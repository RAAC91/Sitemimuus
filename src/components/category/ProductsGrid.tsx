import { motion, AnimatePresence, Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

interface ProductsGridProps {
    products: Product[];
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <section className="pb-32">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {products.map((p) => (
            <motion.div key={p.id} variants={item} layout>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
