import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { addr, command } = await req.json();

  try {
    const res = await fetch(`http://${addr}:7878/v3/server/rawcmd?cmd=${command}&token=${process.env.RCON_PASSWORD}`, {
      method: 'POST',
      body: JSON.stringify({ addr, command }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    return NextResponse.json({ response: data.response });
  } catch (err: any) {
    console.error('REST Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}