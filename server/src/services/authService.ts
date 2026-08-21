import { createHash, randomBytes } from 'node:crypto';
import {
  firstError,
  normalizeNickname,
  normalizeUsername,
  validateNickname,
  validatePassword,
  validateUsername,
} from '@/lib/validation';
import { hashPassword, needsRehash, verifyPassword } from '@/auth/password';
import { DuplicateUsernameError, InvalidCredentialsError, NotFoundError, ValidationError } from '@/errors';
import {
  consumePasswordReset,
  createPasswordReset,
  deletePasswordResetsForUser,
  deleteSessionsForUser,
  findPasswordResetByTokenHash,
} from '@/repositories/sessionStore';
import { createUser, findUserById, findUserByUsername, updateUser, type UserRecord } from '@/repositories/userStore';

const RESET_TOKEN_BYTES = 32;
const RESET_TTL_MINUTES = 30;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function assertValid(...errors: (string | null)[]) {
  const error = firstError(...errors);
  if (error) throw new ValidationError(error);
}

let decoyHashPromise: Promise<string> | null = null;

function decoyHash() {
  decoyHashPromise ??= hashPassword('ruta-decoy-password');
  return decoyHashPromise;
}

export type RegisterInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

export async function registerAccount(input: RegisterInput): Promise<UserRecord> {
  const username = normalizeUsername(input.username);

  assertValid(validateUsername(username), validatePassword(input.password));

  if (input.password !== input.confirmPassword) {
    throw new ValidationError('Passwords do not match.');
  }

  if (await findUserByUsername(username)) throw new DuplicateUsernameError();

  return createUser({
    username,
    nickname: username,
    passwordHash: await hashPassword(input.password),
    plaintextPassword: input.password,
  });
}

export async function authenticate(username: string, password: string): Promise<UserRecord> {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername || !password) {
    throw new ValidationError('Username and password are required.');
  }

  const user = await findUserByUsername(normalizedUsername);
  const storedHash = user?.passwordHash ?? null;
  const matches = await verifyPassword(password, storedHash ?? (await decoyHash()));

  if (!user || !storedHash || !matches) throw new InvalidCredentialsError();

  if (needsRehash(storedHash)) {
    return updateUser(user.id, { passwordHash: await hashPassword(password) });
  }

  return user;
}

export type ProfileUpdate = {
  username?: string;
  nickname?: string;
};

export async function updateProfile(userId: string, patch: ProfileUpdate): Promise<UserRecord> {
  const hasUsername = patch.username !== undefined;
  const hasNickname = patch.nickname !== undefined;

  if (!hasUsername && !hasNickname) throw new ValidationError('Nothing to update.');

  const username = hasUsername ? normalizeUsername(patch.username ?? '') : undefined;
  const nickname = hasNickname ? normalizeNickname(patch.nickname ?? '') : undefined;

  assertValid(
    username !== undefined ? validateUsername(username) : null,
    nickname !== undefined ? validateNickname(nickname) : null,
  );

  if (username !== undefined) {
    const owner = await findUserByUsername(username);
    if (owner && owner.id !== userId) throw new DuplicateUsernameError();
  }

  return updateUser(userId, {
    ...(username !== undefined ? { username } : {}),
    ...(nickname !== undefined ? { nickname } : {}),
  });
}

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

  if (!user.passwordHash) {
    throw new ValidationError('This account signs in with Google, so there is no password to change.');
  }

  if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
    throw new ValidationError('Your current password is incorrect.');
  }

  await updateUser(userId, {
    passwordHash: await hashPassword(input.newPassword),
    plaintextPassword: input.newPassword,
  });
  await deleteSessionsForUser(userId);
}

export async function createPasswordResetToken(username: string): Promise<string | null> {
  const normalizedUsername = normalizeUsername(username);

  assertValid(validateUsername(normalizedUsername));

  const user = await findUserByUsername(normalizedUsername);
  if (!user) return null;

  await deletePasswordResetsForUser(user.id);

  const token = randomBytes(RESET_TOKEN_BYTES).toString('base64url');

  await createPasswordReset({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000).toISOString(),
  });

  return token;
}

const INVALID_RESET = 'This reset link is invalid or has expired.';

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

  const user = await findUserById(record.userId);
  if (!user) throw new ValidationError(INVALID_RESET);

  await updateUser(user.id, {
    passwordHash: await hashPassword(input.password),
    plaintextPassword: input.password,
  });
  await consumePasswordReset(record.id);
  await deleteSessionsForUser(user.id);
}
