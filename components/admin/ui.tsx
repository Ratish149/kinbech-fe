"use client";

import { useState, useCallback } from "react";

// ────────────────────────────────────────────────────
// KPI card
// ────────────────────────────────────────────────────
export function KPI({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-1">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold font-serif">{value}</p>
      {hint && (
        <p
          className={`text-[11px] ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────
// Badge
// ────────────────────────────────────────────────────
const TONE_CLASSES: Record<string, string> = {
  default: "bg-muted text-foreground",
  success: "bg-green-100 text-green-700",
  warn: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warn" | "danger" | "info";
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
        TONE_CLASSES[tone] ?? TONE_CLASSES.default
      }`}
    >
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────
// Field label wrapper
// ────────────────────────────────────────────────────
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────
// PageHead
// ────────────────────────────────────────────────────
export function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="font-serif text-2xl font-medium">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────
// Table
// ────────────────────────────────────────────────────
type ColDef<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export function Table<T extends { id: string | number }>({
  rows,
  columns,
  onRowClick,
}: {
  rows: T[];
  columns: ColDef<T>[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-4 py-3 text-left font-medium text-muted-foreground uppercase text-[10px] tracking-widest"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-cream/60" : ""
                }`}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-[13px]">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// SlideOver (right panel)
// ────────────────────────────────────────────────────
export function SlideOver({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(.25,.46,.45,.94)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif font-medium text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────
// useModal hook
// ────────────────────────────────────────────────────
export function useModal<T>() {
  const [item, setItem] = useState<T | null>(null);

  const openWith = useCallback((it: T) => setItem(it), []);
  const close = useCallback(() => setItem(null), []);

  return { open: item !== null, item, openWith, close };
}

// ────────────────────────────────────────────────────
// Simple inline bar chart (no recharts needed)
// ────────────────────────────────────────────────────
export function MiniBarChart({
  data,
  valueKey = "v",
  labelKey = "d",
  color = "#075924",
}: {
  data: Record<string, number | string>[];
  valueKey?: string;
  labelKey?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0));
  return (
    <div className="flex items-end gap-1 h-full w-full">
      {data.map((d, i) => {
        const val = Number(d[valueKey]) || 0;
        const heightPct = max ? (val / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{ height: `${heightPct}%`, backgroundColor: color, minHeight: 2 }}
            />
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">
              {String(d[labelKey] ?? "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MiniAreaChart({
  data,
  valueKey = "v",
  color = "#075924",
}: {
  data: Record<string, number | string>[];
  valueKey?: string;
  color?: string;
}) {
  const vals = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const W = 400;
  const H = 100;
  const pad = 8;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  if (data.length < 2) return null;

  const px = (i: number) => pad + (i / (data.length - 1)) * innerW;
  const py = (v: number) =>
    max === min
      ? H / 2
      : pad + innerH - ((v - min) / (max - min)) * innerH;

  const pts = vals.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const area = `M${pad},${H} ` + vals.map((v, i) => `L${px(i)},${py(v)}`).join(" ") + ` L${W - pad},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ag)" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
