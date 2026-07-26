/** Session shapes shared by the API handlers and the browser. */

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type SessionGuest = {
  /** Generated display name, e.g. `User4f9c2a`. */
  name: string;
};

/** JSON returned by every endpoint that resolves a session. */
export type SessionPayload = {
  status: 'authenticated' | 'guest';
  user: SessionUser | null;
  guest: SessionGuest | null;
  expiresAt: string;
};

/** Name to show in the UI for either kind of session. */
export function sessionDisplayName(payload: SessionPayload): string {
  return payload.user?.username ?? payload.guest?.name ?? 'Guest';
}
