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
      from: '"SQUD" <your@email.com>',
      to: email,
      subject: "[SQUD] 이메일 인증 코드",
      html: `
        <div style="font-family:Arial, sans-serif; max-width:600px; margin:0 auto; padding:40px 20px; color:#333;">
          <h2 style="font-size:24px; font-weight:bold; margin-bottom:8px;">SQUD에 로그인</h2>
          <p style="font-size:15px; margin-bottom:30px;">돌아오신 것을 환영합니다. 아래 코드를 10분 내에 입력하여 로그인하세요.</p>
          <div style="font-size:32px; font-weight:bold; text-align:center; margin:30px 0; letter-spacing:2px;">
            ${code}
          </div>
          <hr style="border:none; border-top:1px solid #ddd; margin:40px 0;" />
          <p style="font-size:13px; color:#666;">
            이 이메일은 SQUD 계정을 보유하신 고객님께 전송된 것입니다. 본 메일은 마케팅 메일이 아니며, 수신 거부 링크가 없습니다.
          </p>
          <p style="font-size:13px; color:#666; margin-top:30px;">
            ⓒ SQUD Corp. All rights reserved.
          </p>
        </div>
      `,
    });

    await redis.set(`verify:${email}`, code, "EX", 600); // 10분 TTL

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    return NextResponse.json({ success: false, message: "메일 전송 실패" }, { status: 500 });
  }
}
