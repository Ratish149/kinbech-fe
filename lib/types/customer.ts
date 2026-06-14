export interface Customer {
  id: number;
  username: string;
  email: string | null;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  total_orders: number;
  total_spent: string | number;
}

export type PaginatedCustomers = {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
  results: Customer[];
};
