import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST
export async function POST(req: Request) {
  const { name, phone, email, newPassword } = await req.json();

  const dummyUser = {
    name: '홍길동',
    phone: '01012345678',
    email: 'test@naver.com',
  };

  if (
    name === dummyUser.name &&
    phone === dummyUser.phone &&
    email === dummyUser.email
  ) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`[비밀번호 재설정] ${email} → ${hashedPassword}`);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: '회원 정보가 일치하지 않습니다.' },
    { status: 404 }
  );
}
