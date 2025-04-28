import TempPage from "@/app/PageTemplates/page";

export const metadata = {
  title: 'ServerList',
}

export default function ServerListPage() {
  return (
    <div className="min-h-screen">
      <p>Server List</p>
      <TempPage />
    </div>
  );
}
