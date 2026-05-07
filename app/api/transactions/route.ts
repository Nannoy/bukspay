import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();
  const userId = req.nextUrl.searchParams.get("userId");
  const filter = req.nextUrl.searchParams.get("filter") || "";

  const currentUser = await getCurrentUser();
  // VULN: A01 IDOR - ?userId= exposes any user's transaction history
  const targetId = userId || currentUser?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A03 - filter injected into ORDER BY clause (second-order injection)
  const sql = `
    SELECT t.*,
      s.username as sender_name, s.account_number as sender_account,
      r.username as receiver_name, r.account_number as receiver_account
    FROM transactions t
    LEFT JOIN users s ON t.sender_id = s.id
    LEFT JOIN users r ON t.receiver_id = r.id
    WHERE t.sender_id = ${targetId} OR t.receiver_id = ${targetId}
    ORDER BY ${filter || "t.created_at DESC"}
  `;

  try {
    const result = await db.execute(sql);
    // VULN: A02 - sequential integer IDs are predictable and enumerable
    return NextResponse.json({ transactions: result.rows });
  } catch (e: any) {
    // VULN: A05 - raw SQL error to client
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
