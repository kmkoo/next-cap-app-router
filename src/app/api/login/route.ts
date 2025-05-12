import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 예시: 더미 유저 (실제로는 DB에서 가져와야 함)
  const dummyUser = {
    email: 'admin',
    name: '홍길동',
    hashedPassword: await bcrypt.hash('1234', 10),
  };

  if (email !== dummyUser.email) {
    return NextResponse.json(
      { success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, dummyUser.hashedPassword);
  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    name: dummyUser.name,
    email: dummyUser.email
  });
}
