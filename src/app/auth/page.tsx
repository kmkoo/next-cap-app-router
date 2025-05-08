// <head>의 <title> 설정
export const metadata = {
  title: '로그인',
}

// /auth 페이지
export default function authPage() {
  return (
    <div className="min-h-screen static">
      <div className="bg-green-300 rounded-r-full h-3/5 w-2/4 fixed top-1/10">
        <div className="justify-items-center m-30">
          <p className="font-bold text-4xl z-1">원하는 서버를 바로 생성하고<br/>더 나은 환경을 경험하세요</p>
        </div>
      </div>
      <div className="bg-yellow-300/80 rounded-l-full h-1/3 w-1/2 z-2 fixed right-70 top-1/2"/>
    </div>
  );
}
