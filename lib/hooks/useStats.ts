import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardBaseStats,
  fetchSalesChart,
  fetchCategoryChart,
  fetchAlerts,
  fetchRecentOrders,
  type DashboardBaseStats,
  type SalesChartData,
  type CategoryChartData,
  type AlertData,
  type RecentOrderData,
} from "@/lib/api/stats";

export function useDashboardBaseStats() {
  return useQuery<DashboardBaseStats>({
    queryKey: ["dashboard-base-stats"],
    queryFn: fetchDashboardBaseStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSalesChart() {
  return useQuery<SalesChartData>({
    queryKey: ["dashboard-sales-chart"],
    queryFn: fetchSalesChart,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoryChart() {
  return useQuery<CategoryChartData>({
    queryKey: ["dashboard-category-chart"],
    queryFn: fetchCategoryChart,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAlerts() {
  return useQuery<AlertData[]>({
    queryKey: ["dashboard-alerts"],
    queryFn: fetchAlerts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useRecentOrders() {
  return useQuery<RecentOrderData[]>({
    queryKey: ["dashboard-recent-orders"],
    queryFn: fetchRecentOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

