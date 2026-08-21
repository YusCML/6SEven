import { createHash } from 'node:crypto';
import type { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAuthorizationUrl,
  createPkcePair,
  createStateToken,
  exchangeCodeForProfile,
  GoogleOAuthConfigError,
  GoogleOAuthError,
  isGoogleConfigured,
  matchesState,
  readGoogleConfig,
} from './google';
import { clearOAuthState, readOAuthState, sanitizeReturnTo, writeOAuthState } from './state';

const CONFIG = {
  clientId: 'test-client-id.apps.googleusercontent.com',
  clientSecret: 'test-secret',
  redirectUri: 'http://localhost:3000/api/auth/google/callback',
};

function encodeSegment(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function idToken(claims: Record<string, unknown>): string {
  return `${encodeSegment({ alg: 'RS256' })}.${encodeSegment(claims)}.not-a-real-signature`;
}

function validClaims(overrides: Record<string, unknown> = {}) {
  return {
    iss: 'https://accounts.google.com',
    aud: CONFIG.clientId,
    sub: '1234567890',
    exp: Math.floor(Date.now() / 1000) + 3600,
    email: 'juan@ruta.ph',
    email_verified: true,
    name: 'Juan Dela Cruz',
    given_name: 'Juan',
    picture: 'https://lh3.googleusercontent.com/a/photo',
    ...overrides,
  };
}

function respondWith(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, status, json: async () => body } as unknown as Response),
  );
}

