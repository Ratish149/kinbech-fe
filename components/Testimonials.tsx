"use client";

import { Leaf, Star } from "lucide-react";
import { useTestimonials } from "@/lib/hooks/useTestimonials";

export function Testimonials() {
  const { data: testimonials = [] } = useTestimonials();

  const items = testimonials.slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Loved across Nepal</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div key={t.name + i} className="border border-border rounded-2xl p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-3">
                <Leaf className="text-primary shrink-0" size={16} />
                {t.rating && (
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: t.rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
              </div>
              <p className="font-serif text-[17px] leading-relaxed">"{t.description}"</p>
            </div>
            <p className="text-[13px] text-muted-foreground mt-4">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

