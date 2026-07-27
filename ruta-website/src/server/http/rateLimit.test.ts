import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit, type RateLimitRule } from './rateLimit';

const rule: RateLimitRule = { name: 'test', limit: 3, windowMs: 60_000 };

beforeEach(() => {
  // Counters live on globalThis; clear them so tests cannot leak into each other.
  globalThis.__rutaRateLimits = new Map();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkRateLimit', () => {
  it('allows exactly the configured number of attempts', () => {
    const results = [1, 2, 3].map(() => checkRateLimit('1.2.3.4', rule));

    expect(results.map((r) => r.allowed)).toEqual([true, true, true]);
  });

  it('blocks the attempt after the limit', () => {
    for (let i = 0; i < rule.limit; i++) checkRateLimit('1.2.3.4', rule);

    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(false);
  });

  it('counts down the remaining allowance', () => {
    expect(checkRateLimit('1.2.3.4', rule).remaining).toBe(2);
    expect(checkRateLimit('1.2.3.4', rule).remaining).toBe(1);
    expect(checkRateLimit('1.2.3.4', rule).remaining).toBe(0);
  });

  it('keeps identifiers independent — one attacker cannot lock out everyone', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('attacker', rule);

    expect(checkRateLimit('innocent-visitor', rule).allowed).toBe(true);
  });

  it('keeps rules independent, so login attempts do not consume the register budget', () => {
    const other: RateLimitRule = { name: 'other', limit: 3, windowMs: 60_000 };
    for (let i = 0; i < 5; i++) checkRateLimit('1.2.3.4', rule);

    expect(checkRateLimit('1.2.3.4', other).allowed).toBe(true);
  });

  it('reports how long to wait once blocked', () => {
    for (let i = 0; i < rule.limit; i++) checkRateLimit('1.2.3.4', rule);
    const blocked = checkRateLimit('1.2.3.4', rule);

    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('allows attempts again once the window has passed', () => {
    for (let i = 0; i < rule.limit; i++) checkRateLimit('1.2.3.4', rule);
    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(false);

    vi.advanceTimersByTime(rule.windowMs + 1);

    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(true);
  });

  it('does not reset early — the window is not a rolling reprieve', () => {
    for (let i = 0; i < rule.limit; i++) checkRateLimit('1.2.3.4', rule);

    vi.advanceTimersByTime(rule.windowMs - 1000);

    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(false);
  });
});
