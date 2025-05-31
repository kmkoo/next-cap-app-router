'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from "@/components/page-wrapper"

export default function ResetPasswordPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [emailVerified, setEmailVerified] = useState(false)
  const [verifyCodeSent, setVerifyCodeSent] = useState(false)
  const [enteredCode, setEnteredCode] = useState('')
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [isSending, setIsSending] = useState(false);


  const handleSendVerification = async () => {
    if (!email) {
        setEmailError("이메일을 입력해주세요.");
        return;
    }

    setIsSending(true);
    const res = await fetch("/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setIsSending(false);

    if (data.success) {
        setVerifyCodeSent(true);
    } else {
        setEmailError("이메일을 다시 입력해주십시오.");
    }
  };

  const handleVerifyCode = async () => {
    const res = await fetch("/api/email/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: enteredCode }),
    })
    const data = await res.json()
    if (data.success) {
      setEmailVerified(true)
      setVerificationSuccess(true)
      setEmailError("")
    } else {
      setEmailError(data.message || "인증 실패")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setEmailError('')

    if (!emailVerified) {
      setEmailError("이메일 인증을 완료해주세요.")
      return
    }

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
        setTimeout(() => {
          router.push('/auth')
        }, 1000)
      } else {
        setError(data.message)
      }
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    }
  }

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="text-[30px] text-center mb-8">비밀번호 재설정</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center bg-white rounded-md px-2 py-4">
              <span className="mx-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-[16px]"
                required
              />
            </div>

            <div className="flex items-center bg-white rounded-md px-2 py-4">
              <span className="mx-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                </svg>
              </span>
              <input
                type="tel"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-[16px]"
                required
              />
            </div>

            <div className="flex items-center bg-white rounded-md pl-2">
              <span className="mx-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                  <path d="M3 7l9 6l9 -6" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-[16px] py-4"
                required
                readOnly={emailVerified}
              />
              {emailVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    setEmailVerified(false)
                    setVerifyCodeSent(false)
                    setEnteredCode("")
                    setVerificationSuccess(false)
                    setEmailError("")
                  }}
                  className="h-[56px] px-7 rounded-r text-sm text-white bg-[#3A3A3A] whitespace-nowrap hover:bg-[#2B2B2B] cursor-pointer"
                >
                  다시입력
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="h-[56px] px-3 rounded-r text-sm text-white bg-blue-400 whitespace-nowrap hover:bg-blue-500 cursor-pointer"
                >
                  {isSending ? (
                      <svg className="w-6 h-6 mx-[37px] animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                  ) : (
                      "인증 코드 보내기"
                  )}
                </button>
              )}
            </div>

            {emailError && (
              <p className="text-red-500 text-sm mt-1 ml-2">{emailError}</p>
            )}

            {verificationSuccess && (
                <p className="text-green-500 text-sm mt-1">✅ 이메일 인증 완료</p>
            )}

            {verifyCodeSent && !emailVerified && (
              <div className="flex items-center bg-white rounded-md pl-2">
                <span className="mx-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 1 0 -6 0a3 3 0 0 0 6 0" />
                    <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9 -9 9s-9 -4.03 -9 -9s4.03 -9 9 -9z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-[16px] py-4"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="h-[56px] px-10 rounded-r text-sm text-white bg-blue-400 whitespace-nowrap hover:bg-blue-500 cursor-pointer"
                >
                  확인
                </button>
              </div>
            )}

            <div className="flex items-center bg-white rounded-md px-2 py-4">
              <span className="mx-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
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
                className="w-full bg-transparent focus:outline-none text-[16px]"
                required
              />
            </div>

            <div className="flex items-center bg-white rounded-md px-2 py-4">
              <span className="mx-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
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
                className="w-full bg-transparent focus:outline-none text-[16px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3A3A3A] text-white py-4 rounded-md hover:bg-[#2B2B2B] transition cursor-pointer"
            >
              비밀번호 재설정
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
