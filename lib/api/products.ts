import type { Product } from "@/lib/products";
import { getValidAccessToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type BackendProduct = {
  id: string | number;
  slug: string;
  name: string;
  category: { id: string | number; slug: string; name: string } | string;
  subcategory: { id: string | number; slug: string; name: string } | string;
  price: string | number;
  market_price?: string | number | null;
  thumbnail_image?: string | null;
  thumbnail_alt?: string | null;
  images?: { id: number; image: string }[];
  unit: string;
  description?: string;
  stock?: number;
  average_rating?: number;
  total_reviews?: number;
  is_featured?: boolean;
  is_best_seller?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
};

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_best_seller?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
  search?: string;
};

export type PaginatedProducts = {
  products: Product[];
  count: number;
  totalPages: number;
  page: number;
};

export async function fetchProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.page_size ?? 15;
  let url = `${API_URL}/products/?page=${page}&page_size=${pageSize}`;

  if (filters) {
    const searchParams = new URLSearchParams();
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.subcategory) searchParams.append("subcategory", filters.subcategory);
    if (filters.min_price !== undefined) searchParams.append("min_price", String(filters.min_price));
    if (filters.max_price !== undefined) searchParams.append("max_price", String(filters.max_price));
    if (filters.is_featured !== undefined) searchParams.append("is_featured", String(filters.is_featured));
    if (filters.is_best_seller !== undefined) searchParams.append("is_best_seller", String(filters.is_best_seller));
    if (filters.ordering) searchParams.append("ordering", filters.ordering);
    if (filters.search) searchParams.append("search", filters.search);
    url += `&${searchParams.toString()}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: HTTP ${res.status}`);
  }

  const data = await res.json();
  const count = data.count ?? 0;
  const totalPages = data.total_pages ?? 1;
  const currentPage = data.page ?? 1;
  const results: BackendProduct[] = Array.isArray(data) ? data : (data.results ?? []);

  const products = results.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: typeof p.category === "object" ? p.category.slug : p.category,
    subcategory: typeof p.subcategory === "object" ? p.subcategory.slug : p.subcategory,
    price: Number(p.price),
    oldPrice: p.market_price ? Number(p.market_price) : undefined,
    rating: p.average_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    thumbnail_image: p.thumbnail_image || undefined,
    thumbnail_alt: p.thumbnail_alt ?? null,
    images: p.images ?? [],
    unit: p.unit,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    meta_title: p.meta_title ?? null,
    meta_description: p.meta_description ?? null,
  }));

  return {
    products,
    count,
    totalPages,
    page: currentPage,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}/`);
  if (!res.ok) {
    throw new Error(`Failed to fetch product: HTTP ${res.status}`);
  }

  const p: BackendProduct = await res.json();
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: typeof p.category === "object" ? p.category.slug : p.category,
    subcategory: typeof p.subcategory === "object" ? p.subcategory.slug : p.subcategory,
    price: Number(p.price),
    oldPrice: p.market_price ? Number(p.market_price) : undefined,
    rating: p.average_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    thumbnail_image: p.thumbnail_image || undefined,
    thumbnail_alt: p.thumbnail_alt ?? null,
    images: p.images ?? [],
    unit: p.unit,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    meta_title: p.meta_title ?? null,
    meta_description: p.meta_description ?? null,
  };
}

export type Review = {
  id: number;
  user: string;
  product: string;
  rating: number;
  comment: string;
  created_at: string;
};

export async function fetchReviewsByProductSlug(slug: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/reviews/?product=${slug}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: HTTP ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export type ProductInput = {
  name: string;
  category: string; // expects slug
  subcategory: string; // expects slug
  price: number;
  market_price?: number | null;
  image?: string | null;
  unit: string;
  description?: string;
  stock?: number;
  is_featured?: boolean;
  is_best_seller?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
};

export async function createProduct(formData: FormData): Promise<Product> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Unauthorized: No admin access token found.");

  const res = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail ?? JSON.stringify(errData) ?? "Failed to create product");
  }

  const p: BackendProduct = await res.json();
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: typeof p.category === "object" ? p.category.slug : p.category,
    subcategory: typeof p.subcategory === "object" ? p.subcategory.slug : p.subcategory,
    price: Number(p.price),
    oldPrice: p.market_price ? Number(p.market_price) : undefined,
    rating: p.average_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    thumbnail_image: p.thumbnail_image || undefined,
    thumbnail_alt: p.thumbnail_alt ?? null,
    images: p.images ?? [],
    unit: p.unit,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    meta_title: p.meta_title ?? null,
    meta_description: p.meta_description ?? null,
  };
}

export async function updateProduct(slug: string, formData: FormData): Promise<Product> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Unauthorized: No admin access token found.");

  const res = await fetch(`${API_URL}/products/${slug}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail ?? JSON.stringify(errData) ?? "Failed to update product");
  }

  const p: BackendProduct = await res.json();
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    category: typeof p.category === "object" ? p.category.slug : p.category,
    subcategory: typeof p.subcategory === "object" ? p.subcategory.slug : p.subcategory,
    price: Number(p.price),
    oldPrice: p.market_price ? Number(p.market_price) : undefined,
    rating: p.average_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    thumbnail_image: p.thumbnail_image || undefined,
    thumbnail_alt: p.thumbnail_alt ?? null,
    images: p.images ?? [],
    unit: p.unit,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    is_featured: p.is_featured,
    is_best_seller: p.is_best_seller,
    meta_title: p.meta_title ?? null,
    meta_description: p.meta_description ?? null,
  };
}

export async function deleteProduct(slug: string): Promise<void> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Unauthorized: No admin access token found.");

  const res = await fetch(`${API_URL}/products/${slug}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail ?? JSON.stringify(errData) ?? "Failed to delete product");
  }
}


