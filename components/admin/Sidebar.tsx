"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Barcode,
  ClipboardList,
  LayoutDashboard,
  Leaf,
  Package,
  ScanLine,
  Users,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/pos", label: "POS", icon: ScanLine },
  { to: "/admin/barcodes", label: "Barcodes", icon: Barcode },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/financial", label: "Financial", icon: Banknote },
];

export function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-border flex flex-col sticky top-0 h-screen shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-serif text-base font-semibold">KinBech</span>
          <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              href={n.to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={15} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted"
        >
          <Leaf size={12} />
          Back to store
        </Link>
      </div>
    </aside>
  );
}
