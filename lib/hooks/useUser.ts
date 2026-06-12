import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, updateUserProfile, searchCustomerByPhone, createPOSCustomer } from "@/lib/api/user";
import { UserProfile, UserProfileUpdateInput } from "@/lib/types/auth";

export const userKeys = {
  profile: ["userProfile"] as const,
};

export function useUserProfile(options?: { enabled?: boolean }) {
  return useQuery<UserProfile>({
    queryKey: userKeys.profile,
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UserProfileUpdateInput) => updateUserProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
  });
}

export function useSearchCustomerByPhone() {
  return useMutation({
    mutationFn: (phone: string) => searchCustomerByPhone(phone),
  });
}

export function useCreatePOSCustomer() {
  return useMutation({
    mutationFn: ({ firstName, lastName, phone }: { firstName: string; lastName: string; phone: string }) =>
      createPOSCustomer(firstName, lastName, phone),
  });
}

export function useSearchCustomer(phone: string, options?: { enabled?: boolean }) {
  return useQuery<UserProfile[]>({
    queryKey: ["customerSearch", phone],
    queryFn: () => searchCustomerByPhone(phone),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}


