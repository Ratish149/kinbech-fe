import Link from "next/link";
import { CATEGORIES } from "@/lib/products";

const CAT_IMG: Record<string, string> = {
  "fresh-meat": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=70",
  "processed-meat": "https://images.unsplash.com/photo-1599583863916-e06c29087f51?auto=format&fit=crop&w=600&q=70",
  "cooked-meat": "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=600&q=70",
  "sukuti": "https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=600&q=70",
  "vegetables": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=70",
  "farm-produce": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=70",
};

export function TwoColumnCategories() {
  const pairs = CATEGORIES.slice(0, 4);

  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Shop by category</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pairs.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="relative h-56 rounded-3xl overflow-hidden group block"
          >
            <img
              src={CAT_IMG[c.slug]}
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
