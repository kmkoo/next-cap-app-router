import { NextRequest, NextResponse } from "next/server";
import { terminateInstance } from '@/lib/aws-ec2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instances } = body;

    if (!instances) {
      return NextResponse.json({ success: false, error: "인스턴스 리스트를 받지 못했습니다." }, { status: 400 });
    }

    const instanceList = await terminateInstance(instances);
    return NextResponse.json({ success: true, instanceList });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
  
}