import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/products";
import { useState, useEffect } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  // Listen for cart add events for immediate feedback
  useEffect(() => {
    const handleCartAdd = (e: CustomEvent) => {
      if (e.detail?.productId === product.id) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    };
    window.addEventListener("cart-add", handleCartAdd as EventListener);
    return () => window.removeEventListener("cart-add", handleCartAdd as EventListener);
  }, [product.id]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-sm border border-transparent hover:border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      data-testid={`card-product-${product.id}`}
    >
      {/* Discount Badge */}
      <Badge 
        className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground hover:bg-destructive font-bold rounded-sm px-2"
      >
        -{discountPercentage}%
      </Badge>

      {/* Image Container - Clickable */}
      <Link href={`/product/${product.id}`}>
        <div className="aspect-[4/5] w-full bg-secondary/30 p-6 flex items-center justify-center overflow-hidden relative cursor-pointer">
          <motion.img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
            decoding="async"
          />
        </div>
      </Link>
      
      {/* Quick Add Button - Below image on mobile, overlay on desktop */}
      <div className="px-4 py-2 md:absolute md:bottom-4 md:left-0 md:right-0 md:px-4 md:py-0 md:opacity-0 group-hover:md:opacity-100 transition-all duration-300 md:translate-y-4 group-hover:md:translate-y-0">
        <Button 
          className="w-full shadow-lg font-medium tracking-wide text-sm md:text-base min-h-[48px] md:min-h-10" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          data-testid={`button-add-cart-${product.id}`}
          disabled={justAdded}
        >
          {justAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Adăugat!
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" /> Adaugă în coș
            </>
          )}
        </Button>
      </div>

      {/* Info - Clickable */}
      <Link href={`/product/${product.id}`}>
        <div className="p-4 pt-2 flex flex-col flex-1 gap-1 cursor-pointer">
          <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {product.category === 'women' ? 'Parfum Damă' : product.category === 'men' ? 'Parfum Bărbați' : 'Parfum Unisex'} • 100ml
          </div>
          <h3 className="font-serif text-sm md:text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-2 flex items-baseline gap-2 md:gap-3">
            <span className="text-base md:text-lg font-bold text-foreground">{product.price} Lei</span>
            <span className="text-xs md:text-sm text-muted-foreground line-through decoration-destructive/50 decoration-2">
              {product.oldPrice} Lei
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
