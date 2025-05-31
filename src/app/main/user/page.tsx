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
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSending, setIsSending] = useState(false);


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
    setIsSending(true);
    const res = await fetch("/api/email/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const data = await res.json();
    setIsSending(false);

    if (data.success) {
      setVerifyCodeSent(true);
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
      }, 1000);
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
      setTimeout(() => setSuccessMessage(""), 1000);
    } else {
      setPasswordError(data.message || "비밀번호 변경 실패");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("비밀번호를 입력해주세요.");
      return;
    }

    const res = await fetch("/api/user/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: deletePassword }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.clear();
      window.location.href = "/auth";
    } else {
      setDeleteError(data.message || "계정 삭제 실패");
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
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <PageWrapper key={activeTab}>
          {activeTab === "notification" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="py-1.5 text-[16px]">내 프로필</h2>
                  {!isLoading && (
                    editMode ? (
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="p-2 text-red-700 hover:text-red-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        <button
                          type="submit"
                          form="profile-form"
                          className="p-2 text-green-700 hover:text-green-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-2 text-gray-500 hover:text-black rounded-md transition cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )
                  )}
                </div>

                <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
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
                          className="flex-1 min-h-[38px] px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                          required={field !== 'phone'}
                        />
                      ) : isLoading ? (
                        <div className="flex-1 h-[38px] bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <p className="flex-1 min-h-[38px] flex items-center py-1">{(formData as any)[field]}</p>
                      )}
                      {editMode && field === 'email' && !isEmailVerified && (
                        <div className="h-[38px] ml-2">
                          {!verifyCodeSent ? (
                            <button type="button" onClick={handleSendVerification} className="h-[38px] px-3 rounded-md text-white bg-blue-400 hover:bg-blue-500 cursor-pointer text-sm">
                              {isSending ? (
                                  <svg className="w-6 h-6 mx-[37px] animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                  </svg>
                              ) : (
                                  "인증 코드 보내기"
                              )}
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="인증코드 입력"
                                value={enteredCode}
                                onChange={(e) => setEnteredCode(e.target.value)}
                                className="min-h-[38px] border border-gray-300 rounded px-2 py-1 mr-2 text-sm focus:outline-none focus:ring-1"
                              />
                              <button type="button" onClick={handleVerifyCode} className="h-[38px] px-3 rounded-md text-white bg-blue-400 hover:bg-blue-500 cursor-pointer text-sm">
                                인증 확인
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </form>

                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px]">비밀번호 변경</h2>
                    {!passwordEditMode ? (
                      <button
                        onClick={() => setPasswordEditMode(true)}
                        className="p-2 text-gray-500 hover:text-black rounded-md transition cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordEditMode(false)
                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                            setPasswordError("")
                          }}
                          className="p-2 text-red-700 hover:text-red-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        <button
                          type="submit"
                          form="pw-form"
                          className="p-2 text-green-700 hover:text-green-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {passwordEditMode && (
                    <form id="pw-form" onSubmit={handlePasswordSubmit} className="space-y-4">
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
                            className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                            required
                          />
                        </div>
                      ))}
                      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </form>
                  )}
                </div>

                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[16px] text-red-500">계정 삭제</h2>
                    {!deleteMode ? (
                      <button
                        onClick={() => setDeleteMode(true)}
                        className="p-2 text-red-500/60 hover:text-red-500 rounded-md transition cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteMode(false);
                            setDeletePassword("");
                            setDeleteError("");
                          }}
                          className="p-2 text-red-700 hover:text-red-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="p-2 text-green-700 hover:text-green-500 rounded-md transition cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {deleteMode ? (
                    <div className="space-y-3">
                      <p className="text-red-500">계정을 삭제하려면 비밀번호를 입력해주세요.</p>
                      <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full px-4 py-1 text-red-500 border border-red-500 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
                    </div>
                  ) : (
                    <p className="text-red-500 mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
                  )}
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
)

}
