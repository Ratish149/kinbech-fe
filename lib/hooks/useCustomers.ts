import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchCustomers, fetchCustomerDetail, type CustomerFilters } from "@/lib/api/customers";
import type { Customer, PaginatedCustomers } from "@/lib/types/customer";

export const customerKeys = {
  all: ["customers"] as const,
  filtered: (filters: CustomerFilters) => ["customers", filters] as const,
  detail: (id: number | string) => ["customers", "detail", String(id)] as const,
};

export function useCustomers(
  filters?: CustomerFilters,
  options?: Partial<UseQueryOptions<PaginatedCustomers>>
) {
  return useQuery<PaginatedCustomers>({
    queryKey: filters ? customerKeys.filtered(filters) : customerKeys.all,
    queryFn: () => fetchCustomers(filters),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

export function useCustomerDetail(
  id: number | string,
  options?: Partial<UseQueryOptions<Customer>>
) {
  return useQuery<Customer>({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomerDetail(id),
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!id,
    ...options,
  });
}

