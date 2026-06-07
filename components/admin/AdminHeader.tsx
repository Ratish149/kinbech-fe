"use client";

import { Bell, ShoppingBag, LogOut } from "lucide-react";
import { clearTokens, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TokenPayload } from "@/lib/auth";

export function AdminHeader() {
  const router = useRouter();
  const [user, setUser] = useState<TokenPayload | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleLogout() {
    clearTokens();
    router.replace("/admin-login");
  }

  const initials =
    user
      ? (user.first_name?.[0] ?? user.email?.[0] ?? "A").toUpperCase()
      : "A";

  const displayName =
    user?.first_name
      ? `${user.first_name} ${user.last_name ?? ""}`.trim()
      : user?.email ?? "Admin";

  return (
    <header className="bg-white border-b border-border h-14 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        Admin Dashboard
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-muted relative transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <ShoppingBag size={16} />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary text-white text-[12px] font-semibold flex items-center justify-center">
            {initials}
          </div>
          <span className="text-[13px] hidden sm:block">{displayName}</span>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 text-muted-foreground transition-colors"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
