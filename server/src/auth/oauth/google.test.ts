import { describe, expect, it } from 'vitest';
import { buildAuthorizationUrl, createPkcePair, createStateToken, matchesState } from './google';
import { sanitizeReturnTo } from './state';

const CONFIG = {
  clientId: 'test-client-id',
  clientSecret: 'test-secret',
  redirectUri: 'http://localhost:3000/api/auth/google/callback',
};

describe('createPkcePair', () => {
  it('gives a different secret every time', () => {
    expect(createPkcePair().verifier).not.toBe(createPkcePair().verifier);
  });

  it('does not put the secret itself in the challenge we send to Google', () => {
    const { verifier, challenge } = createPkcePair();

    expect(challenge).not.toBe(verifier);
  });
});

describe('createStateToken', () => {
  it('gives a different token every time', () => {
    expect(createStateToken()).not.toBe(createStateToken());
  });
});

describe('matchesState', () => {
  it('accepts the value we sent to Google', () => {
    expect(matchesState('abc123', 'abc123')).toBe(true);
  });

  it('rejects a different value', () => {
    expect(matchesState('abc123', 'xyz789')).toBe(false);
  });

  it('rejects an empty value, so a missing cookie cannot match', () => {
    expect(matchesState('', '')).toBe(false);
  });
});

describe('buildAuthorizationUrl', () => {
  it('includes the state and challenge Google needs', () => {
    const url = buildAuthorizationUrl(CONFIG, { state: 'abc123', challenge: 'xyz789' });

    expect(url).toContain('state=abc123');
    expect(url).toContain('code_challenge=xyz789');
  });

  it('never puts the client secret in a URL the browser can see', () => {
    const url = buildAuthorizationUrl(CONFIG, { state: 'abc123', challenge: 'xyz789' });

    expect(url).not.toContain('test-secret');
  });
});

describe('sanitizeReturnTo', () => {
  it('keeps a path inside our own site', () => {
    expect(sanitizeReturnTo('/dashboard/profile')).toBe('/dashboard/profile');
  });

  it('rejects another website, which would send the user somewhere we do not control', () => {
    expect(sanitizeReturnTo('https://evil.com')).toBe('/home');
  });
});
