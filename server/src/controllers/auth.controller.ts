import type { Request, Response } from 'express';
import { endUserSession, getSession, resolveSession, startUserSession, toSessionPayload } from '@/auth/session';
import { handleError, noStore, readBody, readString, unauthorized } from '@/http/respond';
import {
  authenticate,
  changePassword,
  registerAccount,
  setProfilePhoto,
  updateProfile,
} from '@/services/authService';
import { toPublicUser } from '@/repositories/userStore';

export async function getSessionController(req: Request, res: Response) {
  noStore(res);

  try {
    return res.status(200).json(toSessionPayload(await resolveSession(req, res)));
  } catch (error) {
    return handleError(res, error, 'auth/session');
  }
}

export async function registerController(req: Request, res: Response) {
  noStore(res);

  const body = readBody<{ username: string; password: string; confirmPassword: string }>(req);

  try {
    const user = await registerAccount({
      username: readString(body.username),
      password: readString(body.password),
      confirmPassword: readString(body.confirmPassword),
    });

    return res.status(201).json({
      message: 'Account created successfully. Please sign in.',
      user: toPublicUser(user),
    });
  } catch (error) {
    return handleError(res, error, 'auth/register');
  }
}

export async function loginController(req: Request, res: Response) {
  noStore(res);

  const body = readBody<{ username: string; password: string }>(req);

  try {
    const user = await authenticate(readString(body.username), readString(body.password));
    const session = await startUserSession(req, res, user.id);

    return res.status(200).json({
      message: 'Signed in successfully.',
      ...toSessionPayload({ session, user }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/login');
  }
}

export async function logoutController(req: Request, res: Response) {
  noStore(res);

  try {
    const session = await endUserSession(req, res);

    return res.status(200).json({
      message: 'Signed out successfully.',
      ...toSessionPayload({ session, user: null }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/logout');
  }
}

export async function patchProfileController(req: Request, res: Response) {
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to update your profile.');

    const body = readBody<{ username: string; nickname: string }>(req);

    const user = await updateProfile(resolved.user.id, {
      ...(body.username !== undefined ? { username: readString(body.username) } : {}),
      ...(body.nickname !== undefined ? { nickname: readString(body.nickname) } : {}),
    });

    return res.status(200).json({
      message: 'Profile updated.',
      ...toSessionPayload({ session: resolved.session, user }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/profile');
  }
}

export async function changePasswordController(req: Request, res: Response) {
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to change your password.');

    const body = readBody<{ currentPassword: string; newPassword: string; confirmPassword: string }>(req);

    await changePassword(resolved.user.id, {
      currentPassword: readString(body.currentPassword),
      newPassword: readString(body.newPassword),
      confirmPassword: readString(body.confirmPassword),
    });

    await startUserSession(req, res, resolved.user.id);

    return res.status(200).json({ message: 'Password updated. Other devices have been signed out.' });
  } catch (error) {
    return handleError(res, error, 'auth/change-password');
  }
}

export async function putProfilePhotoController(req: Request, res: Response) {
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to change your profile picture.');

    const body = readBody<{ image: string | null }>(req);
    const image = body.image === null ? null : readString(body.image);

    const user = await setProfilePhoto(resolved.user.id, image);

    return res.status(200).json({
      message: image === null ? 'Profile picture removed.' : 'Profile picture updated.',
      ...toSessionPayload({ session: resolved.session, user }),
    });
  } catch (error) {
    return handleError(res, error, 'auth/profile/photo');
  }
}
