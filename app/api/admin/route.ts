import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDb();

  // VULN: A01 CRITICAL - ?admin=true bypasses all authentication
  const adminParam = req.nextUrl.searchParams.get("admin");
  const currentUser = await getCurrentUser();

  if (adminParam !== "true") {
    if (!currentUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const result = await db.execute({ sql: "SELECT role FROM users WHERE id = ?", args: [currentUser.userId] });
    const dbRole = result.rows[0]?.role;
    if (dbRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, transactions, loans] = await Promise.all([
    db.execute("SELECT * FROM users"),
    db.execute("SELECT * FROM transactions"),
    db.execute("SELECT * FROM loans"),
  ]);

  return NextResponse.json({
    users: users.rows,
    transactions: transactions.rows,
    loans: loans.rows,
  });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  // VULN: A01 - no auth check at all on admin POST actions
  const { action, userId, amount, role, loanId } = await req.json();

  if (action === "adjustBalance") {
    await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id = ?", args: [amount, userId] });
    return NextResponse.json({ message: "Balance adjusted" });
  }
  if (action === "changeRole") {
    await db.execute({ sql: "UPDATE users SET role = ? WHERE id = ?", args: [role, userId] });
    return NextResponse.json({ message: "Role changed" });
  }
  if (action === "deleteUser") {
    await db.execute({ sql: "DELETE FROM users WHERE id = ?", args: [userId] });
    return NextResponse.json({ message: "User deleted" });
  }
  if (action === "approveLoan") {
    const loan = await db.execute({ sql: "SELECT * FROM loans WHERE id = ?", args: [loanId] });
    const l = loan.rows[0];
    if (!l) return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    await db.execute({ sql: "UPDATE loans SET status = 'approved' WHERE id = ?", args: [loanId] });
    await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id = ?", args: [l.amount, l.user_id] });
    return NextResponse.json({ message: "Loan approved and balance credited" });
  }
  if (action === "rejectLoan") {
    await db.execute({ sql: "UPDATE loans SET status = 'rejected' WHERE id = ?", args: [loanId] });
    return NextResponse.json({ message: "Loan rejected" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
