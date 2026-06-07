import type { ContactSubmissionInput, ContactSubmission } from "@/lib/types/contact";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function submitContactForm(data: ContactSubmissionInput): Promise<ContactSubmission> {
  const res = await fetch(`${API_URL}/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit contact form: HTTP ${res.status}`);
  }

  return res.json();
}
