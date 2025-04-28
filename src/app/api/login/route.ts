import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, password } = await request.json()

  //DB 연결시 수정
  const dummyUser = {
    id: 'admin',
    password: '1234',
  }
  
  if (id === dummyUser.id && password === dummyUser.password) {
    return NextResponse.json({ success: true})
  } else {
    return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' }, { status: 401 })
  }
}