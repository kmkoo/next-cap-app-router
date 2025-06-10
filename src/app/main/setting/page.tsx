"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"notification" | "display">("display");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    emailNotification: false,
    showServerAddress: false,
  });
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    if (!email) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings?email=${email}`);
        const data = await res.json();
        setSettings(data);
        setIsFetched(true);
      } catch (err) {
        console.error("설정 불러오기 실패:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!userEmail || !isFetched) return;

    const saveSettings = async () => {
      try {
        await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, ...settings }),
        });
      } catch (err) {
        console.error("설정 저장 실패:", err);
      }
    };
    saveSettings();
  }, [settings, userEmail, isFetched]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (checked: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
        checked ? "bg-[#3A3A3A]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title="환경설정"
          tabs={[
            //{ key: "notification", label: "알림" },
            { key: "display", label: "디스플레이" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="px-6 pt-6">
          <PageWrapper key={activeTab}>
            {activeTab === "notification" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-[16px] mb-4">알림 설정</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">이메일 알림</span>
                      {isFetched ? (
                        renderToggle(settings.emailNotification, () => toggleSetting("emailNotification"))
                      ) : (
                        <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "display" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-[16px] mb-4">디스플레이 설정</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">서버 주소 표시</span>
                      {isFetched ? (
                        renderToggle(settings.showServerAddress, () => toggleSetting("showServerAddress"))
                      ) : (
                        <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse" />
                      )}
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
