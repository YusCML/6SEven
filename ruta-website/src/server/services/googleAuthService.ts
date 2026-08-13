import type { GoogleProfile } from '@/server/auth/oauth/google';
import { generateGuestName } from '@/server/auth/guest';
import { normalizeEmail, USERNAME_MAX_LENGTH, validateUsername } from '@/lib/validation';
import { ValidationError } from '@/server/errors';
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUser,
  type UserRecord,
} from '@/server/store/userStore';

function sanitizeUsername(value: string): string {
  const stripped = value
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9_.]/g, '')
    .slice(0, USERNAME_MAX_LENGTH);

  return stripped.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '');
}

function deriveUsername(profile: GoogleProfile): string {
  const candidates = [profile.name, profile.email.split('@')[0] ?? ''];

  for (const candidate of candidates) {
    const cleaned = sanitizeUsername(candidate);
    if (cleaned && validateUsername(cleaned) === null) return cleaned;
  }

  return generateGuestName();
}

async function refreshProfile(user: UserRecord, profile: GoogleProfile): Promise<UserRecord> {
  const patch: Parameters<typeof updateUser>[1] = {};

  if (user.avatarUrl !== profile.picture) patch.avatarUrl = profile.picture;
  if (profile.emailVerified && !user.emailVerified) patch.emailVerified = true;

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
    });
  }

  try {
    return await createUser({
      username: deriveUsername(profile),
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
