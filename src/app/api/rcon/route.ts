import { NextRequest, NextResponse } from "next/server";
import Rcon from 'rcon-client';

export async function POST(req: NextRequest) {
  const { addr, command } = await req.json();

  console.log(addr);
  try {
    const rcon = await Rcon.Rcon.connect({
      host: addr, // IP DB 참조
      port: 25575,
      password: process.env.RCON_PASSWORD!
    });

    const response = await rcon.send(command);
    await rcon.end();

    console.log(response);

    return NextResponse.json({ response });
  } catch (err: any) {
    console.error('RCON Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}