import type { Metadata } from "next";
import OSShell from "./os-shell";

export const metadata: Metadata = {
  title: "Nonprofit OS",
  description:
    "AI-powered operating system for nonprofit management — grants, donors, finance, compliance, and more.",
};

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <OSShell>{children}</OSShell>;
}
