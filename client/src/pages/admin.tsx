import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Package, User, Phone, MapPin, Clock, CheckCircle, Truck, XCircle, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order } from "@shared/schema";

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
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

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
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/admin`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Admin WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_order") {
          setNewOrderAlert(data.order);
          queryClient.setQueryData<Order[]>(["admin-orders"], (old) => {
            if (!old) return [data.order];
            return [data.order, ...old];
          });
          
          // Play notification sound
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVA1QX+t05NeMRIYc6vPr4ZVOzpNhLfRoHdXRT5LdZO4sIGDfXlua2ptdYeFhod6bmdfYW18kKKqnIdpUUhQYn+aq6aSd1hHQFBsgJqgl45zWkhAS1tufpWdkoF0ZVxWVl5peYyXkoR2aF9cYGp1hI+UjYJzZ15aYGp1g4+TjoN1aGNhaHN+iZCQiIF0amRibHeBi5GPiYBzbGZmbXeCjJCOhoFzb2ttdH2Hjo+Mhn91cm1wd4KLj46JgXdycnN4gYmOjYqDe3VzdHmBh4yLiIR+d3Z2eoCGioqHg358eHh7f4WHh4WCf3x5en1/goWGhIOBfnt7fH+ChIaFg4F+fHx9gIKEhYSCgH58fX5/gYOEg4KAfn1+f4CBg4OCgYB/fn5/gIGCg4KBgH9+fn+AgYKCgoGAf35/f4CBgoKBgYB/f3+AgIGCgoGAf39/f4CAgYGBgYB/f39/gICBgYGAf39/f4CAgYGBgH9/f3+AgIGBgYB/f39/gICBgYGAf39/f4CAgYGBgH9/f39/gIGBgX9/f39/gICBgYF/f39/f4CAgYGBf39/f3+AgIGBgX9/f39/gICBgYF/f39/f4CAgYGBf39/f3+AgIGBgX9/f39/gICBgYB/f39/f4CAgYGAf39/f3+AgIGBgH9/f39/gICBgYB/f39/f4CAgYGAf39/f3+AgIGBgH9/f39/gA==");
          audio.volume = 0.5;
          audio.play().catch(() => {});
          
          setTimeout(() => setNewOrderAlert(null), 5000);
        } else if (data.type === "order_updated") {
          queryClient.setQueryData<Order[]>(["admin-orders"], (old) => {
            if (!old) return old;
            return old.map(o => o.id === data.order.id ? data.order : o);
          });
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    };

    ws.onclose = () => {
      console.log("Admin WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [isAuthenticated, queryClient]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const response = await fetch("/api/orders", {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm">Luxe Parfum - Gestionare Comenzi</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Introduceți parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                data-testid="input-admin-password"
              />
              {authError && (
                <p className="text-destructive text-sm text-center">{authError}</p>
              )}
              <Button type="submit" className="w-full h-12" data-testid="button-admin-login">
                Autentificare
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Order Alert */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Bell className="w-6 h-6 animate-bounce" />
            <div>
              <p className="font-bold">Comandă Nouă!</p>
              <p className="text-sm">{newOrderAlert.customerName} - {newOrderAlert.grandTotal} Lei</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground text-sm">Luxe Parfum - Gestionare Comenzi</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live
              </Badge>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizează
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Comenzi</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">În Așteptare</p>
                  <p className="text-3xl font-bold">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venituri Totale</p>
                  <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} Lei</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Comenzi Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Se încarcă comenzile...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nu există comenzi încă</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        {/* Customer Info */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={`${statusColors[order.status]} border`}>
                            {statusLabels[order.status]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString("ro-RO")}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href={`tel:${order.phoneNumber}`} className="text-primary hover:underline">
                              {order.phoneNumber}
                            </a>
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">
                              {order.address}, {order.city}, {order.county}
                            </span>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="bg-secondary/30 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Produse comandate:</p>
                          <div className="space-y-1">
                            {order.products.map((product, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{product.quantity}x {product.name}</span>
                                <span className="font-medium">{product.price * product.quantity} Lei</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                            <span>Total (incl. livrare {order.shippingCost} Lei)</span>
                            <span className="text-primary">{order.grandTotal} Lei</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Actualizează status:
                        </label>
                        <Select
                          value={order.status}
                          onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                        >
                          <SelectTrigger data-testid={`select-status-${order.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-600" /> În așteptare
                              </span>
                            </SelectItem>
                            <SelectItem value="processing">
                              <span className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-blue-600" /> În procesare
                              </span>
                            </SelectItem>
                            <SelectItem value="shipped">
                              <span className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-purple-600" /> Expediată
                              </span>
                            </SelectItem>
                            <SelectItem value="delivered">
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" /> Livrată
                              </span>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <span className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-600" /> Anulată
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
