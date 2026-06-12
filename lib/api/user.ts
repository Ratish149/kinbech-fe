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
