import { NextResponse } from 'next/server';
import { createUser } from '../_store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { name?: string; email?: string; password?: string; confirmPassword?: string }
    | null;

  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json(
      { error: 'Name, email, and password are required.' },
      { status: 400 },
    );
  }

  if (body.password !== body.confirmPassword) {
    return NextResponse.json(
      { error: 'Passwords do not match.' },
      { status: 400 },
    );
  }

  try {
    const user = createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(
      {
        message: 'Account created successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create account.';
    return NextResponse.json({ error: message }, { status: 409 });
  }
}