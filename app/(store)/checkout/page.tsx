"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { useCreateOrder } from "@/lib/hooks/useOrders";
import type { OrderInput } from "@/lib/types/order";
import { getCurrentUser } from "@/lib/auth";
import { useUserProfile } from "@/lib/hooks/useUser";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const createOrderMutation = useCreateOrder();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loggedIn = isClient && !!getCurrentUser();
  const { data: userProfile } = useUserProfile({ enabled: loggedIn });

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
  const [discountAmount] = useState(0);

  const deliveryFee = total > 1500 ? 0 : 100;
  const finalTotal = total - discountAmount + deliveryFee;

  // Autofill details once profile is loaded
  useEffect(() => {
    if (userProfile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || `${userProfile.first_name} ${userProfile.last_name}`.trim(),
        email: prev.email || userProfile.email || "",
        phone: prev.phone || userProfile.phone_number || "",
      }));
    }
  }, [userProfile]);

  const place = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.billingAddress.trim()) {
      toast.error("Incomplete Form", {
        description: "Please fill in all required fields to place your order.",
      });
      return;
    }

    // Map payment method to choices expected by backend ChoiceFilter
    const methodMap: Record<string, string> = {
      cash: "COD",
      esewa: "Esewa",
      khalti: "Khalti",
      fonepay: "PhonePay",
    };

    const payload: OrderInput = {
      full_name: form.name.trim(),
      phone_number: form.phone.trim(),
      email: form.email.trim() || null,
      shipping_address: form.shippingSameAsBilling
        ? form.billingAddress.trim()
        : (form.shippingAddress.trim() || form.billingAddress.trim()),
      nearest_landmark: form.city,
      total_amount: finalTotal,
      discount_amount: discountAmount,
      payment_method: methodMap[pay] || "COD",
      status: "pending",
      is_paid: false,
      note: form.orderNotes.trim() || null,
      items: items.map((it) => ({
        product: Number(it.product.id),
        quantity: it.qty,
        price: Number(it.product.price),
      })),
    };

    try {
      const orderData = await createOrderMutation.mutateAsync(payload);
      
      toast.success("Order Placed Successfully!", {
        description: `Your order ID is ${orderData.order_id}.`,
      });

      clear();
      
      // Navigate to tracking page
      router.push(`/track/${orderData.order_id}`);
    } catch (e: any) {
      toast.error("Error", {
        description: e.message || "Something went wrong while placing your order.",
      });
    }
  };

  const submitting = createOrderMutation.isPending;
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
      <div className="container-x py-12 flex-1 grid md:grid-cols-[1fr_380px] items-start gap-12">
        <div className="space-y-8">
          <CheckoutForm
            form={form}
            setForm={setForm}
            pay={pay}
            setPay={setPay}
            isFormValid={isFormValid}
            submitting={submitting}
            finalTotal={finalTotal}
            onPlaceOrder={place}
          />
        </div>

        {/* Order Summary Sidebar */}
        <CheckoutSummary
          items={items}
          total={total}
          discountAmount={discountAmount}
          deliveryFee={deliveryFee}
          finalTotal={finalTotal}
          totalWeight={totalWeight}
          deliveryToName={form.name}
          deliveryToCity={form.city}
        />
      </div>
    </div>
  );
}

