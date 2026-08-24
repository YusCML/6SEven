import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { DomainError } from '@/errors';

const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const VALID_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const SCOPES = 'openid email profile';

const STATE_BYTES = 32;
const VERIFIER_BYTES = 32;
const CLOCK_SKEW_SECONDS = 60;

export class GoogleOAuthError extends DomainError {}

export class GoogleOAuthConfigError extends DomainError {}

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);
}

export function readGoogleConfig(): GoogleConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? '';

  const missing = [
    clientId ? null : 'GOOGLE_CLIENT_ID',
    clientSecret ? null : 'GOOGLE_CLIENT_SECRET',
    redirectUri ? null : 'GOOGLE_REDIRECT_URI',
  ].filter((name): name is string => name !== null);

  if (missing.length > 0) {
    throw new GoogleOAuthConfigError(`Google sign-in is not configured. Missing ${missing.join(', ')}.`);
  }

  return { clientId, clientSecret, redirectUri };
}

export type PkcePair = {
  verifier: string;
  challenge: string;
};

export function createPkcePair(): PkcePair {
  const verifier = randomBytes(VERIFIER_BYTES).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');

  return { verifier, challenge };
}

export function createStateToken(): string {
  return randomBytes(STATE_BYTES).toString('base64url');
}

export function matchesState(expected: string, received: string): boolean {
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(received, 'utf8');

  if (a.length === 0 || a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function buildAuthorizationUrl(config: GoogleConfig, input: { state: string; challenge: string }): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: SCOPES,
    state: input.state,
    code_challenge: input.challenge,
    code_challenge_method: 'S256',
    access_type: 'online',
    prompt: 'select_account',
  });

  return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
}

export type GoogleProfile = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  givenName: string;
  picture: string | null;
};

type TokenResponse = {
  id_token?: string;
  error?: string;
  error_description?: string;
};

type IdTokenClaims = {
  iss?: string;
  aud?: string;
  sub?: string;
  exp?: number;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  given_name?: string;
  picture?: string;
};

function decodeIdToken(idToken: string): IdTokenClaims {
  const segments = idToken.split('.');

  if (segments.length !== 3) {
    throw new GoogleOAuthError('Google returned a malformed ID token.');
  }

  try {
    return JSON.parse(Buffer.from(segments[1], 'base64url').toString('utf8')) as IdTokenClaims;
  } catch {
    throw new GoogleOAuthError('Google returned an unreadable ID token.');
  }
}

function assertClaims(claims: IdTokenClaims, config: GoogleConfig): void {
  if (!claims.iss || !VALID_ISSUERS.includes(claims.iss)) {
    throw new GoogleOAuthError('The ID token was not issued by Google.');
  }

  if (claims.aud !== config.clientId) {
    throw new GoogleOAuthError('The ID token was issued for a different application.');
  }

  if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW_SECONDS < Math.floor(Date.now() / 1000)) {
    throw new GoogleOAuthError('The Google sign-in expired before it could be completed.');
  }

  if (!claims.sub) {
    throw new GoogleOAuthError('Google did not identify the account.');
  }

  if (!claims.email) {
    throw new GoogleOAuthError('Google did not share an email address for this account.');
  }
}

function isVerified(value: boolean | string | undefined): boolean {
  return value === true || value === 'true';
}

function toProfile(claims: IdTokenClaims): GoogleProfile {
  return {
    googleId: claims.sub ?? '',
    email: claims.email ?? '',
    emailVerified: isVerified(claims.email_verified),
    name: claims.name ?? claims.given_name ?? '',
    givenName: claims.given_name ?? '',
    picture: claims.picture ?? null,
  };
}

export async function exchangeCodeForProfile(
  config: GoogleConfig,
  input: { code: string; verifier: string },
): Promise<GoogleProfile> {
  let response: Response;

  try {
    response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: input.code,
        code_verifier: input.verifier,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }).toString(),
    });
  } catch {
    throw new GoogleOAuthError('Could not reach Google to complete sign-in.');
  }

  const payload = (await response.json().catch(() => null)) as TokenResponse | null;

  if (!response.ok || !payload) {
    const reason = payload?.error_description ?? payload?.error ?? `HTTP ${response.status}`;
    throw new GoogleOAuthError(`Google rejected the sign-in (${reason}).`);
  }

  if (!payload.id_token) {
    throw new GoogleOAuthError('Google did not return an ID token.');
  }

  const claims = decodeIdToken(payload.id_token);
  assertClaims(claims, config);

  return toProfile(claims);
}
