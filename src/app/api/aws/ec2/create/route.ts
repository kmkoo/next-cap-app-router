import { NextRequest, NextResponse } from "next/server";
import { createInstance } from '@/lib/aws-ec2';
import { _InstanceType } from "@aws-sdk/client-ec2";

export async function POST(req: NextRequest) {
  let instanceType: _InstanceType;
  
  try {
    const body = await req.json();
    const { serverScale, serverName, serverOwner, userCommand } = body;

    if (!serverOwner || !serverName || !serverScale) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

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
        return NextResponse.json({ success: false, error: "잘못된 서버 스케일" }, { status: 400 }); 
    }

    const instance = await createInstance({ instanceType, serverTag:serverName, serverOwner, userCommand });
    return NextResponse.json({ success: true, instance });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
	
}