"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, User, UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { useSearchCustomer, useCreatePOSCustomer } from "@/lib/hooks/useUser";
import type { UserProfile } from "@/lib/types/auth";

interface POSCustomerSelectProps {
  selectedCustomer: UserProfile | null;
  onSelectCustomer: (customer: UserProfile | null) => void;
}

export default function POSCustomerSelect({
  selectedCustomer,
  onSelectCustomer,
}: POSCustomerSelectProps) {
  const [phone, setPhone] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const createMutation = useCreatePOSCustomer();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce phone input
  useEffect(() => {
    const trimmed = phone.trim();
    if (trimmed.length === 0) {
      setDebouncedPhone("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedPhone(trimmed);
    }, 150);
    return () => clearTimeout(timer);
  }, [phone]);

  const {
    data: searchResults = [],
    isLoading,
    error: searchError,
  } = useSearchCustomer(debouncedPhone, {
    enabled: debouncedPhone.length > 0 && isOpen,
  });

  const hasSearched = debouncedPhone.length > 0 && !isLoading;

  useEffect(() => {
    if (searchError) {
      setErrorMessage(searchError.message || "Failed to search customer.");
    } else {
      setErrorMessage(null);
    }
  }, [searchError]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) {
      setErrorMessage("First Name and Phone Number are required.");
      return;
    }

    setErrorMessage(null);

    try {
      const newCustomer = await createMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      onSelectCustomer(newCustomer);
      handleClearSearch();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create customer.");
    }
  };

  const handleClearSearch = () => {
    setPhone("");
    setDebouncedPhone("");
    setShowCreateForm(false);
    setFirstName("");
    setLastName("");
    setErrorMessage(null);
    setIsOpen(false);
  };

  const selectAndClose = (customer: UserProfile) => {
    onSelectCustomer(customer);
    handleClearSearch();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected Customer View or Search Input */}
      {selectedCustomer ? (
        <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-[13px] shadow-sm">
          <User size={16} className="text-primary mr-2.5 shrink-0" />
          <div className="flex-1 min-w-0 pr-6">
            <span className="font-semibold text-zinc-800">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </span>
            <span className="text-muted-foreground text-[11px] font-medium ml-2">
              ({selectedCustomer.phone_number})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectCustomer(null)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Deselect Customer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (phone.trim().length > 0) setIsOpen(true);
            }}
            placeholder="Customer (optional)"
            className="ml-2.5 flex-1 outline-none text-[13px] bg-transparent text-zinc-800 placeholder-zinc-400"
          />
          {phone.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 ml-1"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Floating Popover Dropdown */}
      {isOpen && phone.trim().length > 0 && !selectedCustomer && (
        <div className="absolute left-0 right-0 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl mt-1 overflow-hidden">
          {/* Searching Spinner */}
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-zinc-500 text-[13px] gap-2">
              <Loader2 size={14} className="animate-spin text-primary" />
              Searching...
            </div>
          )}

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 text-[11px] text-red-600 flex items-start gap-1.5 bg-red-50 border-b border-red-100">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Results list */}
          {!isLoading && hasSearched && searchResults.length > 0 && !showCreateForm && (
            <div className="divide-y divide-zinc-100 max-h-[200px] overflow-y-auto">
              {searchResults.map((cust) => (
                <button
                  type="button"
                  key={cust.id}
                  onClick={() => selectAndClose(cust)}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between text-[12px] transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-zinc-800 group-hover:text-primary transition-colors">
                      {cust.first_name} {cust.last_name}
                    </p>
                    <p className="text-[10px] text-zinc-500">Phone: {cust.phone_number}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium group-hover:text-primary transition-colors">
                    Select
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No customer found state */}
          {!isLoading && hasSearched && searchResults.length === 0 && !showCreateForm && (
            <div className="flex flex-col text-center">
              <div className="text-zinc-400 text-[12px] py-4">No customers found</div>
              <div className="border-t border-zinc-100" />
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="w-full py-3 text-primary text-[12px] font-medium hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <UserPlus size={14} />
                New customer "{phone}"
              </button>
            </div>
          )}

          {/* Inline creation form */}
          {showCreateForm && (
            <form onSubmit={handleCreateCustomer} className="p-4 space-y-3 bg-zinc-50">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                <UserPlus size={13} className="text-primary" />
                Register New Customer
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-400 font-bold block mb-0.5 uppercase">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[12px] bg-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-bold block mb-0.5 uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[12px] bg-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary text-white text-[12px] py-1.5 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-1 shadow-sm"
              >
                {createMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  "Create & Select Customer"
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
