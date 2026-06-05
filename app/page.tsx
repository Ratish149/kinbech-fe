import { Hero } from "@/app/components/Hero";
import { CategoriesStrip } from "@/app/components/CategoriesStrip";
import { PopularProducts } from "@/app/components/PopularProducts";
import { TwoColumnCategories } from "@/app/components/TwoColumnCategories";
import { PromiseSection } from "@/app/components/PromiseSection";
import { BestSellersSection } from "@/app/components/BestSellersSection";
import { Testimonials } from "@/app/components/Testimonials";

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
