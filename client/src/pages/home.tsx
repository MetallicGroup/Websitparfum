import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, TrendingUp, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import heroBg from "@assets/generated_images/pastel_pink_hero_banner_with_perfume_bottles_on_podiums.png";
import womenBg from "@assets/generated_images/women's_perfume_category_card_with_pink_aesthetic.png";
import menBg from "@assets/generated_images/men's_perfume_category_card_with_bold_blue/black_aesthetic.png";
import unisexBg from "@assets/generated_images/unisex_perfume_category_card_with_teal/turquoise_aesthetic.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Featured logic: Pick random popular ones
  const featuredProducts = products.slice(0, 8); 
  const bestSellers = products.slice(10, 14);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-in fade-in duration-1000"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Removed dark overlay for the brighter pink aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-transparent mix-blend-multiply" />
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 max-w-2xl drop-shadow-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-serif text-5xl md:text-7xl font-black leading-tight mb-4 text-shadow-lg tracking-tight">
                Luxe Parfum <br />
                <span className="text-white italic font-medium">Reduceri Speciale</span>
              </h1>
              <p className="text-lg md:text-xl text-white font-medium max-w-lg leading-relaxed text-shadow">
                Alege parfumurile tale preferate și bucură-te de reduceri speciale.
                Grăbește-te, oferta este limitată!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Caută parfumul tău preferat..." 
                  className="pl-10 h-14 bg-white/90 text-black border-none shadow-lg text-lg rounded-full focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-2 z-50 max-h-[300px] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.slice(0, 5).map(product => (
                        <Link key={product.id} href={`/category/${product.category}`}>
                          <div className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer">
                            <img src={product.image} alt={product.name} className="h-10 w-10 object-contain" />
                            <div>
                              <p className="text-sm font-medium text-black">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.price} Lei</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">Niciun rezultat găsit.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Hero Category Cards - Redesigned to pop out more */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {/* Women Card - Big */}
            <Link href="/category/women" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border-4 border-white bg-white">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${womenBg})` }} />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-red-600 text-white h-16 w-16 rounded-full flex items-center justify-center flex-col shadow-lg animate-bounce-slow">
                <span className="text-[10px] font-bold uppercase">Până la</span>
                <span className="text-lg font-black leading-none">-30%</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-6 pt-12 text-center">
                <h3 className="font-serif text-3xl font-bold text-pink-900 mb-1">Dama</h3>
                <span className="inline-block bg-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md group-hover:bg-pink-700 transition-colors">
                  Cumpără Acum
                </span>
              </div>
            </Link>
            
            <div className="space-y-6">
              {/* Men Card */}
              <Link href="/category/men" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-blue-900/20 transition-all duration-500 border-4 border-white bg-white">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${menBg})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-slate-900">BĂRBAȚI</h3>
                    <p className="text-xs font-bold text-red-600">MEGA REDUCERI</p>
                  </div>
                </div>
              </Link>

              {/* Unisex Card */}
              <Link href="/category/unisex" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-teal-500/20 transition-all duration-500 border-4 border-white bg-white">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${unisexBg})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 to-transparent" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12">
                    -25%
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center px-6">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-teal-900">UNISEX</h3>
                    <p className="text-xs font-bold text-teal-700">Parfumuri</p>
                  </div>
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
