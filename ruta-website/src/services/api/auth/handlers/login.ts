import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCredentials } from '@/services/api/auth/store';

type LoginBody = {
  email?: string;
  password?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = (req.body ?? {}) as LoginBody;

  if (!body.email || !body.password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = validateCredentials(body.email, body.password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.status(200).json({
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}
