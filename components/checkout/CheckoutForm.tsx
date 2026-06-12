"use client";

import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  form: {
    name: string;
    email: string;
    phone: string;
    city: string;
    billingAddress: string;
    shippingSameAsBilling: boolean;
    shippingAddress: string;
    orderNotes: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      city: string;
      billingAddress: string;
      shippingSameAsBilling: boolean;
      shippingAddress: string;
      orderNotes: string;
    }>
  >;
  pay: string;
  setPay: (method: string) => void;
  isFormValid: boolean;
  submitting: boolean;
  finalTotal: number;
  onPlaceOrder: () => void;
}

export default function CheckoutForm({
  form,
  setForm,
  pay,
  setPay,
  isFormValid,
  submitting,
  finalTotal,
  onPlaceOrder,
}: CheckoutFormProps) {
  return (
    <div className="border border-zinc-200 bg-white rounded-3xl p-8 shadow-sm space-y-8">
      {/* Section 1: Shipping Information */}
      <div className="space-y-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-zinc-900">Shipping Information</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Please fill in your details to complete your order</p>
        </div>

        {/* Row 1: Full Name and Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
        </div>

        {/* Row 2: Phone Number */}
        <div className="w-full">
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
        </div>

        {/* Row 5: Billing Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-700">Billing Address</label>
          <textarea
            value={form.billingAddress}
            onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
            placeholder="Enter your billing address"
            rows={3}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
        </div>

        {/* Checkbox: Shipping address same as billing */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="shippingSameAsBilling"
            checked={form.shippingSameAsBilling}
            onChange={(e) => setForm({ ...form, shippingSameAsBilling: e.target.checked })}
            className="w-4 h-4 rounded text-primary border-zinc-300 focus:ring-primary accent-primary cursor-pointer"
          />
          <label htmlFor="shippingSameAsBilling" className="text-[13px] font-medium text-zinc-700 cursor-pointer select-none">
            Shipping address same as billing address
          </label>
        </div>

        {/* Conditional Shipping Address Textarea */}
        {!form.shippingSameAsBilling && (
          <div className="flex flex-col gap-1.5 animate-fadeIn">
            <label className="text-[13px] font-semibold text-zinc-700">Shipping Address</label>
            <textarea
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              placeholder="Enter your shipping address"
              rows={3}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
            />
          </div>
        )}

        {/* Row 6: Order Notes (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-700">Order Notes (Optional)</label>
          <textarea
            value={form.orderNotes}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setForm({ ...form, orderNotes: e.target.value });
              }
            }}
            placeholder="Any special instructions for your order..."
            rows={3}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
          <p className="text-[11px] text-muted-foreground text-right mt-1">
            {form.orderNotes.length}/500 characters
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Section 2: Payment Method */}
      <div className="space-y-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-zinc-900">Payment Method</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Select your preferred payment option</p>
        </div>

        <div className="grid gap-3">
          {[
            { id: "cash", label: "Cash On Delivery", desc: "Pay cash at your doorstep", badgeBg: "bg-teal-600", badgeText: "COD", icon: "💵" },
            { id: "esewa", label: "eSewa Wallet", desc: "Pay via eSewa digital wallet", badgeBg: "bg-[#60bb46]", badgeText: "eSewa", icon: "🟢" },
            { id: "khalti", label: "Khalti Wallet", desc: "Pay via Khalti digital wallet", badgeBg: "bg-[#5c2d91]", badgeText: "Khalti", icon: "🟣" },
            { id: "fonepay", label: "Fonepay QR", desc: "Scan QR code to pay", badgeBg: "bg-[#e21a22]", badgeText: "Fonepay", icon: "🔴" },
          ].map((p) => {
            const isSelected = pay === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPay(p.id)}
                className={`w-full flex items-center justify-between p-4 border rounded-2xl text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/[0.01] ring-1 ring-primary shadow-sm"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-zinc-900">{p.label}</span>
                      <span className={`text-[9px] font-bold tracking-wider uppercase text-white px-1.5 py-0.5 rounded ${p.badgeBg}`}>
                        {p.badgeText}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-primary bg-primary text-white" : "border-zinc-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Order Button */}
      <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[13px] text-muted-foreground max-w-xs">
          By placing this order, you agree to our terms of service and delivery guidelines.
        </p>
        <button
          onClick={onPlaceOrder}
          disabled={!isFormValid || submitting}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3.5 text-[14px] font-semibold hover:opacity-95 shadow-lg shadow-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center gap-2 justify-center"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing Order...
            </>
          ) : (
            `Place Order (Rs ${finalTotal})`
          )}
        </button>
      </div>
    </div>
  );
}
