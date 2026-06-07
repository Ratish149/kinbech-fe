"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingBag, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Logo } from "@/components/Header";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();

  // Form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Kathmandu",
    billingAddress: "",
    shippingSameAsBilling: true,
    shippingAddress: "",
    orderNotes: "",
  });

  const [pay, setPay] = useState("cash");

  // Promo code states
  const [promo, setPromo] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");

  const deliveryFee = total > 1500 ? 0 : 100;
  const finalTotal = total - discountAmount + deliveryFee;

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "KINBECH10") {
      const discount = Math.round(total * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo("KINBECH10");
      toast.success("Promo code applied!", {
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast.error("Invalid promo code", {
        description: "Try KINBECH10 for 10% off.",
      });
    }
  };

  const place = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.billingAddress.trim()) {
      toast.error("Incomplete Form", {
        description: "Please fill in all required fields to place your order.",
      });
      return;
    }

    const id = "KM" + Math.floor(100000 + Math.random() * 900000);
    try {
      sessionStorage.setItem("km_order", JSON.stringify({ id, items, total: finalTotal, form, pay }));
    } catch (e) {
      console.error("Failed to store order in sessionStorage", e);
    }
    clear();
    router.push(`/track/${id}`);
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.billingAddress.trim() !== "" &&
    (form.shippingSameAsBilling || form.shippingAddress.trim() !== "");

  // Dynamic weight parser based on product unit
  const totalWeight = items.reduce((acc, it) => {
    const unit = (it.product.unit || "").toLowerCase();
    let itemWeight = 0;
    if (unit.includes("kg")) {
      const val = parseFloat(unit);
      itemWeight = isNaN(val) ? 1.0 : val;
    } else if (unit.includes("g")) {
      const val = parseFloat(unit);
      itemWeight = isNaN(val) ? 0.5 : val / 1000;
    }
    return acc + itemWeight * it.qty;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col justify-center items-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-8">
          Add some fresh produce or meat to your cart before proceeding to checkout.
        </p>
        <Link
          href="/product"
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 text-[14px] font-medium hover:opacity-90 transition cursor-pointer"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

      {/* Main Checkout Area */}
      <div className="container-x py-12 flex-1 grid md:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-8">
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

              {/* Row 3: City/District select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">City/District *</label>
                <div className="relative">
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[14px] outline-none transition bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 cursor-pointer appearance-none"
                  >
                    {["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
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
                onClick={place}
                disabled={!isFormValid}
                className="bg-primary text-primary-foreground rounded-full px-8 py-3.5 text-[14px] font-semibold hover:opacity-95 shadow-lg shadow-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                Place Order (Rs {finalTotal})
              </button>
            </div>

          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="border border-zinc-200 bg-white rounded-3xl p-6 h-fit md:sticky md:top-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-sans text-lg font-bold text-zinc-900">Order Summary</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">{items.length} items</p>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map((it) => {
              // Calculate discount percentage if oldPrice exists
              const discount =
                it.product.oldPrice && it.product.oldPrice > it.product.price
                  ? Math.round(((it.product.oldPrice - it.product.price) / it.product.oldPrice) * 100)
                  : 0;

              return (
                <div key={it.product.id} className="flex gap-3 text-[13px] items-start">
                  <div className="relative shrink-0">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-100"
                    />
                    {discount > 0 && (
                      <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-800 truncate">{it.product.name}</p>
                    {it.product.unit && (
                      <span className="inline-block bg-[#eff6ff] text-[#3b82f6] text-[10px] font-semibold px-2 py-0.5 rounded mt-1">
                        {it.product.unit}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                      <span>Qty: {it.qty}</span>
                      <span>·</span>
                      <span>Rs {it.product.price} each</span>
                      {it.product.oldPrice && (
                        <span className="line-through text-[10px]">Rs {it.product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-zinc-900 shrink-0 text-right">Rs {it.product.price * it.qty}</p>
                </div>
              );
            })}
          </div>

          {/* Promo Code Input */}
          <div className="border-t border-zinc-100 pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-700">
              <Tag size={14} className="text-zinc-500" />
              <span>Have a promo code?</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                disabled={appliedPromo !== ""}
                className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-[13px] outline-none bg-white focus:border-primary disabled:opacity-50 transition"
              />
              <button
                type="button"
                onClick={applyPromo}
                disabled={appliedPromo !== "" || promo.trim() === ""}
                className="bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl px-4 py-2 text-[13px] transition disabled:opacity-50 cursor-pointer"
              >
                {appliedPromo ? "Applied" : "Apply"}
              </button>
            </div>
            {appliedPromo && (
              <p className="text-[11px] text-emerald-600 font-semibold">
                Code {appliedPromo} applied successfully!
              </p>
            )}
          </div>

          <div className="border-t border-zinc-100 pt-4 space-y-2.5 text-[13px]">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-800">Rs {total}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount</span>
                <span>-Rs {discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Delivery</span>
              <span className="font-semibold text-zinc-800">
                {deliveryFee === 0 ? "Free" : `Rs ${deliveryFee}`}
              </span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-[10px] text-muted-foreground text-right">
                Free delivery on orders over Rs 1,500
              </p>
            )}
            <div className="flex justify-between font-bold text-[15px] pt-3 border-t border-zinc-100 text-zinc-900 items-baseline">
              <span>Total:</span>
              <span className="text-2xl font-black text-primary">Rs {finalTotal}</span>
            </div>
          </div>

          {/* Additional details (weight, destination) */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-2 text-[12px] text-zinc-600">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Weight:</span>
              <span className="font-semibold text-zinc-800">{totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery To:</span>
              <span className="font-semibold text-zinc-800">{form.name ? `${form.city} (${form.name})` : "Not selected"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
