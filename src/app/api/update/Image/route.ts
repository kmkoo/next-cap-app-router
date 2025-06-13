import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/dbcon";

export async function POST(req: NextRequest) {
  try {
    const { serverName, serverOwner, imageUrl } = await req.json();

    if (!serverName || !serverOwner || !imageUrl) {
      return NextResponse.json({ success: false, error: "파라미터 누락" }, { status: 400 });
    }

    const [result] = await db.query(
      `UPDATE Server 
       SET serverImage = ? 
       WHERE serverName = ? 
       AND userNumber = (SELECT userNumber FROM User WHERE userName = ?)`,
      [imageUrl, serverName, serverOwner]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
