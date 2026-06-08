"use client";

import { Minus, Plus, Search, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/products";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import type { Category } from "@/lib/types/category";

type CartLine = { p: Product; q: number };

export default function POSPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [pay, setPay] = useState("cash");
  const [saleComplete, setSaleComplete] = useState(false);

  // Debounce search input to avoid hitting the backend for every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);
    return () => clearTimeout(handler);
  }, [q]);

  // Load categories on mount
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

  // Fetch products based on filters
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProducts({
        search: debouncedQ || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        page_size: 50, // Showing up to 50 products for POS view
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

  const total = cart.reduce((s, l) => s + l.p.price * l.q, 0);

  const add = (p: Product) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.p.id === p.id);
      if (i >= 0) {
        const n = [...c];
        n[i] = { ...n[i], q: n[i].q + 1 };
        return n;
      }
      return [...c, { p, q: 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setCart((c) =>
      c.map((l) => (l.p.id === id ? { ...l, q: Math.max(1, qty) } : l))
    );

  const rm = (id: string) => setCart((c) => c.filter((l) => l.p.id !== id));

  const handleCharge = () => {
    setSaleComplete(true);
    setCart([]);
    setTimeout(() => setSaleComplete(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 -m-6 h-[calc(100vh-3.5rem)]">
      {/* Product grid area */}
      <div className="p-6 overflow-auto flex flex-col">
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
                  onClick={() => add(p)}
                  className="bg-white border border-border rounded-xl p-3 hover:border-primary hover:shadow-sm text-left transition-all flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={p.thumbnail_image  || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200"}
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
      </div>

      {/* Cart sidebar */}
      <aside className="bg-white border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-serif text-lg font-medium">Current sale</h3>
          <p className="text-[12px] text-muted-foreground">Cashier: Admin · Shift open</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {saleComplete && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[13px] text-green-700 text-center">
              ✓ Sale completed successfully!
            </div>
          )}
          {cart.length === 0 && !saleComplete && (
            <p className="text-center text-muted-foreground text-[13px] py-12">
              Add items to start
            </p>
          )}
          {cart.map((l) => (
            <div key={l.p.id} className="flex items-center gap-2 text-[13px]">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{l.p.name}</p>
                <p className="text-muted-foreground text-[11px]">
                  Rs {l.p.price} · {l.p.unit}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQty(l.p.id, l.q - 1)}
                  className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus size={11} />
                </button>
                <span className="w-6 text-center">{l.q}</span>
                <button
                  onClick={() => setQty(l.p.id, l.q + 1)}
                  className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus size={11} />
                </button>
              </div>
              <span className="w-16 text-right font-medium">Rs {l.p.price * l.q}</span>
              <button
                onClick={() => rm(l.p.id)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex justify-between text-[14px]">
            <span>Subtotal</span>
            <span>Rs {total}</span>
          </div>
          <div className="flex justify-between font-semibold text-[15px]">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

          {/* Payment methods */}
          <div className="grid grid-cols-5 gap-1 text-[11px]">
            {["cash", "qr", "khalti", "esewa", "fonepay"].map((method) => (
              <button
                key={method}
                onClick={() => setPay(method)}
                className={`py-2 rounded-lg border capitalize transition-colors ${
                  pay === method
                    ? "bg-primary text-white border-primary font-medium"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            disabled={!cart.length}
            onClick={handleCharge}
            className="w-full bg-primary text-white rounded-full py-3 text-[14px] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Charge Rs {total}
          </button>
        </div>
      </aside>
    </div>
  );
}
