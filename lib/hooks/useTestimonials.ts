import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api/testimonials";
import type { Testimonial } from "@/lib/types/testimonial";

export const testimonialKeys = {
  all: ["testimonials"] as const,
};

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: testimonialKeys.all,
    queryFn: () => fetchTestimonials(),
    staleTime: 1000 * 60 * 5, // 5 minutes — testimonials rarely change
  });
}
