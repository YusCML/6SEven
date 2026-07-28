import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit, RATE_LIMITS } from '@/server/http/rateLimit';
import { allowMethods, handleError, noStore, readBody, readString } from '@/server/http/respond';
import { registerAccount } from '@/server/services/authService';
import { toPublicUser } from '@/server/store/userStore';

type RegisterBody = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.register)) return;

  const body = readBody<RegisterBody>(req);

  try {
    const user = await registerAccount({
      username: readString(body.username),
      email: readString(body.email),
      password: readString(body.password),
      confirmPassword: readString(body.confirmPassword),
    });

    // Registering deliberately does NOT sign the visitor in — they confirm the
    // credentials by logging in. Their guest session is left untouched.
    return res.status(201).json({
      message: 'Account created successfully. Please sign in.',
      user: toPublicUser(user),
    });
  } catch (error) {
    return handleError(res, error, 'auth/register');
  }
}
