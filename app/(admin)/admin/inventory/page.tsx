"use client";

import { Plus, Search, Trash2, Loader2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Badge, Field, PageHead, SlideOver, Table, useModal } from "@/components/admin/ui";
import type { Product } from "@/lib/products";
import { fetchCategories } from "@/lib/api/categories";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/lib/api/products";
import type { Category } from "@/lib/types/category";
import { toast } from "sonner";

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

  // Modals state
  const editModal = useModal<Product>();
  const [addOpen, setAddOpen] = useState(false);
  
  // Dynamic subcategories state for Forms
  const [addFormCat, setAddFormCat] = useState("");
  const [editFormCat, setEditFormCat] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load categories and products
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) {
        setAddFormCat(data[0].slug);
      }
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

  // Initial load
  useEffect(() => {
    loadCategories();
  }, []);

  // Sync products list when filters/pages change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle Search Debounce/Reset to Page 1
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  // Subcategories helper
  const getSubcategories = (catSlug: string) => {
    const matched = categories.find((c) => c.slug === catSlug);
    return matched?.subs ?? [];
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const subcat = formData.get("subcategory") as string;
    
    if (!addFormCat || !subcat) {
      toast.error("Please select a category and subcategory.");
      setIsSubmitting(false);
      return;
    }

    formData.set("category", addFormCat);
    formData.set("is_featured", String(formData.get("is_featured") === "on"));
    formData.set("is_best_seller", String(formData.get("is_best_seller") === "on"));

    // Check if thumbnail image file was chosen; if not, remove empty file input so backend doesn't complain
    const thumbFile = formData.get("thumbnail_image") as File;
    if (!thumbFile || thumbFile.size === 0) {
      formData.delete("thumbnail_image");
    }

    // Check multiple uploaded images files
    const imageFiles = formData.getAll("uploaded_images") as File[];
    const validImageFiles = imageFiles.filter(file => file.size > 0);
    formData.delete("uploaded_images");
    validImageFiles.forEach(file => {
      formData.append("uploaded_images", file);
    });

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
    if (!editModal.item) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("category", editFormCat);
    formData.set("is_featured", String(formData.get("is_featured") === "on"));
    formData.set("is_best_seller", String(formData.get("is_best_seller") === "on"));

    // Check thumbnail image file; remove if empty so backend doesn't overwrite with blank
    const thumbFile = formData.get("thumbnail_image") as File;
    if (!thumbFile || thumbFile.size === 0) {
      formData.delete("thumbnail_image");
    }

    // Check multiple uploaded images files
    const imageFiles = formData.getAll("uploaded_images") as File[];
    const validImageFiles = imageFiles.filter(file => file.size > 0);
    formData.delete("uploaded_images");
    validImageFiles.forEach(file => {
      formData.append("uploaded_images", file);
    });

    try {
      await updateProduct(editModal.item.slug, formData);
      toast.success("Product updated successfully!");
      editModal.close();
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
    if (!editModal.item) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(editModal.item.slug);
      toast.success("Product deleted successfully!");
      editModal.close();
      setConfirmDelete(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal and set default forms category
  const openEdit = (prod: Product) => {
    // Find the category object slug
    const catSlug = categories.find((c) => c.slug === prod.category)?.slug || categories[0]?.slug || "";
    setEditFormCat(catSlug);
    setConfirmDelete(false);
    editModal.openWith(prod);
  };

  return (
    <div className="space-y-5">
      <PageHead
        title="Inventory"
        subtitle={`${totalProducts} products in catalog`}
        action={
          <button
            onClick={() => {
              if (categories.length > 0) {
                setAddFormCat(categories[0].slug);
              }
              setAddOpen(true);
            }}
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
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mr-1 shrink-0">Category:</span>
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
      {isLoading ? (
        <div className="bg-white border border-border rounded-xl p-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={24} />
          <p className="text-[13px] text-muted-foreground">Loading products catalog...</p>
        </div>
      ) : (
        <>
          <Table
            rows={products}
            onRowClick={openEdit}
            columns={[
              {
                key: "name",
                label: "Product",
                render: (p) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100"}
                      className="w-9 h-9 rounded-lg object-cover bg-muted"
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100";
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
                    <span className="text-[10px] text-muted-foreground capitalize block">{p.subcategory.replace(/-/g, " ")}</span>
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
                  ) : (
                    <span>{p.stock} {p.unit}</span>
                  ),
              },
              {
                key: "id",
                label: "DB ID",
                render: (p) => (
                  <code className="text-[11px] text-muted-foreground font-semibold">#{p.id}</code>
                ),
              },
            ]}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[12px] text-muted-foreground">
                Page {currentPage} of {totalPages} (Total {totalProducts} items)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 border border-border rounded-lg bg-white disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Delete SlideOver */}
      <SlideOver open={editModal.open} onClose={editModal.close} title={`Edit: ${editModal.item?.name ?? ""}`}>
        {editModal.item && (
          <form onSubmit={handleEditProduct} className="space-y-5">
            <img
              src={editModal.item.image || "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400"}
              className="w-full h-40 object-cover rounded-xl border bg-muted"
              alt=""
            />
            
            <div className="grid grid-cols-1 gap-4">
              <Field label="Product Name *">
                <input
                  required
                  name="name"
                  defaultValue={editModal.item.name}
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category *">
                  <select
                    value={editFormCat}
                    onChange={(e) => setEditFormCat(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategory *">
                  <select
                    name="subcategory"
                    defaultValue={editModal.item.subcategory}
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {getSubcategories(editFormCat).map((s) => (
                      <option key={s.id} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Field label="Price (Rs) *">
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editModal.item.price}
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Market Price">
                  <input
                    type="number"
                    step="0.01"
                    name="market_price"
                    defaultValue={editModal.item.oldPrice || ""}
                    placeholder="Old/original price"
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Unit *">
                  <input
                    required
                    name="unit"
                    defaultValue={editModal.item.unit}
                    placeholder="e.g. 1 kg"
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Count *">
                  <input
                    required
                    type="number"
                    name="stock"
                    defaultValue={editModal.item.stock}
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Image URL (Backup/Direct Link)">
                  <input
                    name="image"
                    defaultValue={editModal.item.image}
                    placeholder="Unsplash URL"
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Thumbnail Image (File)">
                  <input
                    type="file"
                    name="thumbnail_image"
                    accept="image/*"
                    className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                  />
                </Field>
                <Field label="Add Product Images (Multiple Files)">
                  <input
                    type="file"
                    name="uploaded_images"
                    accept="image/*"
                    multiple
                    className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                  />
                </Field>
              </div>

              <div className="flex gap-5 py-1 text-[13px]">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="is_featured"
                    defaultChecked={editModal.item.rating >= 4.7} // mockup or use actual
                    className="accent-primary h-4 w-4 rounded"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="is_best_seller"
                    defaultChecked={true}
                    className="accent-primary h-4 w-4 rounded"
                  />
                  Best Seller
                </label>
              </div>

              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={editModal.item.description}
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <div className="border-t border-border pt-3 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SEO Meta Details</p>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Meta Title">
                    <input
                      name="meta_title"
                      placeholder="Page SEO Title"
                      className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>
                  <Field label="Meta Description">
                    <textarea
                      name="meta_description"
                      placeholder="Page SEO Description"
                      rows={2}
                      className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white rounded-full py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={13} />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={editModal.close}
                  className="border border-border rounded-full px-5 py-2 text-[13px] hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>

              {confirmDelete ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-1 text-center space-y-2">
                  <p className="text-[12px] text-red-800 font-medium">Are you sure? This action is permanent.</p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteProduct}
                      className="bg-red-600 text-white rounded-lg px-3 py-1.5 text-[12px] font-medium hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="bg-white border border-border text-foreground rounded-lg px-3 py-1.5 text-[12px] font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-full text-[12px] font-medium transition-all flex items-center justify-center gap-1"
                >
                  <Trash2 size={13} /> Delete Product
                </button>
              )}
            </div>
          </form>
        )}
      </SlideOver>

      {/* Add Product SlideOver */}
      <SlideOver open={addOpen} onClose={() => setAddOpen(false)} title="Add New Product">
        <form onSubmit={handleAddProduct} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Product Name *">
              <input
                required
                name="name"
                placeholder="e.g. Fresh Chicken Breast"
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category *">
                <select
                  value={addFormCat}
                  onChange={(e) => setAddFormCat(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Subcategory *">
                <select
                  required
                  name="subcategory"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select subcategory</option>
                  {getSubcategories(addFormCat).map((s) => (
                    <option key={s.id} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Field label="Price (Rs) *">
                <input
                  required
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Market Price">
                <input
                  type="number"
                  step="0.01"
                  name="market_price"
                  placeholder="Original price"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Unit *">
                <input
                  required
                  name="unit"
                  placeholder="e.g. 1 kg"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock Quantity *">
                <input
                  required
                  type="number"
                  name="stock"
                  placeholder="0"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Image URL (Backup/Direct Link)">
                <input
                  name="image"
                  placeholder="Unsplash URL"
                  className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Thumbnail Image (File)">
                <input
                  type="file"
                  name="thumbnail_image"
                  accept="image/*"
                  className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                />
              </Field>
              <Field label="Product Images (Multiple Files)">
                <input
                  type="file"
                  name="uploaded_images"
                  accept="image/*"
                  multiple
                  className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                />
              </Field>
            </div>

            <div className="flex gap-5 py-1 text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  name="is_featured"
                  className="accent-primary h-4 w-4 rounded"
                />
                Featured Product
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  name="is_best_seller"
                  className="accent-primary h-4 w-4 rounded"
                />
                Best Seller
              </label>
            </div>

            <Field label="Description">
              <textarea
                name="description"
                placeholder="Product summary and source info..."
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <div className="border-t border-border pt-3 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SEO Meta Details (Optional)</p>
              <div className="grid grid-cols-1 gap-3">
                <Field label="Meta Title">
                  <input
                    name="meta_title"
                    placeholder="Page SEO Title"
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Meta Description">
                  <textarea
                    name="meta_description"
                    placeholder="Page SEO Description"
                    rows={2}
                    className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white rounded-full py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={13} />}
              Save Product
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="border border-border rounded-full px-5 py-2 text-[13px] hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
