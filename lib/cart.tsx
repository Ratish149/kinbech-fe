"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "./products";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalQuantity: number;
  total: number;
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setQty: (productId: string, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kinbech_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.map((item: unknown) => {
            const it = item as { qty?: number; quantity?: number; product: Product };
            return {
              product: it.product,
              qty: typeof it.qty === "number" ? it.qty : (typeof it.quantity === "number" ? it.quantity : 1),
            };
          });
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(sanitized);
        }
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("kinbech_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

  const add = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.qty + quantity;
        if (newQty <= 0) {
          return prev.filter((item) => item.product.id !== product.id);
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: newQty }
            : item
        );
      }
      if (quantity <= 0) return prev;
      return [...prev, { product, qty: quantity }];
    });
  };

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, qty }
          : item
      )
    );
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clear = () => {
    setItems([]);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        clear,
        totalQuantity,
        total: totalPrice,
        count: totalQuantity,
        open,
        setOpen,
        setQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
