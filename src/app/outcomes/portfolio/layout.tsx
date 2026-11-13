import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Giving Portfolio",
  description: "Track your giving as a portfolio over time. See what you gave, to whom, and what impact they achieved.",
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return children;
}
