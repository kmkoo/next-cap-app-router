"use client";

import { useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website" | "cost">("all");

  return (
    <PageWrapper>
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <TopBar
        title="대시보드"
        tabs={[
          { key: "all", label: "전체" },
          { key: "server", label: "서버" },
          { key: "website", label: "웹사이트" },
          { key: "cost", label: "비용" },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="px-6 pt-6">
        <PageWrapper key={activeTab}>
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
        </PageWrapper>
      </div>
    </div>
    </PageWrapper>
  );
}
