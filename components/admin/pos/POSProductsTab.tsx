"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import type { Product } from "@/lib/products";
import type { Category } from "@/lib/types/category";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";

interface POSProductsTabProps {
  onAddToCart: (p: Product) => void;
}

export default function POSProductsTab({ onAddToCart }: POSProductsTabProps) {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProducts({
        search: debouncedQ || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        page_size: 50,
      });
      setProducts(result.products);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to connect to the server. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQ, categoryFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <>
      {/* Search and Category Filter Header */}
      <div className="flex flex-col gap-3 mb-4 shrink-0">
        <div className="flex items-center bg-white border border-border rounded-full px-4 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="ml-2 flex-1 outline-none text-[14px]"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mr-1 shrink-0">
            Category:
          </span>
          <button
            onClick={() => setCategoryFilter("All")}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
              categoryFilter === "All"
                ? "bg-primary text-white"
                : "bg-cream text-foreground border border-border hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.slug)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
                categoryFilter === c.slug
                  ? "bg-primary text-white"
                  : "bg-cream text-foreground border border-border hover:bg-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / States */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-muted-foreground text-[13px] mt-2">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
            <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Connection Error</h4>
              <p className="text-[12px] mt-1 text-red-700">{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground text-[13px] py-12">
            No products found matching filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToCart(p)}
                className="bg-white border border-border rounded-xl p-3 hover:border-primary hover:shadow-sm text-left transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={p.thumbnail_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200"}
                    className="w-full aspect-square rounded-lg object-cover"
                    alt={p.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200";
                    }}
                  />
                  <p className="text-[13px] font-medium mt-2 line-clamp-2">{p.name}</p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-primary">Rs {p.price}</span>
                    <span className="text-muted-foreground text-[11px]">{p.unit}</span>
                  </div>
                  {p.stock !== undefined && (
                    <p className={`text-[10px] mt-1 ${p.stock <= 5 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                      Stock: {p.stock}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
