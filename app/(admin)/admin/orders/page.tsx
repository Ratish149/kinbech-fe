"use client";

import { useState } from "react";
import { Badge, Field, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";

type LineItem = {
  id: string;
  name: string;
  image: string;
  qty: number;
  price: number;
  unit: string;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: LineItem[];
};

const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

function tone(s: string): "warn" | "success" | "danger" | "default" {
  if (s === "Completed") return "success";
  if (s === "Cancelled") return "danger";
  if (s === "Pending") return "warn";
  return "default";
}

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=80",
  "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=80",
];

const PRODUCT_NAMES = [
  "Fresh Mutton Curry Cut",
  "Whole Dressed Chicken",
  "Buff Sukuti Premium",
  "Pork Belly Sliced",
  "Chicken Sukuti",
];

const ROWS: Order[] = Array.from({ length: 18 }).map((_, i) => {
  const count = 1 + (i % 4);
  const items: LineItem[] = Array.from({ length: count }).map((_, j) => ({
    id: `${i}-${j}`,
    name: PRODUCT_NAMES[(i + j) % PRODUCT_NAMES.length],
    image: PRODUCT_IMAGES[j % PRODUCT_IMAGES.length],
    qty: 1 + ((i + j) % 3),
    price: [1200, 650, 1800, 850, 900][(i + j) % 5],
    unit: ["1 kg", "1 pc", "500 g"][j % 3],
  }));
  const total = items.reduce((s, x) => s + x.qty * x.price, 0);
  return {
    id: "KM" + (482000 + i),
    customer: ["Pratima R.", "Bibek K.", "Anjali T.", "Niraj M.", "Sushma P."][i % 5],
    phone: "+977 98" + (10000000 + i),
    address: ["Lazimpat, Kathmandu", "Patan Dhoka, Lalitpur", "Bhaisepati", "Baluwatar", "Sanepa"][i % 5],
    total,
    status: STATUSES[i % STATUSES.length],
    date: `2026-06-0${(i % 4) + 1}`,
    items,
  };
});

export default function OrdersPage() {
  const modal = useModal<Order>();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? ROWS : ROWS.filter((r) => r.status === filter);

  return (
    <div>
      <PageHead title="Orders" subtitle={`${ROWS.length} orders`} />

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Table
        rows={filtered}
        onRowClick={modal.openWith}
        columns={[
          {
            key: "id",
            label: "Order #",
            render: (o) => <span className="font-mono text-[12px]">{o.id}</span>,
          },
          { key: "customer", label: "Customer" },
          { key: "items", label: "Items", render: (o) => o.items.length },
          { key: "total", label: "Total", render: (o) => `Rs ${o.total.toLocaleString()}` },
          { key: "date", label: "Date" },
          {
            key: "status",
            label: "Status",
            render: (o) => <Badge tone={tone(o.status)}>{o.status}</Badge>,
          },
        ]}
      />

      <SlideOver open={modal.open} onClose={modal.close} title={`Order ${modal.item?.id ?? ""}`}>
        {modal.item && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <Field label="Customer"><p>{modal.item.customer}</p></Field>
              <Field label="Phone"><p>{modal.item.phone}</p></Field>
              <Field label="Address"><p>{modal.item.address}</p></Field>
              <Field label="Date"><p>{modal.item.date}</p></Field>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
                Items ({modal.item.items.length})
              </p>
              <ul className="border border-border rounded-xl divide-y divide-border">
                {modal.item.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3">
                    <img src={it.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{it.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {it.unit} · Rs {it.price}
                      </p>
                    </div>
                    <span className="text-[13px] text-muted-foreground">× {it.qty}</span>
                    <span className="text-[13px] font-medium w-20 text-right">
                      Rs {it.qty * it.price}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-3 text-[14px] font-semibold">
                <span>Total</span>
                <span>Rs {modal.item.total.toLocaleString()}</span>
              </div>
            </div>

            <Field label="Status">
              <select
                defaultValue={modal.item.status}
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">Timeline</p>
              <ol className="space-y-2 text-[13px]">
                {STATUSES.slice(0, STATUSES.indexOf(modal.item.status) + 1).map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="flex-1">{s}</span>
                    <span className="text-muted-foreground text-[11px]">Day {i + 1}</span>
                  </li>
                ))}
              </ol>
            </div>

            <button className="bg-primary text-white rounded-full px-5 py-2 text-[13px] hover:opacity-90 transition-opacity">
              Save changes
            </button>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

