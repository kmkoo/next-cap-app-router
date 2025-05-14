"use client";

import { useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import WebWrapper from "@/components/web-wrapper";


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website" | "cost">("all");

  return (
    <PageWrapper>
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
        <div className="mx-1 p-1 text-[20px]">대시보드</div>
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
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "cost" ? "bg-[#F1F3F7]" : ""
            }`}
            onClick={() => setActiveTab("cost")}
          >
            비용
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        <WebWrapper key={activeTab}>
        {activeTab === "all" && (
          <div>

          </div>
        )}
        {activeTab === "server" && (
          <div>
            {/* 서버 내용 */}
          </div>
        )}
        {activeTab === "website" && (
          <div>
            {/* 웹사이트 내용 */}
          </div>
        )}
        {activeTab === "cost" && (
          <div>
            {/* 비용 내용 */}
          </div>
        )}
        </WebWrapper>
      </div>
    </div>
    </PageWrapper>
  );
}
