import AuthSidebar from "@/components/authsidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className='flex min-h-screen'>
        <div className="flex-1">
          {children}
        </div>
        <AuthSidebar />
      </div>
  );
}
