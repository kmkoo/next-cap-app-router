"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      router.replace("/auth");
    }
  }, [router]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        className={`md:hidden fixed top-4 right-4 z-50 p-2 ${
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

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={closeSidebar}></div>
      )}

      <div className="flex h-screen relative">
        <div className="hidden md:block">
          <Sidebar isOpen={true} closeSidebar={() => {}} />
        </div>
        <div className="block md:hidden fixed z-50">
          <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </>
  );
}
