import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession, resolveSession, toSessionPayload } from '@/server/auth/session';
import { allowMethods, handleError, noStore, readBody, readString, unauthorized } from '@/server/http/respond';
import { updateProfile } from '@/server/services/authService';

type ProfileBody = {
  username: string;
  email: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET', 'PATCH'])) return;
  noStore(res);

  try {
    if (req.method === 'GET') {
      return res.status(200).json(toSessionPayload(await resolveSession(req, res)));
    }

    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to update your profile.');

    const body = readBody<ProfileBody>(req);
    const user = await updateProfile(resolved.user.id, {
      ...(body.username !== undefined ? { username: readString(body.username) } : {}),
      ...(body.email !== undefined ? { email: readString(body.email) } : {}),
    });

    return res.status(200).json({
      message: 'Profile updated.',
      ...toSessionPayload({ session: resolved.session, user }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/profile');
  }
}
