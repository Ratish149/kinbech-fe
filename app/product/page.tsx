"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Loader2, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useCategories } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/lib/types/category";

/* ─── Filter Panel (shared between sidebar and drawer) ─────────────────────── */
function FilterPanel({
  categories,
  cat,
  sub,
  maxPrice,
  setMaxPrice,
  setPriceChanged,
  minRating,
  setMinRating,
  onClose,
}: {
  categories: Category[];
  cat: string | undefined;
  sub: string | undefined;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  setPriceChanged: (v: boolean) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h4 className="font-serif text-[14px] font-semibold mb-3">Categories</h4>
        <ul className="space-y-1.5 text-[13px]">
          <li>
            <Link
              href="/product"
              onClick={onClose}
              className={`block hover:text-primary ${!cat ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              All Products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/product?category=${c.slug}`}
                onClick={onClose}
                className={`block hover:text-primary ${cat === c.slug ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                {c.name}
              </Link>
              {cat === c.slug && (
                <ul className="mt-1.5 ml-3 space-y-1 border-l border-border pl-3">
                  {c.subs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/product?category=${c.slug}&subcategory=${s.slug}`}
                        onClick={onClose}
                        className={`block text-[12px] hover:text-primary ${sub === s.slug ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-serif text-[14px] font-semibold mb-3">Price</h4>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(+e.target.value);
            setPriceChanged(true);
          }}
          className="w-full accent-primary cursor-pointer"
        />
        <p className="text-[12px] text-muted-foreground mt-1">Up to Rs {maxPrice}</p>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-serif text-[14px] font-semibold mb-3">Rating</h4>
        <div className="space-y-1.5">
          {[0, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input
                type="radio"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="accent-primary"
              />
              {r === 0 ? "All" : `${r}+ Stars`}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main content ──────────────────────────────────────────────────────────── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get("category") || undefined;
  const sub = searchParams.get("subcategory") || undefined;
  const searchVal = searchParams.get("search") || undefined;

  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [priceChanged, setPriceChanged] = useState(false);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [cat, sub, searchVal, minRating, sort]);

  // Debounce price slider
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(2000);
  useEffect(() => {
    if (!priceChanged) return;
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [maxPrice, priceChanged]);

  const backendOrdering = useMemo(() => {
    if (sort === "low") return "price";
    if (sort === "high") return "-price";
    if (sort === "rating") return "-average_rating_annotated";
    return undefined;
  }, [sort]);

  const { data: paginationData, isLoading: loadingProducts } = useProducts({
    category: cat,
    subcategory: sub,
    search: searchVal,
    max_price: priceChanged ? debouncedMaxPrice : undefined,
    ordering: backendOrdering,
    page,
    page_size: 15,
  });

  const products = paginationData?.products ?? [];
  const totalPages = paginationData?.totalPages ?? 1;
  const count = paginationData?.count ?? 0;

  const category = useMemo(() => categories.find((c) => c.slug === cat), [categories, cat]);
  const subObj = useMemo(() => sub && category?.subs.find((s) => s.slug === sub), [category, sub]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchRating = p.rating >= minRating;
      const matchPrice = priceChanged ? p.price <= maxPrice : true;
      return matchRating && matchPrice;
    });
  }, [products, minRating, maxPrice, priceChanged]);

  const loading = loadingCategories || loadingProducts;

  // Count active filters for badge
  const activeFilterCount = [
    priceChanged && maxPrice < 2000,
    minRating > 0,
    !!cat,
  ].filter(Boolean).length;

  return (
    <div className="container-x py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-muted-foreground flex items-center gap-1.5 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link href="/product" className="hover:text-primary">Products</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/product?category=${category.slug}`} className="hover:text-primary">
              {category.name}
            </Link>
          </>
        )}
        {subObj && (
          <>
            <ChevronRight size={12} />
            <span className="text-foreground">{subObj.name}</span>
          </>
        )}
        {searchVal && (
          <>
            <ChevronRight size={12} />
            <span className="text-foreground">Search: &quot;{searchVal}&quot;</span>
          </>
        )}
      </nav>

      {/* ── Mobile: Filter + Sort button row ── */}
      <div className="md:hidden flex items-center gap-3 mb-5">
        {/* Filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-[13px] font-medium hover:bg-muted transition cursor-pointer shrink-0"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Custom sort pill dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 border border-border rounded-full px-4 py-2 text-[13px] font-medium bg-white hover:bg-muted transition cursor-pointer"
          >
            <span className="truncate">
              {sort === "popular" && "Most popular"}
              {sort === "low" && "Price: Low → High"}
              {sort === "high" && "Price: High → Low"}
              {sort === "rating" && "Top rated"}
            </span>
            <ChevronRight size={13} className={`shrink-0 transition-transform ${sortOpen ? "-rotate-90" : "rotate-90"}`} />
          </button>

          {sortOpen && (
            <>
              {/* close on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden text-[13px]">
                {[
                  { value: "popular", label: "Most popular" },
                  { value: "low",     label: "Price: Low → High" },
                  { value: "high",    label: "Price: High → Low" },
                  { value: "rating",  label: "Top rated" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-muted transition cursor-pointer ${
                      sort === opt.value ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity md:hidden ${filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setFilterOpen(false)}
      />
      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 md:hidden ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-serif text-[16px] font-semibold">Filters</span>
          <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-full hover:bg-muted cursor-pointer" aria-label="Close filters">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel
            categories={categories}
            cat={cat}
            sub={sub}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            setPriceChanged={setPriceChanged}
            minRating={minRating}
            setMinRating={setMinRating}
            onClose={() => setFilterOpen(false)}
          />
        </div>
        {/* Apply button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full bg-primary text-primary-foreground rounded-full py-2.5 text-[13px] font-medium hover:opacity-90 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* ── Desktop: sidebar + main grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:sticky md:top-24 md:self-start space-y-7">
          <FilterPanel
            categories={categories}
            cat={cat}
            sub={sub}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            setPriceChanged={setPriceChanged}
            minRating={minRating}
            setMinRating={setMinRating}
          />
        </aside>

        {/* Main Content */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium">
                {searchVal ? `Search results for "${searchVal}"` : (subObj ? subObj.name : category?.name ?? "All Products")}
              </h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                Showing {filtered.length} products of {count} total
              </p>
            </div>
            {/* Desktop sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="hidden md:block text-[13px] bg-white border border-border rounded-full px-3 py-2 outline-none cursor-pointer self-start sm:self-auto"
            >
              <option value="popular">Most popular</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center py-20 text-muted-foreground text-sm">
                  No products match these filters.
                </p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 border border-border rounded-full hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded-full cursor-pointer transition ${
                            page === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 border border-border rounded-full hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
