"use client";

import Link from "next/link";
import { Bell, ChevronDown, LayoutDashboard, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { SearchSuggest } from "./SearchSuggest";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
        <path
          d="M10 1C5 5 2 9 2 13c0 4 3 7 8 7s8-3 8-7c0-4-3-8-8-12z"
          fill="#075924"
        />
        <path d="M10 4v15" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".55" />
      </svg>
      <span className="font-serif text-[22px] font-semibold tracking-tight text-foreground leading-none">
        kinbechmart
      </span>
    </div>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState<null | "products" | "best" | "account">(null);

  const BEST = [
    { label: "Top Mutton Cuts", to: "/category/fresh-meat/mutton" },
    { label: "Buff Sukuti", to: "/category/sukuti/buff-sukuti" },
    { label: "Country Chicken", to: "/category/fresh-meat/chicken" },
    { label: "Frozen Momo", to: "/category/cooked-meat/momo" },
    { label: "Wild Honey", to: "/category/farm-produce/honey" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border" onMouseLeave={() => setMenu(null)}>
      <div className="container-x flex items-center gap-6 py-3.5">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <SearchSuggest variant="header" />

        <nav className="hidden md:flex items-center gap-5 text-[14px]">
          <Link href="/" className="hover:text-primary">Home</Link>
          <button
            onMouseEnter={() => setMenu("products")}
            className="flex items-center gap-1 hover:text-primary cursor-pointer"
          >
            Products <ChevronDown size={14} />
          </button>
          <button
            onMouseEnter={() => setMenu("best")}
            className="flex items-center gap-1 hover:text-primary cursor-pointer"
          >
            Best <ChevronDown size={14} />
          </button>
          <Link href="/about" className="hover:text-primary" onMouseEnter={() => setMenu(null)}>About</Link>
          <Link href="/contact" className="hover:text-primary" onMouseEnter={() => setMenu(null)}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/cart"
            id="cart-icon"
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-muted relative flex items-center justify-center cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menu === "products" && (
        <div className="absolute inset-x-0 top-full bg-white border-t border-border shadow-sm" onMouseEnter={() => setMenu("products")}>
          <div className="container-x grid grid-cols-3 gap-6 py-8">
            {CATEGORIES.map((c) => (
              <div key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="font-serif text-[15px] font-semibold text-foreground hover:text-primary underline underline-offset-4 decoration-primary/40"
                  onClick={() => setMenu(null)}
                >
                  {c.name}
                </Link>
                <ul className="mt-3 space-y-1.5">
                  {c.subs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/category/${c.slug}/${s.slug}`}
                        className="text-[13px] text-muted-foreground hover:text-primary"
                        onClick={() => setMenu(null)}
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {menu === "best" && (
        <div className="absolute inset-x-0 top-full bg-white border-t border-border shadow-sm" onMouseEnter={() => setMenu("best")}>
          <div className="container-x py-6 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
            {BEST.map((b) => (
              <Link key={b.label} href={b.to} className="text-[14px] py-1.5 hover:text-primary" onClick={() => setMenu(null)}>
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {menu === "account" && (
        <div className="absolute right-4 top-full mt-1 w-56 bg-white border border-border rounded-xl shadow-md p-2 z-55" onMouseEnter={() => setMenu("account")}>
          {["My Account", "Orders", "Track Order", "Wishlist", "Sign out"].map((x) => (
            <button key={x} className="w-full text-left text-[13px] px-3 py-2 rounded-lg hover:bg-muted cursor-pointer">
              {x}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
