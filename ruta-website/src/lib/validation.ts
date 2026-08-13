export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;
export const NICKNAME_MAX_LENGTH = 40;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9_.]*[a-zA-Z0-9])?$/;
const NICKNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 .'-]*$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
  return username.trim();
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);

  if (!normalized) return 'Email is required.';
  if (normalized.length > 254) return 'Email is too long.';
  if (!EMAIL_PATTERN.test(normalized)) return 'Enter a valid email address.';

  return null;
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!normalized) return 'Username is required.';
  if (normalized.length < USERNAME_MIN_LENGTH) return `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
  if (normalized.length > USERNAME_MAX_LENGTH) return `Username must be at most ${USERNAME_MAX_LENGTH} characters long.`;
  if (!USERNAME_PATTERN.test(normalized)) {
    return 'Username can only use letters, numbers, underscores and periods, and must start and end with a letter or number.';
  }

  return null;
}

export function normalizeNickname(nickname: string) {
  return nickname.trim().replace(/\s+/g, ' ');
}

export function validateNickname(nickname: string): string | null {
  const normalized = normalizeNickname(nickname);

  if (!normalized) return 'Nickname is required.';
  if (normalized.length > NICKNAME_MAX_LENGTH) return `Nickname must be at most ${NICKNAME_MAX_LENGTH} characters long.`;
  if (!NICKNAME_PATTERN.test(normalized)) {
    return 'Nickname can only use letters, numbers, spaces, periods, apostrophes and hyphens.';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  if (password.length > PASSWORD_MAX_LENGTH) return `Password must be at most ${PASSWORD_MAX_LENGTH} characters long.`;
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';

  return null;
}

export function firstError(...errors: (string | null)[]): string | null {
  return errors.find((error) => error !== null) ?? null;
}
