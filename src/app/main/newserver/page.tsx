import TempPage from "@/app/PageTemplates/page";

export const metadata = {
  title: 'NewServer',
}

export default function NewServerPage() {
  return (
    <div className="min-h-screen">
      <p>New Server</p>
      <TempPage />
    </div>
  );
}
