"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";
import { use } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type ServerData = {
  name: string;
  serverAddr: string | null;
  status: "ON" | "OFF";
  serverType: string;
  createdAt: string;
  serverImage?: string;
};

export default function ServerDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const serverName = decodeURIComponent(name);
  const router = useRouter();

  const [server, setServer] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const defaultImages = [
    "/images/default1.png",
    "/images/default2.png",
    "/images/default3.png",
    "/images/default4.png",
    "/images/default5.png",
  ];

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
          setSelectedImage(data.server.serverImage || null);
          setNewName(serverName);
        } else {
          window.location.href = "/403";
        }
      });
  }, [serverName]);

  const getScaleLabel = (type: string) => {
    switch (type) {
      case "t3.micro":
        return "소규모";
      case "t3.small":
        return "중간규모";
      case "t3.medium":
        return "대규모";
      default:
        return type;
    }
  };

  const handleAction = async (type: "start" | "stop") => {
    const userName = localStorage.getItem("userName");
    if (!userName || !server) return;

    setLoading(true);
    const res = await fetch(`/api/aws/ec2/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName: server.name, serverOwner: userName }),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      if (type === "stop") {
        setServer(
          (prev) => prev && { ...prev, status: "OFF", serverAddr: null }
        );
      } else if (type === "start") {
        setServer(
          (prev) =>
            prev && {
              ...prev,
              status: "ON",
              serverAddr: result.updatedIp ?? prev.serverAddr,
            }
        );
      }
    } else {
      alert(result.error || "실패했습니다.");
    }
  };

  const handleImageUpdate = async () => {
    if (!server || !selectedImage) return;
    const userName = localStorage.getItem("userName");
    const res = await fetch("/api/update/Image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serverName: server.name,
        serverOwner: userName,
        imageUrl: selectedImage,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setServer((prev) => prev && { ...prev, serverImage: selectedImage });
      setShowTooltip(false);
    } else {
      alert("이미지 변경 실패: " + data.error);
    }
  };

  const handleNameUpdate = async () => {
    if (!server || newName === server.name) return;
    const userName = localStorage.getItem("userName");
    setUpdating(true);
    const res = await fetch("/api/update/servername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serverOwner: userName,
        oldName: server.name,
        newName,
      }),
    });
    const data = await res.json();
    setUpdating(false);
    if (data.success) {
      setServer((prev) => prev && { ...prev, name: newName });
      setEditingName(false);
    } else {
      alert("변경 실패: " + data.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!server) return;
    const userName = localStorage.getItem("userName");
    setLoading(true);

    const res = await fetch(`/api/aws/ec2/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName: server.name, serverOwner: userName }),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      alert("삭제되었습니다.");
      router.push("/main/serverlist");
    } else {
      alert(result.error || "삭제 실패");
    }
  };

  if (!server) return null;

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <div className="relative w-full flex flex-col items-center">
          <div className="relative w-full h-[110px] bg-white flex items-center justify-between px-6">
            <div className="flex items-center ml-[150px] gap-4">
              <div className="text-xl font-semibold flex items-center gap-2 mt-14">
                {server.name}
                <span
                  className={`text-[11px] px-2 py-[2px] font-medium rounded ${
                    server.status === "OFF"
                      ? "text-red-500 bg-red-500/10"
                      : "text-green-600 bg-green-600/10"
                  } flex items-center`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                  </svg>
                  {server.status === "OFF" ? "중단됨" : "실행중"}
                </span>
              </div>
            </div>
            <div className="mt-14">
              <button
                onClick={() =>
                  handleAction(server.status === "OFF" ? "start" : "stop")
                }
                disabled={loading}
                className={`ml-2 px-3 py-2 text-[12px] rounded text-sm font-medium flex items-center gap-1 ${
                  server.status === "OFF"
                    ? "bg-[#03588C] text-white hover:bg-[#011C40] shadow-sm hover:shadow-md rounded-3xl"
                    : "bg-[#F25C5C] text-white hover:bg-[#D92525] shadow-sm hover:shadow-md rounded-3xl"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-[41px] text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : server.status === "OFF" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    시작
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    중지
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="absolute top-[30px] left-10 w-[120px] h-[120px]">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={server.serverImage || "/default.png"}
                className="w-full h-full object-cover"
                alt="프로필"
              />
            </div>
            <div className="absolute bottom-[4px] right-[4px]">
              <button
                onClick={() => setShowTooltip((prev) => !prev)}
                className="w-7 h-7 bg-gray-500 hover:bg-gray-600 border-2 border-white text-white text-xs rounded-full flex items-center justify-center shadow-md z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </button>

              {showTooltip && (
                <div className="absolute left-[110%] bottom-[50%] translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs text-gray-700 px-3 py-2 z-20 whitespace-normal max-w-[260px] w-max">
                  <div className="text-center text-sm font-semibold mb-2">
                    이미지 선택
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap justify-center">
                    {defaultImages.map((img) => (
                      <img
                        key={img}
                        src={img}
                        onClick={() => setSelectedImage(img)}
                        className={`w-10 h-10 rounded-full border-2 cursor-pointer transition ${
                          selectedImage === img
                            ? "border-blue-500"
                            : "border-gray-300 opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleImageUpdate}
                    className="w-full py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                  >
                    변경
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-8 px-6">
          <div className="bg-white w-full rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 gap-6 text-sm text-gray-700">
              <div>
                <label className="block font-medium mb-1">서버 이름</label>
                <div className="px-3 py-2 bg-gray-100 rounded flex items-center justify-between gap-2">
                  {editingName ? (
                    <>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-gray-100 text-sm flex-1 focus:outline-none"
                      />
                      <div className="flex items-center gap-1">
                        {newName !== server.name && (
                          <button
                            onClick={handleNameUpdate}
                            disabled={updating}
                            className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                          >
                            {updating ? "..." : "확인"}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingName(false);
                            setNewName(server.name);
                          }}
                          className="px-2 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{server.name}</span>
                      <button
                        className="ml-2 text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={() => setEditingName(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">서버 상태</label>
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {server.status === "ON" ? "실행중" : "중지됨"}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">IP 주소</label>
                <div className="px-3 py-2 bg-gray-100 rounded flex items-center justify-between gap-2">
                  <span className="flex-1">{server.serverAddr || "없음"}</span>
                  {server.serverAddr && (
                    <div className="flex items-center gap-1">
                      <button
                        className="text-gray-500 hover:text-blue-600 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(server.serverAddr!);
                          setCopiedId(server.serverAddr!);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      {copiedId === server.serverAddr && (
                        <span className="text-green-600 text-xs">복사됨!</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">서버 타입</label>
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {getScaleLabel(server.serverType)}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">생성일</label>
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {dayjs(server.createdAt)
                    .tz("Asia/Seoul")
                    .format("YYYY-MM-DD")}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-[12px] bg-white text-red-500 hover:text-white hover:bg-red-500 font-semibold px-3 py-2 rounded-3xl border shadow-sm hover:shadow-md hover:bg-gray-100/30 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                서버 삭제
              </button>
            </div>
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                  <h2 className="text-lg font-semibold mb-3">
                    정말로 삭제하시겠습니까?
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    삭제 시 복구할 수 없습니다.
                    <br />
                    정말로 삭제하시려면 아래에 <strong>'삭제'</strong>를 입력 후
                    확인을 눌러주세요.
                  </p>
                  <input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="'삭제' 입력"
                    className="w-full px-3 py-2 border rounded mt-2 mb-4 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteConfirmText("");
                      }}
                      className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleteConfirmText !== "삭제"}
                      className={`px-3 py-1 text-sm rounded text-white ${
                        deleteConfirmText === "삭제"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
