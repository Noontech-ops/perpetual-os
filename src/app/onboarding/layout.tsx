import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set up your nonprofit on Perpetual OS — import your 990, configure programs, and activate AI agents.",
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return children;
}
