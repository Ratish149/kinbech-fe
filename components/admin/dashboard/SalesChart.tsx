"use client";

import { Loader2 } from "lucide-react";
import { MiniAreaChart } from "@/components/admin/ui";
import { SalesChartData } from "@/lib/api/stats";

interface SalesChartProps {
  salesChart?: SalesChartData;
  isLoading: boolean;
}

export function SalesChart({ salesChart, isLoading }: SalesChartProps) {
  return (
    <div className="md:col-span-2 bg-white border border-border rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
      <h3 className="font-serif text-lg font-medium mb-4">Sales — last 7 days</h3>
      {isLoading || !salesChart ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary/40" size={24} />
        </div>
      ) : (
        <>
          <div className="h-52">
            <MiniAreaChart data={salesChart} />
          </div>
          <div className="flex justify-between mt-2">
            {salesChart.map((s) => (
              <span key={s.d} className="text-[10px] text-muted-foreground flex-1 text-center">
                {s.d}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
