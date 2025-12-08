/**
 * Helper functions for parsing URL search parameters into filter values
 */

/**
 * Parse a URL parameter that can be a single value or comma-separated values into an array
 * @param param - The URL parameter value
 * @returns Array of strings or undefined if param is empty
 */
export function parseArrayParam(param: string | string[] | undefined): string[] | undefined {
  if (!param) return undefined
  if (Array.isArray(param)) return param
  return param.split(',').filter(Boolean)
}

/**
 * Parse a URL parameter into a boolean value
 * @param param - The URL parameter value
 * @returns Boolean value or undefined if param is empty
 */
export function parseBooleanParam(param: string | string[] | undefined): boolean | undefined {
  if (!param) return undefined
  if (Array.isArray(param)) return param[0] === 'true'
  return param === 'true'
}

/**
 * Parse a URL parameter into a number
 * @param param - The URL parameter value
 * @param defaultValue - Default value if parsing fails
 * @returns Number value or default
 */
export function parseNumberParam(param: string | string[] | undefined, defaultValue: number): number {
  if (!param) return defaultValue
  const value = Array.isArray(param) ? param[0] : param
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}
