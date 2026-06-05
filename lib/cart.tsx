"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "./products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalQuantity: number;
  totalPrice: number;
  count: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kinbech_cart");
      if (saved) {
        setItems(JSON.parse(saved));
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

  const add = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clear = () => {
    setItems([]);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
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
        totalPrice,
        count: totalQuantity,
        isOpen,
        setOpen,
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

export function flyToCart(buttonElement: HTMLElement) {
  if (typeof window === "undefined") return;

  const startRect = buttonElement.getBoundingClientRect();
  const target =
    document.getElementById("cart-icon") ||
    document.getElementById("header-cart-icon") ||
    document.querySelector(".header-cart");

  const targetX = target ? target.getBoundingClientRect().left : window.innerWidth - 80;
  const targetY = target ? target.getBoundingClientRect().top : 30;

  const flying = document.createElement("div");
  flying.style.position = "fixed";
  flying.style.left = `${startRect.left + startRect.width / 2 - 10}px`;
  flying.style.top = `${startRect.top + startRect.height / 2 - 10}px`;
  flying.style.width = "20px";
  flying.style.height = "20px";
  flying.style.borderRadius = "50%";
  flying.style.backgroundColor = "#10b981"; // primary emerald green
  flying.style.zIndex = "99999";
  flying.style.pointerEvents = "none";
  flying.style.transition = "all 0.7s cubic-bezier(0.25, 1, 0.5, 1)";
  flying.style.boxShadow = "0 4px 10px rgba(16, 185, 129, 0.4)";
  
  document.body.appendChild(flying);

  // Force reflow
  flying.getBoundingClientRect();

  // Animate to target
  flying.style.left = `${targetX}px`;
  flying.style.top = `${targetY}px`;
  flying.style.transform = "scale(0.3)";
  flying.style.opacity = "0.2";

  setTimeout(() => {
    flying.remove();
    if (target) {
      target.classList.add("scale-110", "bg-emerald-500", "text-white");
      setTimeout(() => {
        target.classList.remove("scale-110", "bg-emerald-500", "text-white");
      }, 300);
    }
  }, 700);
}
