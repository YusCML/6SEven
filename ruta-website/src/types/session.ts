export type SessionUser = {
  id: string;
  username: string;
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
  return payload.user?.username ?? payload.guest?.name ?? 'Guest';
}
