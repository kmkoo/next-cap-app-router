import { NextRequest, NextResponse } from "next/server";
import { createInstance } from '@/lib/aws-ec2';
import { _InstanceType } from "@aws-sdk/client-ec2";
import db from "@/lib/dbcon";
import { RowDataPacket } from "mysql2";
import { serviceCommands } from "@/lib/commands";

export async function POST(req: NextRequest) {
  let instanceType: _InstanceType;
  type ExistRow = RowDataPacket & { isExist: number };
  
  try {
    const body = await req.json();
    const { serverScale, serverName, serverOwner } = body;
    const serverType = "minecraft";
    const userCommand = serviceCommands[serverType];


    if (!serverOwner || !serverName || serverName.trim() === "" || !serverScale) {
      return NextResponse.json({ success: false, errorMassage: "Missing parameters" }, { status: 400 });
    }

    const [userRow] = await db.query<ExistRow[]>(
      "SELECT EXISTS (SELECT 1 FROM User WHERE userName = ?) AS isExist",
      [serverOwner]
    );
    const [serverRow] = await db.query<ExistRow[]>(
      "SELECT EXISTS (SELECT 1 FROM Server WHERE serverName = ?) AS isExist",
      [serverName]
    );

    if (userRow[0].isExist === 0) { // DB 조회 -> 없는 사용자면 거부
      return NextResponse.json({ success: false, errorMassage: "알수 없는 사용자 입니다." }, { status: 404 });
    }

    if (serverRow[0].isExist === 1) { // DB 조회 -> 이미 있는 서버 이름이면 거부
      return NextResponse.json({ success: false, errorMassage: "중복된 서버 이름 입니다." }, { status: 400 });
    }

    console.log("서버 생성 가능");

    switch(serverScale){
      case 'small':
        instanceType = "t3.micro"
        break;
      case 'medium':
        instanceType = "t3.small"
        break;
      case 'big':
        instanceType = "t3.medium"
        break;
      default:
        return NextResponse.json({ success: false, errorMassage: "잘못된 서버 스케일" }, { status: 400 }); 
    }

    const instance = await createInstance({ instanceType, serverTag:serverName, serverOwner, userCommand }); // 인스턴스 생성
    await db.query( // 인스턴스 생성 후 DB에 입력
      `INSERT INTO Server (userNumber, serverName, serverType, instanceId)
      SELECT userNumber, ?, ?, ?
      FROM User
      WHERE userName = ?`,
      [serverName, instanceType, instance![0].InstanceId, serverOwner]
    );
    return NextResponse.json({ success: true, instance });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
	
}