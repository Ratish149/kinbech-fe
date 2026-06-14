import { getValidAccessToken } from "@/lib/auth";
import type { OrderDetail, OrderInput, OrderUpdateInput, PaginatedOrders } from "@/lib/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type OrderFilters = {
  status?: string;
  payment_method?: string;
  is_paid?: boolean;
  is_pos_order?: boolean;
  user?: number;
  search?: string;
  page?: number;
  page_size?: number;
};

export async function fetchOrders(filters?: OrderFilters): Promise<PaginatedOrders> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const params = new URLSearchParams();
  if (filters) {
    if (filters.status && filters.status !== "All") {
      params.append("status", filters.status);
    }
    if (filters.payment_method) {
      params.append("payment_method", filters.payment_method);
    }
    if (filters.is_paid !== undefined) {
      params.append("is_paid", String(filters.is_paid));
    }
    if (filters.is_pos_order !== undefined) {
      params.append("is_pos_order", String(filters.is_pos_order));
    }
    if (filters.user !== undefined) {
      params.append("user", String(filters.user));
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.page) {
      params.append("page", String(filters.page));
    }
    if (filters.page_size) {
      params.append("page_size", String(filters.page_size));
    }
  }

  const res = await fetch(`${API_URL}/orders/?${params.toString()}`, {
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized access. Please log in.");
    }
    throw new Error(`Failed to fetch orders: HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchOrderDetail(orderId: string): Promise<OrderDetail> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/orders/${orderId}/`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch order details: HTTP ${res.status}`);
  }

  return res.json();
}

export async function createOrder(input: OrderInput): Promise<OrderDetail> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to place order. Please try again.");
  }

  return res.json();
}

export async function updateOrder(orderId: string, input: OrderUpdateInput): Promise<OrderDetail> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Unauthorized: No access token found.");

  const res = await fetch(`${API_URL}/orders/${orderId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to update order.");
  }

  return res.json();
}
