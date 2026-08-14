import type { NextApiRequest, NextApiResponse } from 'next';
import { listUsers, toPublicUser } from '@/server/store/userStore';
import { allowMethods, noStore, serverError } from '@/server/http/respond';

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
