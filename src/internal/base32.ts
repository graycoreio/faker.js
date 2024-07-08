export const reducedBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford's Base32 - Excludes I, L, O, and U which may be confused with numbers

/**
 * Encodes a Date into 10 characters base32 string.
 *
 * @param date The Date to encode.
 */
export function encodeDate(date: Date): string {
  let value = date.valueOf();
  let result = '';
  for (let len = 10; len > 0; len--) {
    const mod = value % 32;
    result = reducedBase32[mod] + result;
    value = (value - mod) / 32;
  }

  return result;
}
