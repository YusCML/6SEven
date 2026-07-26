import type { NextApiRequest, NextApiResponse } from 'next';
import { listUsers, toPublicUser } from '@/server/store/authStore';
import { allowMethods, noStore, serverError } from '@/server/http/respond';

/**
 * Debug helper for inspecting the in-memory store while building.
 *
 * Disabled outside development: an open endpoint listing every account is an
 * account-enumeration leak, and there is no admin role to gate it with yet.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET'])) return;
  noStore(res);

  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found.' });
  }

  try {
    const users = await listUsers();
    return res.status(200).json({ users: users.map(toPublicUser) });
  } catch (error) {
    return serverError(res, error, 'auth/users');
  }
}
