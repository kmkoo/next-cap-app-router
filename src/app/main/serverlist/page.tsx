"use client";

import { useState } from "react";
import TempPage from "@/app/PageTemplates/page";

export default function ServerListPage() {
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website">("all");

  return (
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
        <div className="mx-1 p-1 text-[20px]">서버리스트</div>
        <div className="flex flex-row gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "all" ? "bg-[#F1F3F7]" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            전체
          </button>
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
        {activeTab === "all" && (
          <div>
            <p className="text-gray-600 mb-2">전체 서버 목록</p>
            <TempPage />
          </div>
        )}
        {activeTab === "server" && (
          <div>
            <p className="text-gray-600 mb-2">서버만 보기</p>
            {/* 서버 목록 필터된 컴포넌트 또는 로직 삽입 */}
          </div>
        )}
        {activeTab === "website" && (
          <div>
            <p className="text-gray-600 mb-2">웹사이트만 보기</p>
            {/* 웹사이트 목록 필터된 컴포넌트 또는 로직 삽입 */}
          </div>
        )}
      </div>
    </div>
  );
}
