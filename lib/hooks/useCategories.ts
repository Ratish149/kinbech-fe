import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/categories";
import type { Category } from "@/lib/types/category";

export const categoryKeys = {
  all: ["categories"] as const,
  filtered: (filters: { is_featured?: boolean }) => ["categories", filters] as const,
};

export function useCategories(filters?: { is_featured?: boolean }) {
  return useQuery<Category[]>({
    queryKey: filters ? categoryKeys.filtered(filters) : categoryKeys.all,
    queryFn: () => fetchCategories(filters),
    staleTime: 1000 * 60 * 5,  // 5 minutes — categories rarely change
  });
}
