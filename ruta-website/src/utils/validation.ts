/**
 * Validation rules shared by the browser forms and the API handlers.
 * Keep this module free of Node-only imports so it stays bundleable on both sides.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 80;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeFullName(fullName: string) {
  return fullName.trim().replace(/\s+/g, ' ');
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);

  if (!normalized) return 'Email is required.';
  if (normalized.length > 254) return 'Email is too long.';
  if (!EMAIL_PATTERN.test(normalized)) return 'Enter a valid email address.';

  return null;
}

export function validateFullName(fullName: string): string | null {
  const normalized = normalizeFullName(fullName);

  if (!normalized) return 'Full name is required.';
  if (normalized.length < FULL_NAME_MIN_LENGTH) return 'Full name is too short.';
  if (normalized.length > FULL_NAME_MAX_LENGTH) return 'Full name is too long.';

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

/** Returns the first validation error, or null when every rule passes. */
export function firstError(...errors: (string | null)[]): string | null {
  return errors.find((error) => error !== null) ?? null;
}
