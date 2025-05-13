'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '사용자';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setUserName(storedName);
    setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/auth');
  };

  return (
    <div className="bg-[#373A3C] text-neutral-100 divide-y-1 divide-zinc-700 flex flex-col w-60 sticky top-0 h-screen">
      <div className="pt-4 px-4 py-2 border-b border-gray-900">
        <Link href='/main' className="m-1 p-2 text-[12px]">
          한국다람쥐 CLOUD
        </Link>
        <div className="m-1 pt-2 px-2 text-[20px]">
          {userName}
          <p className="text-neutral-400 text-[10px]">{userEmail}</p>
        </div>
      </div>

      <div className="px-3 grow">
        <div className="my-7 mx-2 flex flex-col">
          <Link href='/main/dashboard' className="sidebar-link text-[14px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              <path d="M13.45 11.55l2.05 -2.05"></path>
              <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
            </svg>
            대시보드
          </Link>
          <Link href='/main/serverlist' className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
              <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
              <path d="M7 8l0 .01"></path>
              <path d="M7 16l0 .01"></path>
            </svg>
            서버 리스트
          </Link>
          <Link href='/main/newserver' className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
              <path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12"></path>
              <path d="M7 8v.01"></path>
              <path d="M7 16v.01"></path>
              <path d="M20 15l-2 3h3l-2 3"></path>
            </svg>
            서버 생성
          </Link>
          <Link href='/main/guide' className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 9h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>
            사용 가이드
          </Link>
        </div>
      </div>

      <div className="px-3 text-neutral-400">
        <div className="my-3 mx-2 flex flex-col">
          <Link href='/main/user' className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5"></path>
              <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              <path d="M19.001 15.5v1.5"></path>
              <path d="M19.001 21v1.5"></path>
              <path d="M22.032 17.25l-1.299 .75"></path>
              <path d="M17.27 20l-1.3 .75"></path>
              <path d="M15.97 17.25l1.3 .75"></path>
              <path d="M20.733 20l1.3 .75"></path>
            </svg>
            회원정보
          </Link>
          <Link href='/main/setting' className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            </svg>
            환경설정
          </Link>
          <button onClick={handleLogout} className="sidebar-link text-yellow-700 text-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
              <path d="M9 12h12l-3 -3"></path>
              <path d="M18 15l3 -3"></path>
            </svg>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
