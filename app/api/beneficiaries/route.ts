import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();
  const userId = req.nextUrl.searchParams.get("userId");
  const search = req.nextUrl.searchParams.get("search") || "";

  // VULN: A01 IDOR - no ownership check on userId
  const targetId = userId || (await getCurrentUser())?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A03 - search injected directly into SQL
  const sql = `SELECT * FROM beneficiaries WHERE user_id = ${targetId} AND (name LIKE '%${search}%' OR account_number LIKE '%${search}%')`;
  try {
    const result = await db.execute(sql);
    return NextResponse.json({ beneficiaries: result.rows });
  } catch (e: any) {
    // VULN: A05 - raw SQL error exposed
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const { name, accountNumber, bank, userId } = await req.json();

  const currentUser = await getCurrentUser();
  // VULN: A01 - userId from body, no ownership check
  const ownerId = userId || currentUser?.userId;
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A03 - fields concatenated into SQL
  const sql = `INSERT INTO beneficiaries (user_id, name, account_number, bank) VALUES (${ownerId}, '${name}', '${accountNumber}', '${bank}')`;
  try {
    await db.execute(sql);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Beneficiary added" });
}

export async function DELETE(req: NextRequest) {
  const db = getDb();
  // VULN: A01 IDOR - deletes by id with no ownership check
  const id = req.nextUrl.searchParams.get("id");
  await db.execute({ sql: "DELETE FROM beneficiaries WHERE id = ?", args: [id] });
  return NextResponse.json({ message: "Deleted" });
}
