import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-sm border border-transparent hover:border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Discount Badge */}
      <Badge 
        className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground hover:bg-destructive font-bold rounded-sm px-2"
      >
        -{discountPercentage}%
      </Badge>

      {/* Image Container */}
      <div className="aspect-[4/5] w-full bg-secondary/30 p-6 flex items-center justify-center overflow-hidden relative">
        <motion.img 
          src={product.image} 
          alt={product.name}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
        />
        
        {/* Quick Add Button (Overlay) */}
        <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button 
            className="w-full shadow-lg font-medium tracking-wide" 
            onClick={() => addToCart(product)}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Adaugă în coș
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {product.category === 'women' ? 'Parfum Damă' : product.category === 'men' ? 'Parfum Bărbați' : 'Parfum Unisex'}
        </div>
        <h3 className="font-serif text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-baseline gap-3">
          <span className="text-lg font-bold text-foreground">{product.price} Lei</span>
          <span className="text-sm text-muted-foreground line-through decoration-destructive/50 decoration-2">
            {product.oldPrice} Lei
          </span>
        </div>
      </div>
    </motion.div>
  );
}
