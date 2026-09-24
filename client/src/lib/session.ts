import type { SessionPayload } from '@shared/types/session';

export function sessionDisplayName(payload: SessionPayload | null | undefined): string {
  if (!payload?.user) return 'Guest';

  return payload.user.nickname?.trim() || payload.user.username;
}
