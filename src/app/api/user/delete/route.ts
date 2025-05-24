import { NextResponse } from "next/server";
import db from "@/lib/dbcon";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "이메일이 필요합니다." }, { status: 400 });
  }

  try {
    const [result] = await db.query("DELETE FROM User WHERE userEmail = ?", [email]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ success: false, message: "삭제할 사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "계정이 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 오류:", error);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}
