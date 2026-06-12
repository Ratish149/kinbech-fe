import { getValidAccessToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type KPIData = {
  value: string;
  hint: string;
  trend: "up" | "down" | "neutral";
};

export type RecentOrderData = {
  order_id: string;
  full_name: string;
  total_amount: number;
  status: string;
  time_ago: string;
};

export type DashboardBaseStats = {
  kpis: {
    today_sales: KPIData;
    today_orders: KPIData;
    low_stock_items: KPIData;
    live_animals: KPIData;
  };
};

export type SalesChartData = { d: string; v: number; orders: number }[];
export type CategoryChartData = { name: string; v: number }[];
export type AlertData = {
  type: "danger" | "warn" | "success" | "info";
  message: string;
};

// Base Stats (KPIs and Recent Orders)
export async function fetchDashboardBaseStats(): Promise<DashboardBaseStats> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/stats/dashboard/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats: HTTP ${res.status}`);
  }

  return res.json();
}

// Sales Chart
export async function fetchSalesChart(): Promise<SalesChartData> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/stats/sales-chart/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sales chart: HTTP ${res.status}`);
  }

  return res.json();
}

// Category Chart
export async function fetchCategoryChart(): Promise<CategoryChartData> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/stats/category-chart/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch category chart: HTTP ${res.status}`);
  }

  return res.json();
}

// Alerts
export async function fetchAlerts(): Promise<AlertData[]> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/stats/alerts/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch alerts: HTTP ${res.status}`);
  }

  return res.json();
}

// Recent Orders
export async function fetchRecentOrders(): Promise<RecentOrderData[]> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/stats/recent-orders/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recent orders: HTTP ${res.status}`);
  }

  return res.json();
}

