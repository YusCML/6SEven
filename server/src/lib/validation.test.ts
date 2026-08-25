import { describe, expect, it } from 'vitest';
import { firstError, normalizeNickname, normalizeUsername, validatePassword, validateUsername } from './validation';

describe('normalizeUsername', () => {
  it('removes surrounding spaces', () => {
    expect(normalizeUsername('  juandelacruz  ')).toBe('juandelacruz');
  });
});

describe('normalizeNickname', () => {
  it('trims and collapses repeated spaces', () => {
    expect(normalizeNickname('  Juan   Dela   Cruz  ')).toBe('Juan Dela Cruz');
  });
});

describe('validateUsername', () => {
  it('returns null when the username is valid', () => {
    expect(validateUsername('juandelacruz')).toBeNull();
  });

  it('rejects a username that is too short', () => {
    expect(validateUsername('ab')).toBe('Username must be at least 3 characters long.');
  });

  it('rejects a username with spaces', () => {
    expect(validateUsername('Juan Dela Cruz')).not.toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns null when the password is valid', () => {
    expect(validatePassword('Commuter123')).toBeNull();
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(validatePassword('Comm123')).toBe('Password must be at least 8 characters long.');
  });

  it('rejects a password with no number', () => {
    expect(validatePassword('CommuterOnly')).toBe('Password must contain at least one number.');
  });
});

describe('firstError', () => {
  it('returns the first message so the user sees one error at a time', () => {
    expect(firstError(null, 'Username is required.', 'Password is required.')).toBe('Username is required.');
  });

  it('returns null when nothing failed', () => {
    expect(firstError(null, null)).toBeNull();
  });
});
