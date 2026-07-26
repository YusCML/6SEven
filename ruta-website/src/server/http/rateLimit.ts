import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Fixed-window rate limiting for the auth endpoints.
 *
 * Without this, `/api/auth/login` accepts unlimited password guesses. scrypt
 * makes each attempt costly, which cuts both ways — a few hundred concurrent
 * requests would also exhaust the server's CPU. Capping attempts fixes both.
 *
 * Counters live in memory alongside the auth store, so they reset on restart
 * and are per-instance. That is fine for a single dev/preview server; a real
 * deployment behind several instances needs a shared store (Redis, Postgres),
 * and only this file changes.
 */

type Counter = {
  count: number;
  /** Epoch ms at which the current window ends. */
  resetAt: number;
};

declare global {
  var __rutaRateLimits: Map<string, Counter> | undefined;
}

function counters(): Map<string, Counter> {
  globalThis.__rutaRateLimits ??= new Map();
  return globalThis.__rutaRateLimits;
}

/** Drops expired counters so the map cannot grow without bound. */
function sweep(now: number) {
  const all = counters();

  if (all.size < 1000) return;

  for (const [key, counter] of all) {
    if (counter.resetAt <= now) all.delete(key);
  }
}

/**
 * Best-effort client identifier. `x-forwarded-for` is only trustworthy behind a
 * proxy that sets it; it is used here because the alternative (no limit at all)
 * is worse, not because it cannot be spoofed.
 */
export function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = raw?.split(',')[0]?.trim();

  return first || req.socket.remoteAddress || 'unknown';
}

export type RateLimitRule = {
  /** Distinct name per endpoint, so limits do not share a bucket. */
  name: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(identifier: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const key = `${rule.name}:${identifier}`;
  const all = counters();
  const existing = all.get(key);

  if (!existing || existing.resetAt <= now) {
    all.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, remaining: rule.limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > rule.limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: rule.limit - existing.count, retryAfterSeconds };
}

/**
 * Applies a rule and answers `429` when it is exceeded.
 * Usage: `if (!enforceRateLimit(req, res, RULES.login)) return;`
 */
export function enforceRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  rule: RateLimitRule,
  /** Extra key part, e.g. the submitted email, to also cap per-account attempts. */
  scope?: string,
): boolean {
  const identifier = scope ? `${clientIp(req)}|${scope}` : clientIp(req);
  const result = checkRateLimit(identifier, rule);

  res.setHeader('X-RateLimit-Limit', rule.limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, result.remaining));

  if (result.allowed) return true;

  res.setHeader('Retry-After', result.retryAfterSeconds);
  res.status(429).json({
    error: `Too many attempts. Try again in ${result.retryAfterSeconds} seconds.`,
  });

  return false;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/** One rule per endpoint, tuned to how costly and how guessable each is. */
export const RATE_LIMITS = {
  login: { name: 'login', limit: 10, windowMs: 15 * MINUTE },
  register: { name: 'register', limit: 5, windowMs: HOUR },
  forgotPassword: { name: 'forgot-password', limit: 5, windowMs: HOUR },
  resetPassword: { name: 'reset-password', limit: 10, windowMs: HOUR },
  changePassword: { name: 'change-password', limit: 10, windowMs: HOUR },
} as const satisfies Record<string, RateLimitRule>;
