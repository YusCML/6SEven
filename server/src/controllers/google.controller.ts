import type { Request, Response } from 'express';
import {
  buildAuthorizationUrl,
  createPkcePair,
  createStateToken,
  exchangeCodeForProfile,
  GoogleOAuthConfigError,
  matchesState,
  readGoogleConfig,
} from '@/auth/oauth/google';
import { clearOAuthState, readOAuthState, sanitizeReturnTo, writeOAuthState } from '@/auth/oauth/state';
import { startUserSession } from '@/auth/session';
import { DomainError } from '@/errors';
import { noStore, serverError } from '@/http/respond';
import { signInWithGoogle } from '@/services/googleAuthService';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';

function queryValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
}

function failure(res: Response, message: string) {
  clearOAuthState(res);
  return res.redirect(302, `${CLIENT_ORIGIN}/auth/login?error=${encodeURIComponent(message)}`);
}

export async function googleStartController(req: Request, res: Response) {
  noStore(res);

  try {
    const config = readGoogleConfig();
    const { verifier, challenge } = createPkcePair();
    const state = createStateToken();
    const returnTo = sanitizeReturnTo(req.query.returnTo);

    writeOAuthState(res, { state, verifier, returnTo });

    return res.redirect(302, buildAuthorizationUrl(config, { state, challenge }));
  } catch (error) {
    if (error instanceof GoogleOAuthConfigError) return failure(res, error.message);

    return serverError(res, error, 'auth/google/start');
  }
}

export async function googleCallbackController(req: Request, res: Response) {
  noStore(res);

  if (queryValue(req.query.error)) {
    return failure(res, 'Google sign-in was cancelled.');
  }

  const code = queryValue(req.query.code);
  const state = queryValue(req.query.state);
  const stored = readOAuthState(req);

  if (!code || !state) return failure(res, 'Google sign-in did not complete. Please try again.');
  if (!stored) return failure(res, 'Your Google sign-in expired. Please try again.');
  if (!matchesState(stored.state, state)) {
    return failure(res, 'Google sign-in could not be verified. Please try again.');
  }

  try {
    const config = readGoogleConfig();
    const profile = await exchangeCodeForProfile(config, { code, verifier: stored.verifier });
    const user = await signInWithGoogle(profile);

    await startUserSession(req, res, user.id);
    clearOAuthState(res);

    return res.redirect(302, `${CLIENT_ORIGIN}${stored.returnTo}`);
  } catch (error) {
    if (error instanceof DomainError) return failure(res, error.message);

    return serverError(res, error, 'auth/google/callback');
  }
}
