"use client";

interface CheckoutSummaryProps {
  items: any[];
  total: number;
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;
  totalWeight: number;
  deliveryToName: string;
  deliveryToCity: string;
}

export default function CheckoutSummary({
  items,
  total,
  discountAmount,
  deliveryFee,
  finalTotal,
  totalWeight,
  deliveryToName,
  deliveryToCity,
}: CheckoutSummaryProps) {
  return (
    <aside className="border border-zinc-200 bg-white rounded-3xl p-6 h-fit md:sticky md:top-24 space-y-6 shadow-sm">
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
                  src={it.product.thumbnail_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200"}
                  alt={it.product.thumbnail_alt || it.product.name}
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
          <span className="font-semibold text-zinc-800">
            {deliveryToName ? `${deliveryToCity} (${deliveryToName})` : "Not selected"}
          </span>
        </div>
      </div>
    </aside>
  );
}
