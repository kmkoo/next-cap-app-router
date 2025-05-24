'use client';

import { useState } from "react";
import PageWrapper from "@/components/page-wrapper";

// /main/newserver 페이지
export default function NewServerPage() {
  const [activeTab, setActiveTab] = useState<"server" | "website">("server");

  const [serverScale, setServerScale] = useState("small");
  const [serverName, setServerName] = useState('');
  const [userCommand, setUserCommand] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const serverOwner = "유저이름";  // 유저 이름 들어가도록 수정예정
  

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/aws/ec2/create', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverScale, serverName, serverOwner, userCommand }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  const handleDesc = async () => {
    setLoading(true);
    const res = await fetch('/api/aws/ec2/describe', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "instances": "NONE" }),  // 이부분 나중에 바꿔야됨
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
                  className="border p-2 rounded w-100"
                >
                  <option value="small">작음</option>
                  <option value="medium">보통</option>
                  <option value="big">큼</option>
                </select>
                <input
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="서버 이름"
                  className="border p-2 rounded w-100"
                />
                <input
                  value={userCommand}
                  onChange={(e) => setUserCommand(e.target.value)}
                  placeholder="자동실행 명령어 입력 (옵션)"
                  className="border p-2 rounded w-100"
                />
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "생성 중..." : "인스턴스 생성"}
                </button>
                <button
                  onClick={handleDesc}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "확인 중..." : "인스턴스 확인"}
                </button>
              </div>

              {response && (
                <div className="mt-4 bg-gray-100 p-4 rounded">
                  {response.success ? (
                    <>
                      <p><strong>인스턴스:</strong> {response.instanceList}</p>
                      <p><strong>상태:</strong> {response.instanceList.instance.State?.Name}</p>
                    </>
                  ) : (
                    <p className="text-red-500">오류: {response.error}</p>
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
