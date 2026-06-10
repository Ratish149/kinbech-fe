"use client";

import { AlertTriangle, ArrowUpRight, Bell, Loader2, ShoppingBag } from "lucide-react";
import { Badge, KPI, MiniAreaChart, MiniBarChart } from "@/components/admin/ui";
import {
  useDashboardBaseStats,
  useSalesChart,
  useCategoryChart,
  useAlerts,
} from "@/lib/hooks/useStats";

const STATUS_TONES: Record<string, "warn" | "success" | "danger" | "default" | "info"> = {
  pending: "warn",
  processing: "info",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

export default function DashboardPage() {
  const { data: baseStats, isLoading: isBaseLoading, error: baseError } = useDashboardBaseStats();
  const { data: salesChart, isLoading: isSalesLoading } = useSalesChart();
  const { data: categoryChart, isLoading: isCatLoading } = useCategoryChart();
  const { data: alerts, isLoading: isAlertsLoading } = useAlerts();

  if (baseError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
        <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
        <div>
          <p className="font-semibold">Backend Connection Issue</p>
          <p className="mt-1 text-red-700/90">{(baseError as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium">Good morning, Admin</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening across your shop today.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isBaseLoading || !baseStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5 flex items-center justify-center h-28 shadow-sm">
              <Loader2 className="animate-spin text-primary/40" size={20} />
            </div>
          ))
        ) : (
          <>
            <KPI
              label="Today's sales"
              value={baseStats.kpis.today_sales.value}
              hint={baseStats.kpis.today_sales.hint}
              trend={baseStats.kpis.today_sales.trend === "neutral" ? undefined : baseStats.kpis.today_sales.trend}
            />
            <KPI
              label="Orders today"
              value={baseStats.kpis.today_orders.value}
              hint={baseStats.kpis.today_orders.hint}
              trend={baseStats.kpis.today_orders.trend === "neutral" ? undefined : baseStats.kpis.today_orders.trend}
            />
            <KPI
              label="Low stock items"
              value={baseStats.kpis.low_stock_items.value}
              hint={baseStats.kpis.low_stock_items.hint}
              trend={baseStats.kpis.low_stock_items.trend === "neutral" ? undefined : baseStats.kpis.low_stock_items.trend}
            />
            <KPI
              label="Live animals"
              value={baseStats.kpis.live_animals.value}
              hint={baseStats.kpis.live_animals.hint}
              trend={baseStats.kpis.live_animals.trend === "neutral" ? undefined : baseStats.kpis.live_animals.trend}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-border rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
          <h3 className="font-serif text-lg font-medium mb-4">Sales — last 7 days</h3>
          {isSalesLoading || !salesChart ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary/40" size={24} />
            </div>
          ) : (
            <>
              <div className="h-52">
                <MiniAreaChart data={salesChart} />
              </div>
              <div className="flex justify-between mt-2">
                {salesChart.map((s) => (
                  <span key={s.d} className="text-[10px] text-muted-foreground flex-1 text-center">
                    {s.d}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-5 flex flex-col min-h-[300px]">
          <h3 className="font-serif text-lg font-medium mb-4">By category</h3>
          {isCatLoading || !categoryChart ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary/40" size={24} />
            </div>
          ) : (
            <div className="h-52 flex-1">
              <MiniBarChart data={categoryChart} labelKey="name" />
            </div>
          )}
        </div>
      </div>

      {/* Activity + Alerts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4">Recent orders</h3>
          <ul className="space-y-3 text-[13px]">
            {isBaseLoading || !baseStats ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary/40" size={24} />
              </div>
            ) : (
              <>
                {baseStats.recent_orders.map((o) => (
                  <li key={o.order_id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                        <ShoppingBag size={14} className="text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900">{o.full_name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground ml-2">#{o.order_id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-zinc-900">Rs {o.total_amount.toLocaleString()}</span>
                      <Badge tone={STATUS_TONES[o.status] || "default"}>
                        {o.status}
                      </Badge>
                      <span className="text-muted-foreground text-[11px] min-w-[50px] text-right">{o.time_ago}</span>
                    </div>
                  </li>
                ))}
                {baseStats.recent_orders.length === 0 && (
                  <p className="text-[13px] text-muted-foreground py-4 text-center">No orders placed yet.</p>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
            <Bell size={14} /> Alerts
          </h3>
          <ul className="space-y-3 text-[13px]">
            {isAlertsLoading || !alerts ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="animate-spin text-primary/40" size={20} />
              </div>
            ) : (
              alerts.map((alert, idx) => {
                const isDanger = alert.type === "danger";
                const isWarn = alert.type === "warn";
                const isSuccess = alert.type === "success";
                const isInfo = alert.type === "info";

                let bgClass = "bg-zinc-50 text-zinc-800";
                let iconColor = "text-zinc-600";
                let Icon = Bell;

                if (isDanger) {
                  bgClass = "bg-red-50 text-red-800 border border-red-100/50";
                  iconColor = "text-red-600";
                  Icon = AlertTriangle;
                } else if (isWarn) {
                  bgClass = "bg-amber-50 text-amber-800 border border-amber-100/50";
                  iconColor = "text-amber-600";
                  Icon = AlertTriangle;
                } else if (isSuccess) {
                  bgClass = "bg-emerald-50 text-emerald-800 border border-emerald-100/50";
                  iconColor = "text-emerald-600";
                  Icon = ArrowUpRight;
                } else if (isInfo) {
                  bgClass = "bg-blue-50 text-blue-800 border border-blue-100/50";
                  iconColor = "text-blue-600";
                  Icon = ArrowUpRight;
                }

                return (
                  <li key={idx} className={`flex items-start gap-2 p-3 rounded-xl ${bgClass}`}>
                    <Icon size={14} className={`${iconColor} mt-0.5`} />
                    <span>{alert.message}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

