"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ClipboardList, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function TrackOrderSearchPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();

    if (!trimmed) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    router.push(`/track/${trimmed}`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-zinc-50/50 py-16 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Title & Icon Header */}
        <div className="text-center space-y-2.5">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ClipboardList size={22} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-950">Track Your Order</h1>
          <p className="text-[13px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Enter your Order ID to track the real-time preparation and delivery status of your farm-fresh items.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="order-id-input" className="text-[12px] font-semibold text-zinc-700">
              Order ID
            </label>
            <div className="relative flex items-center bg-cream border border-border rounded-xl px-4 py-3 shadow-inner">
              <Search size={16} className="text-zinc-400 shrink-0" />
              <input
                id="order-id-input"
                type="text"
                placeholder="e.g. KB-X9R2A"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="ml-2.5 flex-1 bg-transparent outline-none text-[14px] font-mono font-medium text-zinc-800 placeholder-zinc-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-full py-3 text-[14px] font-semibold hover:opacity-95 shadow-lg shadow-primary/10 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            Track Order
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex gap-3 text-left">
          <HelpCircle className="text-zinc-500 shrink-0 mt-0.5" size={16} />
          <div className="space-y-1 text-[11px] text-zinc-600 leading-relaxed">
            <p className="font-bold text-zinc-800">How to find your Order ID?</p>
            <p>
              Your Order ID is a 8-character code (starting with <strong className="font-semibold text-zinc-700">KB-</strong>) given to you on the success page after placing your order, or sent via email.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
