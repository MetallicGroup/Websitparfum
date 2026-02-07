export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  category: "women" | "men" | "unisex";
};

export const products: Product[] = [
  { id: "w-1", name: "Parfum inspirat de Jean Paul Gaultier Scandal Women", price: 179, oldPrice: 370, category: "women" },
  { id: "w-2", name: "Parfum inspirat de Jean Paul Gaultier Gaultier Divine", price: 215, oldPrice: 400, category: "women" },
  { id: "w-3", name: "Parfum inspirat de Tom Ford Private Blend Vanilla Sex", price: 189, oldPrice: 400, category: "women" },
  { id: "w-4", name: "Parfum inspirat de Jean Paul Gaultier La Belle Le Parfum", price: 215, oldPrice: 400, category: "women" },
  { id: "w-5", name: "Parfum inspirat de Prada Paradoxe", price: 179, oldPrice: 400, category: "women" },
  { id: "w-6", name: "Parfum inspirat de Givenchy L'Interdit Rouge", price: 189, oldPrice: 370, category: "women" },
  { id: "w-7", name: "Parfum inspirat de Mugler Alien", price: 179, oldPrice: 350, category: "women" },
  { id: "w-8", name: "Parfum inspirat de Jean Paul Gaultier La Belle Paradise Garden", price: 215, oldPrice: 400, category: "women" },
  { id: "w-9", name: "Parfum inspirat de Dior J'adore", price: 179, oldPrice: 420, category: "women" },
  { id: "w-10", name: "Parfum inspirat de Xerjoff Erba Pura", price: 229, oldPrice: 980, category: "women" },
  { id: "w-11", name: "Parfum inspirat de Xerjoff Accento", price: 229, oldPrice: 450, category: "women" },
  { id: "w-12", name: "Parfum inspirat de Versace Crystal Noir", price: 179, oldPrice: 330, category: "women" },
  { id: "w-14", name: "Parfum inspirat de Chanel Chance", price: 189, oldPrice: 765, category: "women" },
  { id: "w-15", name: "Parfum inspirat de Sospiro Erba Pura", price: 199, oldPrice: 500, category: "women" },
  { id: "w-17", name: "Parfum inspirat de Baccarat Rouge 540", price: 229, oldPrice: 380, category: "women" },
  { id: "w-18", name: "Parfum inspirat de Tom Ford Noir Extreme", price: 199, oldPrice: 400, category: "women" },
  { id: "w-19", name: "Parfum inspirat de Tom Ford Black Orchid", price: 189, oldPrice: 350, category: "women" },
  { id: "w-20", name: "Parfum inspirat de Dior Hypnotic Poison", price: 179, oldPrice: 340, category: "women" },
  { id: "w-21", name: "Parfum inspirat de Carolina Herrera Good Girl", price: 179, oldPrice: 659, category: "women" },
  { id: "w-26", name: "Parfum inspirat de Tom Ford Lost Cherry", price: 189, oldPrice: 400, category: "women" },
  { id: "w-27", name: "Parfum inspirat de Paco Rabanne Lady Million", price: 169, oldPrice: 330, category: "women" },
  { id: "w-28", name: "Parfum inspirat de Lancôme La Vie Est Belle", price: 179, oldPrice: 370, category: "women" },
  { id: "w-31", name: "Parfum inspirat de Givenchy L'Interdit", price: 179, oldPrice: 370, category: "women" },
  { id: "w-32", name: "Parfum inspirat de Kilian Angel's Share", price: 229, oldPrice: 500, category: "women" },
  { id: "w-36", name: "Parfum inspirat de Tom Ford Bitter Peach", price: 199, oldPrice: 390, category: "women" },
  { id: "w-40", name: "Parfum inspirat de Tom Ford Tuscan Leather", price: 189, oldPrice: 400, category: "women" },
  { id: "w-42", name: "Parfum inspirat de Chanel Coco Noir", price: 179, oldPrice: 390, category: "women" },
  { id: "w-43", name: "Parfum inspirat de Carolina Herrera Very Good Girl", price: 189, oldPrice: 370, category: "women" },
  { id: "w-47", name: "Parfum inspirat de Tom Ford Oud Wood", price: 199, oldPrice: 400, category: "women" },
  { id: "w-51", name: "Parfum inspirat de YSL Black Opium", price: 179, oldPrice: 300, category: "women" },
  { id: "w-56", name: "Parfum inspirat de Parfums de Marly Delina", price: 199, oldPrice: 400, category: "women" },
  { id: "w-61", name: "Parfum inspirat de Versace Bright Crystal", price: 169, oldPrice: 300, category: "women" },
  { id: "w-64", name: "Parfum inspirat de Gucci Bloom", price: 169, oldPrice: 300, category: "women" },
  { id: "w-66", name: "Parfum inspirat de Chanel Coco Mademoiselle", price: 189, oldPrice: 380, category: "women" },
  { id: "w-86", name: "Parfum inspirat de Chanel N°5", price: 189, oldPrice: 400, category: "women" },
  { id: "m-1", name: "Parfum inspirat de Jean Paul Gaultier Le Male Elixir", price: 229, oldPrice: 400, category: "men" },
  { id: "m-2", name: "Parfum inspirat de Armani Stronger With You Intensely", price: 179, oldPrice: 370, category: "men" },
  { id: "m-3", name: "Parfum inspirat de Armani Stronger With You Absolutely", price: 179, oldPrice: 380, category: "men" },
  { id: "m-4", name: "Parfum inspirat de Jean Paul Gaultier Le Male Le Parfum", price: 215, oldPrice: 400, category: "men" },
  { id: "m-5", name: "Parfum inspirat de Dior Sauvage", price: 179, oldPrice: 370, category: "men" },
  { id: "m-6", name: "Parfum inspirat de Jean Paul Gaultier Scandal Pour Homme Le Parfum", price: 189, oldPrice: 380, category: "men" },
  { id: "m-11", name: "Parfum inspirat de Dior Sauvage Elixir", price: 189, oldPrice: 400, category: "men" },
  { id: "m-12", name: "Parfum inspirat de Louis Vuitton Ombre Nomade", price: 229, oldPrice: 450, category: "men" },
  { id: "m-13", name: "Parfum inspirat de Dior Homme Intense", price: 189, oldPrice: 370, category: "men" },
  { id: "m-14", name: "Parfum inspirat de Versace Eros", price: 169, oldPrice: 300, category: "men" },
  { id: "m-15", name: "Parfum inspirat de YSL MYSLF", price: 179, oldPrice: 330, category: "men" },
  { id: "m-16", name: "Parfum inspirat de Tom Ford Ombre Leather", price: 189, oldPrice: 500, category: "men" },
  { id: "m-17", name: "Parfum inspirat de Dior Fahrenheit", price: 169, oldPrice: 300, category: "men" },
  { id: "m-18", name: "Parfum inspirat de Armani Acqua di Giò Profumo", price: 179, oldPrice: 370, category: "men" },
  { id: "m-21", name: "Parfum inspirat de Versace Eros Flame", price: 179, oldPrice: 320, category: "men" },
  { id: "m-22", name: "Parfum inspirat de Boss The Scent", price: 159, oldPrice: 300, category: "men" },
  { id: "m-24", name: "Parfum inspirat de BVLGARI Man In Black", price: 169, oldPrice: 350, category: "men" },
  { id: "m-29", name: "Parfum inspirat de Dior Homme", price: 169, oldPrice: 320, category: "men" },
  { id: "m-30", name: "Parfum inspirat de Paco Rabanne 1 Million", price: 169, oldPrice: 300, category: "men" },
  { id: "m-31", name: "Parfum inspirat de Paco Rabanne 1 Million Elixir", price: 179, oldPrice: 370, category: "men" },
  { id: "m-32", name: "Parfum inspirat de Dolce&Gabbana The One", price: 169, oldPrice: 300, category: "men" },
  { id: "m-35", name: "Parfum inspirat de Hugo Boss Bottled Intense", price: 159, oldPrice: 300, category: "men" },
  { id: "m-43", name: "Parfum inspirat de YSL Y EDP Intense", price: 179, oldPrice: 350, category: "men" },
  { id: "m-50", name: "Parfum inspirat de Armani Code Parfum", price: 179, oldPrice: 400, category: "men" },
  { id: "m-54", name: "Parfum inspirat de Bleu de Chanel", price: 189, oldPrice: 450, category: "men" },
  { id: "m-55", name: "Parfum inspirat de Creed Aventus", price: 229, oldPrice: 900, category: "men" },
  { id: "m-58", name: "Parfum inspirat de Parfums de Marly Layton", price: 199, oldPrice: 400, category: "men" },
  { id: "u-1", name: "Parfum inspirat de Tom Ford Tobacco Vanille", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-2", name: "Parfum inspirat de Maison Francis Kurkdjian Baccarat Rouge 540", price: 229, oldPrice: 500, category: "unisex" },
  { id: "u-3", name: "Parfum inspirat de Byredo Gypsy Water", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-4", name: "Parfum inspirat de Le Labo Santal 33", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-5", name: "Parfum inspirat de Tom Ford Oud Wood", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-6", name: "Parfum inspirat de Montale Intense Cafe", price: 199, oldPrice: 380, category: "unisex" },
  { id: "u-7", name: "Parfum inspirat de Xerjoff Naxos", price: 229, oldPrice: 500, category: "unisex" },
  { id: "u-8", name: "Parfum inspirat de Initio Musk Therapy", price: 229, oldPrice: 500, category: "unisex" },
];

export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywords = normalizedQuery.split(/\s+/).filter(k => k.length > 2);
  
  return products.filter(product => {
    const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return keywords.every(keyword => normalizedName.includes(keyword));
  }).slice(0, 5);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: "women" | "men" | "unisex"): Product[] {
  return products.filter(p => p.category === category).slice(0, 10);
}
