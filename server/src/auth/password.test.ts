import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('hashPassword', () => {
  it('never stores the password itself', async () => {
    const hash = await hashPassword('Commuter123');

    expect(hash).not.toContain('Commuter123');
  });

  it('produces a different hash every time, because each one uses a new salt', async () => {
    const first = await hashPassword('Commuter123');
    const second = await hashPassword('Commuter123');

    expect(first).not.toBe(second);
  });
});

describe('verifyPassword', () => {
  it('accepts the correct password', async () => {
    const hash = await hashPassword('Commuter123');

    expect(await verifyPassword('Commuter123', hash)).toBe(true);
  });

  it('rejects the wrong password', async () => {
    const hash = await hashPassword('Commuter123');

    expect(await verifyPassword('Commuter124', hash)).toBe(false);
  });

  it('returns false instead of crashing when the stored value is not a hash', async () => {
    expect(await verifyPassword('Commuter123', 'not-a-hash')).toBe(false);
  });
});
