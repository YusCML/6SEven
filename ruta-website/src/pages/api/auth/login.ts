import type { NextApiRequest, NextApiResponse } from 'next';
import { startUserSession, toSessionPayload } from '@/server/auth/session';
import { enforceRateLimit, RATE_LIMITS } from '@/server/http/rateLimit';
import { allowMethods, handleError, noStore, readBody, readString } from '@/server/http/respond';
import { authenticate } from '@/server/services/authService';
import { normalizeEmail } from '@/lib/validation';

type LoginBody = {
  email: string;
  password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  const body = readBody<LoginBody>(req);
  const email = normalizeEmail(readString(body.email));

  // Scoped by email as well as IP, so one account cannot be brute-forced from
  // many addresses, and one address cannot sweep many accounts.
  if (!enforceRateLimit(req, res, RATE_LIMITS.login, email)) return;

  try {
    const user = await authenticate(email, readString(body.password));
    const session = await startUserSession(req, res, user.id);

    return res.status(200).json({
      message: 'Signed in successfully.',
      ...toSessionPayload({ session, user }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/login');
  }
}
