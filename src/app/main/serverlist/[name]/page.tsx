'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";
import { use } from "react";

type ServerData = {
  name: string;
  serverAddr: string | null;
  status: "ON" | "OFF";
  serverType: string;
  createdAt: string;
};

export default function ServerDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const serverName = decodeURIComponent(name);
  const router = useRouter();

  const [server, setServer] = useState<ServerData | null>(null);
  const [activeTab, setActiveTab] = useState<"env" | "config" | "log">("env");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [serverOwner, setServerOwner] = useState('');
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("serverDetail");
    const userName = localStorage.getItem("userName");
    if (!raw || !userName) {
      window.location.href = "/403";
      return;
    }

    const sessionData = JSON.parse(raw);
    if (sessionData.name !== serverName) {
      window.location.href = "/403";
      return;
    }

    fetch("/api/aws/ec2/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName, serverOwner: userName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServer({ name: serverName, ...data.server });
        } else {
          window.location.href = "/403";
        }
      });
  }, [serverName]);

  const handleAction = async (type: "start" | "stop" | "reboot" | "delete") => {
    const userName = localStorage.getItem("userName");
    if (!userName || !server) return;

    const confirmMsg =
      type === "delete"
        ? "정말 서버를 삭제하시겠습니까? (복구 불가)"
        : type === "stop"
        ? "서버를 중단하시겠습니까?"
        : type === "start"
        ? "서버를 시작하시겠습니까?"
        : "서버를 재시작하시겠습니까?";

    if (!window.confirm(confirmMsg)) return;

    const res = await fetch(`/api/aws/ec2/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName: server.name, serverOwner: userName }),
    });

    const result = await res.json();
    if (result.success) {
      if (type === "stop") {
        setServer((prev) => prev && { ...prev, status: "OFF", serverAddr: null });
      } else if (type === "start" || type === "reboot") {
        setServer((prev) => prev && { ...prev, status: "ON", serverAddr: result.updatedIp ?? prev.serverAddr });
      } else if (type === "delete") {
        alert("삭제되었습니다.");
        router.push("/main/serverlist");
      }
    } else {
      alert(result.error || "실패했습니다.");
    }
  };

  if (!server) return null;

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title={server.name}
          tabs={[
            { key: "env", label: "모니터링" },
            { key: "config", label: "설정" },
            { key: "log", label: "로그" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          rightElement={
            <div className="relative">
              <button
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                서버 상태 ▼
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow w-32 text-sm z-50">
                  <button
                    disabled={server.status === "ON"}
                    onClick={() => {
                      handleAction("start");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${server.status !== "ON" ? "hover:bg-gray-100" : ""}`}
                    style={{ color: server.status !== "ON" ? "#000000" : "#cccccc" }}
                  >
                    서버 가동
                  </button>
                  <button
                    disabled={server.status === "OFF"}
                    onClick={() => {
                      handleAction("stop");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${server.status === "ON" ? "hover:bg-gray-100" : ""}`}
                    style={{ color: server.status === "ON" ? "#000000" : "#cccccc" }}
                  >
                    서버 중단
                  </button>
                  <button
                    onClick={() => {
                      handleAction("delete");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    서버 삭제
                  </button>
                </div>
              )}
            </div>
          }
        />
        <div className="px-6 pt-6">
          {activeTab === "env" && (
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div><strong>IP:</strong> {server.serverAddr || "없음"}</div>
                <div><strong>상태:</strong> {server.status === "ON" ? "실행중" : "중지됨"}</div>
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="mb-4">
                <label className="block mb-1 font-medium">서버 이름</label>
                <input
                  value={server.name}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-600"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">서버 타입</label>
                <input
                  value={server.serverType}
                  disabled
                  className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          )}

          {activeTab === "log" && (
            <div className="bg-white rounded shadow p-6">
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                [생성일] {server.createdAt}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
