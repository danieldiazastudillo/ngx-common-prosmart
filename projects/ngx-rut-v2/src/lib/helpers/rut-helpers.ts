/**
 *
 * @param value The RUT string to clean.
 * @description Cleans a RUT (Rol Único Tributario) string by removing non-numeric characters and leading zeros.
 * Converts the RUT to uppercase and returns it.
 * @returns The cleaned RUT string.
 */
export function rutClean(value: string): string {
  if (typeof value === 'string') {
    return value
      .replace(/[^0-9kK]+/g, '')
      .replace(/^0+/, '')
      .toUpperCase();
  }
  return '';
}

/**
 * @param value The RUT string to validate.
 * @description Validates a RUT (Rol Único Tributario) string.
 * @returns True if the RUT is valid, false otherwise.
 */
export function rutValidate(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const rut: string = rutClean(value);
  if (rut.length < 2) {
    return false;
  }

  const body: string = rut.slice(0, -1);
  const dv: string = rut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  let expectedDvStr = '';

  if (expectedDv === 11) {
    expectedDvStr = '0';
  } else if (expectedDv === 10) {
    expectedDvStr = 'K';
  } else {
    expectedDvStr = expectedDv.toString();
  }

  return dv === expectedDvStr;
}

/**
 * Formats a RUT (Rol Único Tributario) string.
 * @param value The RUT string to format.
 * @returns The formatted RUT string.
 */
export function rutFormat(value: string): string {
  const rut: string = rutClean(value);

  if (rut.length <= 1) {
    return rut;
  }

  let result: string = `${rut.slice(-4, -1)}-${rut.slice(-1)}`;
  for (let i: number = 4; i < rut.length; i += 3) {
    result = `${rut.slice(-3 - i, -i)}.${result}`;
  }

  return result;
}
