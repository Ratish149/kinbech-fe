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
        <div className="flex items-center justify-between pt-2">
          <span className="text-[12px] text-muted-foreground">
            Page {currentPage} of {totalPages} (Total {totalProducts} items)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
