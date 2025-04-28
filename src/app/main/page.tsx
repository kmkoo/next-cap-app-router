"use client";
import { useState } from "react";
import TempPage from "@/app/PageTemplates/page";

export default function DashboardPage() {
  const [testdata, setTestdata] = useState(null); // 상태 추가

  const testbtnhandler = async () => {
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ id: 'test', password: '1234' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log(data);
      setTestdata(data); // 상태 업데이트
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <TempPage />
      <button onClick={testbtnhandler} className="border rounded">
        테스트
      </button>
      {testdata && (
        <pre className="mt-4 p-2 bg-gray-200 rounded">
          {JSON.stringify(testdata, null, 2)}
        </pre>
      )}
    </div>
  );
}
