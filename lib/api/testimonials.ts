import type { Testimonial } from "@/lib/types/testimonial";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const url = `${API_URL}/testimonials/`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch testimonials: HTTP ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
    return data.results as Testimonial[];
  }
  return [];
}
