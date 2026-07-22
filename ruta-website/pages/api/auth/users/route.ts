import { NextResponse } from 'next/server';
import { listSafeUsers } from '../_store';

export async function GET() {
  return NextResponse.json({ users: listSafeUsers() });
}