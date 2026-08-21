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
import type { OAuthMode } from '@/auth/oauth/state';
import { getSession, startUserSession } from '@/auth/session';
import { DomainError } from '@/errors';
import { handleError, noStore, serverError, unauthorized } from '@/http/respond';
import { linkGoogleAccount, signInWithGoogle, unlinkGoogleAccount } from '@/services/googleAuthService';
import { toPublicUser } from '@/repositories/userStore';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';
const LINK_RETURN_TO = '/dashboard/profile';

function queryValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
}

function redirectWith(res: Response, returnTo: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  return res.redirect(302, `${CLIENT_ORIGIN}${returnTo}${query ? `?${query}` : ''}`);
}

function failure(res: Response, message: string, mode: OAuthMode = 'signin') {
  clearOAuthState(res);

  return mode === 'link'
    ? redirectWith(res, LINK_RETURN_TO, { googleError: message })
    : redirectWith(res, '/auth/login', { error: message });
}

async function beginOAuth(req: Request, res: Response, mode: OAuthMode, returnTo: string) {
  try {
    const config = readGoogleConfig();
    const { verifier, challenge } = createPkcePair();
    const state = createStateToken();

    writeOAuthState(res, { state, verifier, returnTo, mode });

    return res.redirect(302, buildAuthorizationUrl(config, { state, challenge }));
  } catch (error) {
    if (error instanceof GoogleOAuthConfigError) return failure(res, error.message, mode);

    return serverError(res, error, `auth/google/${mode === 'link' ? 'link' : 'start'}`);
  }
}

export async function googleStartController(req: Request, res: Response) {
  noStore(res);

  return beginOAuth(req, res, 'signin', sanitizeReturnTo(req.query.returnTo));
}

export async function googleLinkStartController(req: Request, res: Response) {
  noStore(res);

  const resolved = await getSession(req);

  if (!resolved?.user) return unauthorized(res, 'Sign in before linking a Google account.');

  return beginOAuth(req, res, 'link', LINK_RETURN_TO);
}

export async function googleCallbackController(req: Request, res: Response) {
  noStore(res);

  const stored = readOAuthState(req);
  const mode = stored?.mode ?? 'signin';

  if (queryValue(req.query.error)) {
    return failure(res, 'Google sign-in was cancelled.', mode);
  }

  const code = queryValue(req.query.code);
  const state = queryValue(req.query.state);

  if (!code || !state) return failure(res, 'Google sign-in did not complete. Please try again.', mode);
  if (!stored) return failure(res, 'Your Google sign-in expired. Please try again.', mode);
  if (!matchesState(stored.state, state)) {
    return failure(res, 'Google sign-in could not be verified. Please try again.', mode);
  }

  try {
    const config = readGoogleConfig();
    const profile = await exchangeCodeForProfile(config, { code, verifier: stored.verifier });

    if (stored.mode === 'link') {
      const resolved = await getSession(req);

      if (!resolved?.user) return failure(res, 'Your session expired before the link finished.', 'link');

      await linkGoogleAccount(resolved.user.id, profile);
      clearOAuthState(res);

      return redirectWith(res, stored.returnTo, { googleLinked: '1' });
    }

    const user = await signInWithGoogle(profile);

    await startUserSession(req, res, user.id);
    clearOAuthState(res);

    return res.redirect(302, `${CLIENT_ORIGIN}${stored.returnTo}`);
  } catch (error) {
    if (error instanceof DomainError) return failure(res, error.message, mode);

    return serverError(res, error, 'auth/google/callback');
  }
}

export async function googleUnlinkController(req: Request, res: Response) {
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to manage your linked accounts.');

    const user = await unlinkGoogleAccount(resolved.user.id);

    return res.status(200).json({ message: 'Google account unlinked.', user: toPublicUser(user) });
  } catch (error) {
    return handleError(res, error, 'auth/google/unlink');
  }
}
