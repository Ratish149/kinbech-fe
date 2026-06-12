"use client";

import Link from "next/link";
import { ChevronDown, Menu, ShoppingCart, X, User } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useCategories } from "@/lib/hooks/useCategories";
import type { Category, Subcategory } from "@/lib/types/category";
import { SearchSuggest } from "./SearchSuggest";
import { getCurrentUser, clearTokens, type TokenPayload } from "@/lib/auth";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<null | "products" | "best">(null);

  const [currentUser, setCurrentUser] = useState<TokenPayload | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearTokens();
    setCurrentUser(null);
    window.location.reload();
  };


  const { data: categories = [] as Category[], isLoading: loading } = useCategories();
  const { data: featuredCategories = [] as Category[], isLoading: loadingFeatured } = useCategories({ is_featured: true });

  const bestItems = useMemo(() => {
    return featuredCategories.flatMap((c: Category) => {
      const featuredSubs = c.subs.filter((s: Subcategory) => s.is_featured);
      if (featuredSubs.length > 0) {
        return featuredSubs.map((s: Subcategory) => ({
          label: s.name,
          to: `/product?category=${c.slug}&subcategory=${s.slug}`,
        }));
      }
      return [{ label: c.name, to: `/product?category=${c.slug}` }];
    });
  }, [featuredCategories]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border" onMouseLeave={() => setMenu(null)}>
        <div className="container-x flex items-center gap-3 md:gap-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="shrink-0" onClick={closeMobile}>
            <Logo />
          </Link>

          {/* Search — hidden on very small, visible from sm */}
          <div className="hidden sm:flex flex-1">
            <SearchSuggest variant="header" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-[14px]">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link
              href="/product"
              onMouseEnter={() => setMenu("products")}
              className="flex items-center gap-1 hover:text-primary cursor-pointer"
            >
              Products <ChevronDown size={14} />
            </Link>
            <button
              onMouseEnter={() => setMenu("best")}
              className="flex items-center gap-1 hover:text-primary cursor-pointer"
            >
              Best <ChevronDown size={14} />
            </button>
            <Link href="/about" className="hover:text-primary" onMouseEnter={() => setMenu(null)}>About</Link>
            <Link href="/contact" className="hover:text-primary" onMouseEnter={() => setMenu(null)}>Contact</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Cart */}
            <Link
              href="/cart"
              id="cart-icon"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
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

            {/* Account / User Icon */}
            {currentUser ? (
              <div className="relative" onMouseEnter={() => setMenu("account")} onMouseLeave={() => setMenu(null)}>
                <button
                  className="p-2 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer text-zinc-700"
                  aria-label="Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">
                    {(currentUser.first_name?.[0] ?? currentUser.email?.[0] ?? "U").toUpperCase()}
                  </div>
                </button>

                {menu === "account" && (
                  <div className="absolute right-0 top-full bg-white border border-border shadow-md rounded-xl py-1.5 w-40 z-50 text-[13px] text-zinc-700">
                    <div className="px-3 py-1 border-b border-border font-medium text-zinc-900 truncate">
                      Hi, {currentUser.first_name || "User"}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3 py-1.5 hover:bg-muted text-zinc-800 transition-colors"
                    >
                      My Profile
                    </Link>
                    {currentUser.is_staff && (
                      <Link
                        href="/admin"
                        className="block px-3 py-1.5 hover:bg-muted text-zinc-800 transition-colors"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer text-zinc-700"
                aria-label="Login"
              >
                <User size={18} />
              </Link>
            )}


            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-muted"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile search bar (below header row, sm and smaller) */}
        <div className="sm:hidden px-4 pb-3">
          <SearchSuggest variant="header" />
        </div>

        {/* Desktop — Products megamenu */}
        {menu === "products" && (
          <div className="absolute inset-x-0 top-full bg-white border-t border-border shadow-sm" onMouseEnter={() => setMenu("products")}>
            <div className="container-x grid grid-cols-3 gap-6 py-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 w-28 bg-muted rounded mb-3" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="h-3 w-20 bg-muted/60 rounded" />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                categories.map((c: Category) => (
                  <div key={c.slug}>
                    <Link
                      href={`/product?category=${c.slug}`}
                      className="font-serif text-[15px] font-semibold text-foreground hover:text-primary underline underline-offset-4 decoration-primary/40"
                      onClick={() => setMenu(null)}
                    >
                      {c.name}
                    </Link>
                    <ul className="mt-3 space-y-1.5">
                      {c.subs.map((s: Subcategory) => (
                        <li key={s.slug}>
                          <Link
                            href={`/product?category=${c.slug}&subcategory=${s.slug}`}
                            className="text-[13px] text-muted-foreground hover:text-primary"
                            onClick={() => setMenu(null)}
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Desktop — Best megamenu */}
        {menu === "best" && (
          <div className="absolute inset-x-0 top-full bg-white border-t border-border shadow-sm" onMouseEnter={() => setMenu("best")}>
            <div className="container-x py-6 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
              {loadingFeatured ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse py-1.5">
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                ))
              ) : (
                bestItems.map((b) => (
                  <Link key={b.label} href={b.to} className="text-[14px] py-1.5 hover:text-primary" onClick={() => setMenu(null)}>
                    {b.label}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity md:hidden ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeMobile}
      />

      {/* Slide-in panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Logo />
          <button onClick={closeMobile} className="p-1.5 rounded-full hover:bg-muted" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 text-[15px]">
          <Link href="/" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2" onClick={closeMobile}>
            Home
          </Link>

          {/* Products accordion */}
          <button
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted rounded-lg mx-2 text-left"
            onClick={() => setMobileExpanded(mobileExpanded === "products" ? null : "products")}
          >
            Products
            <ChevronDown size={15} className={`transition-transform ${mobileExpanded === "products" ? "rotate-180" : ""}`} />
          </button>
          {mobileExpanded === "products" && (
            <div className="mx-4 mb-2 border border-border rounded-xl overflow-hidden">
              {loading ? (
                <div className="p-3 text-[13px] text-muted-foreground">Loading…</div>
              ) : (
                categories.map((c: Category) => (
                  <div key={c.slug} className="border-b border-border last:border-0">
                    <Link
                      href={`/product?category=${c.slug}`}
                      className="block px-4 py-2.5 text-[13px] font-semibold hover:text-primary"
                      onClick={closeMobile}
                    >
                      {c.name}
                    </Link>
                    {c.subs.map((s: Subcategory) => (
                      <Link
                        key={s.slug}
                        href={`/product?category=${c.slug}&subcategory=${s.slug}`}
                        className="block px-6 py-2 text-[12px] text-muted-foreground hover:text-primary border-t border-border/50"
                        onClick={closeMobile}
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Best accordion */}
          <button
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted rounded-lg mx-2 text-left"
            onClick={() => setMobileExpanded(mobileExpanded === "best" ? null : "best")}
          >
            Best
            <ChevronDown size={15} className={`transition-transform ${mobileExpanded === "best" ? "rotate-180" : ""}`} />
          </button>
          {mobileExpanded === "best" && (
            <div className="mx-4 mb-2 border border-border rounded-xl overflow-hidden">
              {loadingFeatured ? (
                <div className="p-3 text-[13px] text-muted-foreground">Loading…</div>
              ) : (
                bestItems.map((b) => (
                  <Link
                    key={b.label}
                    href={b.to}
                    className="block px-4 py-2.5 text-[13px] hover:text-primary border-b border-border/50 last:border-0"
                    onClick={closeMobile}
                  >
                    {b.label}
                  </Link>
                ))
              )}
            </div>
          )}

          <Link href="/about" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2" onClick={closeMobile}>
            About
          </Link>
          <Link href="/contact" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2" onClick={closeMobile}>
            Contact
          </Link>

          {/* Mobile Account / Login */}
          {currentUser ? (
            <div className="border-t border-border mt-2 pt-2">
              <div className="px-5 py-2 text-[12px] text-muted-foreground">
                Logged in as <span className="font-semibold text-zinc-800">{currentUser.first_name || currentUser.email}</span>
              </div>
              <Link href="/profile" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2" onClick={closeMobile}>
                My Profile
              </Link>
              {currentUser.is_staff && (
                <Link href="/admin" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2" onClick={closeMobile}>
                  Admin Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-[calc(100%-1rem)] flex items-center px-5 py-3 hover:bg-red-50 text-red-600 rounded-lg mx-2 text-left transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center px-5 py-3 hover:bg-muted rounded-lg mx-2 border-t border-border mt-2" onClick={closeMobile}>
              Login / Sign Up
            </Link>
          )}
        </nav>

      </aside>
    </>
  );
}
