"use client";

import { useState, useEffect, useRef } from "react";
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<{ url: string; file: File }[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Set initial selected category and image preview
  useEffect(() => {
    if (item) {
      setSelectedCat(item.category);
      setPreviewImage(item.thumbnail_image ?? null);
    } else if (categories.length > 0) {
      setSelectedCat(categories[0].slug);
    }
  }, [item, categories]);

  const getSubcategories = (catSlug: string) => {
    const matched = categories.find((c) => c.slug === catSlug);
    return matched?.subs ?? [];
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleMultiImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newEntries = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setGalleryFiles((prev) => [...prev, ...newEntries]);
    // Reset input so same files can be re-added if needed
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Inject gallery files into FormData before submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Attach remaining gallery files back onto the form before calling onSubmit
    const dt = new DataTransfer();
    galleryFiles.forEach(({ file }) => dt.items.add(file));
    if (galleryInputRef.current) galleryInputRef.current.files = dt.files;
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            <input type="hidden" name="category" value={selectedCat} />
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

        </div>

        {/* Image uploads */}
        <div className="space-y-3 rounded-xl border border-border p-3 bg-muted/20">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Images
          </p>

          {/* Thumbnail — previewed as a product card so user sees exact render */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Thumbnail (Main Image)
            </label>
            <input
              type="file"
              name="thumbnail_image"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 bg-white cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
            />
            {/* Product card preview — matches exact ProductCard layout */}
            {previewImage ? (
              <div className="w-40 rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={previewImage}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-1.5 right-1.5 bg-black/55 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    title="Remove thumbnail"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-40 rounded-2xl border border-dashed border-border overflow-hidden bg-white">
                <div className="aspect-square bg-muted/40 flex items-center justify-center">
                  <p className="text-[10px] text-muted-foreground text-center px-2">No thumbnail</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="h-2 bg-muted rounded w-3/4" />
                  <div className="h-2.5 bg-muted rounded w-1/2" />
                </div>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Preview matches the product card shown in the store.
            </p>
          </div>

          {/* Gallery images */}
          <div className="space-y-2 border-t border-border pt-3">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Gallery Images (Multiple)
            </label>
            <input
              ref={galleryInputRef}
              type="file"
              name="uploaded_images"
              accept="image/*"
              multiple
              onChange={handleMultiImagesChange}
              className="w-full text-[13px] border border-border rounded-lg px-3 py-1.5 bg-white cursor-pointer focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
            />
            {galleryFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryFiles.map(({ url }, i) => (
                  <div key={url} className="relative aspect-square group/img">
                    <img
                      src={url}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                    {/* Delete overlay */}
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/img:bg-black/45 rounded-lg transition-all opacity-0 group-hover/img:opacity-100"
                      title="Remove image"
                    >
                      <Trash2 size={16} className="text-white drop-shadow" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] font-medium rounded px-1 pointer-events-none">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
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