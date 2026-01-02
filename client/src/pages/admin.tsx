import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Package,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Bell,
  Users,
  Monitor,
  Smartphone,
  Eye,
  UserPlus,
  Download,
  Send,
  MessageCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Order, Lead } from "@shared/schema";

interface Visitor {
  id: string;
  page: string;
  lastAction: string;
  lastActionTime: string;
  connectedAt: string;
  device: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels: Record<string, string> = {
  pending: "În așteptare",
  processing: "În procesare",
  shipped: "Expediată",
  delivered: "Livrată",
  cancelled: "Anulată",
};

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
  
    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
  
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError("Parolă incorectă");
      }
    } catch {
      setAuthError("Eroare la conectare");
    }
  };
  

  /* ================= ORDERS ================= */
  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    refetchInterval: 30000,
  });

  /* ================= LEADS ================= */
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch leads");
      return response.json();
    },
    refetchInterval: 30000,
  });

  /* ================= MUTATIONS ================= */
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const response = await fetch(`/api/leads/${leadId}/send-message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });

  const sendAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/leads/send-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
    onSuccess: (data) => {
      alert(
        `Trimise ${data.sent} mesaje, ${data.failed} eșuate din ${data.total}`
      );
    },
  });

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!isAuthenticated) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/admin`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_order") {
        setNewOrderAlert(data.order);
        queryClient.setQueryData<Order[]>(["admin-orders"], (old = []) => [
          data.order,
          ...old,
        ]);
        setTimeout(() => setNewOrderAlert(null), 5000);
      }

      if (data.type === "visitors_update") {
        setVisitors(data.visitors);
        setVisitorCount(data.count);
      }
    };

    return () => ws.close();
  }, [isAuthenticated, queryClient]);

  /* ================= LOGIN UI ================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Parolă admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className="text-red-600 text-sm text-center">{authError}</p>
              )}
              <Button className="w-full">Autentificare</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <Button onClick={() => refetch()} variant="outline" className="mb-6">
        <RefreshCw className="w-4 h-4 mr-2" />
        Actualizează
      </Button>

      {isLoading ? (
        <p>Se încarcă comenzile…</p>
      ) : orders.length === 0 ? (
        <p>Nu există comenzi.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardContent className="p-4">
              <h2 className="font-bold">{order.customerName}</h2>
              <p>{order.phoneNumber}</p>
              <p>
                {order.address}, {order.city}, {order.county}
              </p>
              <p className="font-bold">{order.grandTotal} Lei</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
