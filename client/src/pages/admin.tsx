import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Facebook,
  Music,
  Globe,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Order } from "@shared/schema";

const AUTH_KEY = "admin_auth_token";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Check if already authenticated on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setError("Te rog introdu parola");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${trimmedPassword}`,
        },
      });

      if (res.ok) {
        localStorage.setItem(AUTH_KEY, trimmedPassword);
        setIsAuthenticated(true);
        setPassword(trimmedPassword);
      } else {
        setError("Parolă incorectă");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Eroare la conectare. Te rog încearcă din nou.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    queryClient.clear();
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem(AUTH_KEY) || password.trim();
  };

  // Fetch orders
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch orders");
      }
      return res.json();
    },
    retry: false,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch stats
  const {
    data: stats,
    refetch: refetchStats,
    isError: statsError,
  } = useQuery<{ uniqueVisitors: number; addToCartCount: number }>({
    queryKey: ["admin-stats"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch("/api/stats/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch stats");
      }
      return res.json();
    },
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = getAuthToken();
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
        }
        throw new Error("Failed to update status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // Login UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-2 w-12 h-12 text-gray-600" />
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Parolă admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[48px]"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <Button type="submit" className="w-full min-h-[48px]">
                Autentificare
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard UI
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                refetchOrders();
                refetchStats();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Ieșire
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistici Astăzi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Vizitatori unici:</span>
                    <span className="text-2xl font-bold">{stats.uniqueVisitors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Adăugări în coș:</span>
                    <span className="text-2xl font-bold">{stats.addToCartCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Messages */}
        {(ordersError || statsError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {ordersError ? "Eroare la încărcarea comenzilor. " : ""}
              {statsError ? "Eroare la încărcarea statisticilor. " : ""}
              Te rog reîncearcă.
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {ordersLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Se încarcă comenzile...</p>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nu există comenzi.</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 md:p-6 space-y-4">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg md:text-xl mb-1">
                        {order.customerName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Comandă #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({ id: order.id, status })
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <Clock className="inline w-4 h-4 mr-2" />
                          În așteptare
                        </SelectItem>
                        <SelectItem value="processing">
                          <RefreshCw className="inline w-4 h-4 mr-2" />
                          Procesare
                        </SelectItem>
                        <SelectItem value="shipped">
                          <Truck className="inline w-4 h-4 mr-2" />
                          Expediată
                        </SelectItem>
                        <SelectItem value="delivered">
                          <CheckCircle className="inline w-4 h-4 mr-2" />
                          Livrată
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <XCircle className="inline w-4 h-4 mr-2" />
                          Anulată
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`tel:${order.phoneNumber}`}
                        className="underline hover:text-primary"
                      >
                        {order.phoneNumber}
                      </a>
                    </div>
                    {order.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{order.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p>{order.address}</p>
                      <p className="text-muted-foreground">
                        {order.city}, {order.county}
                        {order.postalCode && `, ${order.postalCode}`}
                      </p>
                    </div>
                  </div>

                  {/* Traffic Source */}
                  {order.trafficSource && (
                    <div className="flex items-center gap-2">
                      {order.trafficSource === "facebook" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          <Facebook className="w-3 h-3" />
                          <span>Facebook</span>
                        </div>
                      )}
                      {order.trafficSource === "tiktok" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded text-xs font-medium">
                          <Music className="w-3 h-3" />
                          <span>TikTok</span>
                        </div>
                      )}
                      {order.trafficSource === "organic" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          <Globe className="w-3 h-3" />
                          <span>Organic</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Products */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          {product.quantity}× {product.name}
                        </span>
                        <span className="font-medium">
                          {product.price * product.quantity} Lei
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
                      <span>
                        Total{" "}
                        {order.shippingCost > 0 && `(livrare ${order.shippingCost} Lei)`}
                        {order.shippingCost === 0 && "(livrare GRATUITĂ)"}
                      </span>
                      <span className="text-lg">{order.grandTotal} Lei</span>
                    </div>
                  </div>

                  {/* Order Date */}
                  <p className="text-xs text-muted-foreground">
                    Data: {new Date(order.createdAt).toLocaleString("ro-RO")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
