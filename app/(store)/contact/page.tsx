"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/api/contact";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      toast.success("Message Sent", {
        description: "Thank you! Your message has been sent successfully.",
      });
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      const errMsg = err.message || "An error occurred.";
      setError(errMsg);
      toast.error("Submission Failed", {
        description: errMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-x py-16">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-medium">Get in touch</h1>
        <p className="text-muted-foreground mt-3 text-[15px]">
          Questions, feedback or wholesale inquiries — we'd love to hear from you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 max-w-xl mx-auto space-y-4 bg-white border rounded-2xl p-6 md:p-8">
        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-4 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full border rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-primary"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className="w-full border rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-primary"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            placeholder="Phone number"
            className="w-full border rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-primary"
          />
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject (optional)"
            className="w-full border rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-primary"
          />
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Message"
          rows={6}
          className="w-full border rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-primary"
        />
        <div className="flex justify-center pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground rounded-full px-8 py-2.5 text-[14px] font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {submitting && <Loader2 className="animate-spin" size={14} />}
            {submitting ? "Sending..." : "Send message"}
          </button>
        </div>
      </form>

      <div className="mt-14 grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {[
          { Icon: MapPin, label: "Visit", value: "Lazimpat, Kathmandu, Nepal" },
          { Icon: Phone, label: "Call", value: "+977 98-0000-0000" },
          { Icon: Mail, label: "Email", value: "hello@kinbechmart.com" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="border border-border rounded-2xl p-5 text-center bg-white">
            <div className="w-10 h-10 mx-auto rounded-full bg-accent flex items-center justify-center mb-3">
              <Icon size={16} className="text-primary" />
            </div>
            <p className="text-[13px] font-medium">{label}</p>
            <p className="text-[13px] text-muted-foreground mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
