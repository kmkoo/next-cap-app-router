'use client'

import { useState } from "react";

export default function ConsoleConnenction(props: { addr: any; }) {
  const [command, setCommand] = useState('');
  const [respose, setRespose] = useState('');

  const sendCommand = async () => {
    const res = await fetch('/api/rcon', {
      method: 'POST',
      body: JSON.stringify({ addr: props.addr, command }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setRespose(data.response);
  };

  return(
    <div className="my-4">
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
        서버 응답: {respose}
      </div>
    </div>
  );
}