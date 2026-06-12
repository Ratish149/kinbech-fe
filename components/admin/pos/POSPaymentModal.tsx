"use client";

import React, { useState, useEffect } from "react";
import { X, Banknote, Smartphone, Columns, Printer, Check, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { UserProfile } from "@/lib/types/auth";
import type { OrderInput } from "@/lib/types/order";
import POSPrintReceiptTemplate from "./POSPrintReceiptTemplate";

interface POSPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  discount: number;
  vat: number;
  cart: { p: any; q: number }[];
  selectedCustomer: UserProfile | null;
  onConfirm: (orderInput: OrderInput) => Promise<any>;
  isPending: boolean;
  orderError: string | null;
  onResetPOS: () => void;
}

export default function POSPaymentModal({
  isOpen,
  onClose,
  total,
  discount,
  vat,
  cart,
  selectedCustomer,
  onConfirm,
  isPending,
  orderError,
  onResetPOS,
}: POSPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "online" | "split">("cash");
  const [cashTendered, setCashTendered] = useState<string>("0");
  const [cashPortion, setCashPortion] = useState<string>("0");
  const [onlinePortion, setOnlinePortion] = useState<string>("0");
  const [successOrder, setSuccessOrder] = useState<any>(null);

  // Helper to generate quick amount button values
  const getQuickAmounts = (totalVal: number) => {
    const amounts = [totalVal];
    const commonNotes = [100, 500, 1000, 2000];
    commonNotes.forEach((note) => {
      if (note > totalVal) amounts.push(note);
    });
    const next500 = Math.ceil(totalVal / 500) * 500;
    if (next500 > totalVal) amounts.push(next500);
    const next1000 = Math.ceil(totalVal / 1000) * 1000;
    if (next1000 > totalVal) amounts.push(next1000);

    return Array.from(new Set(amounts)).sort((a, b) => a - b).slice(0, 4);
  };

  // Reset inputs on modal open
  useEffect(() => {
    if (isOpen) {
      setCashTendered("0");
      setCashPortion("0");
      setOnlinePortion("0");
      setSuccessOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getPaymentMethodLabel = () => {
    if (selectedMethod === "cash") return "COD";
    if (selectedMethod === "online") return "PhonePay";
    return "COD"; // Split maps to COD in backend
  };

  const getPaymentNote = () => {
    if (selectedMethod === "cash") return `POS Cash Sale. Paid: Rs. ${cashTendered}`;
    if (selectedMethod === "online") return "POS Online QR Sale.";
    return `POS Split Sale. Cash: Rs. ${cashPortion}, Online: Rs. ${onlinePortion}`;
  };

  const handleConfirmPayment = async () => {
    const orderInput: OrderInput = {
      user: selectedCustomer ? selectedCustomer.id : null,
      full_name: selectedCustomer
        ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`.trim()
        : "Walk-in Customer",
      phone_number: selectedCustomer ? selectedCustomer.phone_number : "0000000000",
      email: selectedCustomer ? selectedCustomer.email || null : null,
      shipping_address: "In-Store POS Sale",
      nearest_landmark: null,
      total_amount: total,
      discount_amount: discount,
      payment_method: getPaymentMethodLabel(),
      status: "delivered", // Immediately delivered
      is_paid: true,
      is_pos_order: true,
      note: getPaymentNote(),
      items: cart.map((item) => ({
        product: Number(item.p.id),
        quantity: item.q,
        price: item.p.price,
      })),
    };

    try {
      const placed = await onConfirm(orderInput);
      setSuccessOrder(placed);
    } catch (err) {
      // Handled by parent view state
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    onResetPOS();
    onClose();
  };

  // Calculated values
  const tenderedNum = Number(cashTendered) || 0;
  const balanceToReturn = Math.max(0, tenderedNum - total);

  // If order was successfully created, show success state
  if (successOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-[480px] p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif">Payment Successful!</h2>
          <p className="text-zinc-500 text-[13px] mt-1">
            Order <span className="font-semibold text-zinc-800">{successOrder.order_id}</span> has been processed.
          </p>

          {/* Mini Invoice Summary */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 my-5 space-y-2.5 text-left text-[13px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer</span>
              <span className="font-medium text-zinc-800">{successOrder.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Payment Mode</span>
              <span className="font-medium text-zinc-800 capitalize">{selectedMethod}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200/60 pt-2.5 font-semibold">
              <span className="text-zinc-800">Total Paid</span>
              <span className="text-primary font-serif">Rs. {total}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="border border-zinc-200 rounded-2xl py-3 text-[14px] font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Print Receipt
            </button>
            <button
              onClick={handleNewSale}
              className="bg-primary text-white rounded-2xl py-3 text-[14px] font-semibold hover:opacity-95 transition-opacity flex items-center justify-center"
            >
              New Sale (Go Back)
            </button>
          </div>
        </div>

        {/* Printable Receipt layout rendered under print view */}
        <POSPrintReceiptTemplate
          order={successOrder}
          cartItems={cart}
          subtotal={cart.reduce((s, l) => s + l.p.price * l.q, 0)}
          total={total}
          discount={discount}
          vat={vat}
          paymentMethod={selectedMethod}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-[480px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-[17px] font-bold text-zinc-900 font-serif">Payment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Total Due */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium text-[14px]">Total due</span>
            <span className="text-[26px] font-bold text-zinc-950 font-serif">Rs. {total}</span>
          </div>

          {/* Payment Method Cards */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">
              Payment method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Cash Button */}
              <button
                onClick={() => setSelectedMethod("cash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  selectedMethod === "cash"
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <Banknote size={22} className={selectedMethod === "cash" ? "text-white" : "text-zinc-600"} />
                <span className="text-[13px] font-bold mt-1">Cash</span>
                <span className={`text-[9px] mt-0.5 ${selectedMethod === "cash" ? "text-white/80" : "text-zinc-500"}`}>
                  Paid at counter
                </span>
              </button>

              {/* Online Button */}
              <button
                onClick={() => setSelectedMethod("online")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  selectedMethod === "online"
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <Smartphone size={22} className={selectedMethod === "online" ? "text-white" : "text-zinc-600"} />
                <span className="text-[13px] font-bold mt-1">Online</span>
                <span className={`text-[9px] mt-0.5 ${selectedMethod === "online" ? "text-white/80" : "text-zinc-500"}`}>
                  QR / transfer
                </span>
              </button>

              {/* Split Button */}
              <button
                onClick={() => setSelectedMethod("split")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  selectedMethod === "split"
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <Columns size={22} className={selectedMethod === "split" ? "text-white" : "text-zinc-600"} />
                <span className="text-[13px] font-bold mt-1">Split</span>
                <span className={`text-[9px] mt-0.5 ${selectedMethod === "split" ? "text-white/80" : "text-zinc-500"}`}>
                  Cash + Online
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Input Configurations */}
          {selectedMethod === "cash" && (
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                  Cash Tendered
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[13px] font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-[14px] outline-none focus:border-primary font-bold text-zinc-800"
                    placeholder="0"
                    onFocus={(e) => {
                      if (e.target.value === "0") setCashTendered("");
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") setCashTendered("0");
                    }}
                  />
                </div>

                {/* Quick note buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {getQuickAmounts(total).map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setCashTendered(String(amt))}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                        Number(cashTendered) === amt
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {amt === total ? "Exact Amount" : `Rs. ${amt}`}
                    </button>
                  ))}
                </div>

                {/* Remaining amount if underpaid */}
                {tenderedNum > 0 && tenderedNum < total && (
                  <p className="text-[11px] text-amber-600 font-semibold mt-2.5">
                    Remaining: Rs. {total - tenderedNum}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-[13px] border-t border-zinc-200/50 pt-3">
                <span className="text-zinc-500 font-medium">Balance to return</span>
                <span className={`font-bold text-[15px] font-serif ${balanceToReturn > 0 ? "text-green-600" : "text-zinc-800"}`}>
                  Rs. {balanceToReturn}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === "online" && (
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 text-center py-6">
              <Smartphone size={32} className="mx-auto text-primary mb-2" />
              <p className="text-[13px] font-semibold text-zinc-800">Scan QR Code Payment</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Customer should scan store QR and pay <span className="font-bold text-zinc-700">Rs. {total}</span>.
              </p>
            </div>
          )}

          {selectedMethod === "split" && (
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 space-y-3">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                Split Distribution
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">
                    Cash Portion
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[11px]">Rs.</span>
                    <input
                      type="number"
                      value={cashPortion}
                      onChange={(e) => {
                        setCashPortion(e.target.value);
                        const otherVal = Math.max(0, total - (Number(e.target.value) || 0));
                        setOnlinePortion(String(otherVal));
                      }}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-8 pr-3 text-[12px] outline-none focus:border-primary font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold block mb-0.5">
                    Online Portion
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[11px]">Rs.</span>
                    <input
                      type="number"
                      value={onlinePortion}
                      onChange={(e) => {
                        setOnlinePortion(e.target.value);
                        const otherVal = Math.max(0, total - (Number(e.target.value) || 0));
                        setCashPortion(String(otherVal));
                      }}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-8 pr-3 text-[12px] outline-none focus:border-primary font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backend error box */}
          {orderError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[12px] text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
              <span>{orderError}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">

          <button
            onClick={handleConfirmPayment}
            disabled={isPending || (selectedMethod === "cash" && tenderedNum < total)}
            className="flex-1 bg-primary text-white rounded-xl py-3 text-[13px] font-bold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10"
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin text-white" />
            ) : (
              <>
                <Check size={15} />
                Confirm payment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Receipt layout rendered under print view */}
      <POSPrintReceiptTemplate
        order={{
          order_id: "DRAFT",
          created_at: new Date().toISOString(),
          full_name: selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : "Walk-in Customer",
          phone_number: selectedCustomer ? selectedCustomer.phone_number : "0000000000",
        }}
        cartItems={cart}
        subtotal={cart.reduce((s, l) => s + l.p.price * l.q, 0)}
        total={total}
        discount={discount}
        vat={vat}
        paymentMethod={selectedMethod}
      />
    </div>
  );
}
