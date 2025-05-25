"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import PageWrapper from "@/components/page-wrapper";
import TopBar from "@/components/topbar";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"notification" | "display">("notification");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [originalFormData, setOriginalFormData] = useState({ name: "", email: "", phone: "" });
  const [originalEmail, setOriginalEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [verifyCodeSent, setVerifyCodeSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  
  useEffect(() => {
    if (!userEmail) return;

    fetch(`/api/user?email=${userEmail}`)
      .then(res => res.json())
      .then(data => {
        const newData = { name: data.name, email: data.email, phone: data.phone };
        setFormData(newData);
        setOriginalFormData(newData);
        setOriginalEmail(data.email);
        setIsEmailVerified(true);
        setIsLoading(false);
      });
  }, [userEmail]);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "email") {
      if (value === originalEmail) {
        setIsEmailVerified(true);
        setVerifyCodeSent(false);
        setEnteredCode("");
      } else {
        setIsEmailVerified(false);
      }
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSendVerification = async () => {
    const res = await fetch("/api/email/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const data = await res.json();
    if (data.success) {
      setVerifyCodeSent(true);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } else {
      alert("인증 코드 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    const res = await fetch("/api/email/verify", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, code: enteredCode }),
    });
    const data = await res.json();
    if (data.success) {
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증 코드가 올바르지 않습니다.");
    }
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailVerified) return alert("이메일 인증이 필요합니다.");

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSuccessMessage("회원정보가 성공적으로 업데이트되었습니다.");
      setOriginalFormData(formData);
      setOriginalEmail(formData.email);
      setTimeout(() => {
        setSuccessMessage("");
        setEditMode(false);
      }, 3000);
    } else {
      alert("업데이트 실패");
    }
  };

  const handleCancelEdit = () => {
    setFormData(originalFormData);
    setEnteredCode("");
    setIsEmailVerified(true);
    setVerifyCodeSent(false);
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setPasswordError(data.message || "비밀번호 변경 실패");
    }
  };

  return (
    <PageWrapper>
      <div className="bg-[#F1F3F7] flex-grow min-h-screen">
        <TopBar
          title="회원정보"
          tabs={[
            { key: "notification", label: "내 계정" },
            { key: "display", label: "청구" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="px-6 pt-6">
          {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

          <PageWrapper key={activeTab}>
            {activeTab === "notification" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px]">내 프로필</h2>
                    {!editMode && !isLoading && (
                      <button onClick={() => setEditMode(true)} className="p-2 text-gray-500 hover:text-black rounded-md transition cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    {['name', 'phone', 'email'].map((field) => (
                      <div key={field} className="flex items-center gap-11 px-5 text-[15px]">
                        {field === 'name' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                          </svg>
                        )}
                        {field === 'phone' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                          </svg>
                        )}
                        {field === 'email' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                            <path d="M3 7l9 6l9 -6"></path>
                          </svg>
                        )}

                        {editMode ? (
                          <input
                            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleProfileChange}
                            className="flex-1 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={field !== 'phone'}
                          />
                        ) : isLoading ? (
                          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <p className="py-2">{(formData as any)[field]}</p>
                        )}

                        {editMode && field === 'email' && !isEmailVerified && (
                          <div className="ml-2">
                            {!verifyCodeSent ? (
                              <button type="button" onClick={handleSendVerification} className="text-blue-600 hover:underline text-sm">
                                인증 코드 보내기
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="인증코드 입력"
                                  value={enteredCode}
                                  onChange={(e) => setEnteredCode(e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                                <button type="button" onClick={handleVerifyCode} className="text-blue-600 hover:underline text-sm">
                                  인증 확인
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                          취소
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                          저장하기
                        </button>
                      </div>
                    )}
                  </form>

                  <div className="mt-12">
                    <h2 className="text-[16px] mb-6">비밀번호 변경</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map((field, idx) => (
                        <div key={field}>
                          <label className="block text-gray-700 text-[14px] mb-2">
                            {idx === 0 ? '현재 비밀번호' : idx === 1 ? '새 비밀번호' : '새 비밀번호 확인'}
                          </label>
                          <input
                            type="password"
                            name={field}
                            value={(passwordForm as any)[field]}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      ))}
                      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                      <div className="flex justify-end mt-4">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                          비밀번호 변경
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="mt-12">
                    <h2 className="text-[16px] mb-6">계정 삭제</h2>
                    <p className="text-gray-600 mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">계정 삭제</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-[16px] mb-6">결제 정보</h2>
                  <p className="text-gray-600">청구 관련 정보를 이곳에서 관리할 수 있습니다.</p>
                </div>
              </div>
            )}
          </PageWrapper>
        </div>
      </div>
    </PageWrapper>
  );
}
