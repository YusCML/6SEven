import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, verifyPassword } from '@/server/auth/password';
import { getSession, revokeAllUserSessions, startUserSession } from '@/server/auth/session';
import { updateUser } from '@/server/store/authStore';
import { allowMethods, badRequest, noStore, readBody, readString, serverError, unauthorized } from '@/server/http/respond';
import { validatePassword } from '@/utils/validation';

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Change password for the signed-in user. Proving the current password blocks
 * anyone who walks up to an unlocked browser, and every other session is
 * revoked afterwards so a stolen cookie stops working.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to change your password.');

    const body = readBody<ChangePasswordBody>(req);
    const currentPassword = readString(body.currentPassword);
    const newPassword = readString(body.newPassword);
    const confirmPassword = readString(body.confirmPassword);

    if (!currentPassword) return badRequest(res, 'Your current password is required.');

    const validationError = validatePassword(newPassword);
    if (validationError) return badRequest(res, validationError);

    if (newPassword !== confirmPassword) return badRequest(res, 'New passwords do not match.');
    if (newPassword === currentPassword) return badRequest(res, 'Choose a password different from your current one.');

    if (!(await verifyPassword(currentPassword, resolved.user.passwordHash))) {
      return badRequest(res, 'Your current password is incorrect.');
    }

    await updateUser(resolved.user.id, { passwordHash: await hashPassword(newPassword) });

    // Drop every existing session, then re-issue one for this browser only.
    await revokeAllUserSessions(resolved.user.id);
    await startUserSession(req, res, resolved.user.id);

    return res.status(200).json({ message: 'Password updated. Other devices have been signed out.' });
  } catch (error) {
    return serverError(res, error, 'auth/change-password');
  }
}
