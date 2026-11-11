import OrgProfilePage from "@/app/outcomes/org/[id]/org-profile";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OrgProfilePage orgId={slug} />;
}
