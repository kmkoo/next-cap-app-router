"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '사용자';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setUserName(storedName);
    setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!isCollapsed) {
      const timeout = setTimeout(() => setIsTextVisible(true), 100);
      return () => clearTimeout(timeout);
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/auth');
  };

  const toggleCollapse = () => {
    if (!isCollapsed) setIsTextVisible(false);
    setIsCollapsed(!isCollapsed);
  };

  const navItemsTop = [
    /*{
      href: '/main/dashboard',
      label: '대시보드',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M13.45 11.55l2.05 -2.05" />
          <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
        </svg>
      )
    },*/
    {
      href: '/main/serverlist',
      label: '서버 리스트',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M7 8l0 .01" />
          <path d="M7 16l0 .01" />
        </svg>
      )
    },
    {
      href: '/main/newserver',
      label: '서버 생성',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12" />
          <path d="M7 8v.01" />
          <path d="M7 16v.01" />
          <path d="M20 15l-2 3h3l-2 3" />
        </svg>
      )
    },
    {
      href: '/main/guide',
      label: '사용 가이드',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
      )
    }
  ];

  const navItemsBottom = [
    {
      href: '/main/user',
      label: '회원정보',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5" />
          <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M19.001 15.5v1.5" />
          <path d="M19.001 21v1.5" />
          <path d="M22.032 17.25l-1.299 .75" />
          <path d="M17.27 20l-1.3 .75" />
          <path d="M15.97 17.25l1.3 .75" />
          <path d="M20.733 20l1.3 .75" />
        </svg>
      )
    },
    {
      href: '/main/setting',
      label: '환경설정',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="2">
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed md:relative top-0 left-0 h-full z-50 bg-[#373A3C] text-neutral-100 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col ${isCollapsed ? 'w-14 items-center' : 'w-64 px-4'}`}>
      <div className="w-full h-[110px] py-2 border-b border-neutral-600/50 flex flex-col justify-between">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {isTextVisible && (
            <Link href="/main/serverlist">
              <img src="/logo2.svg" alt="logo2" className="w-12 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
          )}
          <button onClick={toggleCollapse} className="hidden md:block text-neutral-300 hover:text-white cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isTextVisible && (
          <div className="pt-2">
            <div className="text-[20px]">{userName}</div>
            <p className="text-neutral-400 text-[10px]">{userEmail}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 w-full">
        <div className={`mt-6 flex flex-col ${isCollapsed ? 'items-center gap-2' : 'gap-2'}`}>
          {navItemsTop.map(({ href, label, icon }) => (
            <Link key={href} href={href} onClick={closeSidebar} className={`${pathname === href ? 'bg-neutral-600/50 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-600/50'} rounded-md transition cursor-pointer ${isCollapsed ? 'flex flex-col items-center p-3' : 'flex items-center gap-3 p-3'}`}>
              <div>{icon}</div>
              {isTextVisible && <span className="text-sm">{label}</span>}
            </Link>
          ))}
        </div>

        <div className={`mb-6 flex flex-col border-t border-neutral-600/50 pt-4 gap-2 ${isCollapsed ? 'items-center' : ''}`}>
          {navItemsBottom.map(({ href, label, icon }) => (
            <Link key={href} href={href} onClick={closeSidebar} className={`${pathname === href ? 'bg-neutral-600/50 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-600/50'} rounded-md transition cursor-pointer ${isCollapsed ? 'flex flex-col items-center p-3' : 'flex items-center gap-3 p-3'}`}>
              <div>{icon}</div>
              {isTextVisible && <span className="text-sm">{label}</span>}
            </Link>
          ))}
          <button onClick={handleLogout} className={`text-yellow-700 hover:text-red-700 hover:bg-gray-100 rounded-md transition cursor-pointer ${isCollapsed ? 'flex flex-col items-center p-3' : 'flex items-center gap-3 p-3'}`}>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
            {isTextVisible && <span className="text-sm">로그아웃</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
