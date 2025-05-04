import Sidebar from "@/components/sidebar";

// /main 하부 경로에 적용되는 레이아웃
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className='flex'>
        <Sidebar />
        {children}
      </div>
  );
}
