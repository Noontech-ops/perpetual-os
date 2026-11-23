import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Perpetual OS and Perpetual Outcomes.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
