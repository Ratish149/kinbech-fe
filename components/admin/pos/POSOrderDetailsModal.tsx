"use client";

import React, { useEffect } from "react";
import { X, Printer, Loader2, Calendar, User, Phone, MapPin, Tag } from "lucide-react";
import { useOrderDetail } from "@/lib/hooks/useOrders";
import POSPrintReceiptTemplate from "./POSPrintReceiptTemplate";

interface POSOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

export default function POSOrderDetailsModal({
  isOpen,
  onClose,
  orderId,
}: POSOrderDetailsModalProps) {
  const { data: order, isLoading, error } = useOrderDetail(orderId || "", {
    enabled: !!orderId && isOpen,
  });

  const handlePrint = () => {
    if (!order) return;
    window.print();
  };

  if (!isOpen) return null;

  const subtotal = order?.items?.reduce((s, item) => s + Number(item.price) * item.quantity, 0) || 0;
  const discountVal = order ? Number(order.discount_amount) : 0;
  const totalVal = order ? Number(order.total_amount) : 0;
  
  // Calculate VAT based on subtotal, discount and total if not explicitly stored
  // total = (subtotal - discount) * (1 + vat/100)
  // total / (subtotal - discount) = 1 + vat/100
  // vat = (total / (subtotal - discount) - 1) * 100
  const baseAmount = subtotal - discountVal;
  const computedVatPercent = order && baseAmount > 0 
    ? Math.round(((totalVal / baseAmount) - 1) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200 print:p-0 print:bg-transparent">
      <div className="bg-white rounded-3xl w-full max-w-[550px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-zinc-950 font-serif">
              {isLoading ? "Loading Order..." : `Order Details: ${order?.order_id}`}
            </h2>
            <p className="text-zinc-500 text-[12px] mt-0.5">
              Review items and print invoice
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-muted-foreground text-[13px] mt-2">Fetching order details...</p>
            </div>
          ) : error || !order ? (
            <div className="text-center py-12 text-red-500">
              <p className="text-[14px] font-semibold">Failed to load order details</p>
              <p className="text-[12px] text-zinc-500 mt-1">{error?.message || "Unknown error"}</p>
            </div>
          ) : (
            <>
              {/* Customer Info Box */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 grid grid-cols-2 gap-4 text-[13px]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <User size={14} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-800">{order.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Phone size={14} className="text-zinc-400" />
                    <span>{order.phone_number || "Guest"}</span>
                  </div>
                  {order.email && (
                    <div className="text-zinc-500 pl-5 truncate">
                      {order.email}
                    </div>
                  )}
                </div>
                <div className="space-y-2 border-l border-zinc-200/60 pl-4">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Calendar size={14} className="text-zinc-400" />
                    <span>
                      {new Date(order.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Tag size={14} className="text-zinc-400" />
                    <span className="capitalize">{order.payment_method} · {order.is_paid ? "Paid" : "Unpaid"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <MapPin size={14} className="text-zinc-400" />
                    <span className="truncate">{order.shipping_address}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <h3 className="font-semibold text-[13px] text-zinc-800">Items Summary</h3>
                <div className="border border-zinc-150 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-zinc-50/70 text-zinc-500 font-semibold border-b border-zinc-100">
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-2 text-center">Qty</th>
                        <th className="py-2.5 px-2 text-right">Price</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {order.items?.map((item) => (
                        <tr key={item.id} className="text-zinc-800">
                          <td className="py-3 px-4 font-medium max-w-[200px] truncate">
                            {item.product_name}
                          </td>
                          <td className="py-3 px-2 text-center text-zinc-500">{item.quantity}</td>
                          <td className="py-3 px-2 text-right">Rs. {Number(item.price)}</td>
                          <td className="py-3 px-4 text-right font-medium">
                            Rs. {Number(item.price) * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-zinc-50/50 rounded-2xl p-4 border border-zinc-100 space-y-2 text-[13px]">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-800">Rs. {subtotal}</span>
                </div>
                {discountVal > 0 && (
                  <div className="flex justify-between text-zinc-500">
                    <span>Discount</span>
                    <span className="font-semibold text-red-600">- Rs. {discountVal}</span>
                  </div>
                )}
                {computedVatPercent > 0 && (
                  <div className="flex justify-between text-zinc-500">
                    <span>VAT ({computedVatPercent}%)</span>
                    <span className="font-semibold text-zinc-800">
                      Rs. {Math.round((subtotal - discountVal) * (computedVatPercent / 100))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline font-bold text-[15px] border-t border-zinc-200/50 pt-2 text-zinc-950">
                  <span>Total</span>
                  <span className="text-[18px] font-serif text-primary">Rs. {totalVal}</span>
                </div>
              </div>

              {order.note && (
                <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-100/50 text-[12px] text-zinc-600">
                  <span className="font-semibold text-zinc-700 block mb-0.5">Note:</span>
                  {order.note}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex gap-3 justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-[12px] font-semibold text-zinc-700 transition-all"
          >
            Close
          </button>
          {order && (
            <button
              onClick={handlePrint}
              className="bg-primary text-white hover:opacity-95 rounded-xl px-4 py-2 text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-primary/10"
            >
              <Printer size={14} />
              Print Receipt
            </button>
          )}
        </div>

      </div>

      {/* Hidden printable invoice */}
      {order && (
        <POSPrintReceiptTemplate
          order={order}
          subtotal={subtotal}
          discount={discountVal}
          vat={computedVatPercent}
          total={totalVal}
        />
      )}
    </div>
  );
}
