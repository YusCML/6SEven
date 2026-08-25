import { randomInt } from 'node:crypto';
import type { GoogleProfile } from '@/auth/oauth/google';
import { normalizeEmail, normalizeNickname, USERNAME_MAX_LENGTH, validateNickname } from '@/lib/validation';
import { NotFoundError, ValidationError } from '@/errors';
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUser,
  type UserRecord,
} from '@/repositories/userStore';

const SUFFIX_MIN = 1000;
const SUFFIX_MAX = 9999;

function deriveUsername(profile: GoogleProfile): string {
  const source = profile.givenName || profile.name || profile.email.split('@')[0] || '';
  const base = source.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, USERNAME_MAX_LENGTH - 5);

  return `${base || 'ruta'}${randomInt(SUFFIX_MIN, SUFFIX_MAX + 1)}`;
}

function deriveNickname(profile: GoogleProfile): string {
  const candidate = normalizeNickname(profile.givenName || profile.name || profile.email.split('@')[0] || '');

  return validateNickname(candidate) === null ? candidate : 'Commuter';
}

async function refreshProfile(user: UserRecord, profile: GoogleProfile): Promise<UserRecord> {
  return updateUser(user.id, {
    avatarUrl: profile.picture,
    emailVerified: user.emailVerified || profile.emailVerified,
    nickname: user.nickname ?? deriveNickname(profile),
  });
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
      username: deriveUsername(profile),
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

export async function linkGoogleAccount(userId: string, profile: GoogleProfile): Promise<UserRecord> {
  if (!profile.googleId || !profile.email) {
    throw new ValidationError('Google did not return enough information to link your account.');
  }

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('Your account no longer exists.');

  if (user.googleId && user.googleId !== profile.googleId) {
    throw new ValidationError('This account is already linked to a different Google account. Unlink it first.');
  }

  const owner = await findUserByGoogleId(profile.googleId);
  if (owner && owner.id !== userId) {
    throw new ValidationError('That Google account is already linked to another RUTA account.');
  }

  const email = normalizeEmail(profile.email);
  const emailOwner = await findUserByEmail(email);

  if (emailOwner && emailOwner.id !== userId) {
    throw new ValidationError('Another RUTA account already uses that Google email address.');
  }

  return updateUser(userId, {
    googleId: profile.googleId,
    email,
    emailVerified: profile.emailVerified,
    avatarUrl: profile.picture,
    ...(user.nickname ? {} : { nickname: deriveNickname(profile) }),
  });
}

export async function unlinkGoogleAccount(userId: string): Promise<UserRecord> {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('Your account no longer exists.');

  if (!user.googleId) throw new ValidationError('No Google account is linked to this profile.');

  if (!user.passwordHash) {
    throw new ValidationError('Set a password before unlinking Google, otherwise you will not be able to sign in.');
  }

  return updateUser(userId, {
    googleId: null,
    email: null,
    emailVerified: false,
    avatarUrl: null,
  });
}
