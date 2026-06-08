import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, Badge } from "@/components/admin/ui";
import type { Product } from "@/lib/products";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  totalProducts,
  currentPage,
  totalPages,
  onPageChange,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-border rounded-xl p-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={24} />
        <p className="text-[13px] text-muted-foreground">Loading products catalog...</p>
      </div>
    );
  }

  return (
    <>
      <Table
        rows={products}
        onRowClick={onEdit}
        columns={[
          {
            key: "name",
            label: "Product",
            render: (p) => (
              <div className="flex items-center gap-3">
                <img
                  src={p.thumbnail_image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100"}
                  className="w-9 h-9 rounded-lg object-cover bg-muted"
                  alt={p.thumbnail_alt || ""}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100";
                  }}
                />
                <div>
                  <span className="font-medium text-[13px] block">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">slug: {p.slug}</span>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            label: "Category",
            render: (p) => (
              <div className="space-y-0.5">
                <span className="capitalize text-[13px] block">{p.category.replace(/-/g, " ")}</span>
                <span className="text-[10px] text-muted-foreground capitalize block">
                  {p.subcategory.replace(/-/g, " ")}
                </span>
              </div>
            ),
          },
          { key: "price", label: "Price", render: (p) => `Rs ${p.price.toLocaleString()}` },
          {
            key: "stock",
            label: "Stock",
            render: (p) =>
              p.stock < 10 ? (
                <Badge tone="warn">{p.stock} units left</Badge>
              ) :(
                 <span>
                  {p.stock}
                </span>
              ) 
              
          },
          {
            key: "unit",
            label: "Unit",
            render: (p) =>
             
                <span>
                  {p.unit}
                </span>
              
          },

          
        ]}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <span className="text-[12px] text-muted-foreground">
            Showing Page <span className="text-foreground font-semibold">{currentPage}</span> of{" "}
            <span className="text-foreground font-semibold">{totalPages}</span> (Total{" "}
            <span className="text-foreground font-semibold">{totalProducts}</span> items)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
              className="px-2.5 py-1 text-[11px] font-medium border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              First
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Render individual page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, and pages around current page
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, arr) => {
                const prevPage = arr[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1.5">
                    {showEllipsis && (
                      <span className="text-muted-foreground text-[12px] px-1 select-none">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-medium border transition-colors flex items-center justify-center cursor-pointer ${
                        currentPage === page
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className="px-2.5 py-1 text-[11px] font-medium border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </>
  );
}
