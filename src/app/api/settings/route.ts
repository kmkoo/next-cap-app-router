import { NextResponse } from "next/server";
import db from "@/lib/dbcon";

// [GET] 설정 불러오기
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, message: "이메일이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query(
      "SELECT settingName FROM User WHERE userEmail = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const userSetting = (rows as any[])[0].settingName;
    const parsed = JSON.parse(userSetting || "{}");

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[설정 불러오기 오류]", err);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// [PATCH] 설정 저장하기
export async function PATCH(req: Request) {
  const body = await req.json();
  const { email, ...updatedSettings } = body;

  if (!email) {
    return NextResponse.json(
      { success: false, message: "이메일이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const jsonSettings = JSON.stringify(updatedSettings);
    await db.query(
      "UPDATE User SET settingName = ? WHERE userEmail = ?",
      [jsonSettings, email]
    );

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error("[설정 저장 오류]", err);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
