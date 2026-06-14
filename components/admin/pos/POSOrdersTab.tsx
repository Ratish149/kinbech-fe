"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, Printer } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";

interface POSOrdersTabProps {
  onShowReceipt: (orderId: string) => void;
  onShowDetails: (orderId: string) => void;
}

export default function POSOrdersTab({ onShowReceipt, onShowDetails }: POSOrdersTabProps) {
  const [orderSearch, setOrderSearch] = useState("");
  const [debouncedOrderSearch, setDebouncedOrderSearch] = useState("");

  // Debounce search input for orders
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrderSearch(orderSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [orderSearch]);

  const { data: posOrdersData, isLoading: isOrdersLoading } = useOrders({
    is_pos_order: true,
    search: debouncedOrderSearch || undefined,
    page_size: 30,
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search POS orders */}
      <div className="flex items-center bg-white border border-border rounded-full px-4 py-2 mb-4 shrink-0">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          placeholder="Search POS orders by ID, customer name or phone..."
          className="ml-2 flex-1 outline-none text-[14px]"
        />
      </div>

      {/* Orders list container */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isOrdersLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-muted-foreground text-[13px] mt-2">Loading POS orders...</p>
          </div>
        ) : !posOrdersData || posOrdersData.results.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-[14px] font-semibold">No POS orders found</p>
            <p className="text-[12px] mt-1 text-zinc-400">Orders placed via this POS screen will show up here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posOrdersData.results.map((order) => (
              <div
                key={order.id}
                onClick={() => onShowDetails(order.order_id)}
                className="bg-white border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 transition-all hover:shadow-sm cursor-pointer hover:bg-zinc-50/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[14px] text-zinc-900 font-serif">
                      {order.order_id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.status === "delivered"
                        ? "bg-green-50 text-green-700 border border-green-105"
                        : "bg-amber-50 text-amber-700 border border-amber-105"
                    }`}>
                      {order.status}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      order.is_paid
                        ? "bg-blue-50 text-blue-700 border border-blue-105"
                        : "bg-red-50 text-red-700 border border-red-105"
                    }`}>
                      {order.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <p className="text-[12.5px] font-medium text-zinc-800">
                    {order.full_name} {order.phone_number && `· ${order.phone_number}`}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {new Date(order.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-105">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Total Amount</p>
                    <p className="text-[15px] font-bold font-serif text-primary">Rs. {order.total_amount}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
