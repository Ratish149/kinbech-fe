"use client";

import { Loader2 } from "lucide-react";
import { Badge, Table, SlideOver, useModal } from "@/components/admin/ui";
import { OrderDetailView } from "@/components/admin/OrderDetailView";
import { RecentOrderData } from "@/lib/api/stats";

const STATUS_TONES: Record<string, "warn" | "success" | "danger" | "default" | "info"> = {
  pending: "warn",
  processing: "info",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

interface RecentOrdersProps {
  recentOrders?: RecentOrderData[];
  isLoading: boolean;
}

export function RecentOrders({ recentOrders, isLoading }: RecentOrdersProps) {
  const modal = useModal<RecentOrderData>();

  // Table generic requires 'id' property
  const ordersWithId =
    recentOrders?.map((o) => ({
      ...o,
      id: o.order_id,
    })) ?? [];

  return (
    <div className="md:col-span-2 bg-white border border-border rounded-xl p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-serif text-lg font-medium mb-4">Recent orders</h3>
        {isLoading || !recentOrders ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary/40" size={24} />
          </div>
        ) : (
          <Table
            rows={ordersWithId}
            onRowClick={(row) => modal.openWith(row)}
            columns={[
              {
                key: "order_id",
                label: "Order #",
                render: (o) => (
                  <span className="font-mono text-[11px] font-semibold text-zinc-600">
                    {o.order_id}
                  </span>
                ),
              },
              { key: "full_name", label: "Customer" },
              {
                key: "total_amount",
                label: "Total",
                render: (o) => `Rs ${Number(o.total_amount).toLocaleString()}`,
              },
              {
                key: "status",
                label: "Status",
                render: (o) => (
                  <Badge tone={STATUS_TONES[o.status] || "default"}>
                    {o.status}
                  </Badge>
                ),
              },
              {
                key: "time_ago",
                label: "Date",
                render: (o) => (
                  <span className="text-muted-foreground text-[12px]">
                    {o.time_ago}
                  </span>
                ),
              },
            ]}
          />
        )}
      </div>

      <SlideOver
        open={modal.open}
        onClose={modal.close}
        title={`Order: ${modal.item?.order_id ?? ""}`}
      >
        {modal.item && (
          <OrderDetailView orderId={modal.item.order_id} onClose={modal.close} />
        )}
      </SlideOver>
    </div>
  );
}
