export interface RegisterInput {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  password?: string;
}

export type AuthMode = "login" | "signup";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface UserProfileUpdateInput {
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}
