"use client";

import { useEffect, useState } from "react";
import { Badge, Field, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";
import { useOrders, useOrderDetail, useUpdateOrder } from "@/lib/hooks/useOrders";
import type { Order, OrderDetail } from "@/lib/types/order";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle } from "lucide-react";

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

  // Fetch order details via useOrderDetail when a modal item is selected
  const {
    data: orderDetails,
    isLoading: isLoadingDetails,
  } = useOrderDetail(modal.item?.order_id || "");

  // Update order mutation
  const updateOrderMutation = useUpdateOrder();

  // Edit fields
  const [editStatus, setEditStatus] = useState("");
  const [editIsPaid, setEditIsPaid] = useState(false);
  const [editTrackingNumber, setEditTrackingNumber] = useState("");

  // Sync details when fetched
  useEffect(() => {
    if (orderDetails) {
      setEditStatus(orderDetails.status);
      setEditIsPaid(orderDetails.is_paid);
      setEditTrackingNumber(orderDetails.tracking_number || "");
    }
  }, [orderDetails]);

  // Save changes
  const handleSaveChanges = async () => {
    if (!orderDetails) return;
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderDetails.order_id,
        input: {
          status: editStatus,
          is_paid: editIsPaid,
          tracking_number: editTrackingNumber.trim() || null,
        },
      });
      toast.success("Order updated successfully!");
      modal.close();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save changes.");
    }
  };

  const error = loadError ? (loadError as Error).message : null;
  const isSaving = updateOrderMutation.isPending;

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
                  {o.order_id.substring(0, 8)}...
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
      <SlideOver open={modal.open} onClose={modal.close} title={`Order: ${modal.item?.order_id.substring(0, 8) ?? ""}...`}>
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="text-[13px] text-muted-foreground">Fetching details from backend…</p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <Field label="Customer"><p className="font-medium">{orderDetails.full_name}</p></Field>
              <Field label="Phone"><p className="font-medium">{orderDetails.phone_number}</p></Field>
              {orderDetails.email && (
                <Field label="Email"><p className="font-medium truncate">{orderDetails.email}</p></Field>
              )}
              <Field label="Nearest Landmark / City"><p className="font-medium">{orderDetails.nearest_landmark || "N/A"}</p></Field>
              <div className="col-span-2">
                <Field label="Shipping Address"><p className="font-medium">{orderDetails.shipping_address}</p></Field>
              </div>
              <Field label="Payment Method">
                <p className="font-medium">{PAYMENT_METHOD_LABELS[orderDetails.payment_method] || orderDetails.payment_method}</p>
              </Field>
              <Field label="Payment Status">
                <Badge tone={orderDetails.is_paid ? "success" : "warn"}>
                  {orderDetails.is_paid ? "Paid" : "Unpaid"}
                </Badge>
              </Field>
              {orderDetails.note && (
                <div className="col-span-2 bg-zinc-50 border rounded-xl p-3">
                  <Field label="Notes"><p className="text-zinc-600 leading-relaxed italic">"{orderDetails.note}"</p></Field>
                </div>
              )}
            </div>

            {/* Line items list */}
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                Items ({orderDetails.items.length})
              </p>
              <ul className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-white">
                {orderDetails.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3 text-[13px]">
                    <img
                      src={it.product_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100"}
                      alt={it.product_name}
                      className="w-10 h-10 rounded-lg object-cover border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{it.product_name || `Product #${it.product}`}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Rs {Number(it.price).toLocaleString()} each
                      </p>
                    </div>
                    <span className="text-muted-foreground">× {it.quantity}</span>
                    <span className="font-semibold w-24 text-right">
                      Rs {(it.quantity * Number(it.price)).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-baseline mt-4 border-t pt-3 text-[14px]">
                <span className="text-zinc-500 font-medium">Discount:</span>
                <span className="font-semibold text-rose-600">-Rs {Number(orderDetails.discount_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline mt-2 text-[15px] font-bold">
                <span>Total Amount:</span>
                <span className="text-lg text-primary">Rs {Number(orderDetails.total_amount).toLocaleString()}</span>
              </div>
            </div>

            {/* Update controls */}
            <div className="border-t border-border pt-5 space-y-4">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Update Order</h4>
              
              <Field label="Status">
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-border bg-white rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {STATUS_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsPaid"
                  checked={editIsPaid}
                  onChange={(e) => setEditIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-zinc-300 focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="editIsPaid" className="text-[13px] font-medium text-zinc-700 cursor-pointer select-none">
                  Mark as Paid
                </label>
              </div>

              <Field label="Tracking Number">
                <input
                  type="text"
                  placeholder="e.g. TRK12345678"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                />
              </Field>

              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full bg-primary text-white rounded-full py-2.5 text-[13px] font-medium hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
