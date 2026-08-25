import { randomInt } from 'node:crypto';

const GUEST_NAME_PREFIX = 'User';
const GUEST_SUFFIX_LENGTH = 6;
const SUFFIX_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

export function generateGuestName(): string {
  let suffix = '';

  for (let index = 0; index < GUEST_SUFFIX_LENGTH; index += 1) {
    suffix += SUFFIX_ALPHABET[randomInt(SUFFIX_ALPHABET.length)];
  }

  return `${GUEST_NAME_PREFIX}${suffix}`;
}
