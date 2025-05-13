/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";

// /main/newserver 페이지
export default function NewServerPage() {
  const [activeTab, setActiveTab] = useState<"server" | "website">("server");

  const [imageId, setImageId] = useState('ami-id');
  const [instanceType, setInstanceType] = useState('t3.small');
  const [keyName, setKeyName] = useState('');
  const [tagName, setTagName] = useState('');
  const [userCommand, setUserCommand] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/aws/ec2/create', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, keyName, tagName, userCommand }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
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
        {activeTab === "server" && (
          <div>
            <p className="text-gray-600 mb-2">서버 생성 폼</p>
              <div className="space-y-2 flex flex-col">
                <input
                  value={imageId}
                  onChange={(e) => setImageId(e.target.value)}
                  placeholder="Image ID"
                  className="border p-2 rounded w-100"
                />
                <input
                  value={instanceType}
                  
                  onChange={(e) => setInstanceType(e.target.value)}
                  placeholder="Instance Type"
                  className="border p-2 rounded w-100"
                />
                <input
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Key Pair Name (옵션)"
                  className="border p-2 rounded w-100"
                />
                <input
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Tag Name (옵션)"
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
              </div>

              {response && (
                <div className="mt-4 bg-gray-100 p-4 rounded">
                  {response.success ? (
                    <>
                      <p><strong>인스턴스 ID:</strong> {response.instance.InstanceId}</p>
                      <p><strong>상태:</strong> {response.instance.State?.Name}</p>
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
      </div>
    </div>
  );
}
