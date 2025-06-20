import { NextRequest, NextResponse } from "next/server";
import { stopInstance } from "@/lib/aws-ec2";
import db from "@/lib/dbcon";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverName, serverOwner: serverEmail } = body;

    if (!serverName || serverName.trim() === "") {
      return NextResponse.json(
        { success: false, errorMassage: "서버 이름을 받지 못했습니다." },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `SELECT instanceId, status
       FROM Server
       WHERE userNumber = (
         SELECT userNumber 
         FROM User 
         WHERE userEmail = ?) 
       AND serverName = ?`,
      [serverEmail, serverName]
    );

    const rows = result as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, errorMassage: "서버를 찾지 못했습니다." },
        { status: 404 }
      );
    }

    const { instanceId, status } = rows[0];
    const timestamp = dayjs().tz("Asia/Seoul").format("YYYYMMDDHHmmss");
    const newName = `${serverName}_del_${timestamp}`;

    if (status === "OFF") {
      await db.query(
        `UPDATE Server 
         SET serverName = ?, serverAddr = NULL, status = ? 
         WHERE instanceId = ?`,
        [newName, "DEL", instanceId]
      );

      return NextResponse.json({ success: true, instanceList: null });
    }

    const instanceList = await stopInstance([instanceId]);

    await db.query(
      `UPDATE Server 
       SET serverName = ?, serverAddr = NULL, status = ? 
       WHERE instanceId = ?`,
      [newName, "DEL", instanceId]
    );

    return NextResponse.json({ success: true, instanceList });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
