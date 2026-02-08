import { useState } from "react";
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

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  /* ================= LOGIN ================= */
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedPassword = password.trim();
    const res = await fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${trimmedPassword}`,
      },
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.error || "Parolă incorectă");
    }
  };

  /* ================= ORDERS ================= */
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
  });

  /* ================= UPDATE STATUS ================= */
  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const res = await fetch(`/api/orders/${id}/status`, {
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

  /* ================= LOGIN UI ================= */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-2" />
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <Input
                type="password"
                placeholder="Parolă admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <p>Se încarcă comenzile…</p>
      ) : orders.length === 0 ? (
        <p>Nu există comenzi.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">
                    {order.customerName}
                  </h2>
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      updateStatus.mutate({ id: order.id, status })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <Clock className="inline w-4 h-4 mr-1" />
                        În așteptare
                      </SelectItem>
                      <SelectItem value="processing">
                        <RefreshCw className="inline w-4 h-4 mr-1" />
                        Procesare
                      </SelectItem>
                      <SelectItem value="shipped">
                        <Truck className="inline w-4 h-4 mr-1" />
                        Expediată
                      </SelectItem>
                      <SelectItem value="delivered">
                        <CheckCircle className="inline w-4 h-4 mr-1" />
                        Livrată
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <XCircle className="inline w-4 h-4 mr-1" />
                        Anulată
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${order.phoneNumber}`} className="underline">
                    {order.phoneNumber}
                  </a>
                </p>

                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  {order.address}, {order.city}, {order.county}
                </p>

                {order.trafficSource && (
                  <div className="flex items-center gap-2 text-sm">
                    {order.trafficSource === 'facebook' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        <Facebook className="w-3 h-3" />
                        <span className="text-xs font-medium">Facebook</span>
                      </div>
                    )}
                    {order.trafficSource === 'tiktok' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded">
                        <Music className="w-3 h-3" />
                        <span className="text-xs font-medium">TikTok</span>
                      </div>
                    )}
                    {order.trafficSource === 'organic' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        <Globe className="w-3 h-3" />
                        <span className="text-xs font-medium">Organic</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-100 rounded p-3">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {p.quantity}× {p.name}
                      </span>
                      <span>
                        {p.price * p.quantity} Lei
                      </span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                    <span>Total (livrare {order.shippingCost} Lei)</span>
                    <span>{order.grandTotal} Lei</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
