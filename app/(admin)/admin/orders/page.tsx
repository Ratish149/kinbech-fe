"use client";

import { useState, useEffect } from "react";
import { Badge, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";
import { useOrders, useUpdateOrder } from "@/lib/hooks/useOrders";
import type { Order } from "@/lib/types/order";
import { Loader2, Search, AlertTriangle, ChevronDown } from "lucide-react";
import { OrderDetailView } from "@/components/admin/OrderDetailView";
import { toast } from "sonner";

const STATUS_CHOICES = [
  { value: "pending", label: "Pending", tone: "warn" as const },
  { value: "processing", label: "Processing", tone: "info" as const },
  { value: "shipped", label: "Shipped", tone: "default" as const },
  { value: "delivered", label: "Delivered", tone: "success" as const },
  { value: "cancelled", label: "Cancelled", tone: "danger" as const },
];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  Esewa: "eSewa",
  Khalti: "Khalti",
  PhonePay: "Phonepay",
};

function getStatusTone(status: string): "warn" | "success" | "danger" | "default" | "info" {
  const choice = STATUS_CHOICES.find((c) => c.value === status);
  return choice ? choice.tone : "default";
}

function getStatusLabel(status: string): string {
  const choice = STATUS_CHOICES.find((c) => c.value === status);
  return choice ? choice.label : status;
}

interface StatusDropdownProps {
  order: Order;
  onUpdateStatus: (newStatus: string) => Promise<void>;
  isPending: boolean;
}

