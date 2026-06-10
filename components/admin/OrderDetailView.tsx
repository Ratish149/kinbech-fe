"use client";

import { useEffect, useState, useRef } from "react";
import { Badge, Field } from "@/components/admin/ui";
import { useOrderDetail, useUpdateOrder } from "@/lib/hooks/useOrders";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type OrderDetailViewProps = {
  orderId: string;
  onSaveSuccess?: () => void;
  onClose?: () => void;
};

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

export function OrderDetailView({ orderId, onSaveSuccess, onClose }: OrderDetailViewProps) {
  const { data: orderDetails, isLoading, error } = useOrderDetail(orderId);
  const updateOrderMutation = useUpdateOrder();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Edit fields
  const [editStatus, setEditStatus] = useState("");
  const [editIsPaid, setEditIsPaid] = useState(false);
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
      if (onSaveSuccess) onSaveSuccess();
      if (onClose) onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save changes.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-[13px] text-muted-foreground">Fetching details from backend…</p>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="p-4 text-center text-red-500 text-[13px]">
        Failed to load order details. Please try again.
      </div>
    );
  }

  return (
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
          <div ref={dropdownRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setStatusOpen(!statusOpen)}
              className="w-full flex items-center justify-between border border-border bg-white rounded-lg px-3 py-2 text-[13px] outline-none text-left cursor-pointer transition hover:border-zinc-300"
            >
              <span>{STATUS_CHOICES.find((c) => c.value === editStatus)?.label || "Select Status"}</span>
              <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
            </button>

            {statusOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-[70] py-1 text-left overflow-hidden">
                {STATUS_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => {
                      setEditStatus(choice.value);
                      setStatusOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-cream transition-colors cursor-pointer ${
                      editStatus === choice.value ? "text-primary font-semibold bg-cream/30" : "text-foreground"
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          disabled={updateOrderMutation.isPending}
          className="w-full bg-primary text-white rounded-full py-2.5 text-[13px] font-medium hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {updateOrderMutation.isPending ? (
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
  );
}
