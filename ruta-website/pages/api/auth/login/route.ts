import { NextResponse } from 'next/server';
import { validateCredentials } from '../_store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const user = validateCredentials(body.email, body.password);

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}