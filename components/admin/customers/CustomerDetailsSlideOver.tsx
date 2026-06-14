"use client";

import React from "react";
import { SlideOver, Badge, Field } from "@/components/admin/ui";
import type { Customer } from "@/lib/types/customer";
import { useOrders } from "@/lib/hooks/useOrders";
import { Loader2, Calendar, Mail, Phone, ShoppingBag, DollarSign } from "lucide-react";

interface CustomerDetailsSlideOverProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsSlideOver({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsSlideOverProps) {
  const { data: ordersData, isLoading: isLoadingOrders } = useOrders(
    {
      user: customer?.id,
      page_size: 15,
    },
    {
      enabled: isOpen && !!customer?.id,
    }
  );

  if (!customer) return null;

  const initials = `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase() || customer.username?.[0]?.toUpperCase() || "C";
  const fullName = `${customer.first_name} ${customer.last_name}`.trim() || customer.username;

  return (
    <SlideOver open={isOpen} onClose={onClose} title="Customer Profile">
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 bg-zinc-50/50 p-4 border border-zinc-150 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary text-lg font-bold flex items-center justify-center shrink-0 border border-primary/20">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-zinc-950 text-base truncate">{fullName}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Member since {new Date(customer.date_joined).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contact Details</h4>
          <div className="bg-white border border-zinc-150 rounded-2xl p-4 space-y-3.5 text-[13px]">
            <div className="flex items-center gap-3 text-zinc-800">
              <Phone size={14} className="text-zinc-400 shrink-0" />
              <span className="font-mono">{customer.phone_number || "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-800">
              <Mail size={14} className="text-zinc-400 shrink-0" />
              <span className="truncate">{customer.email || "No email available"}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-800">
              <Calendar size={14} className="text-zinc-400 shrink-0" />
              <span>
                Joined on {new Date(customer.date_joined).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Shopping Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <ShoppingBag size={16} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Total Orders</p>
                <p className="text-base font-bold text-zinc-900 mt-0.5">{customer.total_orders}</p>
              </div>
            </div>
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                <DollarSign size={16} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Total Spent</p>
                <p className="text-base font-bold text-zinc-900 mt-0.5">Rs. {Number(customer.total_spent).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History list */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Purchase History</h4>
          {isLoadingOrders ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="animate-spin text-primary" size={24} />
              <p className="text-[12px] text-zinc-400 font-medium">Fetching orders history...</p>
            </div>
          ) : !ordersData || ordersData.results.length === 0 ? (
            <div className="bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl p-8 text-center text-zinc-400">
              <p className="text-[13px] font-medium">No purchases recorded yet</p>
              <p className="text-[11px] mt-0.5 text-zinc-400">Orders placed by this user will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[35vh] pr-1">
              {ordersData.results.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-zinc-150 rounded-2xl p-3 flex items-center justify-between text-[12.5px] hover:border-zinc-300 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-mono font-bold text-zinc-900">{ord.order_id}</p>
                    <p className="text-[11px] text-zinc-400">
                      {new Date(ord.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-primary">Rs. {Number(ord.total_amount).toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === "delivered"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : ord.status === "cancelled"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
}
