"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import type { Category } from "@/lib/types/category";
import { HeroSearch } from "./HeroSearch";


export function Hero() {
  const { data: featuredCategories = [] as Category[], isLoading } = useCategories({ is_featured: true });
  const tilts = [-6, 4, -3, 6];

  return (
    <section className="relative overflow-hidden">
      <Leaf className="absolute top-10 left-6 text-primary/15 -rotate-12 hidden sm:block" size={48} />
      <Leaf className="absolute top-32 right-10 text-leaf/20 rotate-45 hidden sm:block" size={36} />
      <div className="container-x pt-8 sm:pt-14 pb-12 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 text-[12px] text-primary bg-accent rounded-full px-3 py-1">
          <Leaf size={12} /> From Nepal · 100% Organic · Direct from farmers
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mt-4 sm:mt-5 leading-[1.05]">
          Fresh from farm,<br />on your plate today.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-[15px]">
          Meat, sukuti, vegetables and farm produce — sourced from Nepali farmers and delivered fresh.
        </p>

        <HeroSearch />

        <div className="mt-8 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{ transform: `rotate(${tilts[i]}deg)` }}
                className="animate-pulse bg-white border border-border rounded-2xl p-3"
              >
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="h-4 bg-muted/80 rounded w-2/3 mx-auto mt-3" />
              </div>
            ))
          ) : (
            featuredCategories.slice(0, 4).map((c, i) => {
              const imageSrc = c.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=70";
              return (
                <Link
                  key={c.slug}
                  href={`/product/?category=${c.slug}`}
                  style={{ transform: `rotate(${tilts[i]}deg)` }}
                  className="group bg-white border border-border rounded-2xl p-3 hover:border-primary/40 transition-transform hover:rotate-0"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={imageSrc} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-serif text-[14px] font-medium mt-2.5">{c.name}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
