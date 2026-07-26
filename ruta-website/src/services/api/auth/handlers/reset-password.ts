import { createHash } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '@/server/auth/password';
import { revokeAllUserSessions } from '@/server/auth/session';
import {
  consumePasswordReset,
  findPasswordResetByTokenHash,
  findUserByEmail,
  updateUser,
} from '@/server/store/authStore';
import { allowMethods, badRequest, noStore, readBody, readString, serverError } from '@/server/http/respond';
import { validatePassword } from '@/utils/validation';

type ResetPasswordBody = {
  token: string;
  password: string;
  confirmPassword: string;
};

const INVALID_TOKEN = 'This reset link is invalid or has expired.';

/**
 * Consumes a token from `forgot-password` and sets a new password. Tokens are
 * single-use, time-limited, and every session of the account is revoked so a
 * hijacker is kicked out even if they were already signed in.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  const body = readBody<ResetPasswordBody>(req);
  const token = readString(body.token);
  const password = readString(body.password);
  const confirmPassword = readString(body.confirmPassword);

  if (!token) return badRequest(res, INVALID_TOKEN);

  const validationError = validatePassword(password);
  if (validationError) return badRequest(res, validationError);

  if (password !== confirmPassword) return badRequest(res, 'Passwords do not match.');

  try {
    const record = await findPasswordResetByTokenHash(createHash('sha256').update(token).digest('hex'));

    if (!record || record.consumedAt || Date.parse(record.expiresAt) <= Date.now()) {
      return badRequest(res, INVALID_TOKEN);
    }

    const user = await findUserByEmail(record.email);
    if (!user) return badRequest(res, INVALID_TOKEN);

    await updateUser(user.id, { passwordHash: await hashPassword(password) });
    await consumePasswordReset(record.id);
    await revokeAllUserSessions(user.id);

    return res.status(200).json({ message: 'Password updated. You can now sign in.' });
  } catch (error) {
    return serverError(res, error, 'auth/reset-password');
  }
}
