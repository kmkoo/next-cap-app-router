import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/dbcon";

export async function POST(req: Request) {
  const { name, phone, email, newPassword } = await req.json();

  try {
    const [rows] = await db.query(
      `SELECT userNumber FROM User WHERE userName = ? AND userPhone = ? AND userEmail = ?`,
      [name, phone, email]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "회원 정보가 일치하지 않습니다." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE User SET userPassword = ? WHERE userName = ? AND userPhone = ? AND userEmail = ?`,
      [hashedPassword, name, phone, email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[비밀번호 재설정 오류]", error);
    return NextResponse.json(
      { success: false, message: "서버 오류로 비밀번호 재설정에 실패했습니다." },
      { status: 500 }
    );
  }
}
