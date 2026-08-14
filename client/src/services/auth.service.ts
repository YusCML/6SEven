import { getJson, postJson } from '@/lib/http';
import type { SessionPayload, SessionUser } from '@shared/types/session';

export type Credentials = {
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export function fetchSession(): Promise<SessionPayload> {
  return getJson<SessionPayload>('/api/auth/session');
}

export function login(credentials: Credentials): Promise<SessionPayload> {
  return postJson<SessionPayload>('/api/auth/login', credentials);
}

export function register(input: RegisterInput): Promise<{ message: string; user: SessionUser }> {
  return postJson('/api/auth/register', { ...input, confirmPassword: input.password });
}

export function logout(): Promise<SessionPayload> {
  return postJson<SessionPayload>('/api/auth/logout');
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return postJson('/api/auth/forgot-password', { email });
}

export function resetPassword(input: { token: string; password: string }): Promise<{ message: string }> {
  return postJson('/api/auth/reset-password', { ...input, confirmPassword: input.password });
}
