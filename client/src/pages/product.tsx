import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { trackTikTokEvent } from "@/lib/tiktok-pixel";
import { useEffect } from "react";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === params?.id);
  
  // Track ViewContent when product page loads
  useEffect(() => {
    if (product) {
      trackTikTokEvent('ViewContent', {
        contents: [{
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        }],
        value: product.price,
        currency: 'RON',
      });
    }
  }, [product]);
  
  if (!product) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-xl">Produsul nu a fost găsit</p>
        <Link href="/">
          <Button>Înapoi la Magazin</Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-6 md:py-12">
      <Link href={`/category/${product.category}`}>
        <Button variant="ghost" className="mb-6 -ml-2" data-testid="button-back">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la {product.category === 'women' ? 'Parfumuri Damă' : product.category === 'men' ? 'Parfumuri Bărbați' : 'Parfumuri Unisex'}
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-secondary/30 rounded-2xl p-8 md:p-12 flex items-center justify-center"
        >
          <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-lg px-3 py-1">
            -{discountPercentage}%
          </Badge>
          <img 
            src={product.image} 
            alt={product.name}
            loading="eager"
            className="w-full max-w-sm h-auto object-contain mix-blend-multiply drop-shadow-2xl"
            data-testid="img-product"
            decoding="async"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">
              {product.category === 'women' ? 'Parfum Damă' : product.category === 'men' ? 'Parfum Bărbați' : 'Parfum Unisex'} • 100ml
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight" data-testid="text-product-name">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">{product.price} Lei</span>
            <span className="text-xl text-muted-foreground line-through">
              {product.oldPrice} Lei
            </span>
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              Economisești {product.oldPrice - product.price} Lei
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Livrare gratuită la comenzi peste 250 Lei</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Parfum inspirat de produsele originale de lux</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Suport WhatsApp pentru întrebări</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="flex-1 min-h-[52px] md:h-14 text-base md:text-lg"
              onClick={() => addToCart(product)}
              data-testid="button-add-to-cart"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Adaugă în Coș
            </Button>
            <Link href="/checkout" className="flex-1">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full min-h-[52px] md:h-14 text-base md:text-lg"
                onClick={() => addToCart(product)}
                data-testid="button-buy-now"
              >
                Cumpără Acum
              </Button>
            </Link>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 mt-6">
            <p className="text-sm text-center font-medium">
              💳 Plată Ramburs la Curier (Cash) - Plătești când primești coletul
            </p>
          </div>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">Produse Similare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
