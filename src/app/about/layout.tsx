import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Perpetual is a two-sided platform connecting donors who give by outcomes with nonprofits powered by AI.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
