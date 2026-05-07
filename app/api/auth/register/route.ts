import { NextRequest, NextResponse } from "next/server";
import { getDb, md5 } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, email, password, phone } = await req.json();
  const db = getDb();

  // VULN: A03 - SQL Injection via string concatenation
  const checkSql = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`;
  const existing = await db.execute(checkSql);

  if (existing.rows[0]) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // VULN: A02 - password stored as MD5 (not bcrypt)
  const hashedPassword = md5(password);
  const accountNumber = "BUK-" + Math.floor(1000 + Math.random() * 9000);

  const result = await db.execute({
    sql: "INSERT INTO users (username, email, password, phone, account_number) VALUES (?, ?, ?, ?, ?)",
    args: [username, email, hashedPassword, phone, accountNumber],
  });

  const userId = Number(result.lastInsertRowid);
  const token = signToken({ userId, username, role: "user" });

  const response = NextResponse.json({ message: "Registered", userId, accountNumber });
  // VULN: A02 - httpOnly:false
  response.cookies.set("token", token, { httpOnly: false, path: "/" });
  return response;
}
