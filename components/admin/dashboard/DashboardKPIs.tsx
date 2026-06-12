"use client";

import { Loader2 } from "lucide-react";
import { KPI } from "@/components/admin/ui";
import { DashboardBaseStats } from "@/lib/api/stats";

interface DashboardKPIsProps {
  baseStats?: DashboardBaseStats;
  isLoading: boolean;
}

export function DashboardKPIs({ baseStats, isLoading }: DashboardKPIsProps) {
  if (isLoading || !baseStats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-xl p-5 flex items-center justify-center h-28 shadow-sm"
          >
            <Loader2 className="animate-spin text-primary/40" size={20} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KPI
        label="Today's sales"
        value={baseStats.kpis.today_sales.value}
        hint={baseStats.kpis.today_sales.hint}
        trend={
          baseStats.kpis.today_sales.trend === "neutral"
            ? undefined
            : baseStats.kpis.today_sales.trend
        }
      />
      <KPI
        label="Orders today"
        value={baseStats.kpis.today_orders.value}
        hint={baseStats.kpis.today_orders.hint}
        trend={
          baseStats.kpis.today_orders.trend === "neutral"
            ? undefined
            : baseStats.kpis.today_orders.trend
        }
      />
      <KPI
        label="Low stock items"
        value={baseStats.kpis.low_stock_items.value}
        hint={baseStats.kpis.low_stock_items.hint}
        trend={
          baseStats.kpis.low_stock_items.trend === "neutral"
            ? undefined
            : baseStats.kpis.low_stock_items.trend
        }
      />
      <KPI
        label="Live animals"
        value={baseStats.kpis.live_animals.value}
        hint={baseStats.kpis.live_animals.hint}
        trend={
          baseStats.kpis.live_animals.trend === "neutral"
            ? undefined
            : baseStats.kpis.live_animals.trend
        }
      />
    </div>
  );
}
