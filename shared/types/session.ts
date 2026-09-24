export type SessionUser = {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  googleLinked: boolean;
  avatarUrl: string | null;
  createdAt: string;
};

export type SessionPayload =
  | { status: 'authenticated'; user: SessionUser }
  | { status: 'guest'; user: null };
