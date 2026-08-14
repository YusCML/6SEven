import type { Request, Response } from 'express';
import { appendCookie, serializeCookie } from '@/auth/cookies';

export const OAUTH_STATE_COOKIE_NAME = 'ruta_oauth';

const STATE_TTL_SECONDS = 600;

const isProduction = process.env.NODE_ENV === 'production';

export type OAuthStatePayload = {
  state: string;
  verifier: string;
  returnTo: string;
};

function isSafeReturnTo(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

export function writeOAuthState(res: Response, payload: OAuthStatePayload) {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');

  appendCookie(
    res,
    serializeCookie(OAUTH_STATE_COOKIE_NAME, encoded, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: STATE_TTL_SECONDS,
      expires: new Date(Date.now() + STATE_TTL_SECONDS * 1000),
    }),
  );
}

export function readOAuthState(req: Request): OAuthStatePayload | null {
  const cookie = req.cookies?.[OAUTH_STATE_COOKIE_NAME];

  if (!cookie || !cookie.trim()) return null;

  try {
    const parsed = JSON.parse(Buffer.from(cookie, 'base64url').toString('utf8')) as Partial<OAuthStatePayload>;

    if (typeof parsed.state !== 'string' || typeof parsed.verifier !== 'string') return null;
    if (!parsed.state || !parsed.verifier) return null;

    return {
      state: parsed.state,
      verifier: parsed.verifier,
      returnTo: isSafeReturnTo(parsed.returnTo) ? parsed.returnTo : '/dashboard',
    };
  } catch {
    return null;
  }
}

export function clearOAuthState(res: Response) {
  appendCookie(
    res,
    serializeCookie(OAUTH_STATE_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    }),
  );
}

export function sanitizeReturnTo(value: unknown, fallback = '/dashboard'): string {
  return isSafeReturnTo(value) ? value : fallback;
}
