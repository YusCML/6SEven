import { createHash, randomBytes } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPasswordReset, deletePasswordResetsForEmail, findUserByEmail } from '@/server/store/authStore';
import { allowMethods, badRequest, noStore, readBody, readString, serverError } from '@/server/http/respond';
import { normalizeEmail, validateEmail } from '@/utils/validation';

type ForgotPasswordBody = {
  email: string;
};

const RESET_TOKEN_BYTES = 32;
const RESET_TTL_MINUTES = 30;

/** The same answer whether or not the email exists — no account enumeration. */
const GENERIC_MESSAGE = 'If that email has an account, password reset instructions are on the way.';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  const body = readBody<ForgotPasswordBody>(req);
  const email = normalizeEmail(readString(body.email));

  const validationError = validateEmail(email);
  if (validationError) return badRequest(res, validationError);

  try {
    const user = await findUserByEmail(email);

    if (user) {
      // One live token per address.
      await deletePasswordResetsForEmail(email);

      const token = randomBytes(RESET_TOKEN_BYTES).toString('base64url');

      await createPasswordReset({
        email,
        tokenHash: createHash('sha256').update(token).digest('hex'),
        expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000).toISOString(),
      });

      // No mailer wired up yet. Until one exists the token is only ever
      // surfaced in development, never in a production response body.
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[auth/forgot-password] reset token for ${email}: ${token}`);
        return res.status(200).json({ message: GENERIC_MESSAGE, devResetToken: token });
      }
    }

    return res.status(200).json({ message: GENERIC_MESSAGE });
  } catch (error) {
    return serverError(res, error, 'auth/forgot-password');
  }
}
