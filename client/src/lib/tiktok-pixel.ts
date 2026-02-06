/**
 * TikTok Pixel utilities for tracking events with PII data
 */

// Hash function for SHA-256 (client-side)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Identify user with PII data (email, phone, external_id)
 * Should be called before tracking events when PII data is available
 */
export async function identifyTikTokUser(email?: string, phone?: string, externalId?: string) {
  if (typeof window === 'undefined' || !(window as any).ttq) return;

  const identifyData: {
    email?: string;
    phone_number?: string;
    external_id?: string;
  } = {};

  if (email) {
    identifyData.email = await sha256(email.toLowerCase().trim());
  }

  if (phone) {
    // Remove all non-digit characters and hash
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      identifyData.phone_number = await sha256(cleanPhone);
    }
  }

  if (externalId) {
    identifyData.external_id = await sha256(String(externalId));
  }

  if (Object.keys(identifyData).length > 0) {
    (window as any).ttq.identify(identifyData);
  }
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Track TikTok event with proper format
 */
export function trackTikTokEvent(
  eventName: string,
  data: {
    contents?: Array<{
      content_id: string;
      content_type: string;
      content_name: string;
      quantity?: number;
      price?: number;
    }>;
    value?: number;
    currency?: string;
    search_string?: string;
  },
  eventId?: string
) {
  if (typeof window === 'undefined' || !(window as any).ttq) return;

  const eventData: any = {};

  if (data.contents && data.contents.length > 0) {
    eventData.contents = data.contents;
  }

  if (data.value !== undefined) {
    eventData.value = data.value;
  }

  if (data.currency) {
    eventData.currency = data.currency;
  }

  if (data.search_string) {
    eventData.search_string = data.search_string;
  }

  const options: { event_id?: string } = {};
  if (eventId) {
    options.event_id = eventId;
  } else {
    options.event_id = generateEventId();
  }

  (window as any).ttq.track(eventName, eventData, options);
}
