"use client";

import { useState } from "react";
import { Badge, Field, PageHead, SlideOver, Table, useModal, KPI, MiniAreaChart } from "@/components/admin/ui";
import { ArrowUpRight, ArrowDownRight, Wallet, Receipt, DollarSign, Calendar, TrendingUp } from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  type: "Sale" | "Purchase" | "Expense" | "Payout";
  category: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  method: "Cash" | "Fonepay" | "Esewa" | "Khalti";
  notes?: string;
};

const TRANSACTIONS: Transaction[] = [
  { id: "TX1001", date: "2026-06-07 15:45", type: "Sale", category: "POS Sale (Mutton)", amount: 3600, status: "Completed", method: "Fonepay", notes: "Order #KM428291" },
  { id: "TX1002", date: "2026-06-07 14:12", type: "Purchase", category: "Local Farm Supply", amount: 45000, status: "Completed", method: "Cash", notes: "Bought 3 live goats from farm partner" },
  { id: "TX1003", date: "2026-06-07 11:30", type: "Sale", category: "Online Sale", amount: 1800, status: "Completed", method: "Esewa", notes: "Order #KM428285" },
  { id: "TX1004", date: "2026-06-06 17:00", type: "Expense", category: "Packaging Supply", amount: 4200, status: "Completed", method: "Cash", notes: "Biodegradable meat wrap papers" },
  { id: "TX1005", date: "2026-06-06 13:15", type: "Sale", category: "POS Sale (Chicken)", amount: 1300, status: "Completed", method: "Cash", notes: "Dressed chicken 2pcs" },
  { id: "TX1006", date: "2026-06-05 10:00", type: "Payout", category: "Staff Salary", amount: 35000, status: "Completed", method: "Fonepay", notes: "May 2026 Salary payout" },
  { id: "TX1007", date: "2026-06-04 16:30", type: "Expense", category: "Utility (Electricity)", amount: 8400, status: "Completed", method: "Khalti", notes: "Cold storage freezer unit bill" },
  { id: "TX1008", date: "2026-06-04 12:00", type: "Sale", category: "Online Bulk Sale", amount: 15400, status: "Completed", method: "Fonepay", notes: "Order #KM428266" },
];

const REVENUE_TREND = [
  { d: "Mon", v: 22000 },
  { d: "Tue", v: 48000 },
  { d: "Wed", v: 35000 },
  { d: "Thu", v: 62000 },
  { d: "Fri", v: 45000 },
  { d: "Sat", v: 85000 },
  { d: "Sun", v: 92000 },
];

