import { randomInt } from 'node:crypto';

/**
 * Guest identity. Visitors who have not signed in still get a session so the
 * app can hold their preferences; they are shown as `User` + a random suffix.
 */

const GUEST_NAME_PREFIX = 'User';
const GUEST_SUFFIX_LENGTH = 6;
// No 0/O/1/I/l — the name is meant to be read aloud and retyped.
const SUFFIX_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

export function generateGuestName(): string {
  let suffix = '';

  for (let index = 0; index < GUEST_SUFFIX_LENGTH; index += 1) {
    suffix += SUFFIX_ALPHABET[randomInt(SUFFIX_ALPHABET.length)];
  }

  return `${GUEST_NAME_PREFIX}${suffix}`;
}

export function isGuestName(name: string): boolean {
  return new RegExp(`^${GUEST_NAME_PREFIX}[${SUFFIX_ALPHABET}]{${GUEST_SUFFIX_LENGTH}}$`).test(name);
}
