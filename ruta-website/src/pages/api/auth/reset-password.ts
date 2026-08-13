import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit, RATE_LIMITS } from '@/server/http/rateLimit';
import { allowMethods, handleError, noStore, readBody, readString } from '@/server/http/respond';
import { resetPasswordWithToken } from '@/server/services/authService';

type ResetPasswordBody = {
  token: string;
  password: string;
  confirmPassword: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.resetPassword)) return;

  const body = readBody<ResetPasswordBody>(req);

  try {
    await resetPasswordWithToken({
      token: readString(body.token),
      password: readString(body.password),
      confirmPassword: readString(body.confirmPassword),
    });

    return res.status(200).json({ message: 'Password updated. You can now sign in.' });
  } catch (error) {
    return handleError(res, error, 'auth/reset-password');
  }
}
