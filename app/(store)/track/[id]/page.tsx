"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOrderDetail } from "@/lib/hooks/useOrders";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
  Loader2,
  Search,
} from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STEPS = [
  { status: "pending", label: "Order Placed", desc: "We have received your order", icon: Clock },
  { status: "processing", label: "Processing", desc: "Your order is being prepared", icon: Package },
  { status: "shipped", label: "Shipped", desc: "Your order is out for delivery", icon: Truck },
  { status: "delivered", label: "Delivered", desc: "Order delivered to your doorstep", icon: CheckCircle2 },
];

export default function TrackOrderPage({ params }: PageProps) {
  const { id: orderId } = use(params);
  const router = useRouter();
  const [retryId, setRetryId] = useState("");

  const {
    data: order,
    isLoading,
    error,
  } = useOrderDetail(orderId);

  const handleRetryTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (retryId.trim()) {
      router.push(`/track/${retryId.trim()}`);
      setRetryId("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-[14px] text-muted-foreground font-medium">Fetching order status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-zinc-50/50 py-16 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle size={22} />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-zinc-950">Order Not Found</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
              We couldn't find an order with ID <span className="font-mono font-semibold text-zinc-800">"{orderId}"</span>. Please check for typos or try another ID below.
            </p>
          </div>

          {/* Inline Retry Search Form */}
          <form onSubmit={handleRetryTrack} className="space-y-3">
            <div className="relative flex items-center bg-cream border border-border rounded-xl px-4 py-2.5 shadow-inner">
              <Search size={15} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter correct Order ID..."
                value={retryId}
                onChange={(e) => setRetryId(e.target.value)}
                className="ml-2 flex-1 bg-transparent outline-none text-[13px] font-mono font-semibold text-zinc-800 placeholder-zinc-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-full py-2.5 text-[13px] font-semibold hover:opacity-95 shadow-lg shadow-primary/5 transition cursor-pointer"
            >
              Track Order
            </button>
          </form>

          <div className="pt-2 border-t">
            <Link
              href="/"
              className="text-[13px] text-primary hover:underline font-semibold"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STEPS.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === "cancelled";

  // Map payment method backend values to client friendly names
  const paymentMethodLabels: Record<string, string> = {
    COD: "Cash on Delivery",
    Esewa: "eSewa Wallet",
    Khalti: "Khalti Wallet",
    PhonePay: "PhonePay QR Scan",
  };

  const isOnlinePayment = order.payment_method !== "COD";

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12">
      <div className="container-x max-w-4xl space-y-8">
        
        {/* Top bar back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/product"
            className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-zinc-900 transition font-medium"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
          <span className="text-[12px] bg-zinc-100 text-zinc-600 font-mono px-3 py-1 rounded-full border">
            ID: {order.order_id}
          </span>
        </div>

        {/* Header Summary Box */}
        <div className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
          isCancelled ? "border-rose-100 bg-gradient-to-br from-white to-rose-50/10" : "border-border"
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
                {isCancelled ? "Order Cancelled" : "Thank you for your order!"}
              </h1>
              {isCancelled && (
                <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Cancelled
                </span>
              )}
            </div>
            <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span>Your order</span>
              <span className="font-mono text-zinc-800 bg-zinc-50 border px-2 py-0.5 rounded-lg text-[12px]">
                #{order.order_id}
              </span>
              {isCancelled ? (
                <span>has been cancelled and is no longer active.</span>
              ) : (
                <>
                  <span>is currently</span>
                  <span className="capitalize text-primary">{order.status}</span>.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[13px] md:text-right text-zinc-600">
            <div className="flex md:justify-end items-center gap-2">
              <Calendar size={14} className="text-muted-foreground" />
              <span>
                Ordered on:{" "}
                <strong className="text-zinc-800 font-semibold">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
            <div className="flex md:justify-end items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isCancelled ? "bg-rose-400" : "bg-emerald-500 animate-pulse"}`} />
              <span>{isCancelled ? "Tracking Suspended" : "Real-time tracking enabled"}</span>
            </div>
          </div>
        </div>

        {/* Cancelled Info or Timeline Section */}
        {isCancelled ? (
          <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-6 sm:p-8 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="space-y-1">
              <h2 className="font-sans text-[14px] font-bold text-rose-950">Order Cancelled</h2>
              <p className="text-[13px] text-rose-800/80 leading-relaxed">
                This order was cancelled. If you believe this was an error or paid online, please contact our support.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
            <h2 className="font-sans text-[15px] text-zinc-800">
              Tracking Timeline
            </h2>
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx <= currentStatusIndex;
                const isActive = idx === currentStatusIndex;

                return (
                  <div key={step.status} className="relative flex md:flex-col items-start gap-4 md:gap-0">
                    
                    {/* Connecting line for desktop */}
                    {idx < STEPS.length - 1 && (
                      <div className="hidden md:block absolute left-7 top-7 w-[calc(100%-1.75rem)] h-[2px] bg-zinc-100 z-0">
                        <div
                          className={`h-full bg-primary transition-all duration-500 ${
                            idx < currentStatusIndex ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}

                    {/* Connecting line for mobile */}
                    {idx < STEPS.length - 1 && (
                      <div className="md:hidden absolute left-5 top-10 w-[2px] h-[calc(100%-1.25rem)] bg-zinc-100 z-0">
                        <div
                          className={`w-full bg-primary transition-all duration-500 ${
                            idx < currentStatusIndex ? "h-full" : "h-0"
                          }`}
                        />
                      </div>
                    )}

                    {/* Step Icon Badge */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                          : "bg-white border-zinc-200 text-zinc-400"
                      } ${isActive ? "ring-4 ring-primary/10" : ""}`}
                    >
                      <StepIcon size={16} />
                    </div>

                    {/* Step Labels */}
                    <div className="md:mt-4 space-y-1">
                      <p
                        className={`text-[14px] leading-none ${
                          isCompleted ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[12px] text-muted-foreground md:mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Two column grid details */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          
          {/* Order Summary & Items List */}
          <div className={`bg-white border rounded-3xl p-6 shadow-sm space-y-6 md:col-span-3 transition-colors duration-300 ${
            isCancelled ? "border-rose-100/50" : "border-border"
          }`}>
            <h2 className="font-sans text-[15px] text-zinc-800">
              Order Items
            </h2>

            <ul className="divide-y divide-zinc-100">
              {order.items.map((it) => (
                <li key={it.id} className="flex py-4 first:pt-0 last:pb-0 items-center gap-3 text-[13px]">
                  <img
                    src={it.product_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100"}
                    alt={it.product_name}
                    className="w-12 h-12 rounded-lg object-cover border shrink-0 opacity-80"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 truncate">{it.product_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Rs {Number(it.price).toLocaleString()} × {it.quantity}
                    </p>
                  </div>
                  <span className="text-zinc-900 shrink-0 text-right">
                    Rs {(it.quantity * Number(it.price)).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-100 pt-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-800">
                  Rs {(Number(order.total_amount) - (order.total_amount > 1500 ? 0 : 100) + Number(order.discount_amount)).toLocaleString()}
                </span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-Rs {Number(order.discount_amount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-zinc-800">
                  {order.total_amount > 1500 ? "Free" : "Rs 100"}
                </span>
              </div>
              <div className="flex justify-between text-[15px] pt-3 border-t border-zinc-100 text-zinc-950 items-baseline">
                <span>Total Amount:</span>
                <span className={`text-2xl font-black ${isCancelled ? "text-zinc-500 line-through decoration-rose-500 decoration-2" : "text-primary"}`}>
                  Rs {Number(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Customer & Shipping Details */}
            <div className={`bg-white border rounded-3xl p-6 shadow-sm space-y-5 transition-colors duration-300 ${
              isCancelled ? "border-rose-100/50" : "border-border"
            }`}>
              <h2 className="font-sans text-[15px] text-zinc-800">
                Delivery Details
              </h2>

              <div className="space-y-4 text-[13px]">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-zinc-800">{order.full_name}</p>
                    <p className="text-muted-foreground">{order.shipping_address}</p>
                    {order.nearest_landmark && (
                      <p className="text-[11px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md w-fit mt-1">
                        Landmark: {order.nearest_landmark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-zinc-100 pt-3">
                  <CreditCard size={16} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-semibold text-zinc-800">
                      {paymentMethodLabels[order.payment_method] || order.payment_method}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        isCancelled ? "bg-rose-400" : order.is_paid ? "bg-emerald-500" : "bg-amber-500"
                      }`} />
                      {isCancelled 
                        ? (order.is_paid ? "Refund Processing" : "Cancelled / Unpaid")
                        : order.is_paid ? "Paid successfully" : "Pay at delivery doorstep"
                      }
                    </p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="border-t border-zinc-100 pt-3 space-y-1">
                    <p className="text-[10px] text-muted-foreground">
                      Tracking Code
                    </p>
                    <p className="font-mono text-[12px] font-bold text-zinc-700 bg-zinc-50 border rounded-lg p-2">
                      {order.tracking_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-cream border border-border rounded-3xl p-6 shadow-sm text-center space-y-3">
              <h3 className="font-serif text-[16px] font-bold text-primary">Need assistance?</h3>
              <p className="text-[12px] text-zinc-600 leading-relaxed">
                If you have any questions regarding your delivery details, status, or issues, please contact our support team.
              </p>
              <div className="pt-1.5 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="w-full text-center bg-primary text-white rounded-full py-2 text-[12px] font-semibold hover:opacity-95 transition"
                >
                  Contact Support
                </Link>
                {isCancelled && (
                  <Link
                    href="/product"
                    className="w-full text-center bg-zinc-100 text-zinc-800 rounded-full py-2 text-[12px] font-semibold hover:bg-zinc-200 transition border border-zinc-200"
                  >
                    Place a New Order
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
