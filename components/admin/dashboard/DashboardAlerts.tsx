"use client";

import { AlertTriangle, ArrowUpRight, Bell, Loader2 } from "lucide-react";
import { AlertData } from "@/lib/api/stats";

interface DashboardAlertsProps {
  alerts?: AlertData[];
  isLoading: boolean;
}

export function DashboardAlerts({ alerts, isLoading }: DashboardAlertsProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
        <Bell size={14} /> Alerts
      </h3>
      <ul className="space-y-3 text-[13px]">
        {isLoading || !alerts ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin text-primary/40" size={20} />
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const isDanger = alert.type === "danger";
            const isWarn = alert.type === "warn";
            const isSuccess = alert.type === "success";
            const isInfo = alert.type === "info";

            let bgClass = "bg-zinc-50 text-zinc-800";
            let iconColor = "text-zinc-600";
            let Icon = Bell;

            if (isDanger) {
              bgClass = "bg-red-50 text-red-800 border border-red-100/50";
              iconColor = "text-red-600";
              Icon = AlertTriangle;
            } else if (isWarn) {
              bgClass = "bg-amber-50 text-amber-800 border border-amber-100/50";
              iconColor = "text-amber-600";
              Icon = AlertTriangle;
            } else if (isSuccess) {
              bgClass = "bg-emerald-50 text-emerald-800 border border-emerald-100/50";
              iconColor = "text-emerald-600";
              Icon = ArrowUpRight;
            } else if (isInfo) {
              bgClass = "bg-blue-50 text-blue-800 border border-blue-100/50";
              iconColor = "text-blue-600";
              Icon = ArrowUpRight;
            }

            return (
              <li key={idx} className={`flex items-start gap-2 p-3 rounded-xl ${bgClass}`}>
                <Icon size={14} className={`${iconColor} mt-0.5`} />
                <span>{alert.message}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
