import OrgProfilePage from "./org-profile";

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "bay-area-literacy" },
  ];
}

export default function Page() {
  return <OrgProfilePage />;
}
