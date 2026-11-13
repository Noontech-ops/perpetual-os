import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Perpetual connects donors who give by outcomes with nonprofits powered by AI. Free for nonprofits, transparent fees for donors.",
};

export default function HowItWorksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
