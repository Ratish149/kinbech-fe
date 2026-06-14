"use client";

import { ShoppingBag, History } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import POSPaymentModal from "@/components/admin/pos/POSPaymentModal";
import POSHeldOrdersModal, { HeldOrder } from "@/components/admin/pos/POSHeldOrdersModal";
import POSOrdersTab from "@/components/admin/pos/POSOrdersTab";
import POSProductsTab from "@/components/admin/pos/POSProductsTab";
import POSCartSidebar from "@/components/admin/pos/POSCartSidebar";
import { useCreateOrder } from "@/lib/hooks/useOrders";
import type { UserProfile } from "@/lib/types/auth";
import type { OrderInput } from "@/lib/types/order";
import { SlideOver } from "@/components/admin/ui";
import { OrderDetailView } from "@/components/admin/OrderDetailView";

const paymentMethodMap: Record<string, string> = {
  cash: "COD",
  esewa: "Esewa",
  khalti: "Khalti",
  fonepay: "PhonePay",
  qr: "PhonePay",
};


type CartLine = { p: Product; q: number };

export default function POSPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saleComplete, setSaleComplete] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<string>("0");
  const [vat, setVat] = useState<string>("0");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [selectedReceiptOrderId, setSelectedReceiptOrderId] = useState<string | null>(null);
  const [selectedDetailOrderId, setSelectedDetailOrderId] = useState<string | null>(null);

  const createOrderMutation = useCreateOrder();

  // Load held orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kinbech_held_orders");
      if (stored) {
        setHeldOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load held orders:", e);
    }
  }, []);

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    const newHeldOrder: HeldOrder = {
      id: Date.now().toString(),
      customer: selectedCustomer,
      cart,
      discount,
      vat,
      timestamp: Date.now(),
      total,
    };
    const updated = [newHeldOrder, ...heldOrders];
    setHeldOrders(updated);
    try {
      localStorage.setItem("kinbech_held_orders", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save held orders:", e);
    }
    handleResetPOS();
  };

  const handleResumeOrder = (order: HeldOrder) => {
    setCart(order.cart);
    setSelectedCustomer(order.customer);
    setDiscount(order.discount);
    setVat(order.vat);
    
    const updated = heldOrders.filter((o) => o.id !== order.id);
    setHeldOrders(updated);
    try {
      localStorage.setItem("kinbech_held_orders", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save held orders:", e);
    }
    setIsHeldModalOpen(false);
  };

  const handleDeleteHeldOrder = (id: string) => {
    const updated = heldOrders.filter((o) => o.id !== id);
    setHeldOrders(updated);
    try {
      localStorage.setItem("kinbech_held_orders", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save held orders:", e);
    }
  };

  // Old tab order search logic removed

  // Products/Categories fetching logic separated to POSProductsTab component

  const subtotal = cart.reduce((s, l) => s + l.p.price * l.q, 0);
  const discountVal = Number(discount) || 0;
  const vatVal = Number(vat) || 0;
  const total = Math.max(0, Math.round((subtotal - discountVal) * (1 + vatVal / 100)));

  const add = (p: Product) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.p.id === p.id);
      if (i >= 0) {
        const n = [...c];
        n[i] = { ...n[i], q: n[i].q + 1 };
        return n;
      }
      return [...c, { p, q: 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setCart((c) =>
      c.map((l) => (l.p.id === id ? { ...l, q: Math.max(1, qty) } : l))
    );

  const rm = (id: string) => setCart((c) => c.filter((l) => l.p.id !== id));

  const handleCharge = () => {
    if (cart.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const handleConfirmOrder = async (orderInput: OrderInput) => {
    setOrderError(null);
    try {
      const placed = await createOrderMutation.mutateAsync(orderInput);
      return placed;
    } catch (err: any) {
      console.error("Failed to place POS order:", err);
      setOrderError(err.message || "Failed to place order.");
      throw err;
    }
  };

  const handleResetPOS = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount("0");
    setVat("0");
    setOrderError(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 -m-6 h-[calc(100vh-3.5rem)] print:hidden">
      {/* Product / Orders area */}
      <div className="p-6 overflow-auto flex flex-col">
        {/* Tab switcher */}
        <div className="flex items-center gap-3 border-b border-zinc-150 pb-3 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "products"
                ? "bg-primary text-white shadow-sm shadow-primary/10"
                : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <ShoppingBag size={14} />
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-sm shadow-primary/10"
                : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <History size={14} />
            POS Orders
          </button>
        </div>

        {activeTab === "orders" ? (
          <POSOrdersTab
            onShowReceipt={setSelectedReceiptOrderId}
            onShowDetails={setSelectedDetailOrderId}
          />
        ) : (
          <POSProductsTab onAddToCart={add} />
        )}
      </div>

      <POSCartSidebar
        cart={cart}
        onSetQty={setQty}
        onRemove={rm}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        discount={discount}
        onSetDiscount={setDiscount}
        vat={vat}
        onSetVat={setVat}
        heldOrdersCount={heldOrders.length}
        onOpenHeldOrders={() => setIsHeldModalOpen(true)}
        onHold={handleHoldOrder}
        onPay={handleCharge}
        orderError={orderError}
        saleComplete={saleComplete}
      />
    </div>

    {/* Payment Confirmation Dialog / Modal */}
    <POSPaymentModal
      isOpen={isPaymentModalOpen}
      onClose={() => setIsPaymentModalOpen(false)}
      total={total}
      discount={Number(discount) || 0}
      vat={Number(vat) || 0}
      cart={cart}
      selectedCustomer={selectedCustomer}
      onConfirm={handleConfirmOrder}
      isPending={createOrderMutation.isPending}
      orderError={orderError}
      onResetPOS={handleResetPOS}
    />

    <POSHeldOrdersModal
      isOpen={isHeldModalOpen}
      onClose={() => setIsHeldModalOpen(false)}
      heldOrders={heldOrders}
      onResume={handleResumeOrder}
      onDelete={handleDeleteHeldOrder}
    />


    <SlideOver
      open={!!selectedDetailOrderId}
      onClose={() => setSelectedDetailOrderId(null)}
      title={`Order Details: ${selectedDetailOrderId ?? ""}`}
    >
      {selectedDetailOrderId && (
        <OrderDetailView
          orderId={selectedDetailOrderId}
          onClose={() => setSelectedDetailOrderId(null)}
        />
      )}
    </SlideOver>
  </>
  );
}
