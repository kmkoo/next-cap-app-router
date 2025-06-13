import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverOwner, oldName, newName } = body;

    if (!serverOwner || !oldName || !newName) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const [existing] = await db.query(
      `SELECT 1 FROM Server
       WHERE userNumber = (SELECT userNumber FROM User WHERE userName = ?)
       AND serverName = ?`,
      [serverOwner, newName]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: "이미 존재하는 서버 이름입니다." },
        { status: 409 }
      );
    }

    const [result] = await db.query(
      `UPDATE Server
       SET serverName = ?
       WHERE userNumber = (SELECT userNumber FROM User WHERE userName = ?)
       AND serverName = ?`,
      [newName, serverOwner, oldName]
    );

    const affectedRows = (result as any).affectedRows || 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "변경할 서버를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
