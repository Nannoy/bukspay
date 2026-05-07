import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const db = getDb();
  const { toAccountNumber, amount, memo, fromUserId } = await req.json();

  const currentUser = await getCurrentUser();

  // VULN: A01 - trusts client-supplied fromUserId to pick the sender
  let senderId: number;
  if (fromUserId) {
    senderId = parseInt(fromUserId);
  } else if (currentUser) {
    senderId = currentUser.userId;
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const senderResult = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [senderId] });
  const sender = senderResult.rows[0] as any;
  if (!sender) return NextResponse.json({ error: "Sender not found" }, { status: 404 });

  const receiverResult = await db.execute({
    sql: "SELECT * FROM users WHERE account_number = ?",
    args: [toAccountNumber],
  });
  const receiver = receiverResult.rows[0] as any;
  if (!receiver) return NextResponse.json({ error: "Recipient not found" }, { status: 404 });

  if (Number(sender.balance) < parseFloat(amount)) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
  }

  // VULN: A03 - memo injected into raw SQL
  // VULN: A05 - no CSRF token check on this state-changing request
  const logSql = `INSERT INTO transactions (sender_id, receiver_id, amount, memo) VALUES (${senderId}, ${receiver.id}, ${amount}, '${memo}')`;
  try {
    await db.execute(logSql);
  } catch (e: any) {
    // VULN: A05 - raw DB error exposed
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  await db.execute({ sql: "UPDATE users SET balance = balance - ? WHERE id = ?", args: [amount, senderId] });
  await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id = ?", args: [amount, receiver.id] });

  return NextResponse.json({ message: "Transfer successful", from: sender.username, to: receiver.username, amount });
}
