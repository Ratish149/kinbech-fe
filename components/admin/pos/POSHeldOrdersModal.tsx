"use client";

import React from "react";
import { X, Play, Trash2, Calendar, ShoppingBag, User } from "lucide-react";
import type { UserProfile } from "@/lib/types/auth";
import type { Product } from "@/lib/products";

export type HeldCartLine = { p: Product; q: number };

export interface HeldOrder {
  id: string;
  customer: UserProfile | null;
  cart: HeldCartLine[];
  discount: string;
  vat: string;
  timestamp: number;
  total: number;
}

interface POSHeldOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  heldOrders: HeldOrder[];
  onResume: (order: HeldOrder) => void;
  onDelete: (id: string) => void;
}

export default function POSHeldOrdersModal({
  isOpen,
  onClose,
  heldOrders,
  onResume,
  onDelete,
}: POSHeldOrdersModalProps) {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[550px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-zinc-950 font-serif">Held Orders</h2>
            <p className="text-zinc-500 text-[12px] mt-0.5">
              Resume or manage orders currently kept on hold
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {heldOrders.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-[14px] font-semibold text-zinc-800">No held orders</h3>
              <p className="text-zinc-500 text-[12px] mt-1 max-w-[280px]">
                You can put orders on hold using the "Hold" button under current order summary.
              </p>
            </div>
          ) : (
            heldOrders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-100 hover:border-zinc-200 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Customer Row */}
                  <div className="flex items-center gap-1.5 text-zinc-800 font-semibold text-[13.5px]">
                    <User size={14} className="text-zinc-400 shrink-0" />
                    <span className="truncate">
                      {order.customer
                        ? `${order.customer.first_name} ${order.customer.last_name}`
                        : "Walk-in Customer"}
                    </span>
                    {order.customer?.phone_number && (
                      <span className="text-[11px] font-normal text-zinc-400 shrink-0">
                        ({order.customer.phone_number})
                      </span>
                    )}
                  </div>

                  {/* Timestamp & Items count */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-500 text-[11px]">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar size={12} className="text-zinc-400" />
                      {formatDate(order.timestamp)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:inline-block"></span>
                    <span className="truncate max-w-[250px]">
                      {order.cart.length} product(s): {order.cart.map(item => `${item.p.name} (x${item.q})`).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Right actions side */}
                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-200/50 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Total</p>
                    <p className="text-[16px] font-bold font-serif text-primary">Rs. {order.total}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDelete(order.id)}
                      className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                      title="Delete held order"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => onResume(order)}
                      className="bg-primary text-white hover:opacity-95 rounded-xl px-3.5 py-2 text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-primary/10"
                    >
                      <Play size={11} fill="currentColor" />
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-[12px] font-semibold text-zinc-700 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
