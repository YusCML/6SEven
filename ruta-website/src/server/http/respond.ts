import type { NextApiRequest, NextApiResponse } from 'next';

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
