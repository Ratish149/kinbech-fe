"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BEST_SELLERS } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function BestSellersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d, behavior: "smooth" });

  return (
    <section className="container-x py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium">Best sellers</h2>
          <p className="text-muted-foreground mt-1 text-[14px]">Tried, loved and reordered.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-300)}
            className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(300)}
            className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-5 px-5 snap-x scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {BEST_SELLERS.map((p) => (
          <div key={p.id} className="min-w-[220px] max-w-[220px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
