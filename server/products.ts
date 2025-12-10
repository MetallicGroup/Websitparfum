export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  category: "women" | "men" | "unisex";
};

export const products: Product[] = [
  { id: "w-1", name: "Jean Paul Gaultier Scandal Women", price: 179, oldPrice: 370, category: "women" },
  { id: "w-2", name: "Jean Paul Gaultier Gaultier Divine", price: 215, oldPrice: 400, category: "women" },
  { id: "w-3", name: "Tom Ford Private Blend Vanilla Sex", price: 189, oldPrice: 400, category: "women" },
  { id: "w-4", name: "Jean Paul Gaultier La Belle Le Parfum", price: 215, oldPrice: 400, category: "women" },
  { id: "w-5", name: "Prada Paradoxe", price: 179, oldPrice: 400, category: "women" },
  { id: "w-6", name: "Givenchy L'Interdit Rouge", price: 189, oldPrice: 370, category: "women" },
  { id: "w-7", name: "Mugler Alien", price: 179, oldPrice: 350, category: "women" },
  { id: "w-8", name: "Jean Paul Gaultier La Belle Paradise Garden", price: 215, oldPrice: 400, category: "women" },
  { id: "w-9", name: "Dior J'adore", price: 179, oldPrice: 420, category: "women" },
  { id: "w-10", name: "Xerjoff Erba Pura", price: 229, oldPrice: 980, category: "women" },
  { id: "w-11", name: "Xerjoff Accento", price: 229, oldPrice: 450, category: "women" },
  { id: "w-12", name: "Versace Crystal Noir", price: 179, oldPrice: 330, category: "women" },
  { id: "w-14", name: "Chanel Chance", price: 189, oldPrice: 765, category: "women" },
  { id: "w-15", name: "Sospiro Erba Pura", price: 199, oldPrice: 500, category: "women" },
  { id: "w-17", name: "Baccarat Rouge 540", price: 229, oldPrice: 380, category: "women" },
  { id: "w-18", name: "Tom Ford Noir Extreme", price: 199, oldPrice: 400, category: "women" },
  { id: "w-19", name: "Tom Ford Black Orchid", price: 189, oldPrice: 350, category: "women" },
  { id: "w-20", name: "Dior Hypnotic Poison", price: 179, oldPrice: 340, category: "women" },
  { id: "w-21", name: "Carolina Herrera Good Girl", price: 179, oldPrice: 659, category: "women" },
  { id: "w-26", name: "Tom Ford Lost Cherry", price: 189, oldPrice: 400, category: "women" },
  { id: "w-27", name: "Paco Rabanne Lady Million", price: 169, oldPrice: 330, category: "women" },
  { id: "w-28", name: "Lancôme La Vie Est Belle", price: 179, oldPrice: 370, category: "women" },
  { id: "w-31", name: "Givenchy L'Interdit", price: 179, oldPrice: 370, category: "women" },
  { id: "w-32", name: "Kilian Angel's Share", price: 229, oldPrice: 500, category: "women" },
  { id: "w-36", name: "Tom Ford Bitter Peach", price: 199, oldPrice: 390, category: "women" },
  { id: "w-40", name: "Tom Ford Tuscan Leather", price: 189, oldPrice: 400, category: "women" },
  { id: "w-42", name: "Chanel Coco Noir", price: 179, oldPrice: 390, category: "women" },
  { id: "w-43", name: "Carolina Herrera Very Good Girl", price: 189, oldPrice: 370, category: "women" },
  { id: "w-47", name: "Tom Ford Oud Wood", price: 199, oldPrice: 400, category: "women" },
  { id: "w-51", name: "YSL Black Opium", price: 179, oldPrice: 300, category: "women" },
  { id: "w-56", name: "Parfums de Marly Delina", price: 199, oldPrice: 400, category: "women" },
  { id: "w-61", name: "Versace Bright Crystal", price: 169, oldPrice: 300, category: "women" },
  { id: "w-64", name: "Gucci Bloom", price: 169, oldPrice: 300, category: "women" },
  { id: "w-66", name: "Chanel Coco Mademoiselle", price: 189, oldPrice: 380, category: "women" },
  { id: "w-86", name: "Chanel N°5", price: 189, oldPrice: 400, category: "women" },
  { id: "m-1", name: "Jean Paul Gaultier Le Male Elixir", price: 229, oldPrice: 400, category: "men" },
  { id: "m-2", name: "Armani Stronger With You Intensely", price: 179, oldPrice: 370, category: "men" },
  { id: "m-3", name: "Armani Stronger With You Absolutely", price: 179, oldPrice: 380, category: "men" },
  { id: "m-4", name: "Jean Paul Gaultier Le Male Le Parfum", price: 215, oldPrice: 400, category: "men" },
  { id: "m-5", name: "Dior Sauvage", price: 179, oldPrice: 370, category: "men" },
  { id: "m-6", name: "Jean Paul Gaultier Scandal Pour Homme Le Parfum", price: 189, oldPrice: 380, category: "men" },
  { id: "m-11", name: "Dior Sauvage Elixir", price: 189, oldPrice: 400, category: "men" },
  { id: "m-12", name: "Louis Vuitton Ombre Nomade", price: 229, oldPrice: 450, category: "men" },
  { id: "m-13", name: "Dior Homme Intense", price: 189, oldPrice: 370, category: "men" },
  { id: "m-14", name: "Versace Eros", price: 169, oldPrice: 300, category: "men" },
  { id: "m-15", name: "YSL MYSLF", price: 179, oldPrice: 330, category: "men" },
  { id: "m-16", name: "Tom Ford Ombre Leather", price: 189, oldPrice: 500, category: "men" },
  { id: "m-17", name: "Dior Fahrenheit", price: 169, oldPrice: 300, category: "men" },
  { id: "m-18", name: "Armani Acqua di Giò Profumo", price: 179, oldPrice: 370, category: "men" },
  { id: "m-21", name: "Versace Eros Flame", price: 179, oldPrice: 320, category: "men" },
  { id: "m-22", name: "Boss The Scent", price: 159, oldPrice: 300, category: "men" },
  { id: "m-24", name: "BVLGARI Man In Black", price: 169, oldPrice: 350, category: "men" },
  { id: "m-29", name: "Dior Homme", price: 169, oldPrice: 320, category: "men" },
  { id: "m-30", name: "Paco Rabanne 1 Million", price: 169, oldPrice: 300, category: "men" },
  { id: "m-31", name: "Paco Rabanne 1 Million Elixir", price: 179, oldPrice: 370, category: "men" },
  { id: "m-32", name: "Dolce&Gabbana The One", price: 169, oldPrice: 300, category: "men" },
  { id: "m-35", name: "Hugo Boss Bottled Intense", price: 159, oldPrice: 300, category: "men" },
  { id: "m-43", name: "YSL Y EDP Intense", price: 179, oldPrice: 350, category: "men" },
  { id: "m-50", name: "Armani Code Parfum", price: 179, oldPrice: 400, category: "men" },
  { id: "m-54", name: "Bleu de Chanel", price: 189, oldPrice: 450, category: "men" },
  { id: "m-55", name: "Creed Aventus", price: 229, oldPrice: 900, category: "men" },
  { id: "m-58", name: "Parfums de Marly Layton", price: 199, oldPrice: 400, category: "men" },
  { id: "u-1", name: "Tom Ford Tobacco Vanille", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-2", name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 229, oldPrice: 500, category: "unisex" },
  { id: "u-3", name: "Byredo Gypsy Water", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-4", name: "Le Labo Santal 33", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-5", name: "Tom Ford Oud Wood", price: 199, oldPrice: 400, category: "unisex" },
  { id: "u-6", name: "Montale Intense Cafe", price: 199, oldPrice: 380, category: "unisex" },
  { id: "u-7", name: "Xerjoff Naxos", price: 229, oldPrice: 500, category: "unisex" },
  { id: "u-8", name: "Initio Musk Therapy", price: 229, oldPrice: 500, category: "unisex" },
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
