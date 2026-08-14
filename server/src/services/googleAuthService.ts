import { randomInt } from 'node:crypto';
import type { GoogleProfile } from '@/auth/oauth/google';
import { generateGuestName } from '@/auth/guest';
import {
  normalizeEmail,
  normalizeNickname,
  USERNAME_MAX_LENGTH,
  validateNickname,
  validateUsername,
} from '@/lib/validation';
import { ValidationError } from '@/errors';
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserByUsername,
  updateUser,
  type UserRecord,
} from '@/repositories/userStore';

const SUFFIX_MIN = 1000;
const SUFFIX_MAX = 9999;
const USERNAME_ATTEMPTS = 5;

function firstWordOf(value: string): string {
  return value.trim().split(/\s+/)[0] ?? '';
}

function usernameBase(profile: GoogleProfile): string {
  const source = firstWordOf(profile.givenName) || firstWordOf(profile.name) || (profile.email.split('@')[0] ?? '');
  const cleaned = source
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return cleaned.slice(0, USERNAME_MAX_LENGTH - 5) || 'ruta';
}

async function deriveUsername(profile: GoogleProfile): Promise<string> {
  const base = usernameBase(profile);

  for (let attempt = 0; attempt < USERNAME_ATTEMPTS; attempt += 1) {
    const candidate = `${base}${randomInt(SUFFIX_MIN, SUFFIX_MAX + 1)}`;

    if (validateUsername(candidate) !== null) break;
    if (!(await findUserByUsername(candidate))) return candidate;
  }

  return generateGuestName().toLowerCase();
}

function deriveNickname(profile: GoogleProfile): string {
  const candidates = [profile.givenName, profile.name, profile.email.split('@')[0] ?? ''];

  for (const candidate of candidates) {
    const cleaned = normalizeNickname(candidate);
    if (cleaned && validateNickname(cleaned) === null) return cleaned;
  }

  return 'Commuter';
}

async function refreshProfile(user: UserRecord, profile: GoogleProfile): Promise<UserRecord> {
  const patch: Parameters<typeof updateUser>[1] = {};

  if (user.avatarUrl !== profile.picture) patch.avatarUrl = profile.picture;
  if (profile.emailVerified && !user.emailVerified) patch.emailVerified = true;
  if (!user.nickname) patch.nickname = deriveNickname(profile);

  if (Object.keys(patch).length === 0) return user;

  return updateUser(user.id, patch);
}

export async function signInWithGoogle(profile: GoogleProfile): Promise<UserRecord> {
  if (!profile.googleId || !profile.email) {
    throw new ValidationError('Google did not return enough information to sign you in.');
  }

  const email = normalizeEmail(profile.email);

  const linked = await findUserByGoogleId(profile.googleId);
  if (linked) return refreshProfile(linked, profile);

  const existing = await findUserByEmail(email);

  if (existing) {
    if (!profile.emailVerified) {
      throw new ValidationError(
        'An account already uses this email. Sign in with your password, because Google has not verified this address.',
      );
    }

    return updateUser(existing.id, {
      googleId: profile.googleId,
      avatarUrl: profile.picture,
      emailVerified: true,
      ...(existing.nickname ? {} : { nickname: deriveNickname(profile) }),
    });
  }

  try {
    return await createUser({
      username: await deriveUsername(profile),
      nickname: deriveNickname(profile),
      email,
      passwordHash: null,
      googleId: profile.googleId,
      avatarUrl: profile.picture,
      emailVerified: profile.emailVerified,
    });
  } catch (error) {
    const raced = (await findUserByGoogleId(profile.googleId)) ?? (await findUserByEmail(email));
    if (raced) return raced;
    throw error;
  }
}
