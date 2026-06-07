"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-serif text-lg font-semibold">Your cart</h3>
          <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-muted rounded-full cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2 py-20">
              <ShoppingBag size={36} className="text-primary/60" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          )}
          {items.map((it) => (
            <div key={it.product.id} className="flex gap-3">
              <img src={it.product.image} alt={it.product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-[14px] font-medium leading-snug">{it.product.name}</p>
                <p className="text-[12px] text-muted-foreground">{it.product.unit}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setQty(it.product.id, it.qty - 1)} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-muted cursor-pointer">
                    <Minus size={12} />
                  </button>
                  <span className="text-[13px] w-6 text-center">{it.qty}</span>
                  <button onClick={() => setQty(it.product.id, it.qty + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-muted cursor-pointer">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium">Rs {it.product.price * it.qty}</p>
                <button onClick={() => remove(it.product.id)} className="text-[11px] text-muted-foreground hover:text-destructive mt-2 cursor-pointer">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">Rs {total}</span>
            </div>
            <div className="flex justify-between text-[12px] text-muted-foreground">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-primary text-primary-foreground rounded-full py-3 text-[14px] font-medium hover:opacity-90 cursor-pointer"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
