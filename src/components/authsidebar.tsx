'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// /auth 레이아웃에 사용되는 사이드바(로그인 기능)
export default function AuthSidebar() {
  const router = useRouter()

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)

    try{
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage('로그인 성공!')
        router.push('/main/dashboard')
      } else {
        setMessage(data.message)
      }
    } catch {
      setMessage('에러가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-neutral-800 text-neutral-100 divide-y-1 divide-zinc-700 flex flex-col w-70 min-h-screen right-0 sticky top-0 h-screen">
      <div className="flex flex-col grow mx-8 justify-center">
        <div className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <p>로그인</p>
        </div>
        <input 
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="p-2 my-2 rounded-lg bg-neutral-600"
        />
        <input 
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 my-2 rounded-lg bg-neutral-600"
        />
        <button onClick={handleLogin} disabled={isLoading} className="p-2 my-2 rounded-lg bg-neutral-900">
          {isLoading ? '로그인중...'
          : '로그인'}
        </button>
        {message && <p className="text-center text-red-500">{message}</p>}
      </div>
      <div className="px-3 text-neutral-400">
        <div className="my-3 mx-2 flex flex-col">
        <Link href='/main/about'
          className="m-1 p-2 rounded-lg hover:bg-neutral-600/50 flex gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          회원가입
        </Link>
        <Link href='/main/about'
          className="m-1 p-2 rounded-lg hover:bg-neutral-600/50 flex gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          아이디찾기
        </Link>
        <Link href='/auth'
          className="m-1 p-2 rounded-lg hover:bg-neutral-600/50 flex gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          비밀번호 재설정
        </Link>
        </div>
      </div>
    </div>
  );
}