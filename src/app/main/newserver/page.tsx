/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";

// /main/newserver 페이지
export default function NewServerPage() {
  const [imageId, setImageId] = useState('ami-id');
  const [instanceType, setInstanceType] = useState('t3.small');
  const [keyName, setKeyName] = useState('');
  const [tagName, setTagName] = useState('');
  const [userCommand, setUserCommand] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/aws/ec2/create', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, keyName, tagName, userCommand }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">새 EC2 인스턴스 생성</h1>

      <div className="space-y-2">
        <input
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          placeholder="Image ID"
          className="border p-2 rounded w-full"
        />
        <input
          value={instanceType}
          
          onChange={(e) => setInstanceType(e.target.value)}
          placeholder="Instance Type"
          className="border p-2 rounded w-full"
        />
        <input
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key Pair Name (옵션)"
          className="border p-2 rounded w-full"
        />
        <input
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag Name (옵션)"
          className="border p-2 rounded w-full"
        />
        <input
          value={userCommand}
          onChange={(e) => setUserCommand(e.target.value)}
          placeholder="자동실행 명령어 입력 (옵션)"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "생성 중..." : "인스턴스 생성"}
        </button>
      </div>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          {response.success ? (
            <>
              <p><strong>인스턴스 ID:</strong> {response.instance.InstanceId}</p>
              <p><strong>상태:</strong> {response.instance.State?.Name}</p>
            </>
          ) : (
            <p className="text-red-500">오류: {response.error}</p>
          )}
        </div>
      )}
    </main>
  );
}
