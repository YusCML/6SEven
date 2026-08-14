import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserModel } from '@/generated/prisma/models';
import { DuplicateEmailError, InvalidCredentialsError, ValidationError } from '@/server/errors';
import { createSessionRecord, findSession } from '@/server/store/sessionStore';
import { findUserByEmail } from '@/server/store/userStore';
import {
  authenticate,
  changePassword,
  createPasswordResetToken,
  registerAccount,
  resetPasswordWithToken,
  updateProfile,
} from './authService';

const { userRows } = vi.hoisted(() => ({ userRows: new Map<string, UserModel>() }));

vi.mock('@/server/db/prisma', async () => {
  const { createUserDouble } = await import('@/server/testing/prismaDouble');
  return { prisma: { user: createUserDouble(userRows) } };
});

const VALID = { username: 'juandelacruz', email: 'juan@ruta.ph', password: 'Commuter123', confirmPassword: 'Commuter123' };

beforeEach(() => {
  userRows.clear();
  globalThis.__rutaSessionTables = { sessions: new Map(), passwordResets: new Map() };
});

describe('registerAccount', () => {
  it('creates an account and stores a hash, never the password', async () => {
    const user = await registerAccount(VALID);

    expect(user.username).toBe('juandelacruz');
    expect(user.email).toBe('juan@ruta.ph');
    expect(user.passwordHash).not.toContain('Commuter123');
  });

  it('lower-cases the email so casing cannot create a second account', async () => {
    const user = await registerAccount({ ...VALID, email: 'JUAN@Ruta.PH' });

    expect(user.email).toBe('juan@ruta.ph');
    expect(await findUserByEmail('juan@ruta.ph')).not.toBeNull();
  });

  it('rejects a duplicate email', async () => {
    await registerAccount(VALID);

    await expect(registerAccount({ ...VALID, username: 'someoneelse' })).rejects.toBeInstanceOf(DuplicateEmailError);
  });

  it('rejects mismatched confirmation', async () => {
    await expect(registerAccount({ ...VALID, confirmPassword: 'Different123' })).rejects.toBeInstanceOf(ValidationError);
  });

  const invalidInputs: { label: string; patch: Partial<typeof VALID> }[] = [
    { label: 'username with spaces', patch: { username: 'Juan Dela Cruz' } },
    { label: 'username too short', patch: { username: 'ab' } },
    { label: 'malformed email', patch: { email: 'not-an-email' } },
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
    expect((await authenticate('juan@ruta.ph', 'Commuter123')).username).toBe('juandelacruz');
  });

  it('accepts a differently-cased email', async () => {
    expect((await authenticate('JUAN@RUTA.PH', 'Commuter123')).email).toBe('juan@ruta.ph');
  });

  it('rejects the wrong password', async () => {
    await expect(authenticate('juan@ruta.ph', 'WrongPass123')).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('gives an unknown email the same error as a wrong password — no account enumeration', async () => {
    const unknown = await authenticate('nobody@ruta.ph', 'Commuter123').catch((error) => error);
    const wrong = await authenticate('juan@ruta.ph', 'WrongPass123').catch((error) => error);

    expect(unknown.message).toBe(wrong.message);
  });

  it('requires both fields', async () => {
    await expect(authenticate('', 'Commuter123')).rejects.toBeInstanceOf(ValidationError);
    await expect(authenticate('juan@ruta.ph', '')).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('updateProfile', () => {
  it('saves only the fields supplied', async () => {
    const user = await registerAccount(VALID);
    const updated = await updateProfile(user.id, { username: 'juan2' });

    expect(updated.username).toBe('juan2');
    expect(updated.email).toBe('juan@ruta.ph');
  });

  it('rejects an empty patch', async () => {
    const user = await registerAccount(VALID);

    await expect(updateProfile(user.id, {})).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects taking an email another account already uses', async () => {
    const first = await registerAccount(VALID);
    await registerAccount({ ...VALID, username: 'second', email: 'second@ruta.ph' });

    await expect(updateProfile(first.id, { email: 'second@ruta.ph' })).rejects.toBeInstanceOf(DuplicateEmailError);
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

    await expect(authenticate('juan@ruta.ph', 'Commuter123')).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect((await authenticate('juan@ruta.ph', 'Newpass123')).id).toBe(user.id);
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
  it('returns null for an unknown email, so the endpoint cannot confirm accounts', async () => {
    expect(await createPasswordResetToken('nobody@ruta.ph')).toBeNull();
  });

  it('issues a token for a real account and lets it set a new password', async () => {
    await registerAccount(VALID);
    const token = await createPasswordResetToken('juan@ruta.ph');

    expect(token).toBeTruthy();

    await resetPasswordWithToken({ token: token!, password: 'Reset12345', confirmPassword: 'Reset12345' });

    expect((await authenticate('juan@ruta.ph', 'Reset12345')).email).toBe('juan@ruta.ph');
  });

  it('will not accept the same token twice', async () => {
    await registerAccount(VALID);
    const token = await createPasswordResetToken('juan@ruta.ph');
    await resetPasswordWithToken({ token: token!, password: 'Reset12345', confirmPassword: 'Reset12345' });

    await expect(
      resetPasswordWithToken({ token: token!, password: 'Another12345', confirmPassword: 'Another12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a forged token', async () => {
    await registerAccount(VALID);
    await createPasswordResetToken('juan@ruta.ph');

    await expect(
      resetPasswordWithToken({ token: 'forged', password: 'Reset12345', confirmPassword: 'Reset12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('only keeps the newest token — requesting again invalidates the previous one', async () => {
    await registerAccount(VALID);
    const first = await createPasswordResetToken('juan@ruta.ph');
    await createPasswordResetToken('juan@ruta.ph');

    await expect(
      resetPasswordWithToken({ token: first!, password: 'Reset12345', confirmPassword: 'Reset12345' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
