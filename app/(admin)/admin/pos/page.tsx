"use client";

import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";

// ── Mock products ────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "1", slug: "fresh-mutton", name: "Fresh Mutton Curry Cut", category: "fresh-meat", subcategory: "goat", price: 1200, rating: 4.8, reviews: 32, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200", unit: "1 kg", description: "", stock: 45 },
  { id: "2", slug: "whole-chicken", name: "Whole Dressed Chicken", category: "fresh-meat", subcategory: "chicken", price: 650, rating: 4.6, reviews: 18, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200", unit: "1 pc", description: "", stock: 12 },
  { id: "3", slug: "buff-sukuti", name: "Buff Sukuti Premium", category: "sukuti", subcategory: "buff-sukuti", price: 1800, rating: 4.9, reviews: 54, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", unit: "500 g", description: "", stock: 8 },
  { id: "4", slug: "pork-belly", name: "Pork Belly Sliced", category: "fresh-meat", subcategory: "pork", price: 850, rating: 4.5, reviews: 22, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200", unit: "500 g", description: "", stock: 20 },
  { id: "5", slug: "goat-liver", name: "Goat Liver Fresh", category: "fresh-meat", subcategory: "goat", price: 550, rating: 4.3, reviews: 11, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200", unit: "500 g", description: "", stock: 30 },
  { id: "6", slug: "chicken-sukuti", name: "Chicken Sukuti", category: "sukuti", subcategory: "chicken-sukuti", price: 900, rating: 4.7, reviews: 41, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200", unit: "250 g", description: "", stock: 15 },
];

type CartLine = { p: Product; q: number };

export default function POSPage() {
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [pay, setPay] = useState("cash");
  const [saleComplete, setSaleComplete] = useState(false);

  const list = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 20);

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
      {/* Product grid */}
      <div className="p-6 overflow-auto">
        <div className="flex items-center bg-white border border-border rounded-full px-4 py-2.5 mb-4">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or scan barcode…"
            className="ml-2 flex-1 outline-none text-[14px]"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => add(p)}
              className="bg-white border border-border rounded-xl p-3 hover:border-primary hover:shadow-sm text-left transition-all"
            >
              <img
                src={p.image}
                className="w-full aspect-square rounded-lg object-cover"
                alt={p.name}
              />
              <p className="text-[13px] font-medium mt-2 line-clamp-2">{p.name}</p>
              <p className="text-[13px] font-semibold mt-1 text-primary">Rs {p.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
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
              <span className="w-16 text-right">Rs {l.p.price * l.q}</span>
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
            {["cash", "qr", "khalti", "esewa", "fonepay"].map((p) => (
              <button
                key={p}
                onClick={() => setPay(p)}
                className={`py-2 rounded-lg border capitalize transition-colors ${
                  pay === p
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {p}
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