export default function FinancialPage() {
  const modal = useModal<Transaction>();
  const [filterType, setFilterType] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = TRANSACTIONS.filter((t) => {
    const matchesType = filterType === "All" || t.type === filterType;
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTxTone = (type: Transaction["type"]) => {
    switch (type) {
      case "Sale":
        return "success";
      case "Purchase":
        return "warn";
      case "Expense":
        return "danger";
      case "Payout":
        return "info";
    }
  };

  const getStatusTone = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warn";
      case "Failed":
        return "danger";
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Financial Ledger"
        subtitle="Manage cashflow, invoices, payouts, and revenue metrics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Total Revenue (Week)" value="Rs 389,000" hint="↑ +18.4% vs last week" trend="up" />
        <KPI label="Total Purchases" value="Rs 128,500" hint="Supplier payments" />
        <KPI label="Operating Expenses" value="Rs 47,600" hint="Rent, electricity, packaging" trend="down" />
        <KPI label="Net Cashflow" value="Rs 212,900" hint="Strong cash posture" trend="up" />
      </div>

      {/* Analytics chart and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium">Revenue Trend (7 days)</h3>
              <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <TrendingUp size={12} /> Live tracking
              </span>
            </div>
            <div className="h-56">
              <MiniAreaChart data={REVENUE_TREND} />
            </div>
            <div className="flex justify-between mt-2">
              {REVENUE_TREND.map((item) => (
                <span key={item.d} className="text-[10px] text-muted-foreground flex-1 text-center font-medium">
                  {item.d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Breakdown Card */}
        <div className="bg-white border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-serif text-lg font-medium">Sales by Payment Mode</h3>
          <div className="space-y-3">
            {[
              { label: "Fonepay QR", value: "Rs 184,300", percent: 47, count: "54 txs" },
              { label: "Cash", value: "Rs 122,100", percent: 31, count: "42 txs" },
              { label: "Esewa", value: "Rs 56,400", percent: 15, count: "18 txs" },
              { label: "Khalti", value: "Rs 26,200", percent: 7, count: "9 txs" },
            ].map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium">{p.label}</span>
                  <span className="text-muted-foreground">{p.value} ({p.count})</span>
                </div>
                <div className="w-full bg-cream rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Filter and Search */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[12px] text-muted-foreground uppercase tracking-widest mr-2">Filters:</span>
          {["All", "Sale", "Purchase", "Expense", "Payout"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                filterType === t ? "bg-primary text-white" : "bg-cream text-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64 border border-border rounded-full px-3 py-1.5 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full outline-none text-[13px] bg-transparent"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <Table
        rows={filtered}
        onRowClick={modal.openWith}
        columns={[
          { key: "id", label: "Tx ID", render: (t) => <code className="text-[11px] font-semibold text-primary">{t.id}</code> },
          { key: "date", label: "Date & Time" },
          { key: "type", label: "Type", render: (t) => <Badge tone={getTxTone(t.type)}>{t.type}</Badge> },
          { key: "category", label: "Category & Description" },
          { key: "method", label: "Payment Mode" },
          {
            key: "amount",
            label: "Amount",
            render: (t) => (
              <span className={`font-semibold ${t.type === "Sale" ? "text-green-600" : "text-zinc-900"}`}>
                {t.type === "Sale" ? "+" : "-"} Rs {t.amount.toLocaleString()}
              </span>
            ),
          },
          { key: "status", label: "Status", render: (t) => <Badge tone={getStatusTone(t.status)}>{t.status}</Badge> },
        ]}
      />

      {/* SlideOver Detail Panel */}
      <SlideOver open={modal.open} onClose={modal.close} title={`Transaction Details: ${modal.item?.id ?? ""}`}>
        {modal.item && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6 border-b border-border space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${modal.item.type === "Sale" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                {modal.item.type === "Sale" ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
              </div>
              <p className="text-2xl font-bold font-serif">
                {modal.item.type === "Sale" ? "+" : "-"} Rs {modal.item.amount.toLocaleString()}
              </p>
              <Badge tone={getStatusTone(modal.item.status)}>{modal.item.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[13px]">
              <Field label="Transaction Category">
                <p className="font-medium">{modal.item.category}</p>
              </Field>
              <Field label="Ledger Type">
                <Badge tone={getTxTone(modal.item.type)}>{modal.item.type}</Badge>
              </Field>
              <Field label="Date & Time">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={13} />
                  <span>{modal.item.date}</span>
                </div>
              </Field>
              <Field label="Payment Method">
                <div className="flex items-center gap-1.5 font-medium">
                  <Wallet size={13} className="text-primary" />
                  <span>{modal.item.method}</span>
                </div>
              </Field>
            </div>

            <Field label="Reference Notes">
              <div className="bg-cream rounded-xl p-3 border border-border/60 text-[13px] italic min-h-[60px]">
                {modal.item.notes || "No notes attached to this transaction."}
              </div>
            </Field>

            <div className="border-t border-border pt-4 flex gap-2">
              <button className="flex-1 bg-primary text-white rounded-full py-2 text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                <Receipt size={14} /> Download Receipt
              </button>
              <button
                onClick={modal.close}
                className="border border-border rounded-full px-5 py-2 text-[13px] hover:bg-muted transition-colors"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
