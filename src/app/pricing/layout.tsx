import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Perpetual OS. Free for nonprofits. No hidden fees.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
