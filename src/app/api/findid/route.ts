import { NextResponse } from "next/server";
import db from "@/lib/dbcon";

export async function POST(req: Request) {
  const { name, phone } = await req.json();

  try {
    const [rows] = await db.query(
      `SELECT userEmail FROM User WHERE userName = ? AND userPhone = ?`,
      [name, phone]
    );

    if ((rows as any[]).length > 0) {
      const user = (rows as any[])[0];
      return NextResponse.json({ success: true, email: user.userEmail });
    }

    return NextResponse.json(
      { success: false, message: "일치하는 회원 정보가 없습니다." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[비밀번호 찾기 오류]", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
