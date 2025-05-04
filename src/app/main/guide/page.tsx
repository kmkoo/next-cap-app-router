import TempPage from "@/app/PageTemplates/page";

// <head>의 <title> 설정
export const metadata = {
  title: 'Guide',
}

// /main/guide 페이지
export default function GuidePage() {
  return (
    <div className="min-h-screen">
      <p>Guide</p>
      <TempPage />
    </div>
  );
}
