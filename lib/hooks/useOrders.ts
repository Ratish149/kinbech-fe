import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchOrderDetail,
  createOrder,
  updateOrder,
  type OrderFilters,
} from "@/lib/api/orders";
import type {OrderDetail, OrderInput, OrderUpdateInput, PaginatedOrders } from "@/lib/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  filtered: (filters: OrderFilters) => ["orders", filters] as const,
  single: (orderId: string) => ["order", orderId] as const,
};

export function useOrders(
  filters?: OrderFilters,
  options?: Partial<UseQueryOptions<PaginatedOrders>>
) {
  return useQuery<PaginatedOrders>({
    queryKey: filters ? orderKeys.filtered(filters) : orderKeys.all,
    queryFn: () => fetchOrders(filters),
    staleTime: 1000 * 30, // 30 seconds for live order listing
    ...options,
  });
}

export function useOrderDetail(
  orderId: string,
  options?: Partial<UseQueryOptions<OrderDetail>>
) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.single(orderId),
    queryFn: () => fetchOrderDetail(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 30,
    ...options,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderInput) => createOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, input }: { orderId: string; input: OrderUpdateInput }) =>
      updateOrder(orderId, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.single(variables.orderId) });
    },
  });
}
