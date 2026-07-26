import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession, startUserSession } from '@/server/auth/session';
import { enforceRateLimit, RATE_LIMITS } from '@/server/http/rateLimit';
import { allowMethods, handleError, noStore, readBody, readString, unauthorized } from '@/server/http/respond';
import { changePassword } from '@/server/services/authService';

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  // The service verifies the current password, so cap guesses here.
  if (!enforceRateLimit(req, res, RATE_LIMITS.changePassword)) return;

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to change your password.');

    const body = readBody<ChangePasswordBody>(req);

    await changePassword(resolved.user.id, {
      currentPassword: readString(body.currentPassword),
      newPassword: readString(body.newPassword),
      confirmPassword: readString(body.confirmPassword),
    });

    // Every session was revoked, including this one — re-issue for this browser.
    await startUserSession(req, res, resolved.user.id);

    return res.status(200).json({ message: 'Password updated. Other devices have been signed out.' });
  } catch (error) {
    return handleError(res, error, 'auth/change-password');
  }
}
