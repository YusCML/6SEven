import type { NextApiRequest, NextApiResponse } from 'next';
import { endUserSession, toSessionPayload } from '@/server/auth/session';
import { allowMethods, noStore, serverError } from '@/server/http/respond';

/**
 * Sign out. The authenticated session is destroyed server-side (the old cookie
 * is dead even if it was copied) and the visitor is handed a fresh guest
 * session so they can keep using the site while signed out.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  try {
    const session = await endUserSession(req, res);

    return res.status(200).json({
      message: 'Signed out successfully.',
      ...toSessionPayload({ session, user: null }),
    });
  } catch (error) {
    return serverError(res, error, 'auth/logout');
  }
}
