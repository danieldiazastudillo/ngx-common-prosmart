/**
 * Configuration options for the thousand separator directive.
 */
export interface SeparadorConfig {
  /**
   * Character used to separate thousands. Default: '.' (Chilean standard)
   */
  thousandSeparator?: string;
  /**
   * Character used as decimal separator. Default: ',' (Chilean standard)
   */
  decimalSeparator?: string;
  /**
   * Whether to allow decimal values. Default: false
   */
  allowDecimals?: boolean;
}

/**
 * Formats a numeric value with thousand and decimal separators.
 * Chilean default: 1350689 → "1.350.689", 1350689.5 → "1.350.689,5" (if decimals allowed)
 *
 * @param value The numeric value to format (number, string, or null/undefined)
 * @param config Optional configuration for separators and decimal handling
 * @returns Formatted string representation of the value
 *
 * @example
 * ```typescript
 * separadorFormat(1350689); // "1.350.689"
 * separadorFormat(1350689.5, { allowDecimals: true }); // "1.350.689,5"
 * separadorFormat(-42000, { thousandSeparator: ',' }); // "-42,000"
 * separadorFormat(1234.56, { thousandSeparator: ',', decimalSeparator: '.', allowDecimals: true }); // "1,234.56"
 * ```
 */
export function separadorFormat(value: any, config: SeparadorConfig = {}): string {
  const thousandSep = config.thousandSeparator ?? '.';
  const decimalSep = config.decimalSeparator ?? ',';
  const allowDec = config.allowDecimals ?? false;

  if (value === null || value === undefined || value === '') return '';

  let [integer, decimal] = String(value).replaceAll(/[^\d.,-]/g, '').split(/[.,]/);
  let sign = '';
  if (integer.startsWith('-')) {
    sign = '-';
    integer = integer.slice(1);
  }

  integer = integer.replaceAll(/\B(?=(\d{3})+(?!\d))/g, thousandSep);

  if (allowDec && decimal !== undefined) {
    return sign + integer + decimalSep + decimal;
  }
  return sign + integer;
}

/**
 * Parses a formatted string to a clean numeric value.
 * "1.350.689,5" → 1350689.5
 *
 * @param value The formatted string value to parse
 * @param config Optional configuration to identify the decimal separator
 * @returns Parsed numeric value or null if invalid
 *
 * @example
 * ```typescript
 * separadorParse("1.350.689,5", { decimalSeparator: ',' }); // 1350689.5
 * separadorParse("1,234.56", { decimalSeparator: '.' }); // 1234.56
 * separadorParse("42,000"); // 42000
 * separadorParse(""); // null
 * ```
 */
export function separadorParse(value: string, config: SeparadorConfig = {}): number | null {
  const decimalSep = config.decimalSeparator ?? ',';

  if (!value) return null;

  let val = value.replaceAll(new RegExp(`[^0-9${decimalSep}]`, 'g'), '');
  val = val.replaceAll(decimalSep, '.');
  const num = Number.parseFloat(val);
  return Number.isNaN(num) ? null : num;
}

/**
 * Sanitizes input to only allow digits and one decimal separator.
 * Removes all other characters and ensures only one decimal separator exists.
 *
 * @param value The raw input string to sanitize
 * @param config Optional configuration to identify the decimal separator
 * @returns Sanitized string with only digits and at most one decimal separator
 *
 * @example
 * ```typescript
 * separadorClean("12a3,4,5"); // "123,45"
 * separadorClean("1..2..3"); // "123"
 * separadorClean("abc123def"); // "123"
 * separadorClean("1,234.56", { decimalSeparator: '.' }); // "123456"
 * ```
 */
export function separadorClean(value: string, config: SeparadorConfig = {}): string {
  const decimalSep = config.decimalSeparator ?? ',';

  let sanitized = value.replaceAll(new RegExp(`[^0-9${decimalSep}]`, 'g'), '');
  const firstSep = sanitized.indexOf(decimalSep);
  if (firstSep !== -1) {
    sanitized = sanitized.substring(0, firstSep + 1) +
                sanitized.substring(firstSep + 1).replaceAll(new RegExp(`[${decimalSep}]`, 'g'), '');
  }
  return sanitized;
}
