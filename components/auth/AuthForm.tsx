"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerUser } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { AuthMode } from "@/lib/types/auth";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Toggle visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Standard validations
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in email and password fields.");
      return;
    }

    if (mode === "signup") {
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !confirmPassword.trim()) {
        toast.error("Please fill in all details for registration.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        const { user } = await loginWithEmail(email.trim(), password);
        toast.success("Welcome back!");
        if (user.is_staff) {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
        // Force header reload
        setTimeout(() => window.location.reload(), 100);
      } else {
        await registerUser({
          email: email.trim(),
          phone_number: phone.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          password: password,
        });
        toast.success("Account created! Logging you in...");

        // Auto login after signup
        const { user } = await loginWithEmail(email.trim(), password);
        if (user.is_staff) {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-2xl rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-semibold text-zinc-900">
          {mode === "login" ? "Welcome back" : "Join kinbechmart"}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1.5">
          {mode === "login"
            ? "Sign in to access your orders and checkout quickly."
            : "Create an account to track your farm-fresh orders."}
        </p>
      </div>

      {/* Toggle Tabs */}
      <div className="flex bg-zinc-100 rounded-xl p-1 mb-6 border border-zinc-200/40">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
            mode === "login"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-muted-foreground hover:text-zinc-700"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-muted-foreground hover:text-zinc-700"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                First Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                Last Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-3.5 text-zinc-400" />
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-3.5 text-zinc-400" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-3.5 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-10 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {mode === "signup" && (
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3.5 text-zinc-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary/50 rounded-xl pl-9 pr-10 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:opacity-90 active:scale-[0.99] text-white rounded-xl py-3 text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-6"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {mode === "login" ? "Sign In" : "Sign Up"}
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Footer toggle */}
      <div className="text-center mt-6 pt-5 border-t border-zinc-100 text-[12px] text-muted-foreground">
        {mode === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              Create an account
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              Sign in instead
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
