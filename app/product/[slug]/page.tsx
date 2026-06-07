"use client";

import Link from "next/link";
import { ChevronRight, Leaf, Minus, Plus, Star, Truck, Loader2 } from "lucide-react";
import { useState, useMemo, use, Suspense, useEffect } from "react";
import { useProductBySlug, useReviewsByProductSlug, useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";

function ProductDetailContent({ slug }: { slug: string }) {
  const { add } = useCart();
  
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch product data
  const { data: product, isLoading: loadingProduct, error: productError } = useProductBySlug(slug);

  // Combine main image and extra images
  const allImages = useMemo(() => {
    if (!product) return [];
    const list = [product.image];
    if (product.images) {
      product.images.forEach((imgObj) => {
        if (imgObj.image && imgObj.image !== product.image) {
          list.push(imgObj.image);
        }
      });
    }
    return list;
  }, [product]);

  const mainImage = activeImage || product?.image;

  // Fetch reviews data
  const { data: backendReviews = [], isLoading: loadingReviews } = useReviewsByProductSlug(slug);

  // Query suggested products under the same subcategory
  const { data: subData, isFetched: isSubFetched } = useProducts({
    subcategory: product?.subcategory,
  }, {
    enabled: !!product && !!product.subcategory,
  });

  const subProducts = useMemo(() => {
    if (!product || !subData) return [];
    return (subData.products ?? []).filter((p) => p.id !== product.id);
  }, [subData, product]);

  // Query suggested products under the same category
  // ONLY if subcategory is null/undefined, OR if subcategory has loaded and returned no other products
  const { data: catData } = useProducts({
    category: product?.category,
  }, {
    enabled: !!product && (!product.subcategory || (isSubFetched && subProducts.length === 0)),
  });

  // Determine "You may also like" suggestions
  const suggested = useMemo(() => {
    if (!product) return [];

    if (subProducts.length > 0) {
      return subProducts.slice(0, 4);
    }
    
    // Fallback to same category
    return (catData?.products ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  }, [subProducts, catData, product]);

  const reviews = useMemo(() => {
    return backendReviews.map((r) => ({
      name: r.user || "Anonymous",
      rating: r.rating,
      text: r.comment,
    }));
  }, [backendReviews]);

  if (loadingProduct) {
    return (
      <div className="container-x py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container-x py-20 text-center flex flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-serif font-semibold">Product not found</h1>
        <p className="text-muted-foreground text-sm">The product you are looking for does not exist or has been removed.</p>
        <Link href="/product" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium mt-4">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-muted-foreground flex items-center gap-1.5 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link href="/product" className="hover:text-primary">Products</Link>
        <ChevronRight size={12} />
        <Link href={`/product?category=${product.category}`} className="hover:text-primary capitalize">
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="md:sticky md:top-24 md:self-start space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
            <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-square rounded-xl overflow-hidden bg-muted border transition cursor-pointer ${
                    mainImage === imgUrl ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium leading-tight">{product.name}</h1>
          {product.reviews > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-[13px]">
              <Star size={14} className="fill-primary text-primary" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          )}
          <div className="flex items-end gap-3 mt-5">
            <p className="text-3xl font-semibold">Rs {product.price}</p>
            {product.oldPrice && <p className="text-muted-foreground line-through">Rs {product.oldPrice}</p>}
            {product.oldPrice && (
              <span className="text-[12px] text-primary bg-accent px-2 py-0.5 rounded-full">
                Save Rs {product.oldPrice - product.price}
              </span>
            )}
          </div>
          <p className="text-[14px] text-muted-foreground mt-1">per {product.unit}</p>

          <p className="mt-5 text-[14px] leading-relaxed text-foreground">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 hover:bg-muted rounded-l-full cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-[14px] w-10 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 hover:bg-muted rounded-r-full cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, qty);
              }}
              className="flex-1 bg-primary text-primary-foreground rounded-full py-3 text-[14px] font-medium hover:opacity-90 cursor-pointer"
            >
              Add to cart
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 text-[12px]">
            <div className="flex items-start gap-2 p-3 bg-accent/30 rounded-xl">
              <Truck size={16} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Free over Rs 1500</p>
                <p className="text-muted-foreground">Same-day in Kathmandu</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-accent/30 rounded-xl">
              <Leaf size={16} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Farm-direct</p>
                <p className="text-muted-foreground">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-12">
          {/* Specs */}
          <section>
            <h2 className="font-serif text-2xl font-medium mb-4">Product information</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-[14px]">
              <dt className="text-muted-foreground">Unit</dt>
              <dd>{product.unit}</dd>
              <dt className="text-muted-foreground">Storage</dt>
              <dd>Refrigerate at 0-4°C</dd>
              <dt className="text-muted-foreground">Shelf life</dt>
              <dd>3-5 days fresh, 30 days frozen</dd>
            </dl>
          </section>

          {/* Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-medium mb-4">Reviews</h2>
              <div className="space-y-5">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-border pb-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[14px]">{r.name}</span>
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[14px] mt-1.5 text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Write a review */}
          {isLoggedIn ? (
            <section className="mt-6 border border-border rounded-2xl p-5">
              <h3 className="font-serif text-lg font-medium mb-3">Write a review</h3>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                className="w-full text-[14px] border border-border rounded-xl p-3 outline-none focus:border-primary min-h-[100px]"
              />
              <button className="mt-3 bg-primary text-primary-foreground rounded-full px-5 py-2 text-[13px] font-medium hover:opacity-90 cursor-pointer">
                Submit review
              </button>
            </section>
          ) : (
            <div className="mt-6 text-sm">
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in to write a review
              </Link>
            </div>
          )}
        </div>

        {/* Sticky aside */}
        <aside className="md:sticky md:top-24 md:self-start border border-border rounded-2xl p-5 h-fit bg-white">
          <div className="flex gap-3">
            <img src={product.image} className="w-20 h-20 rounded-xl object-cover" alt={product.name} />
            <div className="flex-1">
              <p className="text-[14px] font-medium leading-snug">{product.name}</p>
              <p className="text-[12px] text-muted-foreground">{product.unit}</p>
              <p className="text-[16px] font-semibold mt-1">Rs {product.price}</p>
            </div>
          </div>
          <button
            onClick={() => add(product, qty)}
            className="mt-4 w-full bg-primary text-primary-foreground rounded-full py-2.5 text-[13px] font-medium hover:opacity-90 cursor-pointer"
          >
            Add to cart
          </button>
        </aside>
      </div>

      {/* Suggested Products */}
      <section className="mt-20">
        <h2 className="font-serif text-2xl font-medium mb-6">You may also like</h2>
        {suggested.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suggested products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggested.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="container-x py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-muted-foreground">Loading details...</p>
        </div>
      }
    >
      <ProductDetailContent slug={slug} />
    </Suspense>
  );
}
