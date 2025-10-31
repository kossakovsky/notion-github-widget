import type { Theme } from './types';

/**
 * Validates GitHub username format
 * Rules:
 * - 1-39 characters long
 * - May only contain alphanumeric characters or hyphens
 * - Cannot begin or end with a hyphen
 * - Cannot have consecutive hyphens
 */
export function validateGitHubUsername(username: string): boolean {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // Check length
  if (username.length < 1 || username.length > 39) {
    return false;
  }

  // GitHub username regex pattern
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

  return usernameRegex.test(username);
}

/**
 * Sanitizes username to prevent XSS attacks
 * Removes any non-alphanumeric characters except hyphens
 */
export function sanitizeUsername(username: string): string {
  if (!username || typeof username !== 'string') {
    return '';
  }

  // Remove any characters that aren't alphanumeric or hyphens
  return username.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Validates and sanitizes username
 * Returns sanitized username or null if invalid
 */
export function processUsername(username: string): string | null {
  const sanitized = sanitizeUsername(username);

  if (!validateGitHubUsername(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Validates theme parameter
 * Returns 'light' or 'dark', defaults to 'dark'
 */
export function validateTheme(theme: string | null | undefined): Theme {
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return 'dark';
}

/**
 * Creates safe error message without exposing sensitive info
 */
export function createSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose full error details in production
    return 'An error occurred while fetching data';
  }
  return 'An unexpected error occurred';
}
