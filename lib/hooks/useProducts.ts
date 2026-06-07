import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductBySlug,
  fetchReviewsByProductSlug,
  type ProductFilters,
  type PaginatedProducts,
  type Review,
} from "@/lib/api/products";
import type { Product } from "@/lib/products";

export const productKeys = {
  all: ["products"] as const,
  filtered: (filters: ProductFilters) => ["products", filters] as const,
  single: (slug: string) => ["product", slug] as const,
  reviews: (slug: string) => ["reviews", slug] as const,
};

export function useProducts(
  filters?: ProductFilters,
  options?: Partial<UseQueryOptions<PaginatedProducts>>
) {
  return useQuery<PaginatedProducts>({
    queryKey: filters ? productKeys.filtered(filters) : productKeys.all,
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 2,  // 2 minutes for custom queries
    ...options,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product>({
    queryKey: productKeys.single(slug),
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 1000 * 60 * 5,  // 5 minutes
  });
}

export function useReviewsByProductSlug(slug: string) {
  return useQuery<Review[]>({
    queryKey: productKeys.reviews(slug),
    queryFn: () => fetchReviewsByProductSlug(slug),
    staleTime: 1000 * 60 * 5,  // 5 minutes
  });
}
