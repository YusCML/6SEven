import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserModel } from '@/generated/prisma/models';
import type { GoogleProfile } from '@/server/auth/oauth/google';
import { ValidationError } from '@/server/errors';
import { validateUsername } from '@/lib/validation';
import { createUser, findUserByEmail } from '@/server/store/userStore';
import { signInWithGoogle } from './googleAuthService';

const { userRows } = vi.hoisted(() => ({ userRows: new Map<string, UserModel>() }));

vi.mock('@/server/db/prisma', async () => {
  const { createUserDouble } = await import('@/server/testing/prismaDouble');
  return { prisma: { user: createUserDouble(userRows) } };
});

function profile(overrides: Partial<GoogleProfile> = {}): GoogleProfile {
  return {
    googleId: 'google-sub-1',
    email: 'juan@ruta.ph',
    emailVerified: true,
    name: 'Juan Dela Cruz',
    picture: 'https://lh3.googleusercontent.com/a/photo',
    ...overrides,
  };
}

beforeEach(() => {
  userRows.clear();
});

describe('signInWithGoogle — new account', () => {
  it('creates an account with no password at all', async () => {
    const user = await signInWithGoogle(profile());

    expect(user.passwordHash).toBeNull();
    expect(user.plaintextPassword).toBeNull();
    expect(user.googleId).toBe('google-sub-1');
    expect(user.email).toBe('juan@ruta.ph');
    expect(user.emailVerified).toBe(true);
  });

  it('lower-cases the email so Google casing cannot create a second account', async () => {
    const user = await signInWithGoogle(profile({ email: 'Juan@Ruta.PH' }));

    expect(user.email).toBe('juan@ruta.ph');
  });

  it('carries Google\'s unverified flag through rather than assuming true', async () => {
    const user = await signInWithGoogle(profile({ emailVerified: false }));

    expect(user.emailVerified).toBe(false);
  });

  it('derives a username from the display name, stripping spaces', async () => {
    const user = await signInWithGoogle(profile());

    expect(user.username).toBe('JuanDelaCruz');
    expect(validateUsername(user.username)).toBeNull();
  });

  it('falls back to the email local part when the name is unusable', async () => {
    const user = await signInWithGoogle(profile({ name: '', email: 'juan.delacruz@ruta.ph' }));

    expect(user.username).toBe('juan.delacruz');
  });

  it('falls back to a generated name when neither name nor email survives sanitising', async () => {
    const user = await signInWithGoogle(profile({ name: '!!!', email: '!!!@ruta.ph' }));

    expect(validateUsername(user.username)).toBeNull();
  });

  it('never produces a username that would fail the project rules', async () => {
    const user = await signInWithGoogle(profile({ name: 'A'.repeat(120) }));

    expect(validateUsername(user.username)).toBeNull();
  });
});

describe('signInWithGoogle — returning account', () => {
  it('signs the same account back in instead of creating a second one', async () => {
    const first = await signInWithGoogle(profile());
    const second = await signInWithGoogle(profile());

    expect(second.id).toBe(first.id);
    expect(userRows.size).toBe(1);
  });

  it('refreshes the avatar when Google reports a new one', async () => {
    await signInWithGoogle(profile());
    const updated = await signInWithGoogle(profile({ picture: 'https://lh3.googleusercontent.com/a/new' }));

    expect(updated.avatarUrl).toBe('https://lh3.googleusercontent.com/a/new');
    expect(userRows.size).toBe(1);
  });

  it('promotes emailVerified once Google confirms the address', async () => {
    const first = await signInWithGoogle(profile({ emailVerified: false }));
    expect(first.emailVerified).toBe(false);

    const second = await signInWithGoogle(profile({ emailVerified: true }));
    expect(second.emailVerified).toBe(true);
  });
});

describe('signInWithGoogle — linking to a password account', () => {
  beforeEach(async () => {
    await createUser({
      username: 'juandelacruz',
      email: 'juan@ruta.ph',
      passwordHash: 'scrypt$16384$8$1$salt$key',
    });
  });

  it('links when Google has verified the email, keeping the existing account', async () => {
    const user = await signInWithGoogle(profile());

    expect(userRows.size).toBe(1);
    expect(user.username).toBe('juandelacruz');
    expect(user.googleId).toBe('google-sub-1');
    expect(user.passwordHash).toBe('scrypt$16384$8$1$salt$key');
  });

  it('refuses to link when Google has NOT verified the email', async () => {
    await expect(signInWithGoogle(profile({ emailVerified: false }))).rejects.toThrow(ValidationError);

    const untouched = await findUserByEmail('juan@ruta.ph');
    expect(untouched?.googleId).toBeNull();
  });

  it('leaves the password intact after linking, so both sign-in routes keep working', async () => {
    await signInWithGoogle(profile());
    const user = await findUserByEmail('juan@ruta.ph');

    expect(user?.passwordHash).not.toBeNull();
    expect(user?.googleId).toBe('google-sub-1');
  });
});

describe('signInWithGoogle — bad input', () => {
  it('refuses a profile with no subject', async () => {
    await expect(signInWithGoogle(profile({ googleId: '' }))).rejects.toThrow(ValidationError);
  });

  it('refuses a profile with no email', async () => {
    await expect(signInWithGoogle(profile({ email: '' }))).rejects.toThrow(ValidationError);
  });
});
