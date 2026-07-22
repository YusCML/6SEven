import type { NextApiRequest, NextApiResponse } from 'next';
import { createResetRequest, findUserByEmail } from './_store';

type ForgotPasswordBody = {
  email?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = (req.body ?? {}) as ForgotPasswordBody;

  if (!body.email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const user = findUserByEmail(body.email);
  const resetRequest = createResetRequest(body.email);

  return res.status(200).json({
    message: user
      ? 'Password reset instructions were generated.'
      : 'If the email exists, password reset instructions were generated.',
    email: resetRequest.email,
    resetToken: resetRequest.token,
  });
}