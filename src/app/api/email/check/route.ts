import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const storedCode = await redis.get(`verify:${email}`);
  if (!storedCode) {
    return NextResponse.json({ success: false, message: "코드가 만료되었거나 없습니다." }, { status: 400 });
  }

  if (storedCode !== code) {
    return NextResponse.json({ success: false, message: "인증 코드가 일치하지 않습니다." }, { status: 400 });
  }

  await redis.del(`verify:${email}`);
  return NextResponse.json({ success: true });
}
