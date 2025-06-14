"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreated: () => void;
  serverOwner: string;
};

export default function NewServerModal({
  onClose,
  onCreated,
  serverOwner,
}: Props) {
  const defaultImages = [
    "/images/default1.png",
    "/images/default2.png",
    "/images/default3.png",
    "/images/default4.png",
    "/images/default5.png",
  ];

  const [serverScale, setServerScale] = useState("small");
  const [serverName, setServerName] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);

  const isValidName =
    serverName.trim().length >= 2 && serverName.trim().length <= 10;

  const handleCreate = async () => {
    if (!isValidName) return;

    setLoading(true);
    const res = await fetch("/api/aws/ec2/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serverScale,
        serverName,
        serverOwner,
        imageUrl: selectedImage,
      }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);

    if (data.success) {
      onCreated();
      onClose();
    } else {
      setTimeout(() => setResponse(null), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[90%] max-w-md max-h-screen overflow-y-auto p-6 relative opacity-0 translate-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">서버 생성</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              서버 이미지 선택
            </label>
            <div className="flex gap-3 justify-between flex-wrap">
              {defaultImages.map((img) => (
                <img
                  key={img}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-full border-2 cursor-pointer transition ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">서버 이름</label>
            <input
              type="text"
              placeholder="예: 마인크래프트 서버"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!isValidName && (
              <p className="text-gray-600 text-sm mt-1">
                서버 이름은 2자 이상 10자 이하여야 합니다.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">서버 규모</label>
            <div className="flex gap-2">
              {[
                { label: "소규모", value: "small" },
                { label: "중간규모", value: "medium" },
                { label: "대규모", value: "big" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setServerScale(opt.value)}
                  className={`flex-1 py-2 rounded border text-sm ${
                    serverScale === opt.value
                      ? "bg-neutral-700 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading || !isValidName}
            className={`w-full py-3 rounded ${
              loading || !isValidName
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-neutral-700 text-white hover:bg-neutral-800"
            }`}
          >
            {loading ? "생성 중..." : "서버 만들기"}
          </button>
          {response && !response.success && (
            <div className="text-red-600 text-sm mt-2">
              ❌ {response.errorMessage || "서버 생성에 실패했습니다."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
