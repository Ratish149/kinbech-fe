"use client";

import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, BEST_SELLERS } from "@/lib/products";

export function SearchSuggest({
  variant = "header",
  placeholder = "Search for fresh meat, sukuti, vegetables...",
}: {
  variant?: "header" | "hero";
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trimmed = q.trim();
  const matches = trimmed
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 6)
    : BEST_SELLERS.slice(0, 4);
  const heading = trimmed ? `Results for "${trimmed}"` : "Popular right now";

  if (variant === "hero") return null;

  return (
    <div ref={ref} className="relative flex-1 max-w-sm mx-auto hidden lg:block">
      <div className="flex items-center bg-muted rounded-full px-4 py-2 border border-border/50">
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="bg-transparent w-full ml-2 outline-none text-[13px] text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] max-w-[92vw] bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden text-left">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 text-[11px] uppercase tracking-wide text-muted-foreground bg-zinc-50 font-semibold">
            <TrendingUp size={12} className="text-primary" /> {heading}
          </div>
          {matches.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-muted-foreground text-center">
              No products found.
            </p>
          ) : (
            <ul className="max-h-[380px] overflow-y-auto divide-y divide-zinc-50">
              {matches.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition duration-150"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-zinc-150"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-800 leading-snug truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                        {p.category.replace("-", " ")} · {p.unit}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-primary shrink-0">
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
