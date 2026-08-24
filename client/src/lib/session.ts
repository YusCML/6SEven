import type { SessionPayload } from '@shared/types/session';

export function sessionDisplayName(payload: SessionPayload): string {
  const user = payload.user;
  if (user) return user.nickname?.trim() || user.username;

  return payload.guest?.name ?? 'Guest';
}
