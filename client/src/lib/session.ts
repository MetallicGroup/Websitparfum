/**
 * Get or create a unique session ID for tracking
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const STORAGE_KEY = 'luxe_parfum_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Detect device type
 */
export function getDeviceType(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent || '';
  if (/mobile|android|iphone|ipad/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}
