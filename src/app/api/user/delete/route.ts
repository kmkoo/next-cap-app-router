import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/dbcon";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const [rows]: any = await db.query("SELECT userPassword FROM User WHERE userEmail = ?", [email]);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    await db.query("DELETE FROM User WHERE userEmail = ?", [email]);

    return NextResponse.json({ success: true, message: "계정이 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 오류:", error);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}
