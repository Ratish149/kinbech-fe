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

export type TokenPayload = {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_staff: boolean;
  exp: number;
  iat: number;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};
