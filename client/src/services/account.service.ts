import { patchJson, postJson } from '@/lib/http';
import type { SessionPayload } from '@shared/types/session';

export type ProfileInput = {
  username?: string;
  nickname?: string;
};

export type PasswordChangeInput = {
  currentPassword: string;
  newPassword: string;
};

export function updateProfile(input: ProfileInput): Promise<SessionPayload> {
  return patchJson<SessionPayload>('/api/auth/profile', input);
}

export function unlinkGoogle(): Promise<{ message: string }> {
  return postJson('/api/auth/google/unlink');
}

export function changePassword(input: PasswordChangeInput): Promise<{ message: string }> {
  return postJson('/api/auth/change-password', {
    ...input,
    confirmPassword: input.newPassword,
  });
}
