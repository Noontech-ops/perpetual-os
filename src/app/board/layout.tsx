import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board Dashboard",
  description: "Board governance dashboard with financial summaries, meetings, compliance tracking, and strategic oversight.",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
