"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

type Server = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  address: string;
  status: "running" | "stopped";
};

export default function ServerListPage() {
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website">("all");
  const [servers, setServers] = useState<Server[]>([]);
  const [showAddress, setShowAddress] = useState<boolean | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  const [list, setList] = useState();


  useEffect(() =>{
    const storedName: string = localStorage.getItem('userName')!;
    setUserName(storedName);
  }, []);

  useEffect(() => {

    const dummyServers: Server[] = [
      {
        id: "1",
        name: "마인크랙트 서버",
        type: "server",
        createdAt: "2024-12-01",
        address: "192.168.0.1",
        status: "running",
      },
      {
        id: "2",
        name: "포트폴리오 사이트",
        type: "website",
        createdAt: "2024-12-05",
        address: "example.com",
        status: "stopped",
      },
    ];
    setServers(dummyServers);

    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`/api/settings?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.showServerAddress === "boolean") {
          setShowAddress(data.showServerAddress);
        }
      })
      .catch((err) => {
        console.error("설정 불러오기 실패:", err);
      });

    fetch("/api/getServerList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName }),
    })
    .then((res) => res.json())
    .then((data) => { setList(data); });

  }, [userName]);

  const filteredServers = servers.filter((server) => {
    if (activeTab === "all") return true;
    return server.type === activeTab;
  });

  const handleStop = (id: string) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === id ? { ...server, status: "stopped" } : server
      )
    );
  };

  const handleDelete = (id: string) => {
    setServers((prev) => prev.filter((server) => server.id !== id));
  };

  const handleClickRow = (id: string) => {
    alert(`서버 ID ${id} 상세 페이지로 이동 예정`);
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
          <div className="overflow-x-hidden">
            <PageWrapper key={activeTab}>
              <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2">서버 이름</th>
                    <th className="px-4 py-2">서버 종류</th>
                    <th className="px-4 py-2">서버 생성 시기</th>
                    <th className="px-4 py-2">주소</th>
                    <th className="px-4 py-2">상태</th>
                    <th className="px-4 py-2">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServers.map((server) => (
                    <tr
                      key={server.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClickRow(server.id)}
                    >
                      <td className="px-4 py-2">{server.name}</td>
                      <td className="px-4 py-2">{server.type}</td>
                      <td className="px-4 py-2">{server.createdAt}</td>
                      <td className="px-4 py-2 flex items-center gap-8 relative">
                        <div className="relative flex items-center">
                          {copiedId === server.id && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow z-50 whitespace-nowrap">
                              복사완료!
                            </div>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
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
                        </div>
                        {showAddress === null ? (
                          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
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
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStop(server.id);
                          }}
                          disabled={server.status === "stopped"}
                        >
                          {server.status === "stopped" ? "중단됨" : "실행중"}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(server.id);
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredServers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        등록된 서버가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </PageWrapper>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
