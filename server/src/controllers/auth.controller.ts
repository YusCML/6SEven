import type { Request, Response } from 'express';
import { endUserSession, getSession, resolveSession, startUserSession, toSessionPayload } from '@/auth/session';
import { normalizeEmail } from '@/lib/validation';
import { enforceRateLimit, RATE_LIMITS } from '@/middlewares/rateLimit';
import { handleError, noStore, readBody, readString, serverError, unauthorized } from '@/http/respond';
import {
  authenticate,
  changePassword,
  createPasswordResetToken,
  registerAccount,
  resetPasswordWithToken,
  updateProfile,
} from '@/services/authService';
import { listUsers, toPublicUser } from '@/repositories/userStore';

const GENERIC_RESET_MESSAGE = 'If that email has an account, password reset instructions are on the way.';

export async function getSessionController(req: Request, res: Response) {
  noStore(res);

  try {
    return res.status(200).json(toSessionPayload(await resolveSession(req, res)));
  } catch (error) {
    return serverError(res, error, 'auth/session');
  }
}

export async function registerController(req: Request, res: Response) {
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.register)) return;

  const body = readBody<{ username: string; email: string; password: string; confirmPassword: string }>(req);

  try {
    const user = await registerAccount({
      username: readString(body.username),
      email: readString(body.email),
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

  const body = readBody<{ email: string; password: string }>(req);
  const email = normalizeEmail(readString(body.email));

  if (!enforceRateLimit(req, res, RATE_LIMITS.login, email)) return;

  try {
    const user = await authenticate(email, readString(body.password));
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
    return serverError(res, error, 'auth/logout');
  }
}

export async function getProfileController(req: Request, res: Response) {
  noStore(res);

  try {
    return res.status(200).json(toSessionPayload(await resolveSession(req, res)));
  } catch (error) {
    return serverError(res, error, 'auth/profile');
  }
}

export async function patchProfileController(req: Request, res: Response) {
  noStore(res);

  try {
    const resolved = await getSession(req);

    if (!resolved?.user) return unauthorized(res, 'Sign in to update your profile.');

    const body = readBody<{ username: string; nickname: string; email: string }>(req);

    const user = await updateProfile(resolved.user.id, {
      ...(body.username !== undefined ? { username: readString(body.username) } : {}),
      ...(body.nickname !== undefined ? { nickname: readString(body.nickname) } : {}),
      ...(body.email !== undefined ? { email: readString(body.email) } : {}),
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

  if (!enforceRateLimit(req, res, RATE_LIMITS.changePassword)) return;

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

export async function forgotPasswordController(req: Request, res: Response) {
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.forgotPassword)) return;

  const email = readString(readBody<{ email: string }>(req).email);

  try {
    const token = await createPasswordResetToken(email);

    if (token && process.env.NODE_ENV !== 'production') {
      console.info(`[auth/forgot-password] reset token for ${email}: ${token}`);
      return res.status(200).json({ message: GENERIC_RESET_MESSAGE, devResetToken: token });
    }

    return res.status(200).json({ message: GENERIC_RESET_MESSAGE });
  } catch (error) {
    return handleError(res, error, 'auth/forgot-password');
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  noStore(res);

  if (!enforceRateLimit(req, res, RATE_LIMITS.resetPassword)) return;

  const body = readBody<{ token: string; password: string; confirmPassword: string }>(req);

  try {
    await resetPasswordWithToken({
      token: readString(body.token),
      password: readString(body.password),
      confirmPassword: readString(body.confirmPassword),
    });

    return res.status(200).json({ message: 'Password updated. You can now sign in.' });
  } catch (error) {
    return handleError(res, error, 'auth/reset-password');
  }
}

export async function listUsersController(_req: Request, res: Response) {
  noStore(res);

  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found.' });
  }

  try {
    const users = await listUsers();
    return res.status(200).json({ users: users.map(toPublicUser) });
  } catch (error) {
    return serverError(res, error, 'auth/users');
  }
}
