import { Leaf } from "lucide-react";

export function PromiseSection() {
  const items = [
    { t: "Farm-direct", d: "Sourced straight from Nepali farmers — no middlemen." },
    { t: "Same-day cut", d: "Meat is cut fresh on the day of your order." },
    { t: "Cold-chain", d: "Temperature-controlled all the way to your door." },
    { t: "Easy returns", d: "Not happy? We refund or replace — no questions." },
  ];

  return (
    <section className="container-x py-16 bg-cream rounded-3xl">
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Our promise</h2>
        <p className="text-muted-foreground mt-2 text-[14px]">Real food, real farmers, real flavor.</p>
      </div>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {items.map((i) => (
          <div key={i.t}>
            <Leaf className="text-primary mb-3" size={20} />
            <h4 className="font-serif text-lg font-medium">{i.t}</h4>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
