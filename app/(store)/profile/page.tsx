"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useUserProfile, useUpdateUserProfile } from "@/lib/hooks/useUser";
import { toast } from "sonner";
import { Loader2, User, Phone, Mail, Edit2, X, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Check login on client side first
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  // Query and Mutation hooks
  const { data: profile, isLoading, isError } = useUserProfile({ enabled: isLoggedIn });
  const updateProfileMutation = useUpdateUserProfile();

  // Populate state when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      lastName === "" && setLastName(profile.last_name || "");
      phone === "" && setPhone(profile.phone_number || "");
    }
  }, [profile]);

  // Keep these details synced if profile changes in background
  useEffect(() => {
    if (profile && !isEditing) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone_number || "");
    }
  }, [profile, isEditing]);

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-tr from-cream/30 via-white to-emerald-50/10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-tr from-cream/30 via-white to-emerald-50/10 flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 p-8 rounded-2xl max-w-sm text-center shadow-lg">
          <p className="text-red-500 font-semibold mb-4">Failed to load profile details.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white rounded-xl px-5 py-2 text-[13px] font-semibold hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast.error("Please fill in all basic profile details.");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim(),
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile details.");
    }
  };

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <div className="min-h-[80vh] bg-gradient-to-tr from-cream/50 via-white to-emerald-50/20 py-12 px-4 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-700/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-[500px] z-10">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-primary transition-colors text-[13px] font-medium mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to store
        </Link>

        {/* Profile Card */}
        <div className="bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-2xl rounded-3xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center shadow-inner">
                {initials}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-zinc-950">
                  {profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : "My Profile"}
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Member since {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition cursor-pointer"
                title="Edit Details"
              >
                <Edit2 size={15} />
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                  First Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-primary/50 disabled:bg-zinc-50/40 disabled:text-zinc-500 rounded-xl pl-10 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                  Last Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-primary/50 disabled:bg-zinc-50/40 disabled:text-zinc-500 rounded-xl pl-10 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email (Always Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide flex justify-between">
                <span>Email Address</span>
                <span className="text-[10px] lowercase text-zinc-400 italic">not editable</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-3.5 text-zinc-300" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-zinc-50/30 border border-zinc-100 text-zinc-400 rounded-xl pl-10 pr-3 py-2.5 text-[13px] cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-primary/50 disabled:bg-zinc-50/40 disabled:text-zinc-500 rounded-xl pl-10 pr-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-primary/10 transition"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 text-zinc-700 rounded-xl py-2.5 text-[13px] font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 bg-primary hover:opacity-90 disabled:opacity-50 text-white rounded-xl py-2.5 text-[13px] font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
