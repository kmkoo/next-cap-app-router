"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthSidebar from "@/components/authsidebar";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      router.replace("/main/dashboard");
    }
  }, [router]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 ${
          isOpen ? "text-white" : "text-black"
        }`}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <Link href="/auth">
        <div className="fixed top-6 right-6 w-full flex justify-end z-40 md:hidden">
          <img src="/logo1_color.png" alt="로고" className="h-8 object-contain" />
        </div>
      </Link>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-[#373A3C]/50"
          onClick={closeSidebar}
        />
      )}

      <div className="flex min-h-screen min-w-screen relative">
        <div className="flex-1">{children}</div>
        <div className="hidden md:block">
          <AuthSidebar isOpen={true} closeSidebar={() => {}} />
        </div>
        <div className="block md:hidden">
          <AuthSidebar isOpen={isOpen} closeSidebar={closeSidebar} />
        </div>
      </div>
    </>
  );
}
