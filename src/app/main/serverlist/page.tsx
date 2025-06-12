'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import NewServerModal from "./NewServerModal";

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
  imageUrl?: string;
};

export default function ServerListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "server" | "website">("all");
  const [servers, setServers] = useState<Server[]>([]);
  const [showAddress, setShowAddress] = useState<boolean | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

    if (userName) {
      fetchServers();
    }
  }, [userName]);

  const fetchServers = () => {
    fetch("/api/getServerList", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.serverList)) {
          const serverList: Server[] = data.serverList
            .filter((row: any) => row.status !== 'DEL')
            .map((row: any) => ({
              id: row.serverNumber.toString(),
              name: row.serverName,
              type: row.serverType,
              createdAt: dayjs(row.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD"),
              address: row.serverAddr,
              status: row.status,
              imageUrl: row.serverImage,
            }));
          setServers(serverList);
        }
      });
  };

  const getScaleLabel = (type: string) => {
    switch (type) {
      case 't3.micro': return '소규모';
      case 't3.small': return '중간규모';
      case 't3.medium': return '대규모';
      default: return type;
    }
  };

  const filteredServers = servers.filter((server) =>
    activeTab === "all" ? true : server.type === activeTab
  );

  const handleTogglePower = async (server: Server) => {
    const action = server.status === "OFF" ? "start" : "stop";
    setLoadingId(server.id);

    const response = await fetch(`/api/aws/ec2/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName: server.name, serverOwner: userName }),
    });

    const data = await response.json();
    setLoadingId(null);

    if (!data.success) {
      alert(`${action === "stop" ? "중단" : "시작"} 실패: ${data.error || data.errorMassage}`);
      return;
    }

    const updatedIp = data.updatedIp || (action === "stop" ? "" : server.address);

    setServers((prev) =>
      prev.map((s) =>
        s.id === server.id
          ? { ...s, status: action === "stop" ? "OFF" : "ON", address: updatedIp }
          : s
      )
    );
  };

  const handleCardClick = (server: Server) => {
    sessionStorage.setItem("serverDetail", JSON.stringify(server));
    router.push(`/main/serverlist/${encodeURIComponent(server.name)}`);
  };

return (
  <PageWrapper>
    <div className="bg-[#F1F3F7] flex-grow min-h-screen relative">
      <TopBar
        title="서버리스트"
        tabs={[{ key: "all", label: "전체" }]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + 새 서버
        </button>
      </div>
      <div className="px-6 pt-6">
        <PageWrapper key={activeTab}>
          {filteredServers.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">등록된 서버가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {filteredServers.map((server) => (
                <div
                  key={server.id}
                  onClick={() => handleCardClick(server)}
                  className="flex items-center bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  {server.imageUrl && (
                    <img
                      src={server.imageUrl}
                      alt="서버 이미지"
                      className="w-20 h-20 rounded-full object-cover border mr-6"
                    />
                  )}
                  <div className="flex flex-col flex-grow text-sm text-gray-700">
                    <span className="text-xl font-semibold mb-3">{server.name}</span>
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><line x1="6" y1="16" x2="6.01" y2="16" /><line x1="10" y1="16" x2="10.01" y2="16" /></svg>
                      <span>{getScaleLabel(server.type)}</span>
                      {server.status === "ON" && server.address && (
                        <>
                          <span className="mx-2 text-blue-500">{showAddress === false ? "●●●●●●" : server.address}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(server.address); setCopiedId(server.id); setTimeout(() => setCopiedId(null), 1500); }}><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>
                          {copiedId === server.id && <span className="ml-2 text-xs text-green-600">복사완료!</span>}
                        </>
                      )}
                    </div>
                    <div className="flex items-center text-gray-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <span>생성일 : {server.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm gap-3 ml-4">
                    <div className={`flex items-center text-[13px] mb-2 p-1 ${server.status === "OFF" ? "text-red-500 bg-red-500/10" : "text-green-600 bg-green-600/10"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                      {server.status === "OFF" ? "중단됨" : "실행중"}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePower(server);
                      }}
                      disabled={loadingId === server.id}
                      className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-1 ${
                        server.status === "OFF"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {loadingId === server.id ? (
                        <svg className="animate-spin h-5 w-[46px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : server.status === "OFF" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          시작
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                          중지
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageWrapper>
      </div>
      {showModal && (
        <NewServerModal
          onClose={() => setShowModal(false)}
          onCreated={fetchServers}
          serverOwner={userName}
        />
      )}
    </div>
  </PageWrapper>
);
}
