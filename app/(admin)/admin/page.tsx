"use client";

import { AlertTriangle } from "lucide-react";
import {
  DashboardKPIs,
  SalesChart,
  CategoryChart,
  RecentOrders,
  DashboardAlerts,
} from "@/components/admin/dashboard";
import {
  useDashboardBaseStats,
  useSalesChart,
  useCategoryChart,
  useAlerts,
  useRecentOrders,
} from "@/lib/hooks/useStats";

export default function DashboardPage() {
  const { data: baseStats, isLoading: isBaseLoading, error: baseError } = useDashboardBaseStats();
  const { data: salesChart, isLoading: isSalesLoading } = useSalesChart();
  const { data: categoryChart, isLoading: isCatLoading } = useCategoryChart();
  const { data: alerts, isLoading: isAlertsLoading } = useAlerts();
  const { data: recentOrders, isLoading: isRecentOrdersLoading } = useRecentOrders();

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
      <DashboardKPIs baseStats={baseStats} isLoading={isBaseLoading} />

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <SalesChart salesChart={salesChart} isLoading={isSalesLoading} />
        <CategoryChart categoryChart={categoryChart} isLoading={isCatLoading} />
      </div>

      {/* Activity + Alerts */}
      <div className="grid md:grid-cols-3 gap-4">
        <RecentOrders recentOrders={recentOrders} isLoading={isRecentOrdersLoading} />
        <DashboardAlerts alerts={alerts} isLoading={isAlertsLoading} />
      </div>
    </div>
  );
}

