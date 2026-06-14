"use client";

import { useState } from "react";
import { PageHead, SlideOver, useModal } from "@/components/admin/ui";
import { useOrders } from "@/lib/hooks/useOrders";
import type { Order } from "@/lib/types/order";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { OrderDetailView } from "@/components/admin/OrderDetailView";
import { OrderTable } from "@/components/admin/orders/OrderTable";

const STATUS_CHOICES = [
  { value: "pending", label: "Pending", tone: "warn" as const },
  { value: "processing", label: "Processing", tone: "info" as const },
  { value: "shipped", label: "Shipped", tone: "default" as const },
  { value: "delivered", label: "Delivered", tone: "success" as const },
  { value: "cancelled", label: "Cancelled", tone: "danger" as const },
];

function getStatusTone(status: string): "warn" | "success" | "danger" | "default" | "info" {
  const choice = STATUS_CHOICES.find((c) => c.value === status);
  return choice ? choice.tone : "default";
}

function getStatusLabel(status: string): string {
  const choice = STATUS_CHOICES.find((c) => c.value === status);
  return choice ? choice.label : status;
}

export default function OrdersPage() {
  const modal = useModal<Order>();

  // Filters, search, and page state
  const [filter, setFilter] = useState("All");
  const [orderType, setOrderType] = useState<"all" | "pos" | "online">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Load orders using useOrders react-query hook
  const {
    data: paginatedData,
    isLoading,
    error: loadError,
  } = useOrders({
    status: filter !== "All" ? filter : undefined,
    is_pos_order: orderType === "pos" ? true : orderType === "online" ? false : undefined,
    search: searchQuery || undefined,
    page: page,
  });

  const orders = paginatedData?.results ?? [];
  const count = paginatedData?.count ?? 0;
  const totalPages = paginatedData?.total_pages ?? 1;

  const error = loadError ? (loadError as Error).message : null;

  return (
    <div className="space-y-5">
      <PageHead title="Orders" subtitle={`${count} total orders`} />

      {/* Filters & Actions Bar */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="flex items-center bg-cream border border-border rounded-full px-4 py-1.5 w-full md:max-w-xs shrink-0">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by order ID or name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="ml-2 flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Order Type Toggle */}
          <div className="bg-cream border border-border rounded-xl p-1 flex gap-1 text-[11.5px] font-bold">
            <button
              onClick={() => {
                setOrderType("all");
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                orderType === "all"
                  ? "bg-white text-zinc-950 border border-zinc-200 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setOrderType("pos");
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                orderType === "pos"
                  ? "bg-white text-zinc-950 border border-zinc-200 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              POS
            </button>
            <button
              onClick={() => {
                setOrderType("online");
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                orderType === "online"
                  ? "bg-white text-zinc-950 border border-zinc-200 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Online
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
          <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="mt-1 text-red-700/95">{error}</p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-border rounded-xl">
          <Loader2 className="animate-spin text-primary" size={28} />
          <p className="text-[13px] text-muted-foreground font-medium">Loading orders from backend…</p>
        </div>
      ) : (
        <div className="space-y-4">
          <OrderTable
            orders={orders}
            onRowClick={modal.openWith}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3">
              <div className="text-[12px] text-muted-foreground">
                Showing page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-cream hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer border"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-cream hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer border"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SlideOver detail view */}
      <SlideOver open={modal.open} onClose={modal.close} title={`Order: ${modal.item?.order_id ?? ""}`}>
        {modal.item && (
          <OrderDetailView
            orderId={modal.item.order_id}
            onClose={modal.close}
          />
        )}
      </SlideOver>
    </div>
  );
}
