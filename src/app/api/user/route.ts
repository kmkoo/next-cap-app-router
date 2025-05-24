import { NextResponse } from "next/server";
import db from "@/lib/dbcon";

// 사용자 정보 조회 (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "이메일이 필요합니다." }, { status: 400 });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT userName AS name, userEmail AS email, userPhone AS phone FROM User WHERE userEmail = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("사용자 조회 오류:", error);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}

// 사용자 정보 수정 (PATCH)
export async function PATCH(req: Request) {
  const { name, email, phone } = await req.json();

  if (!email || !name || !phone) {
    return NextResponse.json({ success: false, message: "모든 값이 필요합니다." }, { status: 400 });
  }

  try {
    await db.query(
      "UPDATE User SET userName = ?, userPhone = ? WHERE userEmail = ?",
      [name, phone, email]
    );

    return NextResponse.json({ success: true, message: "정보가 수정되었습니다." });
  } catch (error) {
    console.error("사용자 정보 수정 오류:", error);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}
