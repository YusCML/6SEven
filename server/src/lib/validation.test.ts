import { describe, expect, it } from 'vitest';
import {
  firstError,
  normalizeEmail,
  normalizeUsername,
  validateEmail,
  validatePassword,
  validateUsername,
} from './validation';

describe('normalizeEmail', () => {
  it('trims and lower-cases so the same address is one account', () => {
    expect(normalizeEmail('  Juan@Ruta.PH ')).toBe('juan@ruta.ph');
  });
});

describe('normalizeUsername', () => {
  it('trims without changing case', () => {
    expect(normalizeUsername('  JuanDelaCruz  ')).toBe('JuanDelaCruz');
  });
});

describe('validateEmail', () => {
  it.each(['juan@ruta.ph', 'a.b+tag@sub.domain.co'])('accepts %s', (email) => {
    expect(validateEmail(email)).toBeNull();
  });

  it.each([
    ['', 'empty'],
    ['juan', 'no domain'],
    ['juan@ruta', 'no TLD'],
    ['juan @ruta.ph', 'contains a space'],
  ])('rejects %s (%s)', (email) => {
    expect(validateEmail(email)).not.toBeNull();
  });

  it('rejects an address over 254 characters', () => {
    expect(validateEmail(`${'a'.repeat(250)}@ruta.ph`)).toBe('Email is too long.');
  });
});

describe('validateUsername', () => {
  it.each(['abc', 'juandelacruz', 'juan_dela.cruz', 'a1b2c3', 'a'.repeat(24)])('accepts %s', (username) => {
    expect(validateUsername(username)).toBeNull();
  });

  it('rejects spaces — a full name is no longer a valid username', () => {
    expect(validateUsername('Juan Dela Cruz')).toMatch(/letters, numbers/);
  });

  it.each([
    ['ab', 'too short'],
    ['a'.repeat(25), 'too long'],
    ['_juan', 'starts with an underscore'],
    ['juan.', 'ends with a period'],
    ['juan-cruz', 'hyphen is not allowed'],
    ['juan@ruta', 'symbol'],
    ['', 'empty'],
  ])('rejects %s (%s)', (username) => {
    expect(validateUsername(username)).not.toBeNull();
  });
});

describe('validatePassword', () => {
  it('accepts a password with letters and digits at the minimum length', () => {
    expect(validatePassword('Commut3r')).toBeNull();
  });

  it.each([
    ['Commut3', 'seven characters'],
    ['CommuterOnly', 'no digit'],
    ['12345678', 'no letter'],
    ['', 'empty'],
  ])('rejects %s (%s)', (password) => {
    expect(validatePassword(password)).not.toBeNull();
  });

  it('rejects a password over 128 characters', () => {
    expect(validatePassword(`a1${'x'.repeat(200)}`)).toMatch(/at most/);
  });
});

describe('firstError', () => {
  it('returns the first failure so the user sees one message at a time', () => {
    expect(firstError(null, 'second', 'third')).toBe('second');
  });

  it('returns null when everything passes', () => {
    expect(firstError(null, null)).toBeNull();
  });
});
