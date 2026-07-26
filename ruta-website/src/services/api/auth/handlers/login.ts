import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, needsRehash, verifyPassword } from '@/server/auth/password';
import { startUserSession, toSessionPayload } from '@/server/auth/session';
import { findUserByEmail, updateUser } from '@/server/store/authStore';
import { allowMethods, badRequest, noStore, readBody, readString, serverError } from '@/server/http/respond';
import { normalizeEmail } from '@/utils/validation';

type LoginBody = {
  email: string;
  password: string;
};

const INVALID_CREDENTIALS = 'Invalid email or password.';

/**
 * A real hash to verify against when the email is unknown, so a miss costs the
 * same time as a wrong password and cannot be used to enumerate accounts.
 */
let decoyHashPromise: Promise<string> | null = null;

function getDecoyHash() {
  decoyHashPromise ??= hashPassword('ruta-decoy-password');
  return decoyHashPromise;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['POST'])) return;
  noStore(res);

  const body = readBody<LoginBody>(req);
  const email = normalizeEmail(readString(body.email));
  const password = readString(body.password);

  if (!email || !password) return badRequest(res, 'Email and password are required.');

  try {
    const user = await findUserByEmail(email);
    const passwordMatches = await verifyPassword(password, user?.passwordHash ?? (await getDecoyHash()));

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: INVALID_CREDENTIALS });
    }

    // Opportunistically upgrade hashes stored with older scrypt parameters.
    if (needsRehash(user.passwordHash)) {
      await updateUser(user.id, { passwordHash: await hashPassword(password) });
    }

    const session = await startUserSession(req, res, user.id);

    return res.status(200).json({
      message: 'Signed in successfully.',
      ...toSessionPayload({ session, user }),
    });
  } catch (error) {
    return serverError(res, error, 'auth/login');
  }
}
