import { NextResponse } from "next/server";

// POST
export async function POST(req: Request) {
  const { name, phone } = await req.json();

  const dummyUser = {
    name: '홍길동',
    phone: '01012345678',
    email: 'gildong@example.com',
  };

  if (name === dummyUser.name && phone === dummyUser.phone) {
    return NextResponse.json({ success: true, email: dummyUser.email });
  }

  return NextResponse.json(
    { success: false, message: '일치하는 회원 정보가 없습니다.' },
    { status: 404 }
  );
}
