import { useParams } from "wouter";
import { motion } from "framer-motion";
import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Link } from "wouter";

export default function Category() {
  const { type } = useParams();
  const category = type as "women" | "men" | "unisex";
  const products = getProductsByCategory(category);

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

  return (
    <div className="container py-12 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product, idx) => (
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
    </div>
  );
}
