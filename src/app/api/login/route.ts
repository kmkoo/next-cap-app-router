import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/dbcon";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const [rows] = await db.query(
      `SELECT userName, userEmail, userPassword FROM User WHERE userEmail = ?`,
      [email]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." },
        { status: 401 }
      );
    }

    const user = (rows as any[])[0];
    const isMatch = await bcrypt.compare(password, user.userPassword);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      name: user.userName,
      email: user.userEmail,
    });
  } catch (error) {
    console.error("[로그인 오류]", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
