"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Field } from "@/components/admin/ui";
import type { Product } from "@/lib/products";
import type { Category } from "@/lib/types/category";

type ProductFormProps = {
  item?: Product;
  categories: Category[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
};

export function ProductForm({
  item,
  categories,
  onSubmit,
  isSubmitting,
  onCancel,
  onDelete,
}: ProductFormProps) {
  // Category & dynamic subcategories selection state
  const [selectedCat, setSelectedCat] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Set initial selected category
  useEffect(() => {
    if (item) {
      setSelectedCat(item.category);
    } else if (categories.length > 0) {
      setSelectedCat(categories[0].slug);
    }
  }, [item, categories]);

  const getSubcategories = (catSlug: string) => {
    const matched = categories.find((c) => c.slug === catSlug);
    return matched?.subs ?? [];
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {item?.image && (
        <img
          src={item.image}
          className="w-full h-40 object-cover rounded-xl border bg-muted"
          alt={item.name}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        <Field label="Product Name *">
          <input
            required
            name="name"
            defaultValue={item?.name ?? ""}
            placeholder="e.g. Fresh Chicken Breast"
            className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category *">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategory *">
            <select
              required
              name="subcategory"
              defaultValue={item?.subcategory ?? ""}
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {!item && <option value="">Select subcategory</option>}
              {getSubcategories(selectedCat).map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
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
              defaultValue={item?.price ?? ""}
              placeholder="0"
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Field label="Market Price">
            <input
              type="number"
              step="0.01"
              name="market_price"
              defaultValue={item?.oldPrice ?? ""}
              placeholder="Original price"
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Field label="Unit *">
            <input
              required
              name="unit"
              defaultValue={item?.unit ?? ""}
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
              defaultValue={item?.stock ?? ""}
              placeholder="0"
              className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>
          <Field label="Image URL (Backup/Direct Link)">
            <input
              name="image"
              defaultValue={item?.image ?? ""}
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
              defaultChecked={item?.is_featured ?? false}
              className="accent-primary h-4 w-4 rounded"
            />
            Featured Product
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              name="is_best_seller"
              defaultChecked={item?.is_best_seller ?? false}
              className="accent-primary h-4 w-4 rounded"
            />
            Best Seller
          </label>
        </div>

        <Field label="Description">
          <textarea
            name="description"
            defaultValue={item?.description ?? ""}
            placeholder="Product summary and source info..."
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <div className="border-t border-border pt-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            SEO Meta Details (Optional)
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Meta Title">
              <input
                name="meta_title"
                defaultValue={item?.meta_title ?? ""}
                placeholder="Page SEO Title"
                className="w-full border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                name="meta_description"
                defaultValue={item?.meta_description ?? ""}
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
            {item ? "Save Changes" : "Save Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-border rounded-full px-5 py-2 text-[13px] hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>

        {onDelete && (
          <>
            {confirmDelete ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-1 text-center space-y-2">
                <p className="text-[12px] text-red-800 font-medium">
                  Are you sure? This action is permanent.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={onDelete}
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
          </>
        )}
      </div>
    </form>
  );
}
