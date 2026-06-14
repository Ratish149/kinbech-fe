"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/admin/ui";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { CustomerTable } from "@/components/admin/customers/CustomerTable";
import { Loader2, Search, AlertTriangle } from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: paginatedData,
    isLoading,
    error: loadError,
  } = useCustomers({
    search: debouncedSearch || undefined,
    page: page,
    page_size: 15,
  });

  const customers = paginatedData?.results ?? [];
  const count = paginatedData?.count ?? 0;
  const totalPages = paginatedData?.total_pages ?? 1;

  const error = loadError ? (loadError as Error).message : null;

  return (
    <div className="space-y-5">
      <PageHead title="Customers" subtitle={`${count} total customers`} />

      {/* Search Bar */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center bg-cream border border-border rounded-full px-4 py-1.5 w-full sm:max-w-xs shrink-0">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="ml-2 flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
          <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="mt-1 text-red-700/95">{error}</p>
          </div>
        </div>
      )}

      {/* Customers Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-border rounded-xl">
          <Loader2 className="animate-spin text-primary" size={28} />
          <p className="text-[13px] text-muted-foreground font-medium">Loading customers from database…</p>
        </div>
      ) : (
        <div className="space-y-4">
          <CustomerTable
            customers={customers}
            onSelectCustomer={(c) => router.push(`/admin/customers/${c.id}`)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3">
              <div className="text-[12px] text-muted-foreground">
                Showing page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-cream hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer border"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-cream hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer border"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
