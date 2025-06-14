import db from "@/lib/dbcon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userEmail } = body;

  try {
    const [rows]: any = await db.query(
      `SELECT serverNumber, serverName, serverType, createdAt, serverAddr, status, serverImage
      FROM Server
      WHERE userNumber = (
        SELECT userNumber 
        FROM User 
        WHERE userEmail = ?)`,
      userEmail
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "소유한 서버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, serverList: rows });
  } catch (error) {
    console.error("서버 조회중 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 조회 오류" },
      { status: 500 }
    );
  }
}
