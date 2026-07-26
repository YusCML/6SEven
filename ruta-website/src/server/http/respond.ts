import type { NextApiRequest, NextApiResponse } from 'next';
import { DuplicateEmailError, InvalidCredentialsError, NotFoundError, ValidationError } from '@/server/errors';

/**
 * Small helpers so every auth handler answers with the same shape:
 * `{ error: string }` on failure, a domain object on success.
 */

export type ApiError = { error: string };

/**
 * Replies 405 and returns false when the method is not allowed.
 * Usage: `if (!allowMethods(req, res, ['POST'])) return;`
 */
export function allowMethods(req: NextApiRequest, res: NextApiResponse, methods: string[]): boolean {
  if (req.method && methods.includes(req.method)) return true;

  res.setHeader('Allow', methods);
  res.status(405).json({ error: `Method ${req.method ?? 'unknown'} not allowed.` } satisfies ApiError);
  return false;
}

/** Session responses must never be cached by a shared or browser cache. */
export function noStore(res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function badRequest(res: NextApiResponse, message: string) {
  return res.status(400).json({ error: message } satisfies ApiError);
}

export function unauthorized(res: NextApiResponse, message = 'You must be signed in to do that.') {
  return res.status(401).json({ error: message } satisfies ApiError);
}

export function conflict(res: NextApiResponse, message: string) {
  return res.status(409).json({ error: message } satisfies ApiError);
}

export function serverError(res: NextApiResponse, error: unknown, context: string) {
  console.error(`[${context}]`, error);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' } satisfies ApiError);
}

/**
 * Translates a thrown value into a response. Domain errors carry their own
 * meaning, so each one has a status; anything else is an unexpected 500 and is
 * logged rather than shown to the user.
 */
export function handleError(res: NextApiResponse, error: unknown, context: string) {
  if (error instanceof ValidationError) return badRequest(res, error.message);
  if (error instanceof DuplicateEmailError) return conflict(res, error.message);
  if (error instanceof InvalidCredentialsError) return unauthorized(res, error.message);
  if (error instanceof NotFoundError) return unauthorized(res, error.message);

  return serverError(res, error, context);
}

/** `req.body` is `any` — narrow it to a plain object before reading fields. */
export function readBody<T extends Record<string, unknown>>(req: NextApiRequest): Partial<T> {
  const body = req.body;

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Partial<T>;
    } catch {
      return {};
    }
  }

  if (body && typeof body === 'object' && !Array.isArray(body)) return body as Partial<T>;

  return {};
}

export function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
