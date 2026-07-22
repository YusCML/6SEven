import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, isValidEmail } from './_store';

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = (req.body ?? {}) as RegisterBody;
  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';
  const confirmPassword = body.confirmPassword ?? '';

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const user = createUser({
      name,
      email,
      password,
    });

    console.info('[auth/register] user created', {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create account.';
    return res.status(409).json({ error: message });
  }
}