import crypto from 'crypto';

const FACEBOOK_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || '1117738936893819';
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';
const FACEBOOK_API_VERSION = 'v21.0';

interface FacebookEventProduct {
  id: string;
  quantity?: number;
  item_price?: number;
}

interface FacebookUserData {
  em?: string[]; // Email (hashed)
  ph?: string[]; // Phone (hashed)
  fn?: string[]; // First name (hashed)
  ln?: string[]; // Last name (hashed)
  ct?: string[]; // City (hashed)
  st?: string[]; // State (hashed)
  country?: string[]; // Country code (2 letters)
  client_user_agent?: string; // Not hashed
}

interface FacebookCustomData {
  currency?: string;
  value?: number;
  content_ids?: string[];
  contents?: FacebookEventProduct[];
  content_type?: string;
  num_items?: number;
}

interface FacebookEvent {
  event_name: string;
  event_time: number; // Unix timestamp in seconds
  action_source: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  event_source_url?: string;
  user_data: FacebookUserData;
  custom_data?: FacebookCustomData;
  event_id?: string; // For deduplication
}

/**
 * Hash a value using SHA-256
 */
function sha256Hash(input: string): string {
  if (!input) return '';
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

/**
 * Hash phone number (remove non-digits first)
 */
function hashPhone(phone: string): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  return sha256Hash(digitsOnly);
}

/**
 * Send event to Facebook Conversions API
 */
export async function sendFacebookEvent(
  eventName: string,
  data: {
    value?: number;
    currency?: string;
    contents?: Array<{
      id: string;
      quantity?: number;
      item_price?: number;
    }>;
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
  },
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  if (!FACEBOOK_ACCESS_TOKEN) {
    console.warn('Facebook Conversions API: Access token not configured');
    return;
  }

  try {
    const eventTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

    // Build user_data
    const user_data: FacebookUserData = {
      client_user_agent: userData?.client_user_agent,
    };

    if (userData?.email) {
      user_data.em = [sha256Hash(userData.email)];
    }

    if (userData?.phone) {
      user_data.ph = [hashPhone(userData.phone)];
    }

    if (userData?.firstName) {
      user_data.fn = [sha256Hash(userData.firstName)];
    }

    if (userData?.lastName) {
      user_data.ln = [sha256Hash(userData.lastName)];
    }

    if (userData?.city) {
      user_data.ct = [sha256Hash(userData.city)];
    }

    if (userData?.state) {
      user_data.st = [sha256Hash(userData.state)];
    }

    if (userData?.country) {
      user_data.country = [userData.country.toUpperCase()]; // Country code, not hashed
    }

    // Build custom_data
    const custom_data: FacebookCustomData = {};

    if (data.currency) {
      custom_data.currency = data.currency;
    }

    if (data.value !== undefined) {
      custom_data.value = data.value;
    }

    if (data.content_ids && data.content_ids.length > 0) {
      custom_data.content_ids = data.content_ids;
    }

    if (data.contents && data.contents.length > 0) {
      custom_data.contents = data.contents.map(c => ({
        id: c.id,
        quantity: c.quantity,
        item_price: c.item_price,
      }));
    }

    if (data.content_type) {
      custom_data.content_type = data.content_type;
    }

    if (data.num_items !== undefined) {
      custom_data.num_items = data.num_items;
    }

    // Build event
    const event: FacebookEvent = {
      event_name: eventName,
      event_time: eventTime,
      action_source: 'website',
      user_data,
      custom_data: Object.keys(custom_data).length > 0 ? custom_data : undefined,
    };

    if (eventId) {
      event.event_id = eventId;
    }

    // Build payload
    const payload = {
      data: [event],
    };

    // Send to Facebook Conversions API
    const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_PIXEL_ID}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Facebook Conversions API error for ${eventName}:`, response.status, errorText);
      return;
    }

    const result = await response.json();
    if (result.error) {
      console.error(`Facebook Conversions API error for ${eventName}:`, result.error);
    } else {
      console.log(`Facebook Conversions API: ${eventName} event sent successfully`);
    }
  } catch (error) {
    console.error(`Error sending Facebook Conversions API event ${eventName}:`, error);
  }
}

/**
 * Send Purchase event
 */
export async function sendFacebookPurchaseEvent(
  order: {
    grandTotal: number;
    products: Array<{ id: string; name: string; price: number; quantity: number }>;
  },
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  await sendFacebookEvent(
    'Purchase',
    {
      value: order.grandTotal,
      currency: 'RON',
      content_ids: order.products.map(p => p.id),
      contents: order.products.map(p => ({
        id: p.id,
        quantity: p.quantity,
        item_price: p.price,
      })),
      content_type: 'product',
      num_items: order.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    userData,
    eventId
  );
}

/**
 * Send AddToCart event
 */
export async function sendFacebookAddToCartEvent(
  product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
  },
  userData?: {
    email?: string;
    phone?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  await sendFacebookEvent(
    'AddToCart',
    {
      value: product.price * (product.quantity || 1),
      currency: 'RON',
      content_ids: [product.id],
      contents: [{
        id: product.id,
        quantity: product.quantity || 1,
        item_price: product.price,
      }],
      content_type: 'product',
      num_items: product.quantity || 1,
    },
    userData,
    eventId
  );
}

/**
 * Send InitiateCheckout event
 */
export async function sendFacebookInitiateCheckoutEvent(
  cart: {
    total: number;
    products: Array<{ id: string; name: string; price: number; quantity: number }>;
  },
  userData?: {
    email?: string;
    phone?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  await sendFacebookEvent(
    'InitiateCheckout',
    {
      value: cart.total,
      currency: 'RON',
      content_ids: cart.products.map(p => p.id),
      contents: cart.products.map(p => ({
        id: p.id,
        quantity: p.quantity,
        item_price: p.price,
      })),
      content_type: 'product',
      num_items: cart.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    userData,
    eventId
  );
}

/**
 * Send AddPaymentInfo event
 */
export async function sendFacebookAddPaymentInfoEvent(
  order: {
    grandTotal: number;
    products: Array<{ id: string; name: string; price: number; quantity: number }>;
  },
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  await sendFacebookEvent(
    'AddPaymentInfo',
    {
      value: order.grandTotal,
      currency: 'RON',
      content_ids: order.products.map(p => p.id),
      contents: order.products.map(p => ({
        id: p.id,
        quantity: p.quantity,
        item_price: p.price,
      })),
      content_type: 'product',
      num_items: order.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    userData,
    eventId
  );
}

/**
 * Send ViewContent event
 */
export async function sendFacebookViewContentEvent(
  product: {
    id: string;
    name: string;
    price: number;
  },
  userData?: {
    email?: string;
    phone?: string;
    client_user_agent?: string;
  },
  eventId?: string
): Promise<void> {
  await sendFacebookEvent(
    'ViewContent',
    {
      value: product.price,
      currency: 'RON',
      content_ids: [product.id],
      contents: [{
        id: product.id,
        quantity: 1,
        item_price: product.price,
      }],
      content_type: 'product',
    },
    userData,
    eventId
  );
}
