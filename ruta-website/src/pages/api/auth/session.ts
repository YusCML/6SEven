import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveSession, toSessionPayload } from '@/server/auth/session';
import { allowMethods, noStore, serverError } from '@/server/http/respond';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(req, res, ['GET'])) return;
  noStore(res);

  try {
    const resolved = await resolveSession(req, res);
    return res.status(200).json(toSessionPayload(resolved));
  } catch (error) {
    return serverError(res, error, 'auth/session');
  }
}
