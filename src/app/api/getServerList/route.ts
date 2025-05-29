import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try{
    const body = await req.json();
    const { username } = body;

    const serverList = await getServer(username); // 유저소유의 서버리스트 가져오기

    return Response.json({ serverList })
  } catch {
    return NextResponse.json({ error: "서버리스트를 불러오는 중 문제가 발생했습니다." }, { status: 500});
  }
}