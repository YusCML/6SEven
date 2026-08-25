import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, type RateLimitRule } from './rateLimit';

const rule: RateLimitRule = { name: 'login', limit: 3, windowMs: 60_000 };

beforeEach(() => {
  globalThis.__rutaRateLimits = new Map();
});

describe('checkRateLimit', () => {
  it('allows the first attempt', () => {
    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(true);
  });

  it('allows exactly the number of attempts the rule sets', () => {
    checkRateLimit('1.2.3.4', rule);
    checkRateLimit('1.2.3.4', rule);

    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(true);
  });

  it('blocks the attempt after the limit is reached', () => {
    checkRateLimit('1.2.3.4', rule);
    checkRateLimit('1.2.3.4', rule);
    checkRateLimit('1.2.3.4', rule);

    expect(checkRateLimit('1.2.3.4', rule).allowed).toBe(false);
  });

  it('counts each visitor separately, so one attacker cannot lock out everybody', () => {
    checkRateLimit('attacker', rule);
    checkRateLimit('attacker', rule);
    checkRateLimit('attacker', rule);
    checkRateLimit('attacker', rule);

    expect(checkRateLimit('normal-visitor', rule).allowed).toBe(true);
  });
});
