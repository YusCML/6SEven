import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserModel } from '@/generated/prisma/models';
import { DuplicateUsernameError, InvalidCredentialsError, ValidationError } from '@/errors';
import { createSessionRecord, findSession } from '@/repositories/sessionStore';
import { findUserByUsername } from '@/repositories/userStore';
import {
  authenticate,
  changePassword,
  createPasswordResetToken,
  registerAccount,
  resetPasswordWithToken,
  updateProfile,
} from './authService';

const { userRows } = vi.hoisted(() => ({ userRows: new Map<string, UserModel>() }));

vi.mock('@/db/prisma', async () => {
  const { createUserDouble } = await import('@/testing/prismaDouble');
  return { prisma: { user: createUserDouble(userRows) } };
});

const VALID = { username: 'juandelacruz', password: 'Commuter123', confirmPassword: 'Commuter123' };

beforeEach(() => {
  userRows.clear();
  globalThis.__rutaSessionTables = { sessions: new Map(), passwordResets: new Map() };
});

describe('registerAccount', () => {
  it('creates an account and stores a hash, never the password', async () => {
    const user = await registerAccount(VALID);

    expect(user.username).toBe('juandelacruz');
    expect(user.email).toBeNull();
    expect(user.passwordHash).not.toContain('Commuter123');
  });

  it('seeds the nickname from the username so the account has something to show', async () => {
    const user = await registerAccount(VALID);

    expect(user.nickname).toBe('juandelacruz');
  });

  it('rejects a duplicate username', async () => {
    await registerAccount(VALID);

    await expect(registerAccount(VALID)).rejects.toBeInstanceOf(DuplicateUsernameError);
  });

  it('rejects a duplicate username in different casing', async () => {
    await registerAccount(VALID);

    await expect(registerAccount({ ...VALID, username: 'JuanDelaCruz' })).rejects.toBeInstanceOf(
      DuplicateUsernameError,
    );
    expect(await findUserByUsername('JUANDELACRUZ')).not.toBeNull();
  });

  it('rejects mismatched confirmation', async () => {
    await expect(registerAccount({ ...VALID, confirmPassword: 'Different123' })).rejects.toBeInstanceOf(ValidationError);
  });

  const invalidInputs: { label: string; patch: Partial<typeof VALID> }[] = [
    { label: 'username with spaces', patch: { username: 'Juan Dela Cruz' } },
    { label: 'username too short', patch: { username: 'ab' } },
    { label: 'weak password', patch: { password: 'short', confirmPassword: 'short' } },
  ];

  it.each(invalidInputs)('rejects $label', async ({ patch }) => {
    await expect(registerAccount({ ...VALID, ...patch })).rejects.toBeInstanceOf(ValidationError);
  });

  it('does not create a session — registering must not sign anyone in', async () => {
    await registerAccount(VALID);

    expect(globalThis.__rutaSessionTables?.sessions.size).toBe(0);
  });
});

