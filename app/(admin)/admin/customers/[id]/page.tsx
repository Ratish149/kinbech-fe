"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useCustomerDetail } from "@/lib/hooks/useCustomers";
import { useOrders } from "@/lib/hooks/useOrders";
import { OrderDetailView } from "@/components/admin/OrderDetailView";
import {
  SlideOver,
  useModal,
  PageHead,
} from "@/components/admin/ui";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Coins,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import type { Order } from "@/lib/types/order";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CustomerProfilePage({ params }: PageProps) {
  const { id: customerId } = use(params);
  const orderModal = useModal<Order>();
  const [page, setPage] = useState(1);

  // Fetch customer details
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError,
  } = useCustomerDetail(customerId);

  // Fetch customer orders history
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrders(
    {
      user: Number(customerId),
      page: page,
      page_size: 10,
    },
    {
      enabled: !!customerId,
    }
  );

  const orders = ordersData?.results ?? [];
  const totalPages = ordersData?.total_pages ?? 1;

  if (isLoadingCustomer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-[13px] text-muted-foreground font-medium">
          Loading customer profile...
        </p>
      </div>
    );
  }

  if (customerError || !customer) {
    const errorMsg = customerError ? (customerError as Error).message : "Customer not found";
    return (
      <div className="space-y-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-zinc-950 transition font-medium"
        >
          <ArrowLeft size={13} />
          <span>Back to Customers</span>
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3 text-red-800 text-[13px]">
          <AlertTriangle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-950 text-[14px]">Profile Error</p>
            <p className="mt-1 text-red-700/95">{errorMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase() || customer.username?.[0]?.toUpperCase() || "C";
  const fullName = `${customer.first_name} ${customer.last_name}`.trim() || customer.username;

  return (
    <div className="space-y-6">
      {/* Top back button and Title */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="space-y-1">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-zinc-950 transition font-medium"
          >
            <ArrowLeft size={13} />
            <span>Back to Customers</span>
          </Link>
          <h1 className="text-2xl font-semibold font-serif text-zinc-900 mt-1">{fullName}</h1>
        </div>
        <span className="text-[11px] font-mono bg-muted text-zinc-500 px-2.5 py-1 rounded-full border border-border">
          ID: #{customer.id}
        </span>
      </div>

      {/* Main Grid: Customer Details & Info banner */}
      <div className="bg-white border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-50 text-zinc-700 text-lg font-bold flex items-center justify-center shrink-0 border border-border">
            {initials}
          </div>
          <div className="space-y-1 min-w-0">
            <h2 className="font-semibold text-[15px] text-zinc-950 truncate">{fullName}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
              {customer.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-zinc-400" />
                  {customer.email}
                </span>
              )}
              {customer.phone_number && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-zinc-400" />
                  <span className="font-mono">{customer.phone_number}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted-foreground border-t md:border-t-0 pt-4 md:pt-0 border-border">
          <Calendar size={13} className="text-zinc-400" />
          <span>
            Customer since {new Date(customer.date_joined).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Total Orders
            </p>
            <p className="text-2xl font-bold font-serif text-zinc-900 mt-1">
              {customer.total_orders}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-50 text-zinc-600 flex items-center justify-center shrink-0 border border-border">
            <ShoppingBag size={18} />
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Lifetime Spent
            </p>
            <p className="text-2xl font-bold font-serif text-primary mt-1">
              Rs. {Number(customer.total_spent).toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-50 text-zinc-600 flex items-center justify-center shrink-0 border border-border">
            <Coins size={18} />
          </div>
        </div>
      </div>

      {/* Past Orders Section */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif font-semibold text-lg text-zinc-900">
          Order History
        </h3>

        {isLoadingOrders ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 bg-white border border-border rounded-xl">
            <Loader2 className="animate-spin text-primary" size={24} />
            <p className="text-[12px] text-muted-foreground font-medium">Loading history...</p>
          </div>
        ) : ordersError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-[13px]">
            <p className="font-semibold">Failed to fetch order history</p>
            <p className="mt-1 text-red-700">{(ordersError as Error).message}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-xl p-10 text-center text-zinc-400">
            <p className="text-[13px] font-semibold">No orders recorded yet</p>
            <p className="text-[11px] mt-0.5">Purchases placed by this customer will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <OrderTable
              orders={orders}
              onRowClick={(row) => orderModal.openWith(row)}
              hideCustomerInfo={true}
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
      </div>

      {/* SlideOver detail view for clicked orders */}
      <SlideOver
        open={orderModal.open}
        onClose={orderModal.close}
        title={`Order: ${orderModal.item?.order_id ?? ""}`}
      >
        {orderModal.item && (
          <OrderDetailView
            orderId={orderModal.item.order_id}
            onClose={orderModal.close}
          />
        )}
      </SlideOver>
    </div>
  );
}
