import PageWrapper from "@/components/page-wrapper";

export const metadata = {
  title: "메인",
};

export default function AuthPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen flex items-center justify-center bg-[#F1F3F7] px-6 py-10">
        <div className="flex flex-col xl:flex-row items-center justify-between max-w-7xl w-full gap-6">
          <div className="flex-[0.3] w-full px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              복잡한 설정 없이
              <br />
              간편하게 시작하는
              <br />
              클라우드 플랫폼
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              원하는 서버를 바로 생성하고
              <br />더 나은 환경을 경험하세요.
            </p>
          </div>

          <div className="flex-[0.7] w-full flex px-4 mt-8 md:mt-0">
            <video
              className="w-full h-auto rounded-2xl shadow-2xl"
              autoPlay
              muted
              loop
            >
              <source src="/demo.mp4" type="video/mp4" />
              브라우저가 video 태그를 지원하지 않습니다.
            </video>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
