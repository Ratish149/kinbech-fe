"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const admin = isAdminUser();
    if (!admin) {
      router.replace("/admin-login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
