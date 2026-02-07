import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, TrendingUp, ShieldCheck, Search, Truck, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { SocialProofPopup } from "@/components/social-proof-popup";
import { products } from "@/lib/products";
import { useDebounce } from "@/hooks/use-debounce";
import { trackTikTokEvent } from "@/lib/tiktok-pixel";
import { useEffect } from "react";
import heroBg from "@assets/generated_images/luxury_perfume_bottles_pink_podium.png";

// Collage image paths (from public folder)
const women1 = "/products/Parfumatica_Main_Photos/Jean Paul Gaultier Scandal Women Absolu, Eau de Parfum, 80 ml.jpg";
const women2 = "/products/Parfumatica_Main_Photos/Carolina Herrera GOOD GIRL Dazzling Garden 80 ml.jpg";
const women3 = "/products/Parfumatica_Main_Photos/Lancôme La Vie Est Belle Intensément, Eau de Parfum, 75ml.jpg";

const men1 = "/products/Parfumatica_Main_Photos/Dior Sauvage, Eau de Parfum, 100ml.jpg";
const men2 = "/products/Parfumatica_Main_Photos/Jean Paul Gaultier Le Male Le Parfum, Eau de Parfum, 100 ml.jpg";
const men3 = "/products/Parfumatica_Main_Photos/Armani Emporio Stronger With You Intensely, Eau de Parfum, 100ml.jpg";

const unisex1 = "/products/Parfumatica_Main_Photos/Tom Ford Black Orchid, Eau de Parfum, 100ml TESTER.jpg";
const unisex2 = "/products/Parfumatica_Main_Photos/Baccarat Rouge 540, Eau de Parfum, 70 ml TESTER.jpg";
const unisex3 = "/products/Parfumatica_Main_Photos/Xerjoff Erba Pura, Eau de Parfum, 100ml.jpg";

