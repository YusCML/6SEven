export type SessionUser = {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
  createdAt: string;
};

export type SessionGuest = {
  name: string;
};

export type SessionPayload = {
  status: 'authenticated' | 'guest';
  user: SessionUser | null;
  guest: SessionGuest | null;
  expiresAt: string;
};

export function sessionDisplayName(payload: SessionPayload): string {
  const user = payload.user;
  if (user) return user.nickname?.trim() || user.username;

  return payload.guest?.name ?? 'Guest';
}
