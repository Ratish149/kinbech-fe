"use client";

import { useState } from "react";
import { Badge, Field, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";

type Customer = {
  id: string;
  name: string;
  phone: string;
  orders: number;
  spent: number;
  tier: "Regular" | "Frequent" | "VIP";
  points: number;
};

const NAMES = [
  "Pratima Rai",
  "Bibek Karki",
  "Anjali Thapa",
  "Niraj Maharjan",
  "Sushma Poudel",
  "Anita Gurung",
  "Sandeep K.C.",
  "Ramesh Adhikari",
];

const ROWS: Customer[] = NAMES.map((n, i) => ({
  id: "C" + (1000 + i),
  name: n,
  phone: "+977 98" + (20000000 + i * 134),
  orders: 3 + (i * 7) % 40,
  spent: 4000 + (i * 1247) % 60000,
  tier: i % 7 === 0 ? "VIP" : i % 3 === 0 ? "Frequent" : "Regular",
  points: 100 + (i * 87) % 2000,
}));

function tierTone(t: string): "success" | "info" | "default" {
  if (t === "VIP") return "success";
  if (t === "Frequent") return "info";
  return "default";
}

export default function CustomersPage() {
  const modal = useModal<Customer>();
  const [search, setSearch] = useState("");

  const filtered = ROWS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div>
      <PageHead title="Customers" subtitle={`${ROWS.length} active`} />

      {/* Search bar */}
      <div className="bg-white border border-border rounded-xl p-4 mb-4 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="flex-1 outline-none text-[14px]"
        />
      </div>

      <Table
        rows={filtered}
        onRowClick={modal.openWith}
        columns={[
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "orders", label: "Orders" },
          {
            key: "spent",
            label: "Spent",
            render: (c) => `Rs ${c.spent.toLocaleString()}`,
          },
          { key: "points", label: "Points" },
          {
            key: "tier",
            label: "Tier",
            render: (c) => <Badge tone={tierTone(c.tier)}>{c.tier}</Badge>,
          },
        ]}
      />

      <SlideOver open={modal.open} onClose={modal.close} title={modal.item?.name ?? ""}>
        {modal.item && (
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary text-xl font-semibold flex items-center justify-center">
                {modal.item.name[0]}
              </div>
              <div>
                <p className="font-semibold">{modal.item.name}</p>
                <Badge tone={tierTone(modal.item.tier)}>{modal.item.tier} Customer</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <Field label="Customer ID"><p className="font-mono">{modal.item.id}</p></Field>
              <Field label="Phone"><p>{modal.item.phone}</p></Field>
              <Field label="Total orders"><p>{modal.item.orders}</p></Field>
              <Field label="Lifetime spend">
                <p>Rs {modal.item.spent.toLocaleString()}</p>
              </Field>
              <Field label="Loyalty points">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary">{modal.item.points}</span>
                  <span className="text-[11px] text-muted-foreground">pts</span>
                </div>
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                rows={4}
                placeholder="Add a note about this customer…"
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
                Recent purchases
              </p>
              <ul className="text-[13px] space-y-2">
                {["Fresh Mutton Curry Cut", "Wild Honey", "Pure Cow Ghee"].map((p) => (
                  <li key={p} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span>{p}</span>
                    <span className="text-muted-foreground">2 days ago</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="bg-primary text-white rounded-full px-5 py-2 text-[13px] hover:opacity-90 transition-opacity">
              Save note
            </button>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
