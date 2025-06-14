import { NextRequest, NextResponse } from "next/server";
import { createInstance } from "@/lib/aws-ec2";
import {
  _InstanceType,
  EC2Client,
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";
import db from "@/lib/dbcon";
import { RowDataPacket } from "mysql2";

const ec2 = new EC2Client({ region: "ap-northeast-2" });

export async function POST(req: NextRequest) {
  let instanceType: _InstanceType;
  type ExistRow = RowDataPacket & { isExist: number };

  try {
    const body = await req.json();
    const {
      serverScale,
      serverName,
      serverOwner: serverEmail,
      imageUrl,
    } = body;

    if (
      !serverEmail ||
      !serverName ||
      serverName.trim() === "" ||
      !serverScale
    ) {
      return NextResponse.json(
        { success: false, errorMassage: "Missing parameters" },
        { status: 400 }
      );
    }

    const [userRow] = await db.query<ExistRow[]>(
      "SELECT EXISTS (SELECT 1 FROM User WHERE userEmail = ?) AS isExist",
      [serverEmail]
    );
    const [serverRow] = await db.query<ExistRow[]>(
      "SELECT EXISTS (SELECT 1 FROM Server WHERE serverName = ?) AS isExist",
      [serverName]
    );

    if (userRow[0].isExist === 0) {
      return NextResponse.json(
        { success: false, errorMassage: "알수 없는 사용자 입니다." },
        { status: 404 }
      );
    }

    if (serverRow[0].isExist === 1) {
      return NextResponse.json(
        { success: false, errorMassage: "중복된 서버 이름 입니다." },
        { status: 400 }
      );
    }

    switch (serverScale) {
      case "small":
        instanceType = "t3.micro";
        break;
      case "medium":
        instanceType = "t3.small";
        break;
      case "big":
        instanceType = "t3.medium";
        break;
      default:
        return NextResponse.json(
          { success: false, errorMassage: "잘못된 서버 스케일" },
          { status: 400 }
        );
    }

    const instance = await createInstance({
      instanceType,
      serverTag: serverName,
      serverOwner: serverEmail,
    });
    const instanceId = instance?.[0]?.InstanceId;

    if (!instanceId) {
      return NextResponse.json(
        { success: false, errorMassage: "인스턴스 ID 없음" },
        { status: 500 }
      );
    }

    let publicIp = "";
    for (let i = 0; i < 5; i++) {
      const describeResult = await ec2.send(
        new DescribeInstancesCommand({ InstanceIds: [instanceId] })
      );
      publicIp =
        describeResult.Reservations?.[0]?.Instances?.[0]?.PublicIpAddress || "";
      if (publicIp) break;
      await new Promise((res) => setTimeout(res, 2000));
    }

    await db.query(
      `INSERT INTO Server (userNumber, serverName, serverType, instanceId, serverAddr, serverImage)
       SELECT userNumber, ?, ?, ?, ?, ?
       FROM User
       WHERE userEmail = ?`,
      [serverName, instanceType, instanceId, publicIp, imageUrl, serverEmail]
    );

    return NextResponse.json({ success: true, instance, publicIp });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