describe('authenticate', () => {
  beforeEach(async () => {
    await registerAccount(VALID);
  });

  it('returns the user for correct credentials', async () => {
    expect((await authenticate('juandelacruz', 'Commuter123')).username).toBe('juandelacruz');
  });

  it('accepts a differently-cased username', async () => {
    expect((await authenticate('JuanDelaCruz', 'Commuter123')).username).toBe('juandelacruz');
  });

  it('rejects the wrong password', async () => {
    await expect(authenticate('juandelacruz', 'WrongPass123')).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('gives an unknown username the same error as a wrong password — no account enumeration', async () => {
    const unknown = await authenticate('nobodyhere', 'Commuter123').catch((error) => error);
    const wrong = await authenticate('juandelacruz', 'WrongPass123').catch((error) => error);

    expect(unknown.message).toBe(wrong.message);
  });

  it('requires both fields', async () => {
    await expect(authenticate('', 'Commuter123')).rejects.toBeInstanceOf(ValidationError);
    await expect(authenticate('juandelacruz', '')).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('updateProfile', () => {
  it('saves only the fields supplied', async () => {
    const user = await registerAccount(VALID);
    const updated = await updateProfile(user.id, { username: 'juan2' });

    expect(updated.username).toBe('juan2');
    expect(updated.nickname).toBe('juandelacruz');
  });

  it('rejects an empty patch', async () => {
    const user = await registerAccount(VALID);

    await expect(updateProfile(user.id, {})).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects taking a username another account already uses', async () => {
    const first = await registerAccount(VALID);
    await registerAccount({ ...VALID, username: 'second' });

    await expect(updateProfile(first.id, { username: 'second' })).rejects.toBeInstanceOf(DuplicateUsernameError);
  });

  it('lets an account keep its own username while changing something else', async () => {
    const user = await registerAccount(VALID);
    const updated = await updateProfile(user.id, { username: 'juandelacruz', nickname: 'Juan' });

    expect(updated.nickname).toBe('Juan');
  });
});

describe('changePassword', () => {
  it('requires the current password to be correct', async () => {
    const user = await registerAccount(VALID);

    await expect(
      changePassword(user.id, { currentPassword: 'Wrong123', newPassword: 'Newpass123', confirmPassword: 'Newpass123' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('changes the password and invalidates the old one', async () => {
    const user = await registerAccount(VALID);

    await changePassword(user.id, {
      currentPassword: 'Commuter123',
      newPassword: 'Newpass123',
      confirmPassword: 'Newpass123',
    });

    await expect(authenticate('juandelacruz', 'Commuter123')).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect((await authenticate('juandelacruz', 'Newpass123')).id).toBe(user.id);
  });

  it('revokes every existing session, so a stolen cookie stops working', async () => {
    const user = await registerAccount(VALID);
    await createSessionRecord({ id: 'session-hash', userId: user.id, guestName: null, expiresAt: new Date(Date.now() + 1000).toISOString() });

    await changePassword(user.id, {
      currentPassword: 'Commuter123',
      newPassword: 'Newpass123',
      confirmPassword: 'Newpass123',
    });

    expect(await findSession('session-hash')).toBeNull();
  });

  it('refuses reusing the current password', async () => {
    const user = await registerAccount(VALID);

    await expect(
      changePassword(user.id, {
        currentPassword: 'Commuter123',
        newPassword: 'Commuter123',
        confirmPassword: 'Commuter123',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('password reset', () => {
  it('returns null for an unknown username, so the endpoint cannot confirm accounts', async () => {
    expect(await createPasswordResetToken('nobodyhere')).toBeNull();
  });

  it('issues a token for a real account and lets it set a new password', async () => {
    await registerAccount(VALID);
    const token = await createPasswordResetToken('juandelacruz');

    expect(token).toBeTruthy();

    await resetPasswordWithToken({ token: token!, password: 'Reset12345', confirmPassword: 'Reset12345' });

    expect((await authenticate('juandelacruz', 'Reset12345')).username).toBe('juandelacruz');
  });

  it('will not accept the same token twice', async () => {
    await registerAccount(VALID);
    const token = await createPasswordResetToken('juandelacruz');
    await resetPasswordWithToken({ token: token!, password: 'Reset12345', confirmPassword: 'Reset12345' });

    await expect(
      resetPasswordWithToken({ token: token!, password: 'Another12345', confirmPassword: 'Another12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a forged token', async () => {
    await registerAccount(VALID);
    await createPasswordResetToken('juandelacruz');

    await expect(
      resetPasswordWithToken({ token: 'forged', password: 'Reset12345', confirmPassword: 'Reset12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('only keeps the newest token — requesting again invalidates the previous one', async () => {
    await registerAccount(VALID);
    const first = await createPasswordResetToken('juandelacruz');
    await createPasswordResetToken('juandelacruz');

    await expect(
      resetPasswordWithToken({ token: first!, password: 'Reset12345', confirmPassword: 'Reset12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
