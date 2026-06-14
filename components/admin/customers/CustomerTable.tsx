"use client";

import React from "react";
import { Table } from "@/components/admin/ui";
import type { Customer } from "@/lib/types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerTable({ customers, onSelectCustomer }: CustomerTableProps) {
  return (
    <Table
      rows={customers}
      onRowClick={onSelectCustomer}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (c) => (
            <span className="font-semibold text-zinc-950">
              {`${c.first_name} ${c.last_name}`.trim() || c.username}
            </span>
          ),
        },
        {
          key: "email",
          label: "Email",
          render: (c) => <span className="text-zinc-600">{c.email || "—"}</span>,
        },
        {
          key: "phone_number",
          label: "Phone",
          render: (c) => <span className="font-mono text-zinc-700">{c.phone_number || "—"}</span>,
        },
        {
          key: "total_orders",
          label: "Total Orders",
          render: (c) => <span className="font-medium">{c.total_orders}</span>,
        },
        {
          key: "total_spent",
          label: "Lifetime Spend",
          render: (c) => (
            <span className="font-semibold text-primary">
              Rs. {Number(c.total_spent).toLocaleString()}
            </span>
          ),
        },
        {
          key: "date_joined",
          label: "Joined Date",
          render: (c) => (
            <span className="text-muted-foreground text-[12px]">
              {new Date(c.date_joined).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          ),
        },
      ]}
    />
  );
}
