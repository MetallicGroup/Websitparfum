import { useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Category() {
  const { type } = useParams();
  const category = type as "women" | "men" | "unisex";
  const allProducts = getProductsByCategory(category);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const titles = {
    women: "Parfumuri Damă",
    men: "Parfumuri Bărbați",
    unisex: "Parfumuri Unisex"
  };

  const descriptions = {
    women: "Eleganță, rafinament și senzualitate în fiecare picătură.",
    men: "Putere, carismă și distincție masculină.",
    unisex: "Arome versatile care transcend genurile."
  };

  // Filter & Sort Logic
  const filteredProducts = allProducts
    .filter((product) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container py-12 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="capitalize text-foreground">{titles[category]}</span>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl font-bold"
        >
          {titles[category]}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          {descriptions[category]}
        </motion.p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-secondary/30 p-4 rounded-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Caută un parfum..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {sortOrder === "asc" ? "Preț: Crescător" : sortOrder === "desc" ? "Preț: Descrescător" : "Sortare Preț"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder(null)}>
              Relevanță (Implicit)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>
              Preț: Crescător
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>
              Preț: Descrescător
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Nu am găsit niciun parfum care să corespundă căutării tale.</p>
          <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
            Șterge filtrele
          </Button>
        </div>
      )}
    </div>
  );
}
