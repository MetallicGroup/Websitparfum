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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      const res = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError("Parolă incorectă");
      }
    } catch {
      setAuthError("Eroare de conexiune");
    }
  };

  /* ================= ORDERS ================= */
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    refetchInterval: 30000,
  });

  /* ================= LEADS ================= */
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/admin/leads", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    refetchInterval: 30000,
  });

  /* ================= MUTATIONS ================= */
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const res = await fetch(`/api/admin/leads/${leadId}/send-message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });

  const sendAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/leads/send-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!isAuthenticated) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/admin`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-4" />
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Introduceți parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className="text-sm text-red-600 text-center">{authError}</p>
              )}
              <Button className="w-full" type="submit">
                Autentificare
              </Button>
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

      <Button onClick={() => refetch()} className="mb-4">
        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
      </Button>

      {/* restul UI-ului tău poate rămâne neschimbat */}
    </div>
  );
}
