export type OrderItem = {
  id: number;
  product: number;
  product_name: string;
  product_image?: string | null;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  order_id: string;
  full_name: string;
  phone_number: string;
  total_amount: number;
  payment_method: string;
  status: string;
  is_paid: boolean;
  created_at: string;
};

export type OrderDetail = Order & {
  email: string | null;
  shipping_address: string;
  nearest_landmark: string | null;
  discount_amount: number;
  transaction_id: string | null;
  tracking_number: string | null;
  note: string | null;
  items: OrderItem[];
  updated_at: string;
};

export type OrderInput = {
  full_name: string;
  phone_number: string;
  email: string | null;
  shipping_address: string;
  nearest_landmark: string | null;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  status?: string;
  is_paid?: boolean;
  note: string | null;
  items: {
    product: number;
    quantity: number;
    price: number;
  }[];
};

export type OrderUpdateInput = {
  status?: string;
  is_paid?: boolean;
  tracking_number?: string | null;
};
