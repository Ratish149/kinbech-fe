import Link from "next/link";
import { Leaf, Sprout, Truck, ShieldCheck, HandHeart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-x py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-[12px] text-primary bg-accent rounded-full px-3 py-1">
          <Leaf size={12} /> Our story
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-medium mt-4">Farm to table, the honest way</h1>
        <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
          kinbechmart began with a simple idea: that Nepali families deserve clean, fresh, traceable food — and that the farmers who grow it deserve a fair price.
        </p>
      </div>

      {/* Image + story */}
      <div className="mt-14 grid md:grid-cols-2 gap-8 items-center">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=70"
          alt="Nepali farmer in the field"
          className="w-full h-72 md:h-96 object-cover rounded-3xl"
        />
        <div>
          <h2 className="font-serif text-3xl font-medium">A short walk from farm to your kitchen</h2>
          <p className="text-muted-foreground mt-4 text-[14px] leading-relaxed">
            We started in 2022 with three farms in Kavre and a small refrigerated van. Today, we partner with more than 120 farms across Nepal — from Mustang potato growers to Chitwan dairy collectives. Every cut of meat, every vegetable and every jar of honey can be traced back to the person who raised or grew it.
          </p>
          <p className="text-muted-foreground mt-3 text-[14px] leading-relaxed">
            Because we skip middlemen, farmers earn more and you pay less. It is a simple promise: real food, real farmers, real flavor.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mt-20">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-medium">What we stand for</h2>
          <p className="text-muted-foreground mt-2 text-[14px]">The principles that guide every order we deliver.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5 text-[14px]">
          {[
            { Icon: Sprout, t: "Sourced direct", d: "We partner with over 120 farms across Nepal, paying fairly and skipping middlemen." },
            { Icon: Truck, t: "Cut fresh, cold-chained", d: "Meat is cut on the day of order and moved in a cold chain to your home." },
            { Icon: HandHeart, t: "Community-first", d: "Profits reinvest in farmer training, sustainable practices and Nepali agriculture." },
            { Icon: ShieldCheck, t: "Quality guaranteed", d: "Not happy with your order? We refund or replace — no questions asked." },
            { Icon: Leaf, t: "Zero unnecessary plastic", d: "We pack in compostable and reusable materials wherever possible." },
            { Icon: Users, t: "For every Nepali kitchen", d: "From single students to large families — clean food, honest prices." },
          ].map((x) => (
            <div key={x.t} className="border rounded-2xl p-6 bg-white">
              <x.Icon className="text-primary mb-3" size={20} />
              <h3 className="font-serif text-lg font-medium">{x.t}</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 bg-cream rounded-3xl py-12 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "120+", l: "Partner farms" },
            { n: "25k+", l: "Happy households" },
            { n: "12", l: "Districts covered" },
            { n: "4.8★", l: "Average rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-serif text-3xl md:text-4xl font-medium text-primary">{s.n}</p>
              <p className="text-[13px] text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl font-medium text-center">Our journey</h2>
        <ol className="mt-8 space-y-6">
          {[
            { y: "2022", t: "Started with 3 farms in Kavre and one refrigerated van." },
            { y: "2023", t: "Launched the kinbechmart storefront, expanded to 40 farms." },
            { y: "2024", t: "Opened a cold-storage facility in Bhaktapur." },
            { y: "2025", t: "Grew to 120+ partner farms and 25,000+ households served." },
            { y: "2026", t: "Building Nepal's most trusted farm-to-home food network." },
          ].map((e) => (
            <li key={e.y} className="flex gap-5">
              <div className="font-serif text-xl text-primary w-16 shrink-0">{e.y}</div>
              <p className="text-[14px] text-muted-foreground leading-relaxed pt-1">{e.t}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Taste the difference</h2>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-md mx-auto">
          Browse our products and have farm-fresh food at your door tomorrow.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/product" className="bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-[14px] font-medium cursor-pointer">Shop now</Link>
          <Link href="/contact" className="border rounded-full px-6 py-2.5 text-[14px] font-medium cursor-pointer">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
