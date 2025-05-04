import TempPage from "@/app/PageTemplates/page";

// <head>의 <title> 설정
export const metadata = {
  title: 'ServerList',
}

// /main/serverlist 페이지
export default function ServerListPage() {
  return (
    <div className="min-h-screen">
      <p>Server List</p>
      <TempPage />
    </div>
  );
}
