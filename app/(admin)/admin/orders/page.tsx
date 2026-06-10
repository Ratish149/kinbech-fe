"use client";

import { useState } from "react";
import { Badge, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";
import { useOrders } from "@/lib/hooks/useOrders";
import type { Order } from "@/lib/types/order";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { OrderDetailView } from "@/components/admin/OrderDetailView";

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

export default function OrdersPage() {
  const modal = useModal<Order>();

  // Filters, search state
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load orders using useOrders react-query hook
  const {
    data: orders = [],
    isLoading,
    error: loadError,
  } = useOrders({
    status: filter !== "All" ? filter : undefined,
    search: searchQuery || undefined,
  });

  const error = loadError ? (loadError as Error).message : null;

  return (
    <div className="space-y-5">
      <PageHead title="Orders" subtitle={`${orders.length} orders total`} />

      {/* Search and filter controls */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="flex items-center bg-cream border border-border rounded-full px-4 py-1.5 w-full sm:max-w-xs">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order #, Name or Phone..."
            className="ml-2 flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto max-w-full pb-1">
          {["All", ...STATUS_CHOICES.map((c) => c.value)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === s
                  ? "bg-primary text-white"
                  : "bg-cream text-foreground hover:bg-muted"
              }`}
            >
              {s === "All" ? "All Statuses" : getStatusLabel(s)}
            </button>
          ))}
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
        <Table
          rows={orders}
          onRowClick={modal.openWith}
          columns={[
            {
              key: "order_id",
              label: "Order #",
              render: (o) => (
                <span className="font-mono text-[11px] font-semibold text-zinc-600">
                  {o.order_id}
                </span>
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
              render: (o) => <Badge tone={getStatusTone(o.status)}>{getStatusLabel(o.status)}</Badge>,
            },
          ]}
        />
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
