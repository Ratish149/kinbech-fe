"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { useRef } from "react";
import { useCart, flyToCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="group flex flex-col border border-border rounded-2xl overflow-hidden bg-white hover:border-primary/30 transition">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-3.5 flex-1 flex flex-col">
        <Link
          href={`/product/${product.slug}`}
          className="text-[14px] font-medium leading-snug hover:text-primary line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-1.5 text-[12px] text-muted-foreground">
          <Star size={12} className="fill-primary text-primary" />
          <span>{product.rating}</span>
          <span>·</span>
          <span>{product.reviews}</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-[15px] font-semibold">Rs {product.price}</p>
            {product.oldPrice && (
              <p className="text-[11px] text-muted-foreground line-through">Rs {product.oldPrice}</p>
            )}
          </div>
          <button
            ref={btnRef}
            onClick={(e) => {
              e.preventDefault();
              if (btnRef.current) flyToCart(btnRef.current);
              add(product);
            }}
            className="inline-flex items-center gap-1 text-[12px] font-medium bg-primary text-primary-foreground rounded-full px-3 py-1.5 hover:opacity-90"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
