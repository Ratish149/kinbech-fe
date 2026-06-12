"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/admin/ui";
import { DashboardBaseStats } from "@/lib/api/stats";

const STATUS_TONES: Record<string, "warn" | "success" | "danger" | "default" | "info"> = {
  pending: "warn",
  processing: "info",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

interface RecentOrdersProps {
  baseStats?: DashboardBaseStats;
  isLoading: boolean;
}

export function RecentOrders({ baseStats, isLoading }: RecentOrdersProps) {
  return (
    <div className="md:col-span-2 bg-white border border-border rounded-xl p-5">
      <h3 className="font-serif text-lg font-medium mb-4">Recent orders</h3>
      <ul className="space-y-3 text-[13px]">
        {isLoading || !baseStats ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary/40" size={24} />
          </div>
        ) : (
          <>
            {baseStats.recent_orders.map((o) => (
              <li
                key={o.order_id}
                className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                    <ShoppingBag size={14} className="text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">{o.full_name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground ml-2">
                      #{o.order_id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-zinc-900">
                    Rs {o.total_amount.toLocaleString()}
                  </span>
                  <Badge tone={STATUS_TONES[o.status] || "default"}>{o.status}</Badge>
                  <span className="text-muted-foreground text-[11px] min-w-[50px] text-right">
                    {o.time_ago}
                  </span>
                </div>
              </li>
            ))}
            {baseStats.recent_orders.length === 0 && (
              <p className="text-[13px] text-muted-foreground py-4 text-center">
                No orders placed yet.
              </p>
            )}
          </>
        )}
      </ul>
    </div>
  );
}
