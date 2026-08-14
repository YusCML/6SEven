import type { Response } from 'express';

export type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
};

const COOKIE_NAME_PATTERN = /^[\w!#$%&'*.^`|~+-]+$/;

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  if (!COOKIE_NAME_PATTERN.test(name)) {
    throw new TypeError(`Invalid cookie name: ${name}`);
  }

  const segments = [`${name}=${encodeURIComponent(value)}`];

  segments.push(`Path=${options.path ?? '/'}`);

  if (options.maxAge !== undefined) segments.push(`Max-Age=${Math.floor(options.maxAge)}`);
  if (options.expires) segments.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) segments.push('HttpOnly');
  if (options.secure) segments.push('Secure');
  if (options.sameSite) {
    const sameSite = options.sameSite;
    segments.push(`SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`);
  }

  return segments.join('; ');
}

export function appendCookie(res: Response, cookie: string) {
  const existing = res.getHeader('Set-Cookie');

  if (existing === undefined) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }

  const cookies = Array.isArray(existing) ? existing : [String(existing)];
  res.setHeader('Set-Cookie', [...cookies, cookie]);
}
