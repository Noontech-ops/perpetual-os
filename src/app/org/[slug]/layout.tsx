import OutcomesLayout from "@/app/outcomes/layout";
import type { ReactNode } from "react";

export default function OrgLayout({ children }: { children: ReactNode }) {
  return <OutcomesLayout>{children}</OutcomesLayout>;
}
