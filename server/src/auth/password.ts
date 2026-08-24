import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const ALGORITHM = 'scrypt';
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const PARAMS = { N: 16_384, r: 8, p: 1 };
const MAX_MEM = 64 * 1024 * 1024;

function prepare(password: string) {
  return Buffer.from(password.normalize('NFKC'), 'utf8');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(prepare(password), salt, KEY_BYTES, { ...PARAMS, maxmem: MAX_MEM });

  return [ALGORITHM, PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), derived.toString('base64')].join('$');
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');

  if (parts.length !== 6 || parts[0] !== ALGORITHM) return false;

  const [, rawN, rawR, rawP, saltBase64, keyBase64] = parts;
  const N = Number.parseInt(rawN, 10);
  const r = Number.parseInt(rawR, 10);
  const p = Number.parseInt(rawP, 10);

  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  const salt = Buffer.from(saltBase64, 'base64');
  const expected = Buffer.from(keyBase64, 'base64');

  if (salt.length === 0 || expected.length === 0) return false;

  try {
    const derived = await scrypt(prepare(password), salt, expected.length, { N, r, p, maxmem: MAX_MEM });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function needsRehash(storedHash: string): boolean {
  const parts = storedHash.split('$');

  if (parts.length !== 6 || parts[0] !== ALGORITHM) return true;

  const [, rawN, rawR, rawP] = parts;
  return Number(rawN) < PARAMS.N || Number(rawR) < PARAMS.r || Number(rawP) < PARAMS.p;
}
