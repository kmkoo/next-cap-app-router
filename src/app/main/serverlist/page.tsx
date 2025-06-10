'use client';

import { useState, useEffect } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

type Server = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  address: string;
  status: string;
};

export default function ServerListPage() {
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website">("all");
  const [servers, setServers] = useState<Server[]>([]);
  const [showAddress, setShowAddress] = useState<boolean | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`/api/settings?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.showServerAddress === "boolean") {
          setShowAddress(data.showServerAddress);
        }
      });

    fetch("/api/getServerList", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.serverList)) {
          const serverList: Server[] = data.serverList.map((row: any) => ({
            id: row.serverNumber.toString(),
            name: row.serverName,
            type: row.serverType,
            createdAt: dayjs(row.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD"),
            address: row.serverAddr,
            status: row.status,
          }));
          setServers(serverList);
        }
      });
  }, [userName]);

  const filteredServers = servers.filter((server) =>
    activeTab === "all" ? true : server.type === activeTab
  );

  const handleStop = (id: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "stopped" } : s
      )
    );
  };

  const handleDelete = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClickRow = (id: string) => {
    const server = servers.find((s) => s.id === id);
    if (!server) return;
    sessionStorage.setItem("serverDetail", JSON.stringify(server));
    window.location.href = `/main/serverlist/${encodeURIComponent(server.name)}`;
  };

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title="서버리스트"
          tabs={[
            { key: "all", label: "전체" },
            { key: "server", label: "서버" },
            { key: "website", label: "웹사이트" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="px-6 pt-6">
          <PageWrapper key={activeTab}>
            {filteredServers.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">등록된 서버가 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {filteredServers.map((server) => (
                  <div
                    key={server.id}
                    onClick={() => handleClickRow(server.id)}
                    className="bg-white rounded-lg shadow p-5 space-y-2 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-[16px] font-medium">{server.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStop(server.id);
                          }}
                          disabled={server.status === "stopped"}
                          className={`px-3 py-1 rounded text-sm ${
                            server.status === "stopped"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {server.status === "stopped" ? "중단됨" : "중단"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(server.id);
                          }}
                          className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">종류: {server.type}</div>
                    <div className="text-sm text-gray-600">생성일: {server.createdAt}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      주소:
                      {showAddress === null ? (
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <span
                          className={`relative ${
                            !showAddress
                              ? "text-transparent select-none after:content-['●●●●●●'] after:absolute after:inset-0 after:text-black"
                              : ""
                          }`}
                        >
                          {server.address}
                        </span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(server.address);
                          setCopiedId(server.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                      >
                        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path>
                        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"></path>
                      </svg>
                      {copiedId === server.id && (
                        <span className="text-xs text-green-600 ml-2">복사완료!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PageWrapper>
        </div>
      </div>
    </PageWrapper>
  );
}
