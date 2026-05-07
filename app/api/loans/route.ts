import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();
  // VULN: A01 - ?userId= fetches any user's loans
  const userId = req.nextUrl.searchParams.get("userId");
  const currentUser = await getCurrentUser();
  const targetId = userId || currentUser?.userId;
  if (!targetId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await db.execute({ sql: "SELECT * FROM loans WHERE user_id = ?", args: [targetId] });
  return NextResponse.json({ loans: result.rows });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const { userId: bodyUserId, amount, purpose, employment, monthlyIncome } = await req.json();

  // VULN: A07 - no authentication required to submit a loan for any userId
  const currentUser = await getCurrentUser();
  const userId = bodyUserId || currentUser?.userId;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN: A03 - purpose and employment injected into SQL
  const sql = `INSERT INTO loans (user_id, amount, purpose, employment, monthly_income)
    VALUES (${userId}, ${amount}, '${purpose}', '${employment}', ${monthlyIncome})`;

  try {
    await db.execute(sql);
  } catch (e: any) {
    // VULN: A05 - raw DB error exposed
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // VULN: A01 - isVIP=true query param auto-approves loan and credits balance
  const isVIP = req.nextUrl.searchParams.get("isVIP");
  if (isVIP === "true") {
    await db.execute(`UPDATE loans SET status = 'approved' WHERE user_id = ${userId} AND id = (SELECT MAX(id) FROM loans WHERE user_id = ${userId})`);
    await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id = ?", args: [amount, userId] });
  }

  return NextResponse.json({ message: "Loan application submitted" });
}
