import type { Category } from "@/lib/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function fetchCategories(params?: { is_featured?: boolean }): Promise<Category[]> {
  let url = `${API_URL}/categories/`;
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.is_featured !== undefined) {
      searchParams.append("is_featured", String(params.is_featured));
    }
    url += `?${searchParams.toString()}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: HTTP ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
    return data.results as Category[];
  }
  return [];
}
