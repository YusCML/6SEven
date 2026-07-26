import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession, resolveSession, toSessionPayload } from '@/server/auth/session';
import { DuplicateEmailError, updateUser, UserNotFoundError } from '@/server/store/authStore';
import {
  allowMethods,
  badRequest,
  conflict,
  noStore,
  readBody,
  readString,
  serverError,
  unauthorized,
} from '@/server/http/respond';
import { firstError, normalizeEmail, normalizeUsername, validateEmail, validateUsername } from '@/utils/validation';

type ProfileBody = {
  username: string;
  email: string;
};

/**
 * GET   — the profile behind the current session (guest identity included).
 * PATCH — persist username / email. Signed-in visitors only.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET', 'PATCH'])) return;
  noStore(res);

  try {
    if (req.method === 'GET') {
      const resolved = await resolveSession(req, res);
      return res.status(200).json(toSessionPayload(resolved));
    }

    const resolved = await getSession(req);

    if (!resolved?.user) {
      return unauthorized(res, 'Sign in to update your profile.');
    }

    const body = readBody<ProfileBody>(req);
    const hasUsername = body.username !== undefined;
    const hasEmail = body.email !== undefined;

    if (!hasUsername && !hasEmail) {
      return badRequest(res, 'Nothing to update.');
    }

    const username = normalizeUsername(readString(body.username));
    const email = normalizeEmail(readString(body.email));

    const validationError = firstError(
      hasUsername ? validateUsername(username) : null,
      hasEmail ? validateEmail(email) : null,
    );
    if (validationError) return badRequest(res, validationError);

    const user = await updateUser(resolved.user.id, {
      ...(hasUsername ? { username } : {}),
      ...(hasEmail ? { email } : {}),
    });

    return res.status(200).json({
      message: 'Profile updated.',
      ...toSessionPayload({ session: resolved.session, user }),
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) return conflict(res, error.message);
    if (error instanceof UserNotFoundError) return unauthorized(res, 'Your account no longer exists.');
    return serverError(res, error, 'auth/profile');
  }
}
