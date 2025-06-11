'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

export default function NewServerPage() {
  const router = useRouter();
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

    if (data.success) {
      setTimeout(() => {
        router.push("/main/serverlist");
      }, 1000);
    } else {
      setTimeout(() => {
        setResponse(null);
      }, 2000);
    }
  };

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title="서버 생성"
          tabs={[{ key: "server", label: "서버" }]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="px-6 pt-6">
          <PageWrapper key={activeTab}>
            {activeTab === "server" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" strokeWidth="2">
                      <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                      <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                      <path d="M7 8l0 .01" />
                      <path d="M7 16l0 .01" />
                    </svg>
                    <h2 className="text-lg font-bold">게임 서버 생성</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서버 이름</label>
                      <input
                        type="text"
                        placeholder="예: 나의 게임 서버"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서버 규모</label>
                      <div className="flex justify-between gap-3">
                        {[
                          { label: "소규모", value: "small" },
                          { label: "중규모", value: "medium" },
                          { label: "대규모", value: "big" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setServerScale(option.value)}
                            className={`flex-1 py-5 mb-8 rounded-md text-sm font-medium border transition-all duration-150 ${
                              serverScale === option.value
                                ? "bg-neutral-600 text-white"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full py-5 rounded-md text-white bg-neutral-600 hover:bg-neutral-700 flex items-center justify-center text-sm font-medium gap-2"
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
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
                              <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                              <path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12" />
                              <path d="M7 8v.01" />
                              <path d="M7 16v.01" />
                              <path d="M20 15l-2 3h3l-2 3" />
                            </svg>
                            서버 만들기
                          </>
                        )}
                      </button>
                    </div>

                    {response && (
                      <div className={`mt-4 p-4 rounded border text-sm ${response.success ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}>
                        {response.success ? (
                          <p>✅ 서버 생성에 성공했습니다. 잠시 후 이동합니다.</p>
                        ) : (
                          <p>❌ 서버를 생성하지 못했습니다. {response.errorMessage || "오류 발생"}</p>
                        )}
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
