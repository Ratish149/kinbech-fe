"use client";

import React from "react";
import { Minus, Plus, Trash2, Pause, CreditCard, AlertTriangle } from "lucide-react";
import type { Product } from "@/lib/products";
import type { UserProfile } from "@/lib/types/auth";
import POSCustomerSelect from "./POSCustomerSelect";

type CartLine = { p: Product; q: number };

interface POSCartSidebarProps {
  cart: CartLine[];
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  selectedCustomer: UserProfile | null;
  onSelectCustomer: (c: UserProfile | null) => void;
  discount: string;
  onSetDiscount: (d: string) => void;
  vat: string;
  onSetVat: (v: string) => void;
  heldOrdersCount: number;
  onOpenHeldOrders: () => void;
  onHold: () => void;
  onPay: () => void;
  orderError: string | null;
  saleComplete: boolean;
}

export default function POSCartSidebar({
  cart,
  onSetQty,
  onRemove,
  selectedCustomer,
  onSelectCustomer,
  discount,
  onSetDiscount,
  vat,
  onSetVat,
  heldOrdersCount,
  onOpenHeldOrders,
  onHold,
  onPay,
  orderError,
  saleComplete,
}: POSCartSidebarProps) {
  const subtotal = cart.reduce((s, l) => s + l.p.price * l.q, 0);
  const discountVal = Number(discount) || 0;
  const vatVal = Number(vat) || 0;
  const total = Math.max(0, Math.round((subtotal - discountVal) * (1 + vatVal / 100)));

  return (
    <aside className="bg-white border-l border-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-serif text-lg font-medium">Current order</h3>
          <p className="text-[11px] text-muted-foreground">Cashier: Admin · Shift open</p>
        </div>
        <button
          type="button"
          onClick={onOpenHeldOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl text-[12px] font-semibold text-zinc-700 transition-all"
        >
          <Pause size={12} className="rotate-90 text-zinc-500 fill-zinc-500" />
          <span>Held</span>
          {heldOrdersCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold px-1 min-w-[18px]">
              {heldOrdersCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Customer Selection/Creation UI */}
        <POSCustomerSelect
          selectedCustomer={selectedCustomer}
          onSelectCustomer={onSelectCustomer}
        />

        {orderError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[13px] text-red-700 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{orderError}</span>
          </div>
        )}

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
                type="button"
                onClick={() => onSetQty(l.p.id, l.q - 1)}
                className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus size={11} />
              </button>
              <span className="w-6 text-center">{l.q}</span>
              <button
                type="button"
                onClick={() => onSetQty(l.p.id, l.q + 1)}
                className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus size={11} />
              </button>
            </div>
            <span className="w-16 text-right font-medium">Rs {l.p.price * l.q}</span>
            <button
              type="button"
              onClick={() => onRemove(l.p.id)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Calculations & Action Buttons */}
      <div className="border-t border-border p-4 space-y-3.5 shrink-0 bg-white">
        {/* Discount (Rs.) input */}
        <div className="flex justify-between items-center text-[13px] text-zinc-600">
          <span>Discount (Rs.)</span>
          <input
            type="number"
            value={discount}
            onChange={(e) => onSetDiscount(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg text-right w-24 px-2.5 py-1 text-zinc-800 font-semibold outline-none focus:border-primary text-[13px]"
            min="0"
            placeholder="0"
          />
        </div>

        {/* VAT (%) input */}
        <div className="flex justify-between items-center text-[13px] text-zinc-600">
          <span>VAT (%)</span>
          <input
            type="number"
            value={vat}
            onChange={(e) => onSetVat(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg text-right w-24 px-2.5 py-1 text-zinc-800 font-semibold outline-none focus:border-primary text-[13px]"
            min="0"
            placeholder="0"
          />
        </div>

        {/* Subtotal display */}
        <div className="flex justify-between text-[13px] text-zinc-500 pt-1">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-800">Rs. {subtotal}</span>
        </div>

        {/* Total display */}
        <div className="flex justify-between items-baseline font-bold text-[16px] text-zinc-950 border-t border-zinc-100 pt-2.5">
          <span>Total</span>
          <span className="text-[20px] font-serif">Rs. {total}</span>
        </div>

        {/* Hold and Pay Buttons */}
        <div className="grid grid-cols-[100px_1fr] gap-2.5 pt-2">
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onHold}
            className="bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-2xl py-3 text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
          >
            <Pause size={14} className="rotate-90 text-zinc-500" />
            Hold
          </button>
          <button
            type="button"
            disabled={!cart.length}
            onClick={onPay}
            className="bg-primary text-white rounded-2xl py-3 text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/15"
          >
            <CreditCard size={15} />
            Pay Rs. {total}
          </button>
        </div>
      </div>
    </aside>
  );
}
