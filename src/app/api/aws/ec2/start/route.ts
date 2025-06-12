import { NextRequest, NextResponse } from "next/server";
import { startInstance } from '@/lib/aws-ec2';
import db from "@/lib/dbcon";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({ region: "ap-northeast-2" });

async function waitForPublicIp(instanceId: string, retries = 10, delayMs = 3000): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const describeCommand = new DescribeInstancesCommand({ InstanceIds: [instanceId] });
    const describeResult = await ec2.send(describeCommand);
    const ip = describeResult.Reservations?.[0]?.Instances?.[0]?.PublicIpAddress;
    if (ip) return ip;
    await new Promise((res) => setTimeout(res, delayMs));
  }
  return null;
}

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
    const instanceList = await startInstance([instanceId]);

    const publicIp = await waitForPublicIp(instanceId, 20, 5000);

    if (!publicIp) {
      return NextResponse.json({ success: false, errorMassage: "퍼블릭 IP를 얻지 못했습니다." }, { status: 500 });
    }

    await db.query(
      `UPDATE Server SET serverAddr = ?, status = ? WHERE instanceId = ?`,
      [publicIp, 'ON', instanceId]
    );

    return NextResponse.json({ success: true, instanceList, updatedIp: publicIp });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
