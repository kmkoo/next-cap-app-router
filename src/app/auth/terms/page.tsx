export const metadata = {
    title: "이용약관 - EasyAWS",
  };
  
  export default function TermsPage() {
    return (
      <div className="max-w-3xl mx-auto p-6 text-xs leading-relaxed text-gray-800">
        <h1 className="text-base font-bold mb-4">이용약관</h1>
  
        <p className="mb-2">
          본 약관은 KS(이하 "회사")가 제공하는 웹 기반 AWS 리소스 관리 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제1조 (목적)</h2>
        <p className="mb-2">
          이 약관은 회사가 제공하는 서비스의 이용 조건 및 절차, 회사와 이용자 간의 권리∙의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제2조 (정의)</h2>
        <ul className="list-disc list-inside mb-2">
          <li>이용자: 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자</li>
          <li>회원: 서비스에 개인정보를 제공하여 회원 등록을 한 자</li>
          <li>콘솔 대행 기능: AWS EC2, S3 등 리소스를 웹 UI를 통해 생성·관리할 수 있도록 제공하는 기능</li>
        </ul>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제3조 (약관의 게시와 개정)</h2>
        <p className="mb-2">
          회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면 또는 연결화면에 게시합니다. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 공지사항을 통해 고지합니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제4조 (서비스의 제공 및 변경)</h2>
        <p className="mb-2">
          회사는 다음과 같은 서비스를 제공합니다.
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>AWS EC2 서버 생성, 관리 UI</li>
          <li>S3 정적 웹페이지 생성, 템플릿 적용</li>
          <li>사용자 대시보드 및 관리 기능</li>
        </ul>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제5조 (서비스의 중단)</h2>
        <p className="mb-2">
          회사는 서비스 개선 또는 시스템 점검 등으로 일시적인 서비스 중단이 발생할 수 있으며, 사전에 이를 공지합니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제6조 (회원가입)</h2>
        <p className="mb-2">
          사용자는 회사가 정한 가입 양식에 따라 정보를 입력하고 본 약관에 동의함으로써 회원 가입을 신청할 수 있습니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제7조 (회원 탈퇴 및 자격 상실)</h2>
        <p className="mb-2">
          회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령을 준수하여 이를 처리합니다.
        </p>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제8조 (이용자의 의무)</h2>
        <ul className="list-disc list-inside mb-2">
          <li>타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.</li>
          <li>서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
        </ul>
  
        <h2 className="text-sm font-semibold mt-5 mb-2">제9조 (지적재산권)</h2>
        <p className="mb-2">
          서비스에 대한 저작권 및 지적재산권은 회사에 귀속됩니다. 단, 이용자의 생성 콘텐츠는 이용자에게 귀속됩니다.
        </p>
  
        <p className="text-[10px] text-gray-500 mt-10">※ 본 약관은 2025년 5월 16일부터 적용됩니다.</p>
      </div>
    );
  }
  