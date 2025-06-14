import PageWrapper from "@/components/page-wrapper";
import { p } from "framer-motion/client";

export const metadata = {
  title: 'Guide',
}

export default function GuidePage() {
  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
          <div className="mx-1 p-1 text-[20px]">
          사용가이드
          </div>
          <div className="text-[14px] mt-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 9h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>
            처음 시작할 때 필요한 사용법을 확인할 수 있어요!
          </div>
        </div>
        <div className="mx-5 my-10">
          <div className="relative w-full h-[0] pt-[56.2500%] pb-0 [box-shadow:0_2px_8px_0_rgba(63,69,81,0.16)] mt-[1.6em] mb-[0.9em] overflow-hidden rounded-[8px]">
            <iframe loading="lazy" className="absolute w-full h-full top-[0] left-[0] border-[none] p-0 m-0"
              src="https://www.canva.com/design/DAGZOZE-2HI/JYjQ5xZer4xHfNX7WPiALA/view?embed" allow="fullscreen">
            </iframe>
          </div>
        </div>
        <br/>
      </div>
    </PageWrapper>
  );
}
