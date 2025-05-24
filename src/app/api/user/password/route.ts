import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/dbcon";

export async function PATCH(req: Request) {
  const { email, currentPassword, newPassword } = await req.json();

  if (!email || !currentPassword || !newPassword) {
    return NextResponse.json({ success: false, message: "모든 필드가 필요합니다." }, { status: 400 });
  }

  try {
    const [rows]: any = await db.query("SELECT userPassword FROM User WHERE userEmail = ?", [email]);

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.userPassword);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE User SET userPassword = ? WHERE userEmail = ?", [hashed, email]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}
