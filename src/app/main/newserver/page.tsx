'use client';

import { useEffect, useState } from "react";
import PageWrapper from "@/components/page-wrapper";

// /main/newserver 페이지
export default function NewServerPage() {
  const [activeTab, setActiveTab] = useState<"server" | "website">("server");

  const [serverScale, setServerScale] = useState("small");
  const [serverName, setServerName] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [serverOwner, setServerOwner] = useState('');

  useEffect(() => {
    const storedName: string = localStorage.getItem('userName')!;
    setServerOwner(storedName);
  }, []);
  
  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/aws/ec2/create', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverScale, serverName, serverOwner }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
    <PageWrapper>
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
        <div className="mx-1 p-1 text-[20px]">서버생성</div>
        <div className="flex flex-row gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "server" ? "bg-[#F1F3F7]" : ""
            }`}
            onClick={() => setActiveTab("server")}
          >
            서버
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "website" ? "bg-[#F1F3F7]" : ""
            }`}
            onClick={() => setActiveTab("website")}
          >
            웹사이트
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        <PageWrapper key={activeTab}>
        {activeTab === "server" && (
          <div>
            <p className="text-gray-600 mb-2">서버 생성 폼</p>
            <div className="space-y-2 flex flex-col">
              <label>서버 규모</label>
              <select 
                value={serverScale}
                onChange={(e) => setServerScale(e.target.value)}
                className="border p-2 rounded w-80"
              >
                <option value="small">작음</option>
                <option value="medium">보통</option>
                <option value="big">큼</option>
              </select>
              <label>서버 이름</label>
              <p className="text-stone-500">서버 이름은 고유해야합니다.</p>
              <input
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="서버 이름"
                className="border p-2 rounded w-80"
              />
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-50"
              >
                {loading ? "생성 중..." : "서버 만들기"}
              </button>
            </div>

            {response && (
              <div className="mt-4 bg-gray-100 p-4 rounded border-1 w-250 wrap-anywhere">
                {response.success ? (
                  <>
                    <p><strong>서버 생성에 성공했습니다.</strong></p>
                  </>
                ) : (
                  <>
                  <p className="text-red-500">서버를 생성하지 못했습니다. {response.errorMassage}</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "website" && (
          <div>
            <p className="text-gray-600 mb-2">웹사이트 생성 폼</p>
            {/* 추후 웹사이트 생성 폼 컴포넌트 삽입 가능 */}
          </div>
        )}
        </PageWrapper>
      </div>
    </div>
    </PageWrapper>
  );
}