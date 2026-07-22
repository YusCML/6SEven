import crypto from "crypto";

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha256";

export type PasswordHash = {
  passwordHash: string;
  passwordSalt: string;
};

export function hashPassword(plainPassword: string): PasswordHash {
  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(
      plainPassword,
      passwordSalt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    )
    .toString("hex");

  return { passwordHash, passwordSalt };
}

export function verifyPassword(
  plainPassword: string,
  passwordHash: string,
  passwordSalt: string,
) {
  const candidateHash = crypto
    .pbkdf2Sync(
      plainPassword,
      passwordSalt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    )
    .toString("hex");

  const expected = Buffer.from(passwordHash, "hex");
  const actual = Buffer.from(candidateHash, "hex");

  if (expected.length !== actual.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, actual);
}
