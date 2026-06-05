import Link from "next/link";
import { Logo } from "./Header";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="container-x py-14 grid grid-cols-2 md:grid-cols-5 gap-8 text-[13px]">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 text-muted-foreground max-w-xs leading-relaxed">
            Farm-fresh meat, sukuti and produce delivered straight from Nepali farmers to your door.
          </p>
          <p className="mt-4 text-foreground">Kathmandu, Nepal · +977 98-0000-0000</p>
          <p className="text-muted-foreground">hello@kinbechmart.com</p>
        </div>

        <div>
          <h4 className="font-serif text-[14px] font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-muted-foreground">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-[14px] font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>

          </ul>
        </div>

        <div>
          <h4 className="font-serif text-[14px] font-semibold mb-3">Policies</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/policy/terms" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/policy/refund" className="hover:text-primary">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/policy/return" className="hover:text-primary">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/policy/privacy" className="hover:text-primary">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-5 text-[12px] text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} kinbechmart. All rights reserved.</span>
          <span>Made in Nepal, for Nepali kitchens.</span>
        </div>
      </div>
    </footer>
  );
}
