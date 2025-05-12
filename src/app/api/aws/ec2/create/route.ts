import { NextRequest, NextResponse } from "next/server";
import { createInstance } from '@/lib/aws-ec2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, keyName, tagName, userCommand } = body;

    if (!imageId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const instance = await createInstance({ imageId, keyName, tagName, userCommand });
    return NextResponse.json({ success: true, instance });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
	
}