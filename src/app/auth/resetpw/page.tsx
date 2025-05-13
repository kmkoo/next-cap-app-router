'use client'

import { useState } from 'react'

export default function ResetPasswordPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPw !== confirmPw) {
      setError('비밀번호가 서로 일치하지 않습니다.')
      return
    }

    try {
      const res = await fetch('/api/resetpw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, newPassword: newPw }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage('비밀번호가 성공적으로 재설정되었습니다.')
      } else {
        setError(data.message)
      }
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-[#F1F3F7] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h2 className="text-[30px] text-center mb-8">비밀번호 재설정</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center bg-white rounded-md px-2 py-2">
            <span className="mx-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                width="20" height="20" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                stroke="currentColor">
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[14px]"
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-md px-2 py-2">
            <span className="mx-8 text-gray-500 flex items-center justify-center h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                width="20" height="20">
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
            </span>
            <input
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[14px]"
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-md px-2 py-2">
            <span className="mx-8 text-gray-500 flex items-center justify-center h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                width="20" height="20">
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                <path d="M3 7l9 6l9 -6" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[14px]"
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-md px-2 py-2">
            <span className="mx-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                width="20" height="20">
                <path d="M12 17v.01" />
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[14px]"
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-md px-2 py-2">
            <span className="mx-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                width="20" height="20">
                <path d="M12 17v.01" />
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[14px]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3A3A3A] text-white py-2 rounded-md hover:bg-[#2B2B2B] transition"
          >
            비밀번호 재설정
          </button>

          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}
