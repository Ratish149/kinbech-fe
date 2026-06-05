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
  unit: string;
  description: string;
  stock: number;
};

export const CATEGORIES: { slug: string; name: string; subs: { slug: string; name: string }[] }[] = [
  {
    slug: "fresh-meat",
    name: "Fresh Meat",
    subs: [
      { slug: "mutton", name: "Mutton" },
      { slug: "chicken", name: "Chicken" },
      { slug: "buff", name: "Buff" },
      { slug: "pork", name: "Pork" },
    ],
  },
  {
    slug: "processed-meat",
    name: "Processed Meat",
    subs: [
      { slug: "sausages", name: "Sausages" },
      { slug: "salami", name: "Salami" },
      { slug: "ham", name: "Ham" },
      { slug: "bacon", name: "Bacon" },
    ],
  },
  {
    slug: "cooked-meat",
    name: "Cooked Meat",
    subs: [
      { slug: "ready-curry", name: "Ready Curry" },
      { slug: "kebabs", name: "Kebabs" },
      { slug: "momo", name: "Momo" },
    ],
  },
  {
    slug: "sukuti",
    name: "Sukuti & Dry",
    subs: [
      { slug: "buff-sukuti", name: "Buff Sukuti" },
      { slug: "mutton-sukuti", name: "Mutton Sukuti" },
      { slug: "spicy-sukuti", name: "Spicy Sukuti" },
    ],
  },
  {
    slug: "vegetables",
    name: "Vegetables",
    subs: [
      { slug: "leafy", name: "Leafy Greens" },
      { slug: "root", name: "Root Vegetables" },
      { slug: "seasonal", name: "Seasonal" },
    ],
  },
  {
    slug: "farm-produce",
    name: "Farm Produce",
    subs: [
      { slug: "dairy", name: "Dairy" },
      { slug: "eggs", name: "Eggs" },
      { slug: "honey", name: "Honey & Ghee" },
    ],
  },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

const seed: Omit<Product, "id" | "slug">[] = [
  { name: "Fresh Mutton Curry Cut", category: "fresh-meat", subcategory: "mutton", price: 1450, oldPrice: 1600, rating: 4.7, reviews: 124, image: img("photo-1602471122917-3b938cad4c89"), unit: "1 kg", stock: 30, description: "Tender, hand-cut mutton sourced from highland farms in Nepal." },
  { name: "Country Chicken Whole", category: "fresh-meat", subcategory: "chicken", price: 620, rating: 4.6, reviews: 88, image: img("photo-1604908176997-125f25cc6f3d"), unit: "1 kg", stock: 50, description: "Free-range country chicken raised without antibiotics." },
  { name: "Boneless Buff", category: "fresh-meat", subcategory: "buff", price: 780, rating: 4.5, reviews: 62, image: img("photo-1588347818111-a3a2bb98ba0e"), unit: "1 kg", stock: 25, description: "Lean boneless buff, perfect for curries and stir-fries." },
  { name: "Pork Belly Slices", category: "fresh-meat", subcategory: "pork", price: 990, rating: 4.8, reviews: 41, image: img("photo-1607623814075-e51df1bdc82f"), unit: "500 g", stock: 18, description: "Fresh pork belly cut into perfect slices." },
  { name: "Pork Sausage Pack", category: "processed-meat", subcategory: "sausages", price: 540, rating: 4.4, reviews: 35, image: img("photo-1601001815853-3835274403b3"), unit: "6 pcs", stock: 40, description: "Smoky pork sausages, ready to grill." },
  { name: "Italian Salami", category: "processed-meat", subcategory: "salami", price: 720, oldPrice: 820, rating: 4.6, reviews: 27, image: img("photo-1599583863916-e06c29087f51"), unit: "200 g", stock: 22, description: "Aged Italian-style salami with delicate spices." },
  { name: "Smoked Ham", category: "processed-meat", subcategory: "ham", price: 880, rating: 4.5, reviews: 19, image: img("photo-1607103058027-4c5dbdf73a40"), unit: "250 g", stock: 14, description: "Hardwood smoked ham, sliced thin." },
  { name: "Crispy Bacon Strips", category: "processed-meat", subcategory: "bacon", price: 640, rating: 4.7, reviews: 51, image: img("photo-1528607929212-2636ec44253e"), unit: "200 g", stock: 30, description: "Cured and smoked bacon strips ready to pan-fry." },
  { name: "Ready Chicken Curry", category: "cooked-meat", subcategory: "ready-curry", price: 420, rating: 4.5, reviews: 73, image: img("photo-1604908176997-431a4d0a8b7c"), unit: "500 g", stock: 24, description: "Home-style chicken curry, heat and serve." },
  { name: "Seekh Kebabs", category: "cooked-meat", subcategory: "kebabs", price: 380, rating: 4.6, reviews: 45, image: img("photo-1626776876729-bab4369a5a5a"), unit: "6 pcs", stock: 30, description: "Charcoal-grilled seekh kebabs." },
  { name: "Buff Momo (Frozen)", category: "cooked-meat", subcategory: "momo", price: 320, rating: 4.8, reviews: 156, image: img("photo-1496116218417-1a781b1c416c"), unit: "20 pcs", stock: 60, description: "Handmade buff momos, freezer to steamer." },
  { name: "Classic Buff Sukuti", category: "sukuti", subcategory: "buff-sukuti", price: 1200, rating: 4.9, reviews: 210, image: img("photo-1606851094291-6efae152bb87"), unit: "250 g", stock: 18, description: "Traditional Nepali dried buff, perfectly seasoned." },
  { name: "Mutton Sukuti", category: "sukuti", subcategory: "mutton-sukuti", price: 1650, rating: 4.8, reviews: 92, image: img("photo-1604908176997-1f8c6f4f0e0f"), unit: "250 g", stock: 12, description: "Premium mountain mutton sukuti." },
  { name: "Spicy Achari Sukuti", category: "sukuti", subcategory: "spicy-sukuti", price: 1100, oldPrice: 1300, rating: 4.7, reviews: 64, image: img("photo-1625938144755-652e08e359b7"), unit: "200 g", stock: 20, description: "Tangy, fiery achari sukuti." },
  { name: "Organic Spinach", category: "vegetables", subcategory: "leafy", price: 80, rating: 4.5, reviews: 32, image: img("photo-1576045057995-568f588f82fb"), unit: "500 g", stock: 80, description: "Freshly harvested organic spinach." },
  { name: "Mountain Potatoes", category: "vegetables", subcategory: "root", price: 120, rating: 4.6, reviews: 47, image: img("photo-1518977676601-b53f82aba655"), unit: "1 kg", stock: 100, description: "Earthy mountain potatoes from Mustang." },
  { name: "Seasonal Tomatoes", category: "vegetables", subcategory: "seasonal", price: 95, rating: 4.4, reviews: 28, image: img("photo-1592924357228-91a4daadcfea"), unit: "1 kg", stock: 70, description: "Vine-ripened seasonal tomatoes." },
  { name: "Farm Fresh Milk", category: "farm-produce", subcategory: "dairy", price: 110, rating: 4.7, reviews: 88, image: img("photo-1550583724-b2692b85b150"), unit: "1 L", stock: 50, description: "Pasteurized whole milk from local dairies." },
  { name: "Free-range Eggs", category: "farm-produce", subcategory: "eggs", price: 260, rating: 4.8, reviews: 105, image: img("photo-1582722872445-44dc5f7e3c8f"), unit: "12 pcs", stock: 60, description: "Free-range eggs from village hens." },
  { name: "Wild Honey", category: "farm-produce", subcategory: "honey", price: 950, rating: 4.9, reviews: 73, image: img("photo-1587049352846-4a222e784d38"), unit: "500 g", stock: 30, description: "Pure wild honey from the Himalayan foothills." },
  { name: "Pure Cow Ghee", category: "farm-produce", subcategory: "honey", price: 1350, rating: 4.9, reviews: 119, image: img("photo-1631452180519-c014fe946bc7"), unit: "500 g", stock: 25, description: "Traditional bilona cow ghee." },
];

export const PRODUCTS: Product[] = seed.map((p, i) => ({
  ...p,
  id: String(i + 1),
  slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));

export const BEST_SELLERS = PRODUCTS.filter((p) => p.rating >= 4.7).slice(0, 8);

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getProductsBy = (cat?: string, sub?: string) =>
  PRODUCTS.filter((p) => (!cat || p.category === cat) && (!sub || p.subcategory === sub));
export const getProductBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
