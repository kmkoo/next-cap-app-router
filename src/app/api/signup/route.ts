import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/dbcon";

export async function POST(req: Request) {
  const { name, phone, email, password } = await req.json();

  try {
    const [emailCheck] = await db.query("SELECT 1 FROM User WHERE userEmail = ?", [email]);
    if ((emailCheck as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: "이미 가입된 이메일입니다." },
        { status: 409 }
      );
    }

    const [phoneCheck] = await db.query("SELECT 1 FROM User WHERE userPhone = ?", [phone]);
    if ((phoneCheck as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: "이미 등록된 전화번호입니다." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultSettings = {
      emailNotification: false,
      showServerAddress: false,
    };
    
    await db.query(
      "INSERT INTO User (userName, userPhone, userEmail, userPassword, settingName) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, hashedPassword, JSON.stringify(defaultSettings)]
    );

    return NextResponse.json({ success: true, message: "회원가입 성공" });
  } catch (error) {
    console.error("[회원가입 오류]", error);
    return NextResponse.json(
      { success: false, message: "서버 오류로 회원가입에 실패했습니다." },
      { status: 500 }
    );
  }
}
