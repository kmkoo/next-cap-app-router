import PageWrapper from "@/components/page-wrapper"
export const metadata = {
  title: '메인',
};

export default function AuthPage() {
  return (
    <PageWrapper>
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl w-full gap-12">
        
        {/* 왼쪽: 텍스트 영역 (작게) */}
        <div className="flex-[0.8]">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
            복잡한 설정 없이<br />
            간편하게 시작하는 클라우드 플랫폼
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            원하는 서버를 바로 생성하고<br />
            더 나은 환경을 경험하세요.
          </p>
        </div>

        {/* 오른쪽: 영상 영역 (크게) */}
        <div className="flex-[1.2]">
          <video
            className="w-full max-w-3xl h-auto rounded-2xl shadow-2xl"
            controls
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
