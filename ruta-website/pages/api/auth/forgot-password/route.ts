import { NextResponse } from 'next/server';
import { createResetRequest, findUserByEmail } from '../_store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;

  if (!body?.email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const user = findUserByEmail(body.email);
  const resetRequest = createResetRequest(body.email);

  return NextResponse.json({
    message: user
      ? 'Password reset instructions were generated.'
      : 'If the email exists, password reset instructions were generated.',
    email: resetRequest.email,
    resetToken: resetRequest.token,
  });
}