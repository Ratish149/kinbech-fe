"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginWithEmail } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await loginWithEmail(email, password);

      if (!user.is_staff) {
        setError("You do not have admin access. Please contact your administrator.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 space-y-7">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto">
              <Leaf size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold">Admin Portal</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                Sign in to access KinBech administration
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100 text-[13px] text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kinbech.com"
                className="w-full border border-border rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-xl py-3 text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in to Admin"
              )}
            </button>
          </form>

          {/* Back */}
          <p className="text-center text-[12px] text-muted-foreground">
            Not an admin?{" "}
            <a href="/" className="text-primary hover:underline">
              Go to store →
            </a>
          </p>
        </div>

        {/* Security note */}
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Staff accounts only · Only{" "}
          <code className="bg-muted px-1 rounded text-[10px]">is_staff = true</code>{" "}
          users can access this portal
        </p>
      </div>
    </div>
  );
}
