import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Perpetual account to power your nonprofit with AI or start giving smarter.",
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