function fakeRes() {
  const headers = new Map<string, string | string[]>();

  return {
    res: {
      getHeader: (key: string) => headers.get(key),
      setHeader: (key: string, value: string | string[]) => headers.set(key, value),
    } as unknown as Response,
    cookies: () => {
      const raw = headers.get('Set-Cookie');
      return Array.isArray(raw) ? raw : raw ? [String(raw)] : [];
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('createPkcePair', () => {
  it('derives the challenge as base64url(sha256(verifier)), which is what S256 means', () => {
    const { verifier, challenge } = createPkcePair();

    expect(challenge).toBe(createHash('sha256').update(verifier).digest('base64url'));
  });

  it('never repeats a verifier', () => {
    const pairs = new Set(Array.from({ length: 50 }, () => createPkcePair().verifier));

    expect(pairs.size).toBe(50);
  });

  it('produces url-safe values with no padding', () => {
    const { verifier, challenge } = createPkcePair();

    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('matchesState', () => {
  it('accepts an exact match', () => {
    const state = createStateToken();

    expect(matchesState(state, state)).toBe(true);
  });

  it('rejects a different value of the same length', () => {
    expect(matchesState('abcdef', 'abcdeg')).toBe(false);
  });

  it('rejects a length mismatch without throwing, which timingSafeEqual would', () => {
    expect(() => matchesState('short', 'muchlongervalue')).not.toThrow();
    expect(matchesState('short', 'muchlongervalue')).toBe(false);
  });

  it('rejects empty values so a missing cookie cannot match a missing param', () => {
    expect(matchesState('', '')).toBe(false);
  });
});

describe('readGoogleConfig', () => {
  beforeEach(() => {
    vi.stubEnv('GOOGLE_CLIENT_ID', '');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', '');
    vi.stubEnv('GOOGLE_REDIRECT_URI', '');
  });

  it('names every missing variable so the operator knows what to set', () => {
    expect(() => readGoogleConfig()).toThrow(GoogleOAuthConfigError);
    expect(() => readGoogleConfig()).toThrow(/GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI/);
  });

  it('names only the variable that is actually missing', () => {
    vi.stubEnv('GOOGLE_CLIENT_ID', CONFIG.clientId);
    vi.stubEnv('GOOGLE_CLIENT_SECRET', CONFIG.clientSecret);

    expect(() => readGoogleConfig()).toThrow(/Missing GOOGLE_REDIRECT_URI\./);
  });

  it('reports configured state without throwing', () => {
    expect(isGoogleConfigured()).toBe(false);

    vi.stubEnv('GOOGLE_CLIENT_ID', CONFIG.clientId);
    vi.stubEnv('GOOGLE_CLIENT_SECRET', CONFIG.clientSecret);
    vi.stubEnv('GOOGLE_REDIRECT_URI', CONFIG.redirectUri);

    expect(isGoogleConfigured()).toBe(true);
    expect(readGoogleConfig()).toEqual(CONFIG);
  });
});

describe('buildAuthorizationUrl', () => {
  it('sends the browser to Google with every parameter the code flow needs', () => {
    const url = new URL(buildAuthorizationUrl(CONFIG, { state: 'state-value', challenge: 'challenge-value' }));

    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url.searchParams.get('client_id')).toBe(CONFIG.clientId);
    expect(url.searchParams.get('redirect_uri')).toBe(CONFIG.redirectUri);
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('state')).toBe('state-value');
    expect(url.searchParams.get('code_challenge')).toBe('challenge-value');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('scope')).toBe('openid email profile');
  });

  it('never puts the client secret in a browser-visible URL', () => {
    const url = buildAuthorizationUrl(CONFIG, { state: 's', challenge: 'c' });

    expect(url).not.toContain(CONFIG.clientSecret);
  });
});

describe('exchangeCodeForProfile', () => {
  it('returns the profile carried by a valid ID token', async () => {
    respondWith({ id_token: idToken(validClaims()) });

    const profile = await exchangeCodeForProfile(CONFIG, { code: 'auth-code', verifier: 'verifier' });

    expect(profile).toEqual({
      googleId: '1234567890',
      email: 'juan@ruta.ph',
      emailVerified: true,
      name: 'Juan Dela Cruz',
      givenName: 'Juan',
      picture: 'https://lh3.googleusercontent.com/a/photo',
    });
  });

  it('posts the verifier so a stolen code alone is useless', async () => {
    respondWith({ id_token: idToken(validClaims()) });

    await exchangeCodeForProfile(CONFIG, { code: 'auth-code', verifier: 'the-verifier' });

    const [, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = new URLSearchParams(init.body as string);

    expect(body.get('code_verifier')).toBe('the-verifier');
    expect(body.get('grant_type')).toBe('authorization_code');
    expect(body.get('client_secret')).toBe(CONFIG.clientSecret);
  });

  it('treats email_verified: "true" as verified, because Google sends it as a string', async () => {
    respondWith({ id_token: idToken(validClaims({ email_verified: 'true' })) });

    const profile = await exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' });

    expect(profile.emailVerified).toBe(true);
  });

  it('rejects a token issued for a different application', async () => {
    respondWith({ id_token: idToken(validClaims({ aud: 'someone-elses-client-id' })) });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(
      /issued for a different application/,
    );
  });

  it('rejects a token from an untrusted issuer', async () => {
    respondWith({ id_token: idToken(validClaims({ iss: 'https://evil.example.com' })) });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(/not issued by Google/);
  });

  it('rejects an expired token', async () => {
    respondWith({ id_token: idToken(validClaims({ exp: Math.floor(Date.now() / 1000) - 600 })) });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(/expired/);
  });

  it('rejects a token with no subject', async () => {
    respondWith({ id_token: idToken(validClaims({ sub: undefined })) });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(/did not identify/);
  });

  it('rejects a token with no email', async () => {
    respondWith({ id_token: idToken(validClaims({ email: undefined })) });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(/email address/);
  });

  it('rejects a malformed token rather than trusting a partial parse', async () => {
    respondWith({ id_token: 'not.a-jwt' });

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(GoogleOAuthError);
  });

  it("surfaces Google's own error description", async () => {
    respondWith({ error: 'invalid_grant', error_description: 'Code was already redeemed.' }, false, 400);

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(
      /Code was already redeemed/,
    );
  });

  it('reports a network failure instead of leaking the raw error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));

    await expect(exchangeCodeForProfile(CONFIG, { code: 'c', verifier: 'v' })).rejects.toThrow(/Could not reach Google/);
  });
});

describe('oauth state cookie', () => {
  it('round-trips state, verifier, returnTo and mode', () => {
    const { res, cookies } = fakeRes();
    writeOAuthState(res, { state: 'st', verifier: 'vf', returnTo: '/dashboard/profile', mode: 'signin' });

    const value = cookies()[0].split(';')[0].split('=')[1];
    const req = { cookies: { ruta_oauth: decodeURIComponent(value) } } as unknown as Request;

    expect(readOAuthState(req)).toEqual({ state: 'st', verifier: 'vf', returnTo: '/dashboard/profile', mode: 'signin' });
  });

  it('marks the cookie HttpOnly so script cannot read the verifier', () => {
    const { res, cookies } = fakeRes();
    writeOAuthState(res, { state: 'st', verifier: 'vf', returnTo: '/dashboard', mode: 'signin' });

    expect(cookies()[0]).toContain('HttpOnly');
    expect(cookies()[0]).toContain('SameSite=Lax');
  });

  it('returns null for a missing or unreadable cookie', () => {
    expect(readOAuthState({ cookies: {} } as unknown as Request)).toBeNull();
    expect(readOAuthState({ cookies: { ruta_oauth: 'garbage' } } as unknown as Request)).toBeNull();
  });

  it('expires the cookie when cleared', () => {
    const { res, cookies } = fakeRes();
    clearOAuthState(res);

    expect(cookies()[0]).toContain('Max-Age=0');
  });
});

describe('sanitizeReturnTo', () => {
  it('keeps an in-app path', () => {
    expect(sanitizeReturnTo('/dashboard/settings')).toBe('/dashboard/settings');
  });

  it('rejects a protocol-relative URL, which would be an open redirect', () => {
    expect(sanitizeReturnTo('//evil.example.com')).toBe('/dashboard');
  });

  it('rejects an absolute URL', () => {
    expect(sanitizeReturnTo('https://evil.example.com/steal')).toBe('/dashboard');
  });

  it('falls back for non-string input', () => {
    expect(sanitizeReturnTo(undefined)).toBe('/dashboard');
    expect(sanitizeReturnTo(['/a', '/b'])).toBe('/dashboard');
  });
});
