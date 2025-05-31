"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthSidebar from "@/components/authsidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      router.replace("/main/dashboard");
    }
  }, [router]);

  return (
    <div className='flex min-h-screen min-w-screen'>
      <div className="flex-1">
        {children}
      </div>
      <AuthSidebar />
    </div>
  );
}
