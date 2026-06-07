export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: { id: number; image: string }[];
  unit: string;
  description: string;
  stock: number;
};
