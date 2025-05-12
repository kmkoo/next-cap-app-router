import TempPage from "@/app/PageTemplates/page";

// <head>의 <title> 설정
export const metadata = {
  title: 'Guide',
}

// /main/guide 페이지
export default function GuidePage() {
  return (
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
        <div className="mx-1 p-1 text-[20px]">
          사용가이드
        </div>
      </div>
      <p>guide</p>
      <TempPage />
    </div>
  );
}
