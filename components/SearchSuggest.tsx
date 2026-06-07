"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";

export function SearchSuggest({
  variant = "header",
  placeholder = "Search for fresh meat, sukuti, vegetables...",
}: {
  variant?: "header" | "hero";
  placeholder?: string;
}) {
  const router = useRouter();
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

  // Debounce search input
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(q);
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  const trimmed = debouncedQuery.trim();

  // Query backend products dynamically based on search string
  // If query is empty, suggest best sellers from backend
  const { data: paginationData, isLoading: loadingProducts } = useProducts({
    search: trimmed || undefined,
    is_best_seller: trimmed ? undefined : true,
    page_size: trimmed ? 6 : 4,
  });

  // Fallback query to get first 4 products if there are no best sellers in the backend database
  const { data: fallbackData, isLoading: loadingFallback } = useProducts({
    page_size: 4,
  });

  let matches = paginationData?.products ?? [];
  if (!trimmed && matches.length === 0 && fallbackData?.products) {
    matches = fallbackData.products;
  }

  const heading = trimmed ? `Results for "${trimmed}"` : "Popular right now";
  const isLoading = trimmed ? loadingProducts : (loadingProducts && loadingFallback);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (q.trim()) {
      router.push(`/product?search=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  };

  if (variant === "hero") return null;

  return (
    <div ref={ref} className="relative flex-1 max-w-sm mx-auto hidden lg:block">
      <form onSubmit={handleSearchSubmit} className="flex items-center bg-muted rounded-full px-4 py-2 border border-border/50">
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
      </form>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] max-w-[92vw] bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden text-left">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 text-[11px] uppercase tracking-wide text-muted-foreground bg-zinc-50 font-semibold">
            <TrendingUp size={12} className="text-primary" /> {heading}
          </div>
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary" size={20} />
              <span className="text-[12px] text-muted-foreground">Searching...</span>
            </div>
          ) : matches.length === 0 ? (
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
