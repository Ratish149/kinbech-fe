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

const ADMIN_ACCESS_KEY = "kb_admin_access";
const ADMIN_REFRESH_KEY = "kb_admin_refresh";

function isAdminSpace(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path.startsWith("/admin") || path.startsWith("/admin-login");
}

function getKeys() {
  if (isAdminSpace()) {
    return { access: ADMIN_ACCESS_KEY, refresh: ADMIN_REFRESH_KEY };
  }
  return { access: ACCESS_KEY, refresh: REFRESH_KEY };
}

export function saveTokens(tokens: AuthTokens) {
  const keys = getKeys();
  localStorage.setItem(keys.access, tokens.access);
  localStorage.setItem(keys.refresh, tokens.refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const keys = getKeys();
  return localStorage.getItem(keys.access);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const keys = getKeys();
  return localStorage.getItem(keys.refresh);
}

export function clearTokens() {
  const keys = getKeys();
  localStorage.removeItem(keys.access);
  localStorage.removeItem(keys.refresh);
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

export async function registerUser(input: {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  password: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Try to format validation error cleanly
    const messages = Object.entries(err)
      .map(([key, val]) => {
        const fieldName = key.replace(/_/g, " ");
        const errMsg = Array.isArray(val) ? val.join(" ") : String(val);
        return `${fieldName}: ${errMsg}`;
      });
    throw new Error(messages.join(" | ") || "Registration failed");
  }
}

