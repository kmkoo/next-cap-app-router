'use client';

import { useEffect, useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

export default function NewServerPage() {
  const [activeTab, setActiveTab] = useState<"server" | "website">("server");
  const [serverScale, setServerScale] = useState("small");
  const [serverName, setServerName] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [serverOwner, setServerOwner] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setServerOwner(storedName);
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch("/api/aws/ec2/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverScale, serverName, serverOwner }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title="서버 생성"
          tabs={[
            { key: "server", label: "서버" },
            // { key: "website", label: "웹사이트" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="px-6 pt-6">
          <PageWrapper key={activeTab}>
            {activeTab === "server" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="py-1.5 text-[16px]">게임 서버 생성</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-11 px-5 text-[15px]">
                      서버 이름
                      <input
                        type="text"
                        placeholder="서버 이름 (고유해야 합니다)"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="flex-1 min-h-[38px] px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      />
                    </div>
                    <div className="flex items-center gap-11 px-5 text-[15px]">
                      서버 규모
                      <select
                        value={serverScale}
                        onChange={(e) => setServerScale(e.target.value)}
                        className="flex-1 min-h-[38px] px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      >
                        <option value="small">소규모 ( 3인 이하 )</option>
                        <option value="medium">중규모 ( 3 ~ 5 인 )</option>
                        <option value="big">대규모 ( 5인 이상 )</option>
                      </select>
                    </div>

                    <div className="flex justify-end px-5">
                      <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="h-[38px] px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center text-sm"
                      >
                        {loading ? (
                          <>
                            <svg className="w-5 h-5 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            생성중...
                          </>
                        ) : (
                          "서버 만들기"
                        )}
                      </button>
                    </div>

                    {response && (
                      <div className="mt-4 px-5">
                        <div className={`p-4 rounded border text-sm ${response.success ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}>
                          {response.success ? (
                            <p>✅ 서버 생성에 성공했습니다.</p>
                          ) : (
                            <p>❌ 서버를 생성하지 못했습니다. {response.errorMessage || "오류 발생"}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "website" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-[16px] mb-6">웹사이트 생성</h2>
                  <p className="text-gray-600">웹사이트 생성 기능은 추후 제공될 예정입니다.</p>
                </div>
              </div>
            )}
          </PageWrapper>
        </div>
      </div>
    </PageWrapper>
  );
}
