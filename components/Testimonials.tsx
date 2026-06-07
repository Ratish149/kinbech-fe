import { Leaf } from "lucide-react";

export function Testimonials() {
  const ts = [
    { q: "Best mutton I've had in Kathmandu. Tender, clean, delivered cold.", a: "Pratima R." },
    { q: "The sukuti is exactly like my grandmother used to make.", a: "Bibek K." },
    { q: "Vegetables look like they were picked this morning. Because they were.", a: "Anjali T." },
  ];

  return (
    <section className="container-x py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Loved across Nepal</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {ts.map((t) => (
          <div key={t.a} className="border border-border rounded-2xl p-6 bg-white">
            <Leaf className="text-primary mb-3" size={16} />
            <p className="font-serif text-[17px] leading-relaxed">"{t.q}"</p>
            <p className="text-[13px] text-muted-foreground mt-4">— {t.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
