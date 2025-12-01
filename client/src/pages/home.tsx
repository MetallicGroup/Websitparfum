import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import heroBg from "@assets/generated_images/luxury_perfume_store_hero_banner_with_elegant_bottles_and_gold_accents.png";
import womenBg from "@assets/generated_images/elegant_women's_perfume_bottle_with_floral_notes.png";
import menBg from "@assets/generated_images/bold_men's_perfume_bottle_dark_glass.png";
import unisexBg from "@assets/generated_images/unisex_minimalist_perfume_bottle.png";

export default function Home() {
  // Featured logic: Pick random popular ones
  const featuredProducts = products.slice(0, 8); 
  const bestSellers = products.slice(10, 14);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-in fade-in duration-1000"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay */}
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-4">
                Esențe Rare, <br />
                <span className="text-primary italic">Lux Accesibil.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
                Descoperă colecția noastră exclusivă de parfumuri de designer. 
                Arome care definesc personalitatea.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="xl" className="text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 border-none" asChild>
                <Link href="/category/women">Cumpără Acum</Link>
              </Button>
              <Button size="xl" variant="outline" className="text-lg h-14 px-8 bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors" asChild>
                <Link href="/category/men">Vezi Colecția</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Category Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            <Link href="/category/women" className="group relative h-64 rounded-lg overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${womenBg})` }} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <h3 className="font-serif text-2xl font-bold mb-2">DAMĂ</h3>
                <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded">-25% REDUCERE</span>
              </div>
            </Link>
            
            <div className="space-y-4">
              <Link href="/category/men" className="group relative h-30 block rounded-lg overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${menBg})` }} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-between px-6 text-white">
                  <h3 className="font-serif text-xl font-bold">BĂRBAȚI</h3>
                  <span className="bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded">-25%</span>
                </div>
              </Link>
              <Link href="/category/unisex" className="group relative h-30 block rounded-lg overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${unisexBg})` }} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-between px-6 text-white">
                  <h3 className="font-serif text-xl font-bold">UNISEX</h3>
                  <span className="bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded">-25%</span>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-border/50">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-secondary text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Calitate Premium</h4>
              <p className="text-xs text-muted-foreground">Doar ingrediente de top.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-secondary text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Plată la Livrare</h4>
              <p className="text-xs text-muted-foreground">Plătești când primești coletul.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-secondary text-primary">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Transport Gratuit</h4>
              <p className="text-xs text-muted-foreground">La comenzi peste 250 Lei.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Recomandate</h2>
            <p className="text-muted-foreground">Selecția noastră de parfumuri must-have.</p>
          </div>
          <Button variant="link" className="hidden md:flex" asChild>
            <Link href="/category/women">Vezi tot <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/category/women">Vezi toate produsele</Link>
          </Button>
        </div>
      </section>

      {/* BEST SELLERS BANNER */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <Badge variant="outline" className="border-primary text-primary uppercase tracking-widest">Best Sellers</Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Cele mai iubite arome ale momentului</h2>
              <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
                Aceste parfumuri sunt preferatele clienților noștri. Descoperă de ce sunt atât de speciale.
              </p>
              <Button size="lg" asChild>
                <Link href="/category/women">Cumpără Best Sellers</Link>
              </Button>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              {bestSellers.map((product) => (
                <div key={product.id} className="bg-background p-4 rounded-lg shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-contain mix-blend-multiply" />
                  <div className="mt-2 text-center">
                    <p className="font-serif font-bold text-sm truncate">{product.name}</p>
                    <p className="text-primary font-bold text-sm">{product.price} Lei</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
