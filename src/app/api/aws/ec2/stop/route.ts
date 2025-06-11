import { NextRequest, NextResponse } from "next/server";
import { stopInstance } from '@/lib/aws-ec2';
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverName, serverOwner } = body;

    if (!serverName || serverName.trim() === "") {
      return NextResponse.json({ success: false, errorMassage: "서버 이름을 받지 못했습니다." }, { status: 400 });
    }

    const [result] = await db.query(
      `SELECT instanceId
       FROM Server
       WHERE userNumber = (
         SELECT userNumber 
         FROM User 
         WHERE userName = ?) 
       AND serverName = ?`,
      [serverOwner, serverName]
    );

    const rows = result as any[];

    if (rows.length === 0) {
      return NextResponse.json({ success: false, errorMassage: "서버를 찾지 못했습니다." }, { status: 404 });
    }

    const instanceId = rows[0].instanceId;
    const instanceList = await stopInstance([instanceId]);

    // 퍼블릭 IP가 해제되므로 DB에서 주소 비우기
    await db.query(
      `UPDATE Server SET serverAddr = NULL WHERE instanceId = ?`,
      [instanceId]
    );

    return NextResponse.json({ success: true, instanceList });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
