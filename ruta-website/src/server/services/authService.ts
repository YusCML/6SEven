import { createHash, randomBytes } from 'node:crypto';
import { firstError, normalizeEmail, normalizeUsername, validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import { hashPassword, needsRehash, verifyPassword } from '@/server/auth/password';
import { DuplicateEmailError, InvalidCredentialsError, NotFoundError, ValidationError } from '@/server/errors';
import {
  consumePasswordReset,
  createPasswordReset,
  createUser,
  deletePasswordResetsForEmail,
  deleteSessionsForUser,
  findPasswordResetByTokenHash,
  findUserByEmail,
  findUserById,
  updateUser,
  type UserRecord,
} from '@/server/store/authStore';

/**
 * Authentication business logic.
 *
 * Nothing here touches `req` or `res` — these are plain async functions over
 * domain types, so they can be unit-tested without mocking HTTP, and reused if
 * another entry point (a CLI, tRPC, a job) ever needs them. The API routes in
 * `pages/api/auth/` are thin adapters that call into this module and translate
 * the thrown errors into status codes.
 */

const RESET_TOKEN_BYTES = 32;
const RESET_TTL_MINUTES = 30;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function assertValid(...errors: (string | null)[]) {
  const error = firstError(...errors);
  if (error) throw new ValidationError(error);
}

/**
 * A real hash to verify against when the email is unknown, so a miss costs the
 * same time as a wrong password and cannot be used to enumerate accounts.
 */
let decoyHashPromise: Promise<string> | null = null;

function decoyHash() {
  decoyHashPromise ??= hashPassword('ruta-decoy-password');
  return decoyHashPromise;
}

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Creates an account. Does **not** sign anyone in — that is the caller's decision. */
export async function registerAccount(input: RegisterInput): Promise<UserRecord> {
  const username = normalizeUsername(input.username);
  const email = normalizeEmail(input.email);

  assertValid(validateUsername(username), validateEmail(email), validatePassword(input.password));

  if (input.password !== input.confirmPassword) {
    throw new ValidationError('Passwords do not match.');
  }

  // The store also enforces this; catching it here keeps the error typed.
  if (await findUserByEmail(email)) throw new DuplicateEmailError();

  return createUser({ username, email, passwordHash: await hashPassword(input.password) });
}

/**
 * Verifies credentials. Throws rather than returning null so callers cannot
 * forget to check, and upgrades the stored hash when parameters have moved on.
 */
export async function authenticate(email: string, password: string): Promise<UserRecord> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new ValidationError('Email and password are required.');
  }

  const user = await findUserByEmail(normalizedEmail);
  const matches = await verifyPassword(password, user?.passwordHash ?? (await decoyHash()));

  if (!user || !matches) throw new InvalidCredentialsError();

  if (needsRehash(user.passwordHash)) {
    return updateUser(user.id, { passwordHash: await hashPassword(password) });
  }

  return user;
}

export type ProfileUpdate = {
  username?: string;
  email?: string;
};

/** Saves profile fields. Only the keys present in `patch` are touched. */
export async function updateProfile(userId: string, patch: ProfileUpdate): Promise<UserRecord> {
  const hasUsername = patch.username !== undefined;
  const hasEmail = patch.email !== undefined;

  if (!hasUsername && !hasEmail) throw new ValidationError('Nothing to update.');

  const username = hasUsername ? normalizeUsername(patch.username ?? '') : undefined;
  const email = hasEmail ? normalizeEmail(patch.email ?? '') : undefined;

  assertValid(
    username !== undefined ? validateUsername(username) : null,
    email !== undefined ? validateEmail(email) : null,
  );

  return updateUser(userId, {
    ...(username !== undefined ? { username } : {}),
    ...(email !== undefined ? { email } : {}),
  });
}

/**
 * Changes a password after proving the current one, then revokes every session
 * so a stolen cookie stops working. The caller re-issues one for this browser.
 */
export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string; confirmPassword: string },
): Promise<void> {
  if (!input.currentPassword) throw new ValidationError('Your current password is required.');

  assertValid(validatePassword(input.newPassword));

  if (input.newPassword !== input.confirmPassword) {
    throw new ValidationError('New passwords do not match.');
  }

  if (input.newPassword === input.currentPassword) {
    throw new ValidationError('Choose a password different from your current one.');
  }

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('Your account no longer exists.');

  if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
    throw new ValidationError('Your current password is incorrect.');
  }

  await updateUser(userId, { passwordHash: await hashPassword(input.newPassword) });
  await deleteSessionsForUser(userId);
}

/**
 * Issues a reset token, or returns null when the email has no account. Callers
 * must answer identically either way, so the endpoint cannot be used to test
 * whether an address is registered.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const normalizedEmail = normalizeEmail(email);

  assertValid(validateEmail(normalizedEmail));

  if (!(await findUserByEmail(normalizedEmail))) return null;

  // One live token per address.
  await deletePasswordResetsForEmail(normalizedEmail);

  const token = randomBytes(RESET_TOKEN_BYTES).toString('base64url');

  await createPasswordReset({
    email: normalizedEmail,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000).toISOString(),
  });

  return token;
}

const INVALID_RESET = 'This reset link is invalid or has expired.';

/** Consumes a single-use reset token and sets a new password. */
export async function resetPasswordWithToken(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<void> {
  if (!input.token) throw new ValidationError(INVALID_RESET);

  assertValid(validatePassword(input.password));

  if (input.password !== input.confirmPassword) {
    throw new ValidationError('Passwords do not match.');
  }

  const record = await findPasswordResetByTokenHash(hashToken(input.token));

  if (!record || record.consumedAt || Date.parse(record.expiresAt) <= Date.now()) {
    throw new ValidationError(INVALID_RESET);
  }

  const user = await findUserByEmail(record.email);
  if (!user) throw new ValidationError(INVALID_RESET);

  await updateUser(user.id, { passwordHash: await hashPassword(input.password) });
  await consumePasswordReset(record.id);
  await deleteSessionsForUser(user.id);
}
