'use client';

import { useEffect, useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";
import { use } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from 'recharts';

export default function ServerDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const serverName = decodeURIComponent(name);

  const [server, setServer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"env" | "config" | "log">("env");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("serverDetail");
    if (!raw) {
      window.location.href = "/403";
      return;
    }

    const data = JSON.parse(raw);
    if (data.name !== serverName) {
      window.location.href = "/403";
      return;
    }

    setServer(data);
  }, [serverName]);

  if (!server) return;

  // 데이터 (샘플)
  const monitoringData = {
    ipv4: "0.0.0.0",
    ports: [22, 3000, 8080],
    isRunning: true
  };
  // const timeSeriesData = [
  //   { time: "10:00", cpu: 10, mem: 100, in: 30, out: 20 },
  //   { time: "10:01", cpu: 20, mem: 100, in: 40, out: 25 },
  //   { time: "10:02", cpu: 35, mem: 100, in: 50, out: 35 },
  //   { time: "10:03", cpu: 25, mem: 97, in: 70, out: 45 },
  //   { time: "10:04", cpu: 89, mem: 100, in: 65, out: 50 }
  // ];
  const logLines = [
    "[10:30] 인스턴스 생성됌",
    "[10:31] 인스턴스 시작됌",
    "[10:32] 인스턴스 해킹됌",
    "[10:35] 포트 3000열림"
  ];
  // const sharedUsers = [
  //   { name: "user1", permissions: 7 },
  //   { name: "user2", permissions: 3 },
  //   { name: "user3", permissions: 0 }
  // ];

  // const PERMISSION = {
  //   ACCESS: 1,
  //   READ: 2,
  //   WRITE: 4
  // };
  // const latestCpu = timeSeriesData[timeSeriesData.length - 1]?.cpu ?? 0;

  // 이벤트
  const serverStop = () =>{
    alert("인스턴스 중단. DB에 상태 flase. 누르면 '중단하시겠습니까?'에서 예/아니요 선택");
  }
  const serverRestart = () =>{
    alert("인스턴스 재시작. DB에 상태 true");
  }
  const serverDel = () =>{
    alert("서버 주인만 실행 가능. 비밀번호 입력 창 생성. DB 살려두고 유저만제거");
  }
  const setSave = () =>{
    alert("설정 저장. 인스턴스 DB 수정 및 인스턴스 재설정");
  }
  // const userAdd = () =>{
  //   alert("닉네임, 권한 설정 창 생성 후 추가. 유저와 서버 매칭 DB에 권한과 함께 추가");
  // }
  // const userDel = () =>{
  //   alert("유저 삭제. 유저와 서버 매칭 DB에서 삭제");
  // }
  const cancel = () =>{
    alert("설정 변경 취소. 서버 리스트 페이지로 이동");
  }

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
                    disabled={monitoringData.isRunning}
                    onClick={() => {
                      serverRestart();
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${!monitoringData.isRunning?"hover:bg-gray-100":""}`}
                    style={{color:!monitoringData.isRunning?"#000000":"#cccccc"}}
                  >
                    서버 가동
                  </button>
                  <button
                    disabled={!monitoringData.isRunning}
                    onClick={() => {
                      serverStop();
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${monitoringData.isRunning?"hover:bg-gray-100":""}`}
                    style={{color:monitoringData.isRunning?"#000000":"#cccccc"}}
                  >
                    서버 중단
                  </button>
                  <button
                    onClick={() => {
                      serverDel();
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-red-100 text-red-600`}
                  >
                    서버 삭제
                  </button>
                </div>
              )}
            </div>
          }
        />

          {activeTab === "env" && (
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div><strong>IP:</strong> {monitoringData.ipv4}</div>
                {/* <div><strong>Port:</strong> {monitoringData.ports.join(", ")}</div> */}
                <div className="flex items-center gap-2">
                  <div>
                    <strong>상태:</strong>{" "}
                    <span>
                      {monitoringData.isRunning ? "실행중" : "중지됌"}
                    </span>
                    {/* <span
                      className={
                        monitoringData.isRunning
                          ? latestCpu < 70
                            ? "text-green-600"
                            : latestCpu < 90
                            ? "text-yellow-600"
                            : "text-red-600"
                          : "text-black"
                      }
                    >
                      {monitoringData.isRunning
                        ? latestCpu < 70
                          ? "실행중(양호)"
                          : latestCpu < 90
                          ? "실행중(주의)"
                          : "실행중(경고)"
                        : "중지됨"}
                    </span> */}
                  </div>
                  {/* {typeof monitoringData.isRunning === "boolean" && (
                    <div className="mt-4">
                      {monitoringData.isRunning ? (
                        <button className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => serverStop}>
                          서버 중단
                        </button>
                      ) : (
                        <button className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => serverRestart}>
                          서버 가동
                        </button>
                      )}
                    </div>
                  )} */}
                </div>
              </div>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded shadow">
                  <p className="font-semibold mb-2">CPU 사용량 (%)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#000088" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow">
                  <p className="font-semibold mb-2">메모리 사용량 (%)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mem" stroke="#000088" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow">
                  <p className="font-semibold mb-2">네트워크 수신량 (MB)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="in" stroke="#000088" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow">
                  <p className="font-semibold mb-2">네트워크 송신량 (MB)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="out" stroke="#000088" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div> */}
            </div>
          )}

          {activeTab === "config" && (
            <div className="bg-white rounded shadow p-6 mb-6">
              <div className="mb-4">
                <label className="block mb-1 font-medium">서버 이름 변경</label>
                <input
                  defaultValue={server.name}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">서버 규모 변경</label>
                <select className="border border-gray-300 rounded px-3 py-2 w-full">
                  <option>작음</option>
                  <option>중간</option>
                  <option>큼</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  해당 옵션 변경 시 적용까지 시간이 걸릴 수 있습니다.
                </p>
              </div>
              {/* <div className="mb-6">
                <h3 className="font-semibold mb-2">서버 공유</h3>
                <div className="max-h-[300px] overflow-y-auto border border-gray-300 rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F1F3F7] sticky top-0 z-10">
                      <tr className="text-center font-bold">
                        <th className="py-2">닉네임</th>
                        <th className="py-2">접근권한</th>
                        <th className="py-2">읽기권한</th>
                        <th className="py-2">수정권한</th>
                        <th className="py-2"> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedUsers.map((user, idx) => (
                        <tr key={idx} className="text-center bg-white font-bold border-t border-gray-200">
                          <td className="py-2">{user.name}</td>
                          <td className="py-2">
                            <span className={user.permissions & PERMISSION.ACCESS ? "text-green-600" : "text-red-600"}>
                              {user.permissions & PERMISSION.ACCESS ? "V" : "X"}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={user.permissions & PERMISSION.READ ? "text-green-600" : "text-red-600"}>
                              {user.permissions & PERMISSION.READ ? "V" : "X"}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={user.permissions & PERMISSION.WRITE ? "text-green-600" : "text-red-600"}>
                              {user.permissions & PERMISSION.WRITE ? "V" : "X"}
                            </span>
                          </td>
                          <td className="py-2 font-normal">
                            <button className="text-[#880000] hover:underline"
                            onClick={() => userDel}>삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-3">
                  <button className="text-[#000088] hover:underline font-medium"
                  onClick={() => userAdd}>+사용자 추가</button>
                </div>
              </div> */}
              <div className="flex justify-between items-center mt-6">
                {/* <button className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => serverDel}>서버삭제</button> */}
                <div className="flex gap-2">
                  <button className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => cancel}>취소</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setSave}>저장</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "log" && (
            <div className="bg-white rounded shadow p-6">
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {logLines.slice().reverse().join("\n")}
              </pre>
            </div>
          )}
        </div>
    </PageWrapper>
  );
}