const categorySections = [
  {
    key: "women",
    title: "Parfumuri Damă",
    description: "Arome florale și elegante pentru femeia modernă",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-100",
    accentColor: "text-pink-600",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
  },
  {
    key: "men",
    title: "Parfumuri Bărbați",
    description: "Esențe masculine puternice și sofisticate",
    bgColor: "bg-gradient-to-br from-slate-50 to-blue-100",
    accentColor: "text-slate-700",
    buttonColor: "bg-slate-800 hover:bg-slate-900",
  },
  {
    key: "unisex",
    title: "Parfumuri Unisex",
    description: "Fraganțe versatile pentru orice personalitate",
    bgColor: "bg-gradient-to-br from-teal-50 to-emerald-100",
    accentColor: "text-teal-700",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredProducts = products.filter(product => 
    debouncedSearchQuery.length > 0 && product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  // Track Search event when user searches
  useEffect(() => {
    if (debouncedSearchQuery.length > 0 && filteredProducts.length > 0) {
      const totalValue = filteredProducts.slice(0, 5).reduce((sum, p) => sum + p.price, 0);
      trackTikTokEvent('Search', {
        contents: filteredProducts.slice(0, 5).map(product => ({
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        })),
        value: totalValue,
        currency: 'RON',
        search_string: debouncedSearchQuery,
      });
    }
  }, [debouncedSearchQuery, filteredProducts]);

  return (
    <div className="space-y-12 md:space-y-20 pb-20">
      <SocialProofPopup />
      
      {/* HERO SECTION - Mobile Optimized */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center py-8 md:py-0" style={{ zIndex: 30 }}>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-transparent mix-blend-multiply" />
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-white space-y-4 md:space-y-6 max-w-2xl drop-shadow-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-2 md:mb-4 text-shadow-lg tracking-tight">
                Luxe Parfum <br />
                <span className="text-white italic font-medium text-3xl md:text-4xl lg:text-5xl">Arome de Lux</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-white font-medium max-w-lg leading-relaxed text-shadow">
                Alege parfumurile tale preferate și descoperă arome de lux la prețuri accesibile.
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
                  className="pl-10 h-12 md:h-14 bg-white/90 text-black border-none shadow-lg text-base md:text-lg rounded-full focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
                {debouncedSearchQuery && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl p-2 max-h-[400px] overflow-y-auto" style={{ zIndex: 9999 }}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.slice(0, 5).map(product => (
                        <Link key={product.id} href={`/category/${product.category}`}>
                          <div className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer" data-testid={`search-result-${product.id}`}>
                            <img src={product.image} alt={product.name} className="h-10 w-10 object-contain" loading="lazy" />
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

          {/* Hero Category Cards - Desktop Only */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {/* Women Card - Big */}
            <Link href="/category/women" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border-4 border-white bg-pink-50" data-testid="link-category-women-hero">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
                <img src={women1} alt="Women Perfume 1" className="absolute -right-4 -bottom-4 w-48 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" />
                <img src={women2} alt="Women Perfume 2" className="absolute right-24 bottom-24 w-40 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 z-10 opacity-90" />
                <img src={women3} alt="Women Perfume 3" className="absolute right-4 top-12 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" />
              </div>
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
              <Link href="/category/men" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-blue-900/20 transition-all duration-500 border-4 border-white bg-blue-50" data-testid="link-category-men-hero">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
                  <img src={men1} alt="Men Perfume 1" className="absolute -right-2 -bottom-2 w-32 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" />
                  <img src={men2} alt="Men Perfume 2" className="absolute right-20 bottom-4 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 z-10" />
                  <img src={men3} alt="Men Perfume 3" className="absolute right-10 -top-6 w-20 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" />
                </div>
                <div className="absolute inset-0 flex items-center justify-start pl-4 z-30">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-slate-900">BĂRBAȚI</h3>
                    <p className="text-xs font-bold text-red-600">MEGA REDUCERI</p>
                  </div>
                </div>
              </Link>

              {/* Unisex Card */}
              <Link href="/category/unisex" className="group relative h-36 block rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-teal-500/20 transition-all duration-500 border-4 border-white bg-teal-50" data-testid="link-category-unisex-hero">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-200 rounded-full blur-2xl opacity-50"></div>
                  <img src={unisex1} alt="Unisex Perfume 1" className="absolute -right-2 -bottom-2 w-32 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 z-20" />
                  <img src={unisex2} alt="Unisex Perfume 2" className="absolute right-24 bottom-2 w-24 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 z-10" />
                  <img src={unisex3} alt="Unisex Perfume 3" className="absolute right-8 -top-4 w-20 h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 opacity-80" />
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

      {/* MOBILE CATEGORY CARDS */}
      <section className="container lg:hidden -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <Link href="/category/women" className="relative rounded-xl overflow-hidden aspect-square bg-pink-100 shadow-lg" data-testid="link-category-women-mobile">
            <img src={women1} alt="Parfumuri Damă" className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pink-600 to-transparent p-2 pt-6">
              <span className="text-white text-xs font-bold">DAMĂ</span>
            </div>
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-30%</div>
          </Link>
          <Link href="/category/men" className="relative rounded-xl overflow-hidden aspect-square bg-slate-100 shadow-lg" data-testid="link-category-men-mobile">
            <img src={men1} alt="Parfumuri Bărbați" className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-700 to-transparent p-2 pt-6">
              <span className="text-white text-xs font-bold">BĂRBAȚI</span>
            </div>
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-25%</div>
          </Link>
          <Link href="/category/unisex" className="relative rounded-xl overflow-hidden aspect-square bg-teal-100 shadow-lg" data-testid="link-category-unisex-mobile">
            <img src={unisex1} alt="Parfumuri Unisex" className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-600 to-transparent p-2 pt-6">
              <span className="text-white text-xs font-bold">UNISEX</span>
            </div>
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-25%</div>
          </Link>
        </div>
      </section>

      {/* BENEFITS - Mobile Optimized */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8 border-y border-border/50">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left p-3 md:p-0">
            <div className="p-2 md:p-3 rounded-full bg-secondary text-primary">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm">Calitate Premium</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">Doar ingrediente de top.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left p-3 md:p-0">
            <div className="p-2 md:p-3 rounded-full bg-secondary text-primary">
              <CreditCard className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm">Plată la Livrare</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">Plătești când primești.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left p-3 md:p-0">
            <div className="p-2 md:p-3 rounded-full bg-secondary text-primary">
              <Truck className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm">Transport Gratuit</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">La comenzi peste 250 Lei.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left p-3 md:p-0">
            <div className="p-2 md:p-3 rounded-full bg-secondary text-primary">
              <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm">Suport WhatsApp</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">Răspundem rapid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTIONS WITH PRODUCTS */}
      {categorySections.map((category, idx) => {
        const categoryProducts = products.filter(p => p.category === category.key).slice(0, 4);
        
        return (
          <section key={category.key} className={`py-10 md:py-16 ${idx % 2 === 1 ? 'bg-secondary/30' : ''}`}>
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4"
              >
                <div>
                  <Badge variant="outline" className={`${category.accentColor} border-current mb-2 uppercase tracking-widest text-[10px] md:text-xs`}>
                    {category.key === 'women' ? 'Pentru Ea' : category.key === 'men' ? 'Pentru El' : 'Pentru Toți'}
                  </Badge>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{category.title}</h2>
                  <p className="text-muted-foreground text-sm md:text-base">{category.description}</p>
                </div>
                <Link href={`/category/${category.key}`}>
                  <Button variant="outline" className="hidden md:flex gap-2" data-testid={`button-view-more-${category.key}`}>
                    Vezi mai multe <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {categoryProducts.map((product, pIdx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pIdx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile View More Button */}
              <div className="mt-6 text-center md:hidden">
                <Link href={`/category/${category.key}`}>
                  <Button className={`${category.buttonColor} text-white w-full max-w-xs`} data-testid={`button-view-more-${category.key}-mobile`}>
                    Vezi toate parfumurile {category.key === 'women' ? 'damă' : category.key === 'men' ? 'bărbați' : 'unisex'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* WHATSAPP CTA SECTION */}
      <section className="container">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 md:p-10 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Ai nevoie de ajutor?</h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto text-sm md:text-base">
              Scrie-ne pe WhatsApp și te ajutăm să alegi parfumul perfect pentru tine!
            </p>
            <a 
              href="https://wa.me/40771267846?text=Buna%20ziua!%20As%20dori%20mai%20multe%20informatii%20despre%20parfumurile%20dumneavoastra."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-600 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
              data-testid="link-whatsapp-cta"
            >
              <MessageCircle className="h-5 w-5" />
              Scrie-ne pe WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-secondary py-10 md:py-16">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">De ce să alegi Luxe Parfum?</h2>
            <p className="text-muted-foreground text-sm md:text-base">Siguranță și calitate la fiecare comandă</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Parfumuri Inspirate</h3>
              <p className="text-muted-foreground text-sm">Parfumuri inspirate de cele mai populare arome de lux.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Livrare Rapidă</h3>
              <p className="text-muted-foreground text-sm">Primești comanda în 1-3 zile lucrătoare în toată România.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Plată Ramburs</h3>
              <p className="text-muted-foreground text-sm">Plătești comod la curier când primești coletul.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