function StatusDropdown({ order, onUpdateStatus, isPending }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => setIsOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const currentStatus = order.status;
  const tone = getStatusTone(currentStatus);

  const toneBgClasses: Record<string, string> = {
    default: "bg-muted text-foreground hover:bg-zinc-200 border-zinc-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200/60",
    warn: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200/60",
    danger: "bg-red-100 text-red-600 hover:bg-red-200 border-red-200/60",
    info: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200/60",
  };

  const bgClass = toneBgClasses[tone] ?? toneBgClasses.default;

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer outline-none transition-all ${bgClass}`}
      >
        <span>{getStatusLabel(currentStatus)}</span>
        <ChevronDown size={11} className="opacity-70 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 z-40 w-36 bg-white border border-zinc-250 rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
          {STATUS_CHOICES.map((choice) => {
            const isSelected = choice.value === currentStatus;
            
            let dotColor = "bg-zinc-400";
            if (choice.value === "pending") dotColor = "bg-amber-500";
            else if (choice.value === "processing") dotColor = "bg-blue-500";
            else if (choice.value === "shipped") dotColor = "bg-zinc-500";
            else if (choice.value === "delivered") dotColor = "bg-green-500";
            else if (choice.value === "cancelled") dotColor = "bg-red-500";

            return (
              <button
                key={choice.value}
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  if (choice.value !== currentStatus) {
                    await onUpdateStatus(choice.value);
                  }
                }}
                className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-[11.5px] font-bold hover:bg-zinc-50 transition-colors ${
                  isSelected ? "text-primary bg-zinc-50/50" : "text-zinc-700"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                <span>{choice.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const modal = useModal<Order>();
  const updateOrderMutation = useUpdateOrder();

  // Filters, search, and page state
  const [filter, setFilter] = useState("All");
  const [orderType, setOrderType] = useState<"all" | "pos" | "online">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
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
      <PageHead title="Orders" subtitle={`${count} orders total`} />

      {/* Search and filter controls */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex items-center bg-cream border border-border rounded-full px-4 py-1.5 w-full lg:max-w-xs shrink-0">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search Order #, Name or Phone..."
            className="ml-2 flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>

        {/* Source / Type and Status Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full lg:w-auto justify-end">
          {/* Source / Type Filter */}
          <div className="flex gap-1 bg-zinc-50 p-0.5 rounded-xl border border-zinc-200/80 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => { setOrderType("all"); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                orderType === "all"
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/40"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All Channels
            </button>
            <button
              type="button"
              onClick={() => { setOrderType("pos"); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                orderType === "pos"
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/40"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              POS
            </button>
            <button
              type="button"
              onClick={() => { setOrderType("online"); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                orderType === "online"
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/40"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Online
            </button>
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-zinc-200 hidden md:block shrink-0" />

          {/* Status Filters */}
          <div className="flex gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 shrink-0">
            {["All", ...STATUS_CHOICES.map((c) => c.value)].map((s) => {
              const active = filter === s;
              const isAll = s === "All";
              const tone = isAll ? "default" : getStatusTone(s);
              
              let activeClass = "bg-zinc-900 text-white border-zinc-950";
              let dotColor = "bg-zinc-400";
              
              if (!isAll && active) {
                if (tone === "warn") {
                  activeClass = "bg-amber-50 text-amber-700 border-amber-200";
                  dotColor = "bg-amber-500";
                } else if (tone === "success") {
                  activeClass = "bg-green-50 text-green-700 border-green-200";
                  dotColor = "bg-green-500";
                } else if (tone === "danger") {
                  activeClass = "bg-red-50 text-red-700 border-red-200";
                  dotColor = "bg-red-500";
                } else if (tone === "info") {
                  activeClass = "bg-blue-50 text-blue-700 border-blue-200";
                  dotColor = "bg-blue-500";
                }
              } else if (isAll && active) {
                activeClass = "bg-zinc-100 text-zinc-900 border-zinc-300";
                dotColor = "bg-zinc-950";
              }
              
              if (!active) {
                if (s === "pending") dotColor = "bg-amber-400/60";
                else if (s === "processing") dotColor = "bg-blue-400/60";
                else if (s === "shipped") dotColor = "bg-zinc-400/60";
                else if (s === "delivered") dotColor = "bg-green-400/60";
                else if (s === "cancelled") dotColor = "bg-red-400/60";
                else dotColor = "bg-zinc-400/50";
              }

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleFilterChange(s)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[12px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? `${activeClass} shadow-xs`
                      : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-900 hover:bg-zinc-100/60"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                  {s === "All" ? "All Statuses" : getStatusLabel(s)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
          <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="mt-1 text-red-700/90">{error}</p>
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
          <Table
            rows={orders}
            onRowClick={modal.openWith}
            columns={[
              {
                key: "order_id",
                label: "Order #",
                render: (o) => (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] font-semibold text-zinc-600">
                      {o.order_id}
                    </span>
                    {o.is_pos_order ? (
                      <span className="inline-flex items-center w-fit text-[9px] font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded uppercase border border-zinc-200/50">
                        POS
                      </span>
                    ) : (
                      <span className="inline-flex items-center w-fit text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded uppercase border border-blue-100/50">
                        Online
                      </span>
                    )}
                  </div>
                ),
              },
              { key: "full_name", label: "Customer" },
              { key: "phone_number", label: "Phone" },
              { key: "total_amount", label: "Total", render: (o) => `Rs ${Number(o.total_amount).toLocaleString()}` },
              {
                key: "payment_method",
                label: "Payment",
                render: (o) => (
                  <span className="text-[12px]">
                    {PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}
                  </span>
                ),
              },
              {
                key: "created_at",
                label: "Date",
                render: (o) => (
                  <span className="text-muted-foreground text-[12px]">
                    {new Date(o.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (o) => (
                  <StatusDropdown
                    order={o}
                    isPending={updateOrderMutation.isPending}
                    onUpdateStatus={async (newStatus) => {
                      try {
                        await updateOrderMutation.mutateAsync({
                          orderId: o.order_id,
                          input: { status: newStatus },
                        });
                        toast.success(`Order ${o.order_id} status updated to ${getStatusLabel(newStatus)}`);
                      } catch (err) {
                        console.error("Failed to update status:", err);
                        toast.error("Failed to update order status");
                      }
                    }}
                  />
                ),
              },
            ]}
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
