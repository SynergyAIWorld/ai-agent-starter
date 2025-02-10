/**
 * Formats a number to a string with specified decimal places and thousands separators.
 *
 * @param {number} value - The number to be formatted.
 * @param {number} [decimalPlaces=2] - The number of decimal places to include (default is 2). If set to 0, no decimal point is shown.
 * @returns {string} The formatted number as a string.
 *
 * @example
 * // Returns "123,456.79"
 * formatNumber(123456.789);
 *
 * @example
 * // Returns "123,456.8"
 * formatNumber(123456.789, 1);
 *
 * @example
 * // Returns "123,456"
 * formatNumber(123456.789, 0);
 */
export function formatNumber(
  value: number | string | undefined,
  decimalPlaces?: number,
): string {
  if (!value) {
    return "0";
  }
  // Convert to string to avoid floating point precision issues
  const numStr = decimalPlaces
    ? parseFloat(value.toString()).toFixed(decimalPlaces).toString()
    : value.toString();

  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = numStr.split(".");

  // Format the integer part with thousands separator
  integerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decimalPlaces === 0) {
    // Return only the integer part if decimalPlaces is 0
    return integerPart ?? "0";
  } else {
    // Handle the decimal part
    if (decimalPart) {
      decimalPart = decimalPart.substring(0, decimalPlaces);
    } else {
      decimalPart = "".padEnd(decimalPlaces ?? 2, "0");
    }

    return `${integerPart}.${decimalPart}`;
  }
}
