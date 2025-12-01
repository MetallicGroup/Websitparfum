import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2, Truck } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, "Prenumele este obligatoriu"),
  lastName: z.string().min(2, "Numele este obligatoriu"),
  phone: z.string().min(10, "Număr de telefon invalid"),
  address: z.string().min(5, "Adresa este obligatorie"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  county: z.string().min(2, "Județul este obligatoriu"),
});

export default function Checkout() {
  const { items, total, shippingCost, grandTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      county: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock order placement
    console.log(values);
    setIsSuccess(true);
    clearCart();
    
    // Simulate SMS/WhatsApp notification logic (frontend only)
    setTimeout(() => {
      toast({
        title: "Comandă confirmată! 🎉",
        description: `Mulțumim ${values.firstName}! Vei primi un SMS de confirmare în curând.`,
        duration: 5000,
      });
    }, 1000);
  }

  if (isSuccess) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h1 className="font-serif text-4xl font-bold">Comandă Plasată cu Succes!</h1>
        <p className="text-muted-foreground max-w-md">
          Comanda ta a fost înregistrată. Vei fi contactat în curând pentru confirmare.
          Plata se va face ramburs la curier.
        </p>
        <Button onClick={() => setLocation("/")} size="lg">
          Înapoi la Magazin
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-xl">Coșul tău este gol</p>
        <Button onClick={() => setLocation("/")}>Vezi Produse</Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-6xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Finalizare Comandă</h1>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              1. Date Livrare
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prenume</FormLabel>
                        <FormControl>
                          <Input placeholder="Ion" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume</FormLabel>
                        <FormControl>
                          <Input placeholder="Popescu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="07xx xxx xxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresa completă</FormLabel>
                      <FormControl>
                        <Input placeholder="Strada, Număr, Bloc, Apartament" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oraș</FormLabel>
                        <FormControl>
                          <Input placeholder="București" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Județ</FormLabel>
                        <FormControl>
                          <Input placeholder="Ilfov" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full mt-8 text-lg h-12">
                  Plasează Comanda
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Prin plasarea comenzii ești de acord cu termenii și condițiile noastre.
                </p>
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-secondary/30 p-6 rounded-lg border sticky top-24">
            <h2 className="font-bold text-xl mb-6">Rezumat Comandă</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0 p-1">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-2">{item.name}</p>
                    <p className="text-muted-foreground">{item.quantity} x {item.price} Lei</p>
                  </div>
                  <div className="font-bold text-sm">
                    {item.price * item.quantity} Lei
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal produse</span>
                <span>{total} Lei</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Cost Livrare
                </span>
                <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                  {shippingCost === 0 ? "GRATUIT" : `${shippingCost} Lei`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t font-serif font-bold text-xl">
                <span>Total de plată</span>
                <span>{grandTotal} Lei</span>
              </div>
              <div className="bg-white border rounded-md p-3 mt-4 text-center text-sm font-medium">
                💳 Plată Ramburs la Curier (Cash)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
