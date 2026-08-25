import { getJson, postJson } from '@/lib/http';
import type { SessionPayload, SessionUser } from '@shared/types/session';

export type Credentials = {
  username: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

export function fetchSession(): Promise<SessionPayload> {
  return getJson<SessionPayload>('/api/auth/session');
}

export function login(credentials: Credentials): Promise<SessionPayload> {
  return postJson<SessionPayload>('/api/auth/login', credentials);
}

export function register(input: RegisterInput): Promise<{ message: string; user: SessionUser }> {
  return postJson('/api/auth/register', input);
}

export function logout(): Promise<SessionPayload> {
  return postJson<SessionPayload>('/api/auth/logout');
}

