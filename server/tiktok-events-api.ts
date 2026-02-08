/**
 * TikTok Events API - Server-side event tracking
 * 
 * Documentation: https://ads.tiktok.com/help/article?aid=10028
 */

import crypto from 'crypto';

const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || 'D6349AJC77UBV3LSRJQG';
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || 'af5313200bd29cca38adeb6391300615b8542c5c';
const TIKTOK_API_ENDPOINT = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

interface TikTokEventProduct {
  content_id: string;
  content_type: string;
  content_name: string;
  quantity?: number;
  price?: number;
}

interface TikTokEventData {
  event: string;
  event_id?: string;
  event_time?: number;
  properties: {
    value?: number;
    currency?: string;
    content_id?: string;
    content_type?: string;
    content_name?: string;
    contents?: TikTokEventProduct[];
    search_string?: string;
    url?: string;
  };
  context: {
    page?: {
      url?: string;
      referrer?: string;
    };
    user?: {
      external_id?: string;
      phone_number?: string;
      email?: string;
    };
    ip?: string;
    user_agent?: string;
  };
}

/**
 * Hash string with SHA-256
 */
function sha256Hash(input: string): string {
  return crypto.createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
}

/**
 * Send event to TikTok Events API
 */
export async function sendTikTokEvent(
  eventName: string,
  data: {
    value?: number;
    currency?: string;
    contents?: TikTokEventProduct[];
    content_id?: string;
    content_type?: string;
    content_name?: string;
    search_string?: string;
    url?: string;
  },
  customerInfo?: {
    email?: string;
    phone?: string;
    external_id?: string;
    ip?: string;
    user_agent?: string;
  },
  eventId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const generatedEventId = eventId || `${eventTime}_${Math.random().toString(36).substr(2, 9)}`;

    const eventData: TikTokEventData = {
      event: eventName,
      event_id: generatedEventId,
      event_time: eventTime,
      properties: {
        currency: data.currency || 'RON',
        url: data.url || process.env.BASE_URL || 'https://luxeparfum.store',
      },
      context: {
        page: {
          url: data.url || process.env.BASE_URL || 'https://luxeparfum.store',
        },
      },
    };

    // Add value if provided
    if (data.value !== undefined) {
      eventData.properties.value = data.value;
    }

    // Add contents array or single content
    if (data.contents && data.contents.length > 0) {
      eventData.properties.contents = data.contents;
    } else if (data.content_id) {
      eventData.properties.content_id = data.content_id;
      eventData.properties.content_type = data.content_type || 'product';
      eventData.properties.content_name = data.content_name || '';
    }

    // Add search_string if provided
    if (data.search_string) {
      eventData.properties.search_string = data.search_string;
    }

    // Add customer information (hashed)
    if (customerInfo) {
      eventData.context.user = {};
      
      if (customerInfo.email) {
        eventData.context.user.email = sha256Hash(customerInfo.email);
      }
      
      if (customerInfo.phone) {
        // Remove all non-digit characters before hashing
        const cleanPhone = customerInfo.phone.replace(/\D/g, '');
        if (cleanPhone) {
          eventData.context.user.phone_number = sha256Hash(cleanPhone);
        }
      }
      
      if (customerInfo.external_id) {
        eventData.context.user.external_id = sha256Hash(String(customerInfo.external_id));
      }

      if (customerInfo.ip) {
        eventData.context.ip = customerInfo.ip;
      }

      if (customerInfo.user_agent) {
        eventData.context.user_agent = customerInfo.user_agent;
      }
    }

    // TikTok Events API v1.3 payload format
    // According to TikTok docs, timestamp should be Unix timestamp in seconds (string)
    const timestamp = eventData.event_time?.toString() || Math.floor(Date.now() / 1000).toString();
    
    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event_source_id: 'web', // Required: identifies the source of the event (web, app, etc.)
      data: [
        {
          event: eventData.event,
          event_id: eventData.event_id,
          timestamp: timestamp,
          properties: eventData.properties,
          context: eventData.context,
        }
      ],
    };

    console.log('Sending TikTok event:', {
      event: eventName,
      event_id: generatedEventId,
      pixel_id: TIKTOK_PIXEL_ID,
    });

    const response = await fetch(TIKTOK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Access-Token': TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TikTok Events API error:', response.status, errorText);
      return {
        success: false,
        error: `TikTok API error: ${response.status} - ${errorText}`,
      };
    }

    const result = await response.json();
    console.log('TikTok event sent successfully:', result);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending TikTok event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Purchase event when order is completed
 */
export async function sendTikTokPurchaseEvent(
  order: {
    id: string;
    customerName: string;
    phoneNumber: string;
    products: Array<{ id: string; name: string; price: number; quantity: number }>;
    total: number;
    shippingCost: number;
    grandTotal: number;
  },
  requestInfo?: {
    ip?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    // Generate external_id from customer name and phone
    const externalId = `${order.customerName}_${order.phoneNumber}`;

    await sendTikTokEvent(
      'Purchase',
      {
        value: order.grandTotal,
        currency: 'RON',
        contents: order.products.map(product => ({
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        url: `${process.env.BASE_URL || 'https://luxeparfum.store'}/checkout`,
      },
      {
        phone: order.phoneNumber,
        external_id: externalId,
        ip: requestInfo?.ip,
        user_agent: requestInfo?.userAgent,
      }
    );

    // Also send PlaceAnOrder event
    await sendTikTokEvent(
      'PlaceAnOrder',
      {
        value: order.grandTotal,
        currency: 'RON',
        contents: order.products.map(product => ({
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        url: `${process.env.BASE_URL || 'https://luxeparfum.store'}/checkout`,
      },
      {
        phone: order.phoneNumber,
        external_id: externalId,
        ip: requestInfo?.ip,
        user_agent: requestInfo?.userAgent,
      }
    );
  } catch (error) {
    console.error('Error sending TikTok purchase event:', error);
    // Don't throw - we don't want to fail the order creation if TikTok API fails
  }
}
