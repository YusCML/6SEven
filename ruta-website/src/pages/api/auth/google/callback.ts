import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForProfile, matchesState, readGoogleConfig } from '@/server/auth/oauth/google';
import { clearOAuthState, readOAuthState } from '@/server/auth/oauth/state';
import { startUserSession } from '@/server/auth/session';
import { DomainError } from '@/server/errors';
import { allowMethods, noStore, serverError } from '@/server/http/respond';
import { signInWithGoogle } from '@/server/services/googleAuthService';

function queryValue(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? '';
  return '';
}

function failure(res: NextApiResponse, message: string) {
  clearOAuthState(res);
  return res.redirect(302, `/auth/login?error=${encodeURIComponent(message)}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET'])) return;
  noStore(res);

  if (queryValue(req.query.error)) {
    return failure(res, 'Google sign-in was cancelled.');
  }

  const code = queryValue(req.query.code);
  const state = queryValue(req.query.state);
  const stored = readOAuthState(req);

  if (!code || !state) {
    return failure(res, 'Google sign-in did not complete. Please try again.');
  }

  if (!stored) {
    return failure(res, 'Your Google sign-in expired. Please try again.');
  }

  if (!matchesState(stored.state, state)) {
    return failure(res, 'Google sign-in could not be verified. Please try again.');
  }

  try {
    const config = readGoogleConfig();
    const profile = await exchangeCodeForProfile(config, { code, verifier: stored.verifier });
    const user = await signInWithGoogle(profile);

    await startUserSession(req, res, user.id);
    clearOAuthState(res);

    return res.redirect(302, stored.returnTo);
  } catch (error) {
    if (error instanceof DomainError) return failure(res, error.message);

    return serverError(res, error, 'auth/google/callback');
  }
}
