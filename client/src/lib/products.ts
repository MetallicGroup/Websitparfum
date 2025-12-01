import womenPerfumeImg from "@assets/generated_images/elegant_women's_perfume_bottle_with_floral_notes.png";
import menPerfumeImg from "@assets/generated_images/bold_men's_perfume_bottle_dark_glass.png";
import unisexPerfumeImg from "@assets/generated_images/unisex_minimalist_perfume_bottle.png";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  category: "women" | "men" | "unisex";
  image: string;
  description?: string;
  tags?: string[];
};

export const products: Product[] = [
  // WOMEN
  { id: "w1", name: "Jean Paul Gaultier Scandal Women", price: 179, oldPrice: 370, category: "women", image: womenPerfumeImg },
  { id: "w2", name: "Jean Paul Gaultier Gaultier Divine", price: 215, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w3", name: "Tom Ford Private Blend Vanilla Sex", price: 189, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w4", name: "Jean Paul Gaultier La Belle Le Parfum", price: 215, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w5", name: "Prada Paradoxe", price: 179, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w6", name: "Givenchy L’Interdit Rouge", price: 189, oldPrice: 370, category: "women", image: womenPerfumeImg },
  { id: "w7", name: "Mugler Alien", price: 179, oldPrice: 350, category: "women", image: womenPerfumeImg },
  { id: "w8", name: "Jean Paul Gaultier La Belle Paradise Garden", price: 215, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w9", name: "Dior J’adore", price: 179, oldPrice: 420, category: "women", image: womenPerfumeImg },
  { id: "w10", name: "Xerjoff Erba Pura", price: 229, oldPrice: 980, category: "women", image: womenPerfumeImg },
  { id: "w11", name: "Xerjoff Accento", price: 229, oldPrice: 450, category: "women", image: womenPerfumeImg },
  { id: "w12", name: "Versace Crystal Noir", price: 179, oldPrice: 330, category: "women", image: womenPerfumeImg },
  { id: "w13", name: "Lancôme Trésor La Nuit", price: 189, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w14", name: "Chanel Chance", price: 189, oldPrice: 765, category: "women", image: womenPerfumeImg },
  { id: "w15", name: "Sospiro Erba Pura", price: 199, oldPrice: 500, category: "women", image: womenPerfumeImg },
  { id: "w16", name: "Jean Paul Gaultier Scandal Women Absolu", price: 189, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w17", name: "Baccarat Rouge 540", price: 229, oldPrice: 380, category: "women", image: womenPerfumeImg },
  { id: "w18", name: "Tom Ford Noir Extreme", price: 199, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w19", name: "Tom Ford Black Orchid", price: 189, oldPrice: 350, category: "women", image: womenPerfumeImg },
  { id: "w20", name: "Dior Hypnotic Poison", price: 179, oldPrice: 340, category: "women", image: womenPerfumeImg },
  { id: "w21", name: "Carolina Herrera Good Girl", price: 179, oldPrice: 659, category: "women", image: womenPerfumeImg },
  { id: "w22", name: "Armani Sì Intense", price: 179, oldPrice: 350, category: "women", image: womenPerfumeImg },
  { id: "w23", name: "Tom Ford Rose Prick", price: 179, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w24", name: "Tom Ford Vanille Fatale", price: 179, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w25", name: "Xerjoff Opera", price: 229, oldPrice: 500, category: "women", image: womenPerfumeImg },
  { id: "w26", name: "Tom Ford Lost Cherry", price: 189, oldPrice: 400, category: "women", image: womenPerfumeImg },
  { id: "w27", name: "Paco Rabanne Lady Million", price: 169, oldPrice: 330, category: "women", image: womenPerfumeImg },
  { id: "w28", name: "Lancôme La Vie Est Belle", price: 179, oldPrice: 370, category: "women", image: womenPerfumeImg },
  { id: "w29", name: "Dior Addict", price: 179, oldPrice: 310, category: "women", image: womenPerfumeImg },
  { id: "w30", name: "Calvin Klein Euphoria", price: 159, oldPrice: 300, category: "women", image: womenPerfumeImg },
  // MEN
  { id: "m1", name: "Jean Paul Gaultier Le Male Elixir", price: 229, oldPrice: 400, category: "men", image: menPerfumeImg },
  { id: "m2", name: "Armani Stronger With You Intensely", price: 179, oldPrice: 370, category: "men", image: menPerfumeImg },
  { id: "m3", name: "Armani Stronger With You Absolutely", price: 179, oldPrice: 380, category: "men", image: menPerfumeImg },
  { id: "m4", name: "Jean Paul Gaultier Le Male Le Parfum", price: 215, oldPrice: 400, category: "men", image: menPerfumeImg },
  { id: "m5", name: "Dior Sauvage", price: 179, oldPrice: 370, category: "men", image: menPerfumeImg },
  { id: "m6", name: "Jean Paul Gaultier Scandal Pour Homme Le Parfum", price: 189, oldPrice: 380, category: "men", image: menPerfumeImg },
  { id: "m7", name: "Jean Paul Gaultier Scandal Pour Homme", price: 179, oldPrice: 350, category: "men", image: menPerfumeImg },
  { id: "m8", name: "Armani Stronger With You Parfum", price: 179, oldPrice: 350, category: "men", image: menPerfumeImg },
  { id: "m9", name: "Tom Ford Private Blend Vanilla Sex", price: 189, oldPrice: 400, category: "men", image: menPerfumeImg },
  { id: "m10", name: "Jean Paul Gaultier Scandal Pour Homme Absolu", price: 189, oldPrice: 390, category: "men", image: menPerfumeImg },
  { id: "m11", name: "Dior Sauvage Elixir", price: 189, oldPrice: 400, category: "men", image: menPerfumeImg },
  { id: "m12", name: "Louis Vuitton Ombre Nomade", price: 229, oldPrice: 450, category: "men", image: menPerfumeImg },
  { id: "m13", name: "Dior Homme Intense", price: 189, oldPrice: 370, category: "men", image: menPerfumeImg },
  { id: "m14", name: "Versace Eros", price: 169, oldPrice: 300, category: "men", image: menPerfumeImg },
  { id: "m15", name: "YSL MYSLF", price: 179, oldPrice: 330, category: "men", image: menPerfumeImg },
  { id: "m16", name: "Tom Ford Ombre Leather", price: 189, oldPrice: 500, category: "men", image: menPerfumeImg },
  { id: "m17", name: "Dior Fahrenheit", price: 169, oldPrice: 300, category: "men", image: menPerfumeImg },
  { id: "m18", name: "Armani Acqua di Giò Profumo", price: 179, oldPrice: 370, category: "men", image: menPerfumeImg },
  { id: "m19", name: "Xerjoff Erba Pura", price: 229, oldPrice: 980, category: "men", image: menPerfumeImg },
  { id: "m20", name: "Xerjoff Accento", price: 229, oldPrice: 450, category: "men", image: menPerfumeImg },
  // UNISEX
  { id: "u1", name: "Tom Ford Private Blend Vanilla Sex", price: 189, oldPrice: 400, category: "unisex", image: unisexPerfumeImg },
  { id: "u2", name: "Xerjoff Erba Pura", price: 229, oldPrice: 980, category: "unisex", image: unisexPerfumeImg },
  { id: "u3", name: "Xerjoff Accento", price: 229, oldPrice: 450, category: "unisex", image: unisexPerfumeImg },
  { id: "u4", name: "Sospiro Erba Pura", price: 199, oldPrice: 500, category: "unisex", image: unisexPerfumeImg },
  { id: "u5", name: "Tom Ford Noir Extreme", price: 199, oldPrice: 400, category: "unisex", image: unisexPerfumeImg },
  { id: "u6", name: "Tom Ford Black Orchid", price: 189, oldPrice: 350, category: "unisex", image: unisexPerfumeImg },
  { id: "u7", name: "Tom Ford Rose Prick", price: 179, oldPrice: 400, category: "unisex", image: unisexPerfumeImg },
  { id: "u8", name: "Tom Ford Vanille Fatale", price: 179, oldPrice: 400, category: "unisex", image: unisexPerfumeImg },
  { id: "u9", name: "Tom Ford Lost Cherry", price: 189, oldPrice: 400, category: "unisex", image: unisexPerfumeImg },
  { id: "u10", name: "Xerjoff Opera", price: 229, oldPrice: 500, category: "unisex", image: unisexPerfumeImg },
];

export const getProductsByCategory = (category: string) => products.filter(p => p.category === category);
export const getProductById = (id: string) => products.find(p => p.id === id);
