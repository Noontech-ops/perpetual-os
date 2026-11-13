import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Perpetual account to manage your nonprofit or giving portfolio.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
