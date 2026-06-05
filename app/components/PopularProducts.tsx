import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function PopularProducts() {
  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Popular products</h2>
        <p className="text-muted-foreground mt-2 text-[14px]">What our customers love this week</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRODUCTS.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
