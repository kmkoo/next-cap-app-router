"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      router.replace("/auth");
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}
