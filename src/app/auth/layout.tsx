import AuthSidebar from "@/components/authsidebar";

// /auth 하부 경로에 적용되는 레이아웃
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className='flex min-h-screen min-w-screen'>
        <div className="flex-1">
          {children}
        </div>
        <AuthSidebar />
      </div>
  );
}
