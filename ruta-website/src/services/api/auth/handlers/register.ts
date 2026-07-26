import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '@/server/auth/password';
import { startUserSession, toSessionPayload } from '@/server/auth/session';
import { createUser, DuplicateEmailError } from '@/server/store/authStore';
import { allowMethods, badRequest, conflict, noStore, readBody, readString, serverError } from '@/server/http/respond';
import { firstError, normalizeEmail, normalizeFullName, validateEmail, validateFullName, validatePassword } from '@/utils/validation';

type RegisterBody = {
  fullName: string;
  /** Accepted for backwards compatibility with the previous field name. */
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  const body = readBody<RegisterBody>(req);
  const fullName = normalizeFullName(readString(body.fullName) || readString(body.name));
  const email = normalizeEmail(readString(body.email));
  const password = readString(body.password);
  const confirmPassword = readString(body.confirmPassword);

  const validationError = firstError(validateFullName(fullName), validateEmail(email), validatePassword(password));
  if (validationError) return badRequest(res, validationError);

  if (password !== confirmPassword) return badRequest(res, 'Passwords do not match.');

  try {
    const user = await createUser({
      fullName,
      email,
      passwordHash: await hashPassword(password),
    });

    // Registering signs the visitor in, replacing their guest session.
    const session = await startUserSession(req, res, user.id);

    return res.status(201).json({
      message: 'Account created successfully.',
      ...toSessionPayload({ session, user }),
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) return conflict(res, error.message);
    return serverError(res, error, 'auth/register');
  }
}
