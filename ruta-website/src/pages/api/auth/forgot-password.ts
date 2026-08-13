import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit, RATE_LIMITS } from '@/server/http/rateLimit';
import { allowMethods, handleError, noStore, readBody, readString } from '@/server/http/respond';
import { createPasswordResetToken } from '@/server/services/authService';

type ForgotPasswordBody = {
  email: string;
};

const GENERIC_MESSAGE = 'If that email has an account, password reset instructions are on the way.';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.forgotPassword)) return;

  const email = readString(readBody<ForgotPasswordBody>(req).email);

  try {
    const token = await createPasswordResetToken(email);

    if (token && process.env.NODE_ENV !== 'production') {
      console.info(`[auth/forgot-password] reset token for ${email}: ${token}`);
      return res.status(200).json({ message: GENERIC_MESSAGE, devResetToken: token });
    }

    return res.status(200).json({ message: GENERIC_MESSAGE });
  } catch (error) {
    return handleError(res, error, 'auth/forgot-password');
  }
}
