export type Subcategory = {
  id: string;
  slug: string;
  name: string;
  is_featured?: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  is_featured?: boolean;
  image?: string | null;
  subs: Subcategory[];
};
