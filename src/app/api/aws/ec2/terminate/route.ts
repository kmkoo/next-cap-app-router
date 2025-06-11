import { NextRequest, NextResponse } from "next/server";
import { terminateInstance } from '@/lib/aws-ec2';
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instances } = body;

    if (!instances || !Array.isArray(instances)) {
      return NextResponse.json({ success: false, error: "인스턴스 리스트를 받지 못했습니다." }, { status: 400 });
    }

    const instanceList = await terminateInstance(instances);

    // DB에서 상태 업데이트
    for (const inst of instances) {
      await db.query(
        `UPDATE Server SET status = 'terminated', serverAddr = NULL WHERE instanceId = ?`,
        [inst.instanceId]
      );
    }

    return NextResponse.json({ success: true, instanceList });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
