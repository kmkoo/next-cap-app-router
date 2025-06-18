'use client'

import { useState } from "react";

export default function ConsoleConnenction(props: { addr: any; }) {
  const [command, setCommand] = useState('');
  const [RCONrespose, setRCONRespose] = useState('');
  const [RESTrespose, setRESTRespose] = useState('');

  const sendCommand = async () => {
    const res = await fetch('/api/rcon', {
      method: 'POST',
      body: JSON.stringify({ addr: props.addr, command }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setRCONRespose(data.response);
  };

  const sendRESTCommand = async () => {
    const res = await fetch('/api/REST', {
      method: 'POST',
      body: JSON.stringify({ addr: props.addr, command }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setRESTRespose(data.response);
  };

  return(
    <div className="my-4">
      <div>
        <label>RCON 테스트전용(마인크래프트)</label>
        <input 
        type="text" 
        className="w-full p-2 border rounded"
        value={command}
        onChange={(e) => setCommand(e.target.value)}/>
        <button
        className="text-[12px] bg-white text-blue-500 font-semibold px-3 py-2 my-3 rounded-3xl border shadow-sm hover:shadow-md hover:bg-gray-100/30"
        onClick={sendCommand}>
          명령어 전송
        </button>
        <div className="text-sm text-gray-700 wrap-break-word">
          서버 응답: {RCONrespose}
        </div>
      </div>
      <div>
        <label>REST_API 테스트전용(테라리아)</label>
        <input 
        type="text" 
        className="w-full p-2 border rounded"
        value={command}
        onChange={(e) => setCommand(e.target.value)}/>
        <button
        className="text-[12px] bg-white text-blue-500 font-semibold px-3 py-2 my-3 rounded-3xl border shadow-sm hover:shadow-md hover:bg-gray-100/30"
        onClick={sendRESTCommand}>
          명령어 전송
        </button>
        <div className="text-sm text-gray-700 wrap-break-word">
          서버 응답: {RESTrespose}
        </div>
      </div>
    </div>
  );
}