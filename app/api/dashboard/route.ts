import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();
  const urlUserId = req.nextUrl.searchParams.get("userId");

  // VULN: A01 IDOR - accepts ?userId= with no ownership check
  const targetId = urlUserId || (await getCurrentUser())?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A02 + A05 - returns full row including password hash
  const result = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [targetId] });
  const user = result.rows[0];

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}
