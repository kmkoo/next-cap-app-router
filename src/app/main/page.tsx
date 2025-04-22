import TempPage from "@/app/PageTemplates/page";
import Form from "next/form";

export const metadata = {
  title: '대시보드',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <TempPage />
      <Form action='/api/test' >
        <input type="text" name="test" className="p-2 my-2 rounded-lg bg-neutral-600" placeholder="테스트" />
        <button type="submit" className="border rounded">GO</button>
      </Form>
    </div>
  );
}
