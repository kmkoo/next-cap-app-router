'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        router.push("/main/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <div className="bg-[#373A3C] text-neutral-100 divide-y-1 divide-neutral-600/50 flex flex-col w-65 min-h-screen right-0 sticky top-0 h-screen">
      <div className="flex flex-col grow mx-6 justify-center pb-30">
        <div className="flex justify-center mb-10">
          <Link href="/auth">
            <img
              src="/logo1.svg"
              alt="logo2"
              className="w-24 h-12"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <img
              src="/logo2.svg"
              alt="logo2"
              className="w-24 h-12"
              style={{ filter: 'brightness(0) invert(1)' }}
              />
          </Link>
        </div>
        <div className="flex gap-2 mb-3 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M21 12h-13l3 -3" />
            <path d="M11 15l-3 -3" />
          </svg>
          <p className="text-[16px]">로그인</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="flex items-center p-3 my-2 rounded-lg bg-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-1 border-none outline-none text-white w-full text-[14px]"
            />
          </div>

          <div className="flex items-center p-3 my-2 rounded-lg bg-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
              <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
              <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
            </svg>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-1 border-none outline-none text-white w-full text-[14px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-[45px] p-3 my-2 rounded-lg hover:bg-neutral-800/50 bg-neutral-800 text-[14px] cursor-pointer"
          >
            {isLoading ?
              <svg className="w-6 h-6 mx-auto animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              : '로그인'}
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-2">{message}</p>}
      </div>

      <div className="px-3 text-neutral-400">
        <div className="my-5 mx-2 flex flex-col">
          <Link
            href="/auth/signup"
            className={`m-1 p-3 rounded-md transition cursor-pointer ${pathname === '/auth/signup' ? 'bg-neutral-600/50 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-600/50'} flex gap-2 text-[14px]`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
            </svg>
            회원가입
          </Link>

          <Link
            href="/auth/findid"
            className={`m-1 p-3 rounded-md transition cursor-pointer ${pathname === '/auth/findid' ? 'bg-neutral-600/50 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-600/50'} flex gap-2 text-[14px]`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            아이디찾기
          </Link>

          <Link
            href="/auth/resetpw"
            className={`m-1 p-3 rounded-md transition cursor-pointer ${pathname === '/auth/resetpw' ? 'bg-neutral-600/50 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-600/50'} flex gap-2 text-[14px]`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
              <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M8 11v-5a4 4 0 0 1 8 0" />
            </svg>
            비밀번호 재설정
          </Link>
        </div>
      </div>
    </div>
  );
}
