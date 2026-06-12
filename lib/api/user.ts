import { getValidAccessToken } from "@/lib/auth";
import { UserProfile, UserProfileUpdateInput } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function fetchUserProfile(): Promise<UserProfile> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No access token found.");

  const res = await fetch(`${API_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user profile: HTTP ${res.status}`);
  }

  return res.json();
}

export async function updateUserProfile(
  input: UserProfileUpdateInput
): Promise<UserProfile> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No access token found.");

  const res = await fetch(`${API_URL}/me/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errMsg = Object.entries(err)
      .map(([key, val]) => `${key.replace(/_/g, " ")}: ${Array.isArray(val) ? val.join(" ") : val}`)
      .join(" | ");
    throw new Error(errMsg || "Failed to update profile.");
  }

  return res.json();
}

export async function searchCustomerByPhone(phone: string): Promise<UserProfile[]> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No access token found.");

  const res = await fetch(`${API_URL}/customers/?phone_number=${phone}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to search customer: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.results || data;
}

export async function createPOSCustomer(
  firstName: string,
  lastName: string,
  phone: string
): Promise<UserProfile> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No access token found.");

  const res = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errMsg = Object.entries(err)
      .map(([key, val]) => `${key.replace(/_/g, " ")}: ${Array.isArray(val) ? val.join(" ") : val}`)
      .join(" | ");
    throw new Error(errMsg || "Failed to create POS customer.");
  }

  return res.json();
}
