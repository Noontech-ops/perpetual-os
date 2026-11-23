import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Perpetual OS and Perpetual Outcomes. How we handle your data.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
