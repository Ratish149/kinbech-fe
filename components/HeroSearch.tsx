"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Loader2, ChevronDown } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();

  useEffect(() => {
    if (categories.length > 0 && !cat) {
      setCat(categories[0].slug);
    }
  }, [categories, cat]);

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(q);
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trimmed = debouncedQuery.trim();
  
  // Query backend products dynamically based on search string and category select
  const { data: paginationData, isLoading: loadingProducts } = useProducts({
    search: trimmed || undefined,
    category: cat || undefined,
    page_size: trimmed ? 6 : 4,
  });

  const matches = paginationData?.products ?? [];

  const activeCategoryName = categories.find((c) => c.slug === cat)?.name ?? "";
  const heading = trimmed
    ? `Results ${activeCategoryName ? `in ${activeCategoryName}` : ""} for "${q}"`
    : `Suggested ${activeCategoryName ? `in ${activeCategoryName}` : ""}`;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (q.trim()) {
      if (cat) {
        router.push(`/product?search=${encodeURIComponent(q.trim())}&category=${cat}`);
      } else {
        router.push(`/product?search=${encodeURIComponent(q.trim())}`);
      }
    } else if (cat) {
      router.push(`/product?category=${cat}`);
    }
    setOpen(false);
    setCatOpen(false);
  };

  return (
    <div ref={ref} className="mt-5 sm:mt-7 w-full max-w-xl mx-auto relative">
      <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-border rounded-full px-2 py-2 shadow-sm">
        {/* Beautiful Custom Category Dropdown */}
        <div className="relative hidden sm:block shrink-0">
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            disabled={categories.length === 0}
            className="flex items-center gap-1 bg-transparent text-[13px] px-4 py-2 outline-none rounded-full cursor-pointer disabled:opacity-50 font-medium text-foreground hover:bg-cream/40 transition-colors"
          >
            <span className="truncate max-w-[120px]">
              {categories.length === 0 ? "Loading..." : (activeCategoryName || "Select")}
            </span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 shrink-0 ${catOpen ? "rotate-180" : ""}`} />
          </button>

          {catOpen && categories.length > 0 && (
            <div className="absolute left-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-lg z-[60] min-w-[180px] py-1.5 text-left overflow-hidden">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    setCat(c.slug);
                    setCatOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-cream cursor-pointer transition-colors ${cat === c.slug ? "text-primary font-semibold bg-cream/30" : "text-foreground"
                    }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hidden sm:block w-px h-5 bg-border" />
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
        <button type="submit" className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-[13px] font-medium hover:opacity-90 cursor-pointer">
          Search
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden text-left">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b text-[11px] uppercase tracking-wide text-muted-foreground">
            <TrendingUp size={12} /> {heading}
          </div>
          {loadingProducts ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary" size={20} />
              <span className="text-[12px] text-muted-foreground">Searching...</span>
            </div>
          ) : matches.length === 0 ? (
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
                      src={p.thumbnail_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100"}
                      alt={p.thumbnail_alt || p.name}
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
