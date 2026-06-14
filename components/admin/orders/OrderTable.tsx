"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { Table } from "@/components/admin/ui";
import { useUpdateOrder } from "@/lib/hooks/useOrders";
import type { Order } from "@/lib/types/order";
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

// ─── Portal dropdown position hook ───────────────────────────────────────────
interface DropdownPos {
  top: number;
  left: number;
  minWidth: number;
}

function usePortalPosition(
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  isOpen: boolean,
  dropdownHeight: number
): DropdownPos | null {
  const [pos, setPos] = useState<DropdownPos | null>(null);

  const calculate = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight + 8;

    setPos({
      top: openUp
        ? rect.top + window.scrollY - dropdownHeight - 4
        : rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 144, // align right edge of dropdown to right edge of button
      minWidth: rect.width,
    });
  }, [buttonRef, dropdownHeight]);

  useEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    calculate();
    window.addEventListener("scroll", calculate, true);
    window.addEventListener("resize", calculate);
    return () => {
      window.removeEventListener("scroll", calculate, true);
      window.removeEventListener("resize", calculate);
    };
  }, [isOpen, calculate]);

  return pos;
}

// ─── Status Dropdown ─────────────────────────────────────────────────────────
interface StatusDropdownProps {
  order: Order;
  onUpdateStatus: (newStatus: string) => Promise<void>;
  isPending: boolean;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

function StatusDropdown({ order, onUpdateStatus, isPending, isOpen, onToggle }: StatusDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pos = usePortalPosition(buttonRef, isOpen, 220);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        onToggle(false);
      }
    };
    // slight delay so the current click that opened it doesn't immediately close it
    const timer = setTimeout(() => window.addEventListener("mousedown", handleOutsideClick), 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onToggle]);

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

  const dropdownContent = pos
    ? createPortal(
        <div
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            minWidth: 144,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-36 bg-white border border-zinc-200 rounded-xl shadow-2xl py-1 overflow-hidden animate-in fade-in duration-100">
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
                    onToggle(false);
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
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        disabled={isPending}
        onClick={() => onToggle(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer outline-none transition-all ${bgClass}`}
      >
        <span>{getStatusLabel(currentStatus)}</span>
        <ChevronDown size={11} className="opacity-70 shrink-0" />
      </button>
      {dropdownContent}
    </div>
  );
}

// ─── Payment Status Dropdown ──────────────────────────────────────────────────
interface PaymentStatusDropdownProps {
  order: Order;
  onUpdatePaymentStatus: (newPaidStatus: boolean) => Promise<void>;
  isPending: boolean;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

function PaymentStatusDropdown({ order, onUpdatePaymentStatus, isPending, isOpen, onToggle }: PaymentStatusDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pos = usePortalPosition(buttonRef, isOpen, 90);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        onToggle(false);
      }
    };
    const timer = setTimeout(() => window.addEventListener("mousedown", handleOutsideClick), 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onToggle]);

  const currentPaid = order.is_paid;
  const bgClass = currentPaid
    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200/60"
    : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200/60";

  const dropdownContent = pos
    ? createPortal(
        <div
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            minWidth: 128,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-32 bg-white border border-zinc-200 rounded-xl shadow-2xl py-1 overflow-hidden animate-in fade-in duration-100">
            <button
              type="button"
              onClick={async () => {
                onToggle(false);
                if (!currentPaid) {
                  await onUpdatePaymentStatus(true);
                }
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-[11.5px] font-bold hover:bg-zinc-50 transition-colors ${
                currentPaid ? "text-primary bg-zinc-50/50" : "text-zinc-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              <span>Paid</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                onToggle(false);
                if (currentPaid) {
                  await onUpdatePaymentStatus(false);
                }
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-[11.5px] font-bold hover:bg-zinc-50 transition-colors ${
                !currentPaid ? "text-primary bg-zinc-50/50" : "text-zinc-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Unpaid</span>
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        disabled={isPending}
        onClick={() => onToggle(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer outline-none transition-all ${bgClass}`}
      >
        <span>{currentPaid ? "Paid" : "Unpaid"}</span>
        <ChevronDown size={11} className="opacity-70 shrink-0" />
      </button>
      {dropdownContent}
    </div>
  );
}

// ─── Order Table ──────────────────────────────────────────────────────────────
interface OrderTableProps {
  orders: Order[];
  onRowClick: (order: Order) => void;
  hideCustomerInfo?: boolean;
}

export function OrderTable({ orders, onRowClick, hideCustomerInfo = false }: OrderTableProps) {
  const updateOrderMutation = useUpdateOrder();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const allColumns = [
    {
      key: "order_id",
      label: "Order #",
      render: (o: Order) => (
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
    ...(!hideCustomerInfo
      ? [
          { key: "full_name", label: "Customer" },
          { key: "phone_number", label: "Phone" },
        ]
      : []),
    {
      key: "total_amount",
      label: "Total",
      render: (o: Order) => `Rs ${Number(o.total_amount).toLocaleString()}`,
    },
    {
      key: "payment_method",
      label: "Payment",
      render: (o: Order) => (
        <span className="text-[12px]">
          {PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}
        </span>
      ),
    },
    {
      key: "is_paid",
      label: "Payment Status",
      render: (o: Order) => (
        <PaymentStatusDropdown
          order={o}
          isPending={updateOrderMutation.isPending}
          isOpen={openDropdownId === `payment-${o.order_id}`}
          onToggle={(open) => setOpenDropdownId(open ? `payment-${o.order_id}` : null)}
          onUpdatePaymentStatus={async (newPaidStatus) => {
            try {
              await updateOrderMutation.mutateAsync({
                orderId: o.order_id,
                input: { is_paid: newPaidStatus },
              });
              toast.success(`Order ${o.order_id} payment status updated to ${newPaidStatus ? "Paid" : "Unpaid"}`);
            } catch (err) {
              console.error("Failed to update payment status:", err);
              toast.error("Failed to update payment status");
            }
          }}
        />
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (o: Order) => (
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
      render: (o: Order) => (
        <StatusDropdown
          order={o}
          isPending={updateOrderMutation.isPending}
          isOpen={openDropdownId === `status-${o.order_id}`}
          onToggle={(open) => setOpenDropdownId(open ? `status-${o.order_id}` : null)}
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
  ];

  return (
    <Table
      rows={orders}
      onRowClick={onRowClick}
      columns={allColumns}
    />
  );
}
