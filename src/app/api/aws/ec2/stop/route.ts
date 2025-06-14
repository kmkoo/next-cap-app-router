import { NextRequest, NextResponse } from "next/server";
import { stopInstance } from "@/lib/aws-ec2";
import db from "@/lib/dbcon";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({ region: "ap-northeast-2" });

async function waitForStopped(
  instanceId: string,
  retries = 20,
  delay = 5000
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const describe = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    const res = await ec2.send(describe);
    const state = res.Reservations?.[0]?.Instances?.[0]?.State?.Name;
    if (state === "stopped") return true;
    await new Promise((r) => setTimeout(r, delay));
  }
  return false;
}

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
      `SELECT instanceId
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

    const instanceId = rows[0].instanceId;
    await stopInstance([instanceId]);

    const success = await waitForStopped(instanceId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "중단 상태 확인 실패 (timeout)" },
        { status: 500 }
      );
    }

    await db.query(
      `UPDATE Server SET serverAddr = NULL, status = ? WHERE instanceId = ?`,
      ["OFF", instanceId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
