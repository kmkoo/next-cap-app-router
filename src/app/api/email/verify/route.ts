import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: "KS",
      to: email,
      subject: "[KS] 이메일 인증 코드",
      text: `다음 인증코드 [${code}]를 입력해주세요!`,
    });

    await redis.set(`verify:${email}`, code, "EX", 300); // 5분 TTL

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    return NextResponse.json({ success: false, message: "메일 전송 실패" }, { status: 500 });
  }
}
