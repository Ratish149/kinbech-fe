"use client";

import { Printer, Search } from "lucide-react";
import { useState } from "react";
import { PageHead } from "@/components/admin/ui";
import type { Product } from "@/lib/products";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", slug: "fresh-mutton", name: "Fresh Mutton Curry Cut", category: "fresh-meat", subcategory: "goat", price: 1200, rating: 4.8, reviews: 32, thumbnail_image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200", unit: "1 kg", description: "", stock: 45 },
  { id: "2", slug: "whole-chicken", name: "Whole Dressed Chicken", category: "fresh-meat", subcategory: "chicken", price: 650, rating: 4.6, reviews: 18, thumbnail_image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200", unit: "1 pc", description: "", stock: 12 },
  { id: "3", slug: "buff-sukuti", name: "Buff Sukuti Premium", category: "sukuti", subcategory: "buff-sukuti", price: 1800, rating: 4.9, reviews: 54, thumbnail_image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", unit: "500 g", description: "", stock: 8 },
  { id: "4", slug: "pork-belly", name: "Pork Belly Sliced", category: "fresh-meat", subcategory: "pork", price: 850, rating: 4.5, reviews: 22, thumbnail_image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200", unit: "500 g", description: "", stock: 20 },
  { id: "5", slug: "goat-liver", name: "Goat Liver Fresh", category: "fresh-meat", subcategory: "goat", price: 550, rating: 4.3, reviews: 11, thumbnail_image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200", unit: "500 g", description: "", stock: 30 },
  { id: "6", slug: "chicken-sukuti", name: "Chicken Sukuti", category: "sukuti", subcategory: "chicken-sukuti", price: 900, rating: 4.7, reviews: 41, thumbnail_image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200", unit: "250 g", description: "", stock: 15 },
];

export default function BarcodesPage() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());

  const list = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectAll = () => setSel(new Set(list.map((p) => p.id)));
  const clearAll = () => setSel(new Set());

  return (
    <div>
      <PageHead
        title="Barcodes"
        subtitle="Search, print and reprint product labels"
        action={
          <button
            disabled={sel.size === 0}
            className="bg-primary text-white rounded-full px-4 py-2 text-[13px] flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer size={14} /> Print selected ({sel.size})
          </button>
        }
      />

      {/* Search + bulk actions */}
      <div className="bg-white border border-border rounded-xl p-4 mb-4 flex items-center gap-3">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="flex-1 outline-none text-[14px]"
        />
        <div className="flex gap-2 shrink-0">
          <button onClick={selectAll} className="text-[12px] text-primary hover:underline">
            Select all
          </button>
          <span className="text-muted-foreground">·</span>
          <button onClick={clearAll} className="text-[12px] text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      </div>

      {/* Barcode grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {list.map((p) => (
          <label
            key={p.id}
            className={`bg-white border rounded-xl p-3 cursor-pointer transition-all ${
              sel.has(p.id) ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={sel.has(p.id)}
                onChange={() => toggle(p.id)}
                className="accent-primary"
              />
              {p.stock < 15 && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                  Low stock
                </span>
              )}
            </div>
            <p className="text-[13px] font-medium line-clamp-2">{p.name}</p>
            <div className="mt-3 bg-cream rounded-lg p-3 text-center">
              {/* Simulated barcode */}
              <div className="flex justify-center gap-px mb-1 h-8">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
                      background: "#1a1a1a",
                    }}
                    className="h-full"
                  />
                ))}
              </div>
              <code className="text-[10px] tracking-widest">KM{p.id.padStart(6, "0")}</code>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Rs {p.price} · {p.unit}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
}
