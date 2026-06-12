"use client";

import { Loader2 } from "lucide-react";
import { MiniBarChart } from "@/components/admin/ui";
import { CategoryChartData } from "@/lib/api/stats";

interface CategoryChartProps {
  categoryChart?: CategoryChartData;
  isLoading: boolean;
}

export function CategoryChart({ categoryChart, isLoading }: CategoryChartProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col min-h-[300px]">
      <h3 className="font-serif text-lg font-medium mb-4">By category</h3>
      {isLoading || !categoryChart ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary/40" size={24} />
        </div>
      ) : (
        <div className="h-52 flex-1">
          <MiniBarChart data={categoryChart} labelKey="name" />
        </div>
      )}
    </div>
  );
}
