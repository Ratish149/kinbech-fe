"use client";

import { Plus, Search, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { PageHead, SlideOver } from "@/components/admin/ui";
import type { Product } from "@/lib/products";
import { fetchCategories } from "@/lib/api/categories";
import {
  fetchProducts,
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/products";
import type { Category } from "@/lib/types/category";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";

export default function InventoryPage() {
  // Products & categories state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters, search, pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit slide-over state — fetch full product by slug on open
  const [editOpen, setEditOpen] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  // Add slide-over state
  const [addOpen, setAddOpen] = useState(false);

  // Load categories and products
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProducts({
        search: searchQuery || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        page: currentPage,
        page_size: 15,
      });
      setProducts(result.products);
      setTotalProducts(result.count);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to connect to the backend server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, categoryFilter, currentPage]);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  // Open edit slide-over and fetch full product data by slug
  const handleRowClick = async (product: Product) => {
    setEditOpen(true);
    setEditSlug(product.slug);
    setFullEditProduct(null);
    setIsLoadingEdit(true);
    try {
      const full = await fetchProductBySlug(product.slug);
      setFullEditProduct(full);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product details.");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditSlug(null);
    setFullEditProduct(null);
  };

  // Shared FormData cleanup helper
  const cleanFormData = (formData: FormData) => {
    formData.set("is_featured", String(formData.get("is_featured") === "on"));
    formData.set("is_best_seller", String(formData.get("is_best_seller") === "on"));

    const thumbFile = formData.get("thumbnail_image") as File;
    if (!thumbFile || thumbFile.size === 0) formData.delete("thumbnail_image");

    const imageFiles = formData.getAll("uploaded_images") as File[];
    const validImageFiles = imageFiles.filter((f) => f.size > 0);
    formData.delete("uploaded_images");
    validImageFiles.forEach((f) => formData.append("uploaded_images", f));
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const subcat = formData.get("subcategory") as string;

    if (!subcat) {
      toast.error("Please select a subcategory.");
      setIsSubmitting(false);
      return;
    }

    cleanFormData(formData);

    try {
      await createProduct(formData);
      toast.success("Product created successfully!");
      setAddOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Product Submit
  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editSlug) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    cleanFormData(formData);

    try {
      await updateProduct(editSlug, formData);
      toast.success("Product updated successfully!");
      closeEdit();
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!editSlug) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(editSlug);
      toast.success("Product deleted successfully!");
      closeEdit();
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHead
        title="Inventory"
        subtitle={`${totalProducts} products in catalog`}
        action={
          <button
            onClick={() => setAddOpen(true)}
            className="bg-primary text-white rounded-full px-4 py-2 text-[13px] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> New product
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center bg-cream border border-border rounded-full px-4 py-1.5 w-full sm:max-w-xs">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="ml-2 flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto py-1">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mr-1 shrink-0">
            Category:
          </span>
          <button
            onClick={() => handleCategoryFilterChange("All")}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
              categoryFilter === "All" ? "bg-primary text-white" : "bg-cream text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryFilterChange(c.slug)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
                categoryFilter === c.slug ? "bg-primary text-white" : "bg-cream text-foreground hover:bg-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-[13px]">
          <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="mt-1 text-red-700/90">{error}</p>
          </div>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={handleRowClick}
        totalProducts={totalProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Edit SlideOver — opens immediately, fetches full product in background */}
      <SlideOver
        open={editOpen}
        onClose={closeEdit}
        title={fullEditProduct ? `Edit: ${fullEditProduct.name}` : "Loading product…"}
      >
        {isLoadingEdit ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="text-[13px] text-muted-foreground">Fetching product details…</p>
          </div>
        ) : fullEditProduct ? (
          <ProductForm
            key={fullEditProduct.slug}
            item={fullEditProduct}
            categories={categories}
            onSubmit={handleEditProduct}
            isSubmitting={isSubmitting}
            onCancel={closeEdit}
            onDelete={handleDeleteProduct}
          />
        ) : null}
      </SlideOver>

      {/* Add SlideOver */}
      <SlideOver open={addOpen} onClose={() => setAddOpen(false)} title="Add New Product">
        <ProductForm
          key={addOpen ? "add-open" : "add-closed"}
          categories={categories}
          onSubmit={handleAddProduct}
          isSubmitting={isSubmitting}
          onCancel={() => setAddOpen(false)}
        />
      </SlideOver>
    </div>
  );
}