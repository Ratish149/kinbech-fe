"use client";

import { AlertTriangle, ArrowUpRight, Bell, Leaf, Package, ShoppingBag, Users } from "lucide-react";
import { KPI, MiniAreaChart, MiniBarChart } from "@/components/admin/ui";

const sales = Array.from({ length: 7 }).map((_, i) => ({
  d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  v: 12000 + Math.round(Math.random() * 18000),
}));

const cats = [
  { name: "Fresh Meat", v: 42000 },
  { name: "Sukuti", v: 28000 },
  { name: "Cooked", v: 18000 },
  { name: "Veg", v: 12000 },
  { name: "Farm", v: 9000 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium">Good morning, Admin</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening across your shop today.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Today's sales" value="Rs 48,320" hint="↑ +12% vs yesterday" trend="up" />
        <KPI label="Orders" value="37" hint="6 pending" />
        <KPI label="Low stock items" value="4" hint="Action needed" trend="down" />
        <KPI label="Live animals" value="128" hint="3 categories" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4">Sales — last 7 days</h3>
          <div className="h-52">
            <MiniAreaChart data={sales} />
          </div>
          <div className="flex justify-between mt-2">
            {sales.map((s) => (
              <span key={s.d} className="text-[10px] text-muted-foreground flex-1 text-center">
                {s.d}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4">By category</h3>
          <div className="h-52">
            <MiniBarChart data={cats} labelKey="name" />
          </div>
        </div>
      </div>

      {/* Activity + Alerts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4">Recent activity</h3>
          <ul className="space-y-3 text-[13px]">
            {[
              { i: ShoppingBag, t: "Order #KM428291 confirmed", s: "2 min ago" },
              { i: Package, t: "Stock low: Pork Belly (5 left)", s: "12 min ago" },
              { i: Users, t: "New customer registered: Anjali T.", s: "1 hour ago" },
              { i: Leaf, t: "Farm: 4 chickens marked sold", s: "2 hours ago" },
            ].map((x, idx) => (
              <li key={idx} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                  <x.i size={14} className="text-primary" />
                </div>
                <span className="flex-1">{x.t}</span>
                <span className="text-muted-foreground text-[11px]">{x.s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
            <Bell size={14} /> Alerts
          </h3>
          <ul className="space-y-3 text-[13px]">
            <li className="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
              <AlertTriangle size={14} className="text-red-600 mt-0.5" />
              <span>4 items below minimum stock</span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5" />
              <span>2 batches expiring within 7 days</span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-accent rounded-xl">
              <ArrowUpRight size={14} className="text-primary mt-0.5" />
              <span>Sales up 12% this week</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
