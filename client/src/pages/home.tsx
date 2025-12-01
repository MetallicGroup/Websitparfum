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

// Women Collage Images
import women1 from "/products/Parfumatica_Main_Photos/DIOR J'adore Parfum d’Eau, Eau de Parfum, 100ml.jpg";
import women2 from "/products/Parfumatica_Main_Photos/Carolina Herrera Good Girl, Eau de Parfum, 100ml.jpg";
import women3 from "/products/Parfumatica_Main_Photos/Lancôme La Vie Est Belle, Eau de Parfum, 75 ml.jpg";

// Men Collage Images
import men1 from "/products/Parfumatica_Main_Photos/Dior Sauvage, Eau de Parfum, 100ml.jpg";
import men2 from "/products/Parfumatica_Main_Photos/Jean Paul Gaultier Le Male Le Parfum, Eau de Parfum, 100 ml.jpg";
import men3 from "/products/Parfumatica_Main_Photos/Armani Emporio Stronger With You Intensely, Eau de Parfum, 100ml.jpg";

// Unisex Collage Images
import unisex1 from "/products/Parfumatica_Main_Photos/Tom Ford Black Orchid, Eau de Parfum, 100ml.jpg";
import unisex2 from "/products/Parfumatica_Main_Photos/Baccarat Rouge 540, Eau de Parfum, 70 ml.jpg";
import unisex3 from "/products/Parfumatica_Main_Photos/Xerjoff Erba Pura, Eau de Parfum, 100ml.jpg";

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
      <section className="relative h-[85vh] min-h-[700px] flex items-start pt-32 overflow-hidden">
        {/* Dynamic Background with Real Bottles */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-400 via-pink-200 to-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-white/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-to-t from-pink-500/20 to-transparent"></div>

          {/* Real Perfume Bottles Composition - Hero */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-full hidden lg:block pointer-events-none">
             {/* Central Hero Bottle - Baccarat Rouge (The Red King) */}
             <motion.img 
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              src={unisex2} 
              alt="Baccarat Rouge"
              className="absolute right-[25%] top-[25%] w-[350px] h-auto object-contain drop-shadow-2xl z-20"
            />

            {/* Side Bottle Left - Good Girl (The Icon) */}
            <motion.img 
              initial={{ opacity: 0, x: -50, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              src={women2} 
              alt="Good Girl"
              className="absolute right-[55%] top-[40%] w-[280px] h-auto object-contain drop-shadow-xl z-10 blur-[1px] hover:blur-0 transition-all duration-700"
            />

            {/* Side Bottle Right - Sauvage (The Bold) */}
            <motion.img 
              initial={{ opacity: 0, x: 50, rotate: 10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              src={men1} 
              alt="Sauvage"
              className="absolute right-[5%] top-[35%] w-[260px] h-auto object-contain drop-shadow-xl z-10 blur-[1px] hover:blur-0 transition-all duration-700"
            />
          </div>
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-start h-full">
          <div className="text-white space-y-8 max-w-2xl drop-shadow-lg pt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-serif text-6xl md:text-8xl font-black leading-none mb-2 text-shadow-xl tracking-tighter text-white">
                Luxe Parfum
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 font-light italic tracking-wide mb-6 text-shadow-md">
                Reduceri Speciale
              </p>
              <p className="text-lg md:text-xl text-white font-medium max-w-lg leading-relaxed text-shadow-sm opacity-90">
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input 
                  placeholder="Caută parfumul tău preferat..." 
                  className="pl-10 h-14 bg-white/95 text-black border-none shadow-2xl text-lg rounded-full focus-visible:ring-primary placeholder:text-gray-400"
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
            className="hidden lg:grid grid-cols-2 gap-6 mt-20"
          >
            {/* Women Card - Big */}
            <Link href="/category/women" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border-4 border-white bg-pink-50">
              {/* Collage Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
                <img 
                  src={women1} 
                  alt="Women Perfume 1" 
                  className="absolute -right-4 -bottom-4 w-48 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" 
                />
                <img 
                  src={women2} 
                  alt="Women Perfume 2" 
                  className="absolute right-24 bottom-24 w-40 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 z-10 opacity-90" 
                />
                <img 
                  src={women3} 
                  alt="Women Perfume 3" 
                  className="absolute right-4 top-12 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" 
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-red-600 text-white h-16 w-16 rounded-full flex items-center justify-center flex-col shadow-lg animate-bounce-slow z-30">
                <span className="text-[10px] font-bold uppercase">Până la</span>
                <span className="text-lg font-black leading-none">-30%</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent p-6 pt-12 text-left">
                <h3 className="font-serif text-3xl font-bold text-pink-900 mb-1">Dama</h3>
                <span className="inline-block bg-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md group-hover:bg-pink-700 transition-colors">
                  Cumpără Acum
                </span>
              </div>
            </Link>
            
            <div className="space-y-6">
              {/* Men Card */}
              <Link href="/category/men" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-blue-900/20 transition-all duration-500 border-4 border-white bg-blue-50">
                <div className="absolute inset-0 overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
                   <img 
                    src={men1} 
                    alt="Men Perfume 1" 
                    className="absolute -right-2 -bottom-2 w-32 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" 
                  />
                  <img 
                    src={men2} 
                    alt="Men Perfume 2" 
                    className="absolute right-20 bottom-4 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 z-10" 
                  />
                   <img 
                    src={men3} 
                    alt="Men Perfume 3" 
                    className="absolute right-10 -top-6 w-20 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" 
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-start pl-4 z-30">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-slate-900">BĂRBAȚI</h3>
                    <p className="text-xs font-bold text-red-600">MEGA REDUCERI</p>
                  </div>
                </div>
              </Link>

              {/* Unisex Card */}
              <Link href="/category/unisex" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-teal-500/20 transition-all duration-500 border-4 border-white bg-teal-50">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-200 rounded-full blur-2xl opacity-50"></div>
                   <img 
                    src={unisex1} 
                    alt="Unisex Perfume 1" 
                    className="absolute -right-2 -bottom-2 w-32 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" 
                  />
                  <img 
                    src={unisex2} 
                    alt="Unisex Perfume 2" 
                    className="absolute right-24 bottom-2 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 z-10" 
                  />
                  <img 
                    src={unisex3} 
                    alt="Unisex Perfume 3" 
                    className="absolute right-8 -top-4 w-20 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" 
                  />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12">
                    -25%
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-start pl-4 z-30">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
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
