import {
  firstError,
  normalizeNickname,
  normalizeUsername,
  validateAvatarDataUrl,
  validateNickname,
  validatePassword,
  validateUsername,
} from '@/lib/validation';
import { hashPassword, verifyPassword } from '@/auth/password';
import { DuplicateUsernameError, InvalidCredentialsError, NotFoundError, ValidationError } from '@/errors';
import { deleteSessionsForUser } from '@/repositories/sessionStore';
import { createUser, findUserById, findUserByUsername, updateUser, type UserRecord } from '@/repositories/userStore';

function assertValid(...errors: (string | null)[]) {
  const error = firstError(...errors);
  if (error) throw new ValidationError(error);
}

const DECOY_HASH = '$2b$10$EOdk2DgMo/Z8pPO/V5S.DeYwgh16b6zd9Zzm14owp0lBUeKEtL3Ge';

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
  const matches = await verifyPassword(password, storedHash ?? DECOY_HASH);

  if (!user || !storedHash || !matches) throw new InvalidCredentialsError();

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

export async function setProfilePhoto(userId: string, dataUrl: string | null): Promise<UserRecord> {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('Your account no longer exists.');

  if (dataUrl === null) return updateUser(userId, { avatarUrl: null });

  assertValid(validateAvatarDataUrl(dataUrl));

  return updateUser(userId, { avatarUrl: dataUrl });
}
