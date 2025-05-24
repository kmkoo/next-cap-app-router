// src/api/test/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/dbcon';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM User');
return NextResponse.json({ success: true, data: rows });

  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) });
  }
}
