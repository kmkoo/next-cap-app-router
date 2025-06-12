'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";
import { use } from "react";

type ServerData = {
  name: string;
  serverAddr: string | null;
  status: "ON" | "OFF";
  serverType: string;
  createdAt: string;
  serverImage?: string;
};

export default function ServerDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const serverName = decodeURIComponent(name);
  const router = useRouter();

  const [server, setServer] = useState<ServerData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full h-[110px] bg-white flex items-center justify-between px-6">
          <div className="flex items-center ml-[160px] gap-4">
            <div className="text-xl font-semibold flex items-center gap-2 mt-14">
              {server.name}
              <span className={`text-[11px] px-2 py-[2px] font-medium rounded ${
                server.status === "OFF"
                  ? "text-red-500 bg-red-500/10"
                  : "text-green-600 bg-green-600/10"
              } flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
                {server.status === "OFF" ? "중단됨" : "실행중"}
              </span>
            </div>
          </div>
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
        </div>

        <div className="absolute top-[30px] left-10 w-[132px] h-[132px] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={server.serverImage || "/default.png"}
            className="w-full h-full object-cover"
            alt="프로필"
          />
        </div>
      </div>

      <div className="w-full flex justify-center mt-8 px-6">
        <div className="bg-white w-full rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <label className="block font-medium mb-1">서버 이름</label>
              <div className="px-3 py-2 bg-gray-100 rounded">{server.name}</div>
            </div>
            <div>
              <label className="block font-medium mb-1">서버 상태</label>
              <div className="px-3 py-2 bg-gray-100 rounded">{server.status === "ON" ? "실행중" : "중지됨"}</div>
            </div>
            <div>
              <label className="block font-medium mb-1">서버 타입</label>
              <div className="px-3 py-2 bg-gray-100 rounded">{server.serverType}</div>
            </div>
            <div>
              <label className="block font-medium mb-1">생성일</label>
              <div className="px-3 py-2 bg-gray-100 rounded">{server.createdAt}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium mb-1">IP 주소</label>
              <div className="px-3 py-2 bg-gray-100 rounded">{server.serverAddr || "없음"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
)

}
