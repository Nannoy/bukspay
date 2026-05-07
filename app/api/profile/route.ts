import { NextRequest, NextResponse } from "next/server";
import { getDb, md5 } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();
  const userId = req.nextUrl.searchParams.get("userId");
  const currentUser = await getCurrentUser();

  // VULN: A01 - ?userId= fetches any profile
  const targetId = userId || currentUser?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A02 - returns full row including password hash
  const result = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [targetId] });
  return NextResponse.json({ user: result.rows[0] });
}

export async function PUT(req: NextRequest) {
  const db = getDb();
  const { userId, phone, address, newPassword } = await req.json();
  const currentUser = await getCurrentUser();

  // VULN: A01 - userId from body, no ownership check
  const targetId = userId || currentUser?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (newPassword) {
    // VULN: A07 - no verification of current password before allowing change
    await db.execute({ sql: "UPDATE users SET password = ? WHERE id = ?", args: [md5(newPassword), targetId] });
  }

  if (phone || address) {
    await db.execute({ sql: "UPDATE users SET phone = ?, address = ? WHERE id = ?", args: [phone, address, targetId] });
  }

  // VULN: A02 - returns updated row including hash
  const updated = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [targetId] });
  return NextResponse.json({ message: "Profile updated", user: updated.rows[0] });
}
