import OrgProfilePage from "./org-profile";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrgProfilePage orgId={id} />;
}
