/**
 * Shared between the server page and the client switcher.
 *
 * This deliberately does NOT live in the "use client" component: exports
 * crossing that boundary reach a Server Component as client references rather
 * than their values, so a constant imported from there arrives as a function
 * and silently reads as undefined.
 */
export const ROLE_COOKIE = "hjm_role";

/** A year - the lens is a durable preference, not a session. */
export const ROLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Persists the chosen lens. Lives here rather than inline in the switcher so
 * the browser write sits outside the component body.
 */
export function setRoleCookie(key: string): void {
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(key)}; path=/; max-age=${ROLE_COOKIE_MAX_AGE}; samesite=lax`;
}
