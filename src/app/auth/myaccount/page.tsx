'use client';

import { useEffect, useState } from 'react';

export default function MyAccountPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/me');
      const data = await res.json();
      setName(data.name);
      setPhone(data.phone);
      setEmail(data.email);
      if (data.profileUrl) setPreviewUrl(data.profileUrl);
    };
    fetchUser();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    if (newPassword) formData.append('newPassword', newPassword);
    formData.append('currentPassword', currentPassword);
    if (profile) formData.append('profile', profile);

    try {
      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.success ? '✅ 수정 완료!' : (data.message || '❌ 수정 실패'));
    } catch {
      setMessage('❌ 서버 오류');
    }
  };

  return (
    <div className="bg-[#F1F3F7] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h2 className="text-[30px] text-center mb-6">내 계정 수정</h2>

        <div className="flex justify-center mb-4">
          <label className="cursor-pointer relative">
            <img
              src={previewUrl || '/default-profile.png'}
              alt="프로필"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className="hidden"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 5v14m-7-7h14" />
              </svg>
            </div>
          </label>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <InputRow icon="user" value={name} onChange={setName} placeholder="이름" />
          <InputRow icon="phone" value={phone} onChange={setPhone} placeholder="전화번호" />
          <InputRow icon="mail" value={email} onChange={() => {}} placeholder="이메일" readOnly />
          <InputRow icon="lock" value={currentPassword} onChange={setCurrentPassword} placeholder="현재 비밀번호" type="password" />
          <InputRow icon="lock" value={newPassword} onChange={setNewPassword} placeholder="새 비밀번호" type="password" />

          {message && <p className="text-center text-sm text-red-500">{message}</p>}
          <button type="submit" className="w-full bg-[#3A3A3A] text-white py-2 rounded-md hover:bg-[#2B2B2B] transition">
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

function InputRow({
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false,
}: {
  icon: 'user' | 'phone' | 'mail' | 'lock';
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
}) {
  const icons = {
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
      </svg>
    ),
    mail: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
        <path d="M3 7l9 6l9 -6" />
      </svg>
    ),
    lock: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center bg-white rounded-md px-2 py-2 ${readOnly ? 'opacity-70' : ''}`}>
      <span className="mx-8 text-gray-500">{icons[icon]}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`w-full bg-transparent focus:outline-none text-[14px] ${readOnly ? 'cursor-not-allowed' : ''}`}
        required={!readOnly}
      />
    </div>
  );
}
