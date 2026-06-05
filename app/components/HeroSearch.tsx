"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export function HeroSearch() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(CATEGORIES[0].slug);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trimmed = q.trim().toLowerCase();
  const inCat = PRODUCTS.filter((p) => p.category === cat);
  const matches = trimmed
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(trimmed)).slice(0, 6)
    : inCat.slice(0, 4);
  const heading = trimmed
    ? `Results for "${q}"`
    : `Suggested in ${CATEGORIES.find((c) => c.slug === cat)?.name}`;

  return (
    <div ref={ref} className="mt-7 max-w-xl mx-auto relative">
      <div className="flex items-center bg-white border border-border rounded-full px-2 py-2 shadow-sm">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="bg-transparent text-[13px] px-3 py-2 outline-none rounded-full"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="w-px h-5 bg-border" />
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search size={15} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent outline-none text-[13px]"
            placeholder="Search mutton, sukuti, honey..."
          />
        </div>
        <button className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-[13px] font-medium hover:opacity-90">
          Search
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden text-left">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b text-[11px] uppercase tracking-wide text-muted-foreground">
            <TrendingUp size={12} /> {heading}
          </div>
          {matches.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-muted-foreground text-center">
              No products found.
            </p>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto">
              {matches.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium leading-snug">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                        {p.category.replace("-", " ")} · {p.unit}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium text-primary shrink-0">
                      Rs {p.price}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
