import type { Metadata } from "next";
import { marketplaceOrgs } from "@/lib/mock-marketplace";
import OrgProfilePage from "./org-profile";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const org = marketplaceOrgs.find((o) => o.id === id);
  if (!org) return { title: "Organization Not Found" };
  return {
    title: org.name,
    description: org.mission,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrgProfilePage orgId={id} />;
}
