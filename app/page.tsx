import { Hero } from "@/components/Hero";
import { CategoriesStrip } from "@/components/CategoriesStrip";
import { PopularProducts } from "@/components/PopularProducts";
import { TwoColumnCategories } from "@/components/TwoColumnCategories";
import { PromiseSection } from "@/components/PromiseSection";
import { BestSellersSection } from "@/components/BestSellersSection";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <CategoriesStrip />
      <PopularProducts />
      <TwoColumnCategories />
      <PromiseSection />
      <BestSellersSection />
      <Testimonials />
    </div>
  );
}
