import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const ALGORITHM = 'scrypt';
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const COST = 16_384;
const BLOCK_SIZE = 8;
const PARALLELISM = 1;
const MAX_MEMORY = 64 * 1024 * 1024;

function scrypt(password: string, salt: Buffer, keyLength: number, cost: number, blockSize: number, parallelism: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const options = { N: cost, r: blockSize, p: parallelism, maxmem: MAX_MEMORY };

    scryptCallback(password.normalize('NFKC'), salt, keyLength, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await scrypt(password, salt, KEY_BYTES, COST, BLOCK_SIZE, PARALLELISM);

  return [ALGORITHM, COST, BLOCK_SIZE, PARALLELISM, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');

  if (parts.length !== 6) return false;
  if (parts[0] !== ALGORITHM) return false;

  const cost = Number(parts[1]);
  const blockSize = Number(parts[2]);
  const parallelism = Number(parts[3]);
  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');

  if (!Number.isFinite(cost) || !Number.isFinite(blockSize) || !Number.isFinite(parallelism)) return false;
  if (salt.length === 0 || expected.length === 0) return false;

  try {
    const key = await scrypt(password, salt, expected.length, cost, blockSize, parallelism);
    return timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}
