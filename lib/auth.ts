const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

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

/** Decode a JWT without verifying signature (client-side only). */
export function decodeJwt(token: string): TokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  return Date.now() / 1000 > payload.exp;
}

// ── Token storage ──────────────────────────────────────────────────────────
const ACCESS_KEY = "kb_access";
const REFRESH_KEY = "kb_refresh";

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getCurrentUser(): TokenPayload | null {
  const token = getAccessToken();
  if (!token) return null;
  if (isTokenExpired(token)) return null;
  return decodeJwt(token);
}

export function isAdminUser(): boolean {
  const user = getCurrentUser();
  return !!user?.is_staff;
}

// ── API calls ──────────────────────────────────────────────────────────────
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ tokens: AuthTokens; user: TokenPayload }> {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.detail ?? err.non_field_errors?.[0] ?? "Login failed"
    );
  }

  const data: AuthTokens = await res.json();
  saveTokens(data);
  const user = decodeJwt(data.access)!;
  return { tokens: data, user };
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data: { access: string } = await res.json();
  localStorage.setItem(ACCESS_KEY, data.access);
  return data.access;
}

/** Returns a valid access token, refreshing if needed. */
export async function getValidAccessToken(): Promise<string | null> {
  const token = getAccessToken();
  if (token && !isTokenExpired(token)) return token;
  return refreshAccessToken();
}
