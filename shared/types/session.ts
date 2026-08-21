export type SessionUser = {
  id: string;
  username: string;
  nickname: string | null;
  email: string;
  avatarUrl: string | null;
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
