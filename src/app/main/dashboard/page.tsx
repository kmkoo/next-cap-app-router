import TempPage from "@/app/PageTemplates/page";

// <head>의 <title> 설정
export const metadata = {
  title: 'Dashboard',
}

// /main/dashboard 페이지
export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <p>Dashboard</p>
      <TempPage />
    </div>
  );
}
