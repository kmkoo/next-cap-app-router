import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, phone, email, password } = await req.json();

  const dummyExistingUser = { email: "test@naver.com" };
  if (email === dummyExistingUser.email) {
    return NextResponse.json(
      { success: false, message: "이미 존재하는 이메일입니다." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    phone,
    email,
    password: hashedPassword,
  };

  console.log("[회원가입 정보 - 해시된 비밀번호]", newUser);

  return NextResponse.json({ success: true, message: "회원가입 성공" });
}
