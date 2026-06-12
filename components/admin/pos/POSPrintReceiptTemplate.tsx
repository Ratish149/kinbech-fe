"use client";

import React from "react";

interface POSPrintReceiptTemplateProps {
  order: any;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  paymentMethod?: string;
  cartItems?: any[];
}

export default function POSPrintReceiptTemplate({
  order,
  subtotal,
  discount,
  vat,
  total,
  paymentMethod,
  cartItems,
}: POSPrintReceiptTemplateProps) {
  const finalPaymentMethod = paymentMethod || order?.payment_method || "COD";
  const items = cartItems || order?.items || [];

  return (
    <div className="hidden print:block w-[80mm] mx-auto p-4 bg-white text-black font-mono text-[11px] leading-relaxed">
      {/* Styles to inject print specifics */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-receipt-area, .print-receipt-area * {
            visibility: visible;
          }
          .print-receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            background: white !important;
            color: black !important;
            padding: 10px !important;
          }
        }
      `}} />

      <div className="print-receipt-area space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[14px] font-bold uppercase tracking-wider">KINBECH STORE</h1>
          <p className="text-[9px] text-zinc-600 mt-0.5">Kathmandu, Nepal</p>
          <p className="text-[9px] text-zinc-600">Tel: +977-1-000000</p>
          <div className="border-b border-dashed border-black my-2" />
          <h2 className="text-[12px] font-bold">SALES RECEIPT</h2>
        </div>

        {/* Invoice Info */}
        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>Invoice No:</span>
            <span className="font-bold">{order?.order_id || "DRAFT"}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>
              {order?.created_at
                ? new Date(order.created_at).toLocaleString()
                : new Date().toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>Admin</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{order?.full_name || "Walk-in"}</span>
          </div>
          {order?.phone_number && (
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{order.phone_number}</span>
            </div>
          )}
        </div>

        <div className="border-b border-dashed border-black my-2" />

        {/* Items Table */}
        <table className="w-full text-left text-[10px]">
          <thead>
            <tr className="border-b border-black font-bold">
              <th className="pb-1">Item</th>
              <th className="text-center pb-1">Qty</th>
              <th className="text-right pb-1">Price</th>
              <th className="text-right pb-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, idx: number) => {
              const name = item.product_name || item.p?.name || "";
              const qty = item.quantity || item.q || 0;
              const price = item.price || item.p?.price || 0;
              const lineTotal = Number(price) * Number(qty);
              return (
                <tr key={idx} className="border-b border-zinc-100">
                  <td className="py-1 max-w-[35mm] truncate">{name}</td>
                  <td className="text-center py-1">{qty}</td>
                  <td className="text-right py-1">Rs.{price}</td>
                  <td className="text-right py-1">Rs.{lineTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="border-b border-dashed border-black my-2" />

        {/* Totals */}
        <div className="space-y-1 text-right text-[10px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rs. {subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>Rs. {discount}</span>
            </div>
          )}
          {vat > 0 && (
            <div className="flex justify-between">
              <span>VAT ({vat}%):</span>
              <span>Rs. {Math.round((subtotal - discount) * (vat / 100))}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-[12px] pt-1">
            <span>Total:</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-black my-2" />

        {/* Payment Details */}
        <div className="flex justify-between text-[10px] font-bold">
          <span>Paid Via:</span>
          <span className="uppercase">{finalPaymentMethod}</span>
        </div>

        {/* Footer */}
        <div className="text-center pt-3 space-y-1">
          <p className="text-[9px] font-bold">THANK YOU FOR YOUR VISIT!</p>
          <p className="text-[8px] text-zinc-500">Please visit us again.</p>
        </div>
      </div>
    </div>
  );
}
