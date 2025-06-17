import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { NextRequest, NextResponse } from "next/server";
import Rcon from 'rcon-client';

const ec2 = new EC2Client({ region: "ap-northeast-2" });

async function waitForPublicIp(
  instanceId: string,
  retries = 10,
  delayMs = 3000
): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const describeCommand = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });
    const describeResult = await ec2.send(describeCommand);
    const ip =
      describeResult.Reservations?.[0]?.Instances?.[0]?.PrivateIpAddress;
    if (ip) return ip;
    await new Promise((res) => setTimeout(res, delayMs));
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { serverName, serverOwner: serverEmail, command } = await req.json();

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

    const Ipaddr = await waitForPublicIp(instanceId, 20, 5000);

    const rcon = await Rcon.Rcon.connect({
      host: Ipaddr!,
      port: 25575,
      password: process.env.RCON_PASSWORD!
    });

    const response = await rcon.send(command);
    await rcon.end();

    console.log(response);

    return NextResponse.json({ response });
  } catch (err: any) {
    console.error('RCON Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}