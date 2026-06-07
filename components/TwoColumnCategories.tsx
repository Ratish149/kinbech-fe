import Link from "next/link";
import { fetchCategories } from "@/lib/api/categories";
import type { Category } from "@/lib/types/category";


export async function TwoColumnCategories() {
  let categories: Category[] = [];
  try {
    categories = await fetchCategories();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  const pairs = categories.slice(0, 4);

  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Shop by category</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pairs.map((c) => (
          <Link
            key={c.slug}
            href={`/product?category=${c.slug}`}
            className="relative h-56 rounded-3xl overflow-hidden group block"
          >
            <img
              src={c.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=70"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={c.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="font-serif text-2xl font-medium">{c.name}</h3>
              <p className="text-[13px] opacity-90 mt-1">{c.subs.length} categories · Shop now</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
