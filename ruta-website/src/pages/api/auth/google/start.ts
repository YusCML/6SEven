import type { NextApiRequest, NextApiResponse } from 'next';
import {
  buildAuthorizationUrl,
  createPkcePair,
  createStateToken,
  GoogleOAuthConfigError,
  readGoogleConfig,
} from '@/server/auth/oauth/google';
import { sanitizeReturnTo, writeOAuthState } from '@/server/auth/oauth/state';
import { allowMethods, noStore, serverError } from '@/server/http/respond';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET'])) return;
  noStore(res);

  try {
    const config = readGoogleConfig();
    const { verifier, challenge } = createPkcePair();
    const state = createStateToken();
    const returnTo = sanitizeReturnTo(req.query.returnTo);

    writeOAuthState(res, { state, verifier, returnTo });

    return res.redirect(302, buildAuthorizationUrl(config, { state, challenge }));
  } catch (error) {
    if (error instanceof GoogleOAuthConfigError) {
      return res.redirect(302, `/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    return serverError(res, error, 'auth/google/start');
  }
}
