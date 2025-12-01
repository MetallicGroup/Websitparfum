import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Phone, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products } from "@/lib/products";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { items, itemsCount, total, shippingThreshold, shippingCost, grandTotal, removeFromCart, updateQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const remainingForFreeShipping = shippingThreshold - total;

  const filteredProducts = products.filter(product => 
    searchQuery.length > 1 && product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Announcement Bar (Marquee) */}
      <div className="bg-accent text-accent-foreground py-2 overflow-hidden relative z-50">
        <motion.div 
          className="whitespace-nowrap flex gap-8"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-medium flex items-center gap-2">
              🚚 Transport GRATUIT la toate comenzile peste 250 lei 🎉
            </span>
          ))}
        </motion.div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">Parfumerie</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/category/women" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Parfumuri Damă</Link>
                <Link href="/category/men" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Parfumuri Bărbați</Link>
                <Link href="/category/unisex" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Parfumuri Unisex</Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-serif text-2xl font-black tracking-tighter uppercase">Luxe Parfum</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/category/women" className={`transition-colors hover:text-primary ${location === '/category/women' ? 'text-primary' : ''}`}>
              PARFUMURI DAMĂ
            </Link>
            <Link href="/category/men" className={`transition-colors hover:text-primary ${location === '/category/men' ? 'text-primary' : ''}`}>
              PARFUMURI BĂRBAȚI
            </Link>
            <Link href="/category/unisex" className={`transition-colors hover:text-primary ${location === '/category/unisex' ? 'text-primary' : ''}`}>
              PARFUMURI UNISEX
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar (Desktop) */}
            <div className="relative hidden md:block w-64 mr-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Caută..." 
                className="pl-8 h-9 bg-secondary/50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Search Dropdown */}
              {searchQuery.length > 1 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card rounded-md shadow-xl border z-50 max-h-[300px] overflow-y-auto p-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 5).map(product => (
                      <Link key={product.id} href={`/category/${product.category}`} onClick={() => setSearchQuery("")}>
                        <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-sm cursor-pointer transition-colors">
                          <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center overflow-hidden">
                             <img src={product.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.price} Lei</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground p-2 text-center">Nu am găsit rezultate.</p>
                  )}
                </div>
              )}
            </div>

             <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                      {itemsCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl">Coșul tău</SheetTitle>
                </SheetHeader>
                
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                    <p>Coșul este gol</p>
                    <Button variant="link" onClick={() => setIsCartOpen(false)} className="mt-2">
                      Începe cumpărăturile
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Free Shipping Progress */}
                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                      {remainingForFreeShipping > 0 ? (
                        <p className="text-sm text-center font-medium text-orange-600 dark:text-orange-400">
                          ✨ Mai adaugi <span className="font-bold">{remainingForFreeShipping} lei</span> și primești transport GRATUIT! ✨
                        </p>
                      ) : (
                        <p className="text-sm text-center font-medium text-green-600 dark:text-green-400">
                          🎉 Felicitări! Comanda ta are transport GRATUIT!
                        </p>
                      )}
                      <div className="h-2 w-full bg-muted rounded-full mt-3 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${Math.min((total / shippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 py-4 border-b border-border/50 last:border-0">
                            <div className="h-20 w-20 bg-secondary rounded-md overflow-hidden flex-shrink-0 p-2">
                              <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.price} Lei</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="text-xs w-4 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    +
                                  </button>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-auto p-0 text-destructive hover:text-destructive/80 hover:bg-transparent"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{total} Lei</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transport</span>
                          <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                            {shippingCost === 0 ? "GRATUIT" : `${shippingCost} Lei`}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{grandTotal} Lei</span>
                        </div>
                      </div>
                      <Button className="w-full" size="lg" asChild onClick={() => setIsCartOpen(false)}>
                        <Link href="/checkout">Finalizează Comanda</Link>
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/40700000000?text=Buna%20ziua!%20Am%20nevoie%20de%20ajutor%20cu%20o%20comanda."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      >
        <Phone className="h-6 w-6 fill-current" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ai nevoie de ajutor?
        </span>
      </a>

      <footer className="bg-secondary py-12 mt-20">
        <div className="container grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-serif text-lg font-black mb-4 uppercase">Luxe Parfum</h3>
            <p className="text-muted-foreground max-w-xs">
              Destinația ta pentru parfumuri de lux. Autenticitate garantată și experiență de shopping premium.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Categorii</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/category/women" className="hover:text-primary">Damă</Link></li>
              <li><Link href="/category/men" className="hover:text-primary">Bărbați</Link></li>
              <li><Link href="/category/unisex" className="hover:text-primary">Unisex</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Suport</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Contact</li>
              <li>Livrare și Retur</li>
              <li>Termeni și Condiții</li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          © 2025 Luxe Parfum. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
