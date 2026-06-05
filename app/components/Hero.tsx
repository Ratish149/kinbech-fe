import Link from "next/link";
import { Leaf } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { HeroSearch } from "./HeroSearch";

const CAT_IMG: Record<string, string> = {
  "fresh-meat": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=70",
  "processed-meat": "https://images.unsplash.com/photo-1599583863916-e06c29087f51?auto=format&fit=crop&w=600&q=70",
  "cooked-meat": "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=600&q=70",
  "sukuti": "https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=600&q=70",
  "vegetables": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=70",
  "farm-produce": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=70",
};

export function Hero() {
  const tilts = [-6, 4, -3, 6];

  return (
    <section className="relative overflow-hidden">
      <Leaf className="absolute top-10 left-6 text-primary/15 -rotate-12" size={48} />
      <Leaf className="absolute top-32 right-10 text-leaf/20 rotate-45" size={36} />
      <div className="container-x pt-14 pb-20 text-center">
        <div className="inline-flex items-center gap-2 text-[12px] text-primary bg-accent rounded-full px-3 py-1">
          <Leaf size={12} /> From Nepal · 100% Organic · Direct from farmers
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-medium mt-5 leading-[1.05]">
          Fresh from farm,<br />on your plate today.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-[15px]">
          Meat, sukuti, vegetables and farm produce — sourced from Nepali farmers and delivered fresh.
        </p>

        <HeroSearch />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 4).map((c, i) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              style={{ transform: `rotate(${tilts[i]}deg)` }}
              className="group bg-white border border-border rounded-2xl p-3 hover:border-primary/40 transition-transform hover:rotate-0"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={CAT_IMG[c.slug]} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-serif text-[14px] font-medium mt-2.5">{c.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
