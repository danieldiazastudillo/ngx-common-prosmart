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
 * Determines whether a keyboard event should be allowed in a RUT input.
 * Encodes the RUT-domain rule: only digits and the letter K/k are valid characters.
 * Navigation keys (arrows, backspace, etc.) and clipboard shortcuts are always allowed.
 *
 * @param event The keyboard event to evaluate.
 * @returns `true` if the key should be allowed, `false` if it should be blocked.
 *
 * @example
 * // Inside a directive's keydown handler:
 * if (!isAllowedRutKey(event)) {
 *   event.preventDefault();
 * }
 */
export function isAllowedRutKey(event: KeyboardEvent): boolean {
  const key = event.key;

  // Allow: backspace, delete, tab, escape, enter, arrows, home, end
  if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
    return true;
  }

  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X and Mac equivalents
  if (event.ctrlKey || event.metaKey) {
    return true;
  }

  // Allow only digits and K/k (the valid verifier digit characters)
  return /^[0-9kK]$/.test(key);
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
