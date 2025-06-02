import { NextRequest, NextResponse } from "next/server";
import { getInstanceData } from '@/lib/aws-ec2';
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverName, serverOwner } = body;

    let rows: any[] = [];

    if(!serverName || serverName.trim() === ""){
      const [result] = await db.query( // 유저 이름만 받으면 해당 유저 소유의 서버목록 출력
        `SELECT instanceId
        FROM Server
        WHERE userNumber = (
          SELECT userNumber 
          FROM User 
          WHERE userName = ?)`,
        [serverOwner]
      );
      rows = result as any[];
    }
    else{
      const [result] = await db.query( // 해당 유저의 해당 서버 출력
        `SELECT instanceId
        FROM Server
        WHERE userNumber = (
          SELECT userNumber 
          FROM User 
          WHERE userName = ?) 
        AND serverName = ?`,
        [serverOwner, serverName]
      );
      rows = result as any[];
    }

    if(rows.length === 0){
      return NextResponse.json({ success: false, errorMassage: "서버를 찾지 못했습니다." }, { status: 404 });
    }

    const instanceList = await getInstanceData(rows);

    return NextResponse.json({ success: true, instanceList });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
	
}