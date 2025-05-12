"use client";

import { useState } from "react";
import TempPage from "@/app/PageTemplates/page";

export default function NewServerPage() {
  const [activeTab, setActiveTab] = useState<"server" | "website">("server");

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
            <TempPage />
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
