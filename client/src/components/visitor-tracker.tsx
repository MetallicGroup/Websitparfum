import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getSessionId, getDeviceType } from "@/lib/session";
import { detectTrafficSource } from "@/lib/traffic-source";

const pageNames: Record<string, string> = {
  "/": "Pagina principală",
  "/checkout": "Checkout",
  "/category/women": "Parfumuri Damă",
  "/category/men": "Parfumuri Bărbați",
  "/category/unisex": "Parfumuri Unisex",
};

export function VisitorTracker() {
  const [location] = useLocation();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTrackedRef = useRef(false);

  // Track session on first load
  useEffect(() => {
    if (location === "/admin" || sessionTrackedRef.current) return;
    
    const sessionId = getSessionId();
    const device = getDeviceType();
    const trafficSource = detectTrafficSource();
    
    // Track session in database
    fetch('/api/track/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userAgent: navigator.userAgent,
        device,
        trafficSource,
      }),
    }).catch(err => console.error('Error tracking session:', err));
    
    sessionTrackedRef.current = true;
  }, []);

  useEffect(() => {
    function connect() {
      if (location === "/admin") return;
      
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/visitor`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        const pageName = pageNames[location] || (location.startsWith("/product/") ? "Pagina produs" : location);
        ws.send(JSON.stringify({ type: "page_view", page: location, pageName }));
      };

      ws.onclose = () => {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const pageName = pageNames[location] || (location.startsWith("/product/") ? "Pagina produs" : location);
      wsRef.current.send(JSON.stringify({ type: "page_view", page: location, pageName }));
    }
  }, [location]);

  useEffect(() => {
    function trackAction(action: string) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "action", action }));
      }
    }

    function handleAddToCart() {
      trackAction("A adăugat în coș");
      
      // Track add to cart event in database
      const sessionId = getSessionId();
      fetch('/api/track/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'add_to_cart',
        }),
      }).catch(err => console.error('Error tracking add to cart:', err));
    }

    function handleScroll() {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > 75) {
        trackAction("Navighează pagina (75%+)");
      }
    }

    window.addEventListener("cart-add", handleAddToCart);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("cart-add", handleAddToCart);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

export function trackCartAdd() {
  window.dispatchEvent(new CustomEvent("cart-add"));
}
