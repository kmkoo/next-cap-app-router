import TempPage from "@/app/PageTemplates/page";

// <head>의 <title> 설정
export const metadata = {
  title: 'About',
}

// /main/about 페이지
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <p>About</p>
      <TempPage />
    </div>
  );
}
