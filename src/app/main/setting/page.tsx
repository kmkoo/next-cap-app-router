"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/page-wrapper";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"notification" | "display">("notification");

  const [settings, setSettings] = useState({
    emailNotification: false,
    showServerAddress: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("설정 불러오기 실패:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
      } catch (err) {
        console.error("설정 저장 실패:", err);
      }
    };
    saveSettings();
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageWrapper>
    <div className="bg-[#F1F3F7] flex-grow min-h-screen">
      <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
        <div className="mx-1 p-1 text-[20px] font-semibold">환경설정</div>
        <div className="flex flex-row gap-4 mt-4">
          <button
            className={`px-4 py-2 ${activeTab === "notification"
              ? "bg-[#F1F3F7] font-medium rounded-t-lg"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("notification")}
          >
            알림
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "display"
              ? "bg-[#F1F3F7] font-medium rounded-t-lg"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("display")}
          >
            디스플레이
          </button>
        </div>
      </div>
      
      <div className="px-6 pt-6">
      <PageWrapper key={activeTab}>
        {activeTab === "notification" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">알림 설정</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">이메일 알림</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotification}
                    onChange={() => toggleSetting("emailNotification")}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "display" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">디스플레이 설정</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">서버 주소 표시</span>
                  <input
                    type="checkbox"
                    checked={settings.showServerAddress}
                    onChange={() => toggleSetting("showServerAddress")}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        </PageWrapper>
      </div>
    </div>
    </PageWrapper>
  );
}
