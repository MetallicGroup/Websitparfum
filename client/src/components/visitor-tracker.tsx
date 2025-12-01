import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

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
