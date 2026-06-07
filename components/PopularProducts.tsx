import { fetchProducts } from "@/lib/api/products";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/products";

export async function PopularProducts() {
  let products: Product[] = [];
  try {
    const data = await fetchProducts({ page_size: 8 });
    products = data.products;
  } catch (error) {
    console.error("Failed to fetch popular products:", error);
  }

  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Popular products</h2>
        <p className="text-muted-foreground mt-2 text-[14px]">What our customers love this week</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
