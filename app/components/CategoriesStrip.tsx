import { Leaf, ShieldCheck, Truck } from "lucide-react";

export function CategoriesStrip() {
  return (
    <section className="container-x py-8 border-t border-border">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-primary" /> Free delivery over Rs 1500
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" /> Quality guaranteed
        </div>
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-primary" /> 100% farm-direct
        </div>
      </div>
    </section>
  );
}
