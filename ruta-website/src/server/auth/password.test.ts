import { describe, expect, it } from 'vitest';
import { hashPassword, needsRehash, verifyPassword } from './password';

describe('hashPassword', () => {
  it('never stores the password itself', async () => {
    const hash = await hashPassword('Commuter123');

    expect(hash).not.toContain('Commuter123');
    expect(hash.startsWith('scrypt$')).toBe(true);
  });

  it('salts each hash, so identical passwords do not collide', async () => {
    const [a, b] = await Promise.all([hashPassword('Commuter123'), hashPassword('Commuter123')]);

    expect(a).not.toBe(b);
    expect(await verifyPassword('Commuter123', a)).toBe(true);
    expect(await verifyPassword('Commuter123', b)).toBe(true);
  });

  it('records the parameters used, so they can be raised later', async () => {
    const [algorithm, n, r, p] = (await hashPassword('Commuter123')).split('$');

    expect(algorithm).toBe('scrypt');
    expect(Number(n)).toBe(16_384);
    expect(Number(r)).toBe(8);
    expect(Number(p)).toBe(1);
  });
});

describe('verifyPassword', () => {
  it('accepts the correct password', async () => {
    expect(await verifyPassword('Commuter123', await hashPassword('Commuter123'))).toBe(true);
  });

  it.each([
    ['Commuter124', 'one character different'],
    ['commuter123', 'different case'],
    ['', 'empty'],
    ['Commuter123 ', 'trailing space'],
  ])('rejects %s (%s)', async (attempt) => {
    expect(await verifyPassword(attempt, await hashPassword('Commuter123'))).toBe(false);
  });

  it.each([
    ['', 'empty string'],
    ['not-a-hash', 'unstructured'],
    ['bcrypt$16384$8$1$c2FsdA==$a2V5', 'a different algorithm'],
    ['scrypt$16384$8$1$c2FsdA==', 'too few segments'],
    ['scrypt$x$y$z$c2FsdA==$a2V5', 'non-numeric parameters'],
  ])('returns false rather than throwing for %s (%s)', async (stored) => {
    expect(await verifyPassword('Commuter123', stored)).toBe(false);
  });
});

describe('needsRehash', () => {
  it('leaves a current hash alone', async () => {
    expect(needsRehash(await hashPassword('Commuter123'))).toBe(false);
  });

  it('flags a hash made with weaker parameters', () => {
    expect(needsRehash('scrypt$1024$8$1$c2FsdA==$a2V5')).toBe(true);
  });

  it('flags anything not produced by this module', () => {
    expect(needsRehash('$2b$10$abcdefghijklmnopqrstuv')).toBe(true);
    expect(needsRehash('plaintext')).toBe(true);
  });
});
