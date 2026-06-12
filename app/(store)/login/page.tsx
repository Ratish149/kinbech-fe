"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.is_staff) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  return (
    <div className="flex-1 min-h-[85vh] bg-gradient-to-tr from-cream/50 via-white to-emerald-50/20 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-700/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-primary transition-colors text-[13px] font-medium mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to store
        </Link>

        {/* Auth Form Component */}
        <AuthForm />
      </div>
    </div>
  );
}

