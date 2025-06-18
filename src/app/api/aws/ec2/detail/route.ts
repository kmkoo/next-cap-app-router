import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const { serverName, serverOwner: serverEmail } = await req.json();

    if (!serverName || !serverEmail) {
      return NextResponse.json(
        { success: false, error: "누락된 파라미터" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `SELECT serverAddr, status, serverType, createdAt, serverImage
       FROM Server
       WHERE serverName = ?
       AND userNumber = (SELECT userNumber FROM User WHERE userEmail = ?)`,
      [serverName, serverEmail]
    );

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: "서버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, server: result[0] });
  } catch (error) {
    console.error("상세 정보 조회 실패:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
