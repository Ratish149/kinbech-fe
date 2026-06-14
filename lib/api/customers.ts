import { getValidAccessToken } from "@/lib/auth";
import type { Customer, PaginatedCustomers } from "@/lib/types/customer";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type CustomerFilters = {
  search?: string;
  page?: number;
  page_size?: number;
};

export async function fetchCustomers(filters?: CustomerFilters): Promise<PaginatedCustomers> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const params = new URLSearchParams();
  if (filters) {
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

  const res = await fetch(`${API_URL}/customers/?${params.toString()}`, {
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized access. Please log in.");
    }
    throw new Error(`Failed to fetch customers: HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchCustomerDetail(id: number | string): Promise<Customer> {
  const token = await getValidAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/customers/${id}/`, {
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized access. Please log in.");
    }
    throw new Error(`Failed to fetch customer details: HTTP ${res.status}`);
  }

  return res.json();
}

