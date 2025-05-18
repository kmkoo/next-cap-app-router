export const metadata = {
  title: "개인정보처리방침 - KS",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-xs leading-relaxed text-gray-800">
      <h1 className="text-base font-bold mb-4">개인정보처리방침</h1>

      <p className="mb-2">
        KS는 「개인정보 보호법」 등 관련 법령에 따라 사용자 여러분의 개인정보를 보호하고, 권익을 보호하기 위해 최선을 다하고 있습니다.
      </p>

      <h2 className="text-sm font-semibold mt-5 mb-2">1. 수집하는 개인정보 항목</h2>
      <p className="mb-2">
        회원가입, EC2/S3 생성 요청 및 이용 과정에서 다음과 같은 개인정보를 수집할 수 있습니다.
      </p>
      <ul className="list-disc list-inside mb-2">
        <li>이름, 이메일 주소, 비밀번호</li>
        <li>AWS 리소스 생성 정보 (예: 인스턴스 이름, 리전, 템플릿 선택 등)</li>
        <li>서비스 이용 기록, 접속 로그, 쿠키, IP 주소 등</li>
      </ul>

      <h2 className="text-sm font-semibold mt-5 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
      <p className="mb-2">
        수집한 개인정보는 다음의 목적을 위해 활용됩니다.
      </p>
      <ul className="list-disc list-inside mb-2">
        <li>AWS 리소스 자동 생성/관리 기능 제공</li>
        <li>회원 관리 및 서비스 개선</li>
        <li>보안 및 접근 제어, 고객 응대</li>
      </ul>

      <h2 className="text-sm font-semibold mt-5 mb-2">3. 개인정보의 보유 및 이용기간</h2>
      <p className="mb-2">
        원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 일정 기간 보존해야 하는 경우에는 해당 기간 동안 안전하게 보관됩니다.
      </p>

      <h2 className="text-sm font-semibold mt-5 mb-2">4. 개인정보의 제3자 제공</h2>
      <p className="mb-2">
        KS는 사용자의 사전 동의 없이 개인정보를 외부에 제공하지 않으며, 필요한 경우 동의를 구합니다.
      </p>

      <h2 className="text-sm font-semibold mt-5 mb-2">5. 이용자 권리와 행사 방법</h2>
      <p className="mb-2">
        사용자는 언제든지 본인의 개인정보에 대해 열람, 정정, 삭제 요청을 할 수 있습니다.
      </p>

      <p className="text-[10px] text-gray-500 mt-10">※ 본 방침은 2025년 5월 16일부터 적용됩니다.</p>
    </div>
  );
}
