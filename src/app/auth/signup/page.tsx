"use client";

import { useState } from "react";
import PageWrapper from "@/components/page-wrapper";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verifyCodeSent, setVerifyCodeSent] = useState(false);
    const [enteredCode, setEnteredCode] = useState("");
    const [verificationSuccess, setVerificationSuccess] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailVerified) {
            setErrorMessage("이메일 인증을 완료해주세요.");
            return;
        }

        if (password !== confirmPassword) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
        }

        try {
            const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, password }),
        });

        const data = await res.json();
        if (data.success) {
            setSuccess(true);
            setErrorMessage("");
        } else {
            setErrorMessage(data.message || "회원가입에 실패했습니다.");
        }
        } catch {
        setErrorMessage("서버 오류가 발생했습니다.");
        }
    };

    const handleSendVerification = async () => {
        const res = await fetch("/api/email/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
            setVerifyCodeSent(true);
            setErrorMessage("인증 코드가 이메일로 전송되었습니다.");
        } else {
            setErrorMessage("인증 코드 전송에 실패했습니다.");
        }
    };
    
    const handleVerifyCode = async () => {
        const res = await fetch("/api/email/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: enteredCode }),
        });
        const data = await res.json();
        if (data.success) {
            setEmailVerified(true);
            setVerificationSuccess(true);
            setErrorMessage("");
        } else {
            setErrorMessage(data.message || "인증 실패");
        }
    };

    return (
        <PageWrapper>
        <div className="bg-[#F1F3F7] min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-xl">
                <h2 className="text-[30px] text-center mb-8">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center bg-white rounded-md px-2 py-2">
                        <span className="mx-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                                <path d="M3 7l9 6l9 -6"></path>
                            </svg>
                        </span>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent focus:outline-none text-[14px]"
                            required
                            readOnly={emailVerified}
                        />
                        {emailVerified ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setEmailVerified(false);
                                    setVerifyCodeSent(false);
                                    setEnteredCode("");
                                    setVerificationSuccess(false);
                                    setErrorMessage("");
                                }}
                                className="text-sm text-red-500 whitespace-nowrap ml-2 pr-2 hover:underline cursor-pointer"
                            >
                                다시입력
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendVerification}
                                className="text-sm text-blue-600 whitespace-nowrap ml-2 pr-2 hover:underline cursor-pointer"
                            >
                                인증코드 전송
                            </button>
                        )}
                    </div>

                    {verifyCodeSent && !emailVerified && (
                        <div className="flex items-center bg-white rounded-md px-2 py-2 mt-2">
                            <span className="mx-8 text-gray-500 flex items-center justify-center h-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M15 12a3 3 0 1 0 -6 0a3 3 0 0 0 6 0"></path>
                                    <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9 -9 9s-9 -4.03 -9 -9s4.03 -9 9 -9z"></path>
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={enteredCode}
                                onChange={(e) => setEnteredCode(e.target.value)}
                                placeholder="인증 코드 입력"
                                className="w-full bg-transparent focus:outline-none text-[14px]"
                            />
                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                className="text-sm text-green-600 whitespace-nowrap ml-2 pr-2 hover:underline cursor-pointer"
                            >
                                확인
                            </button>
                        </div>
                    )}


                        {verificationSuccess && (
                        <p className="text-green-500 text-sm mt-1">✅ 이메일 인증 완료</p>
                    )}

                    <div className="flex items-center bg-white rounded-md px-2 py-2">
                        <span className="mx-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
                                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                                <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
                            </svg>
                        </span>
                        <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-[14px]"
                        required
                        />
                    </div>

                    <div className="flex items-center bg-white rounded-md px-2 py-2">
                        <span className="mx-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
                                <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
                                <path d="M15 16h.01"></path>
                                <path d="M12.01 16h.01"></path>
                                <path d="M9.02 16h.01"></path>
                            </svg>
                        </span>
                        <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-[14px]"
                        required
                        />
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <input type="checkbox" id="terms" className="mr-2" required />
                        <label htmlFor="terms">
                            <a href="/terms" className="text-blue-600 hover:underline">이용약관</a> 및{" "}
                            <a href="/privacy" className="text-blue-600 hover:underline">개인정보 처리방침</a>에 동의합니다.
                        </label>
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    {success && <p className="text-green-600 text-sm">🎉 회원가입에 성공했습니다!</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#3A3A3A] text-white py-2 rounded-md hover:bg-[#2B2B2B] transition"
                        >
                        가입하기
                    </button>

                </form>
            </div>
        </div>
        </PageWrapper>
    );
}
