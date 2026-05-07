import { NextRequest, NextResponse } from "next/server";
import { getDb, md5 } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const db = getDb();

  // VULN: A03 - SQL Injection via string concatenation
  // Payload: alice'-- (comments out the password check)
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${md5(password)}'`;

  let user: any;
  try {
    const result = await db.execute(sql);
    user = result.rows[0];
  } catch (e: any) {
    // VULN: A05 - raw DB error leaked to client
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  if (!user) {
    // VULN: A07 - reveals whether username exists vs wrong password
    const check = await db.execute(`SELECT id FROM users WHERE username = '${username}'`);
    if (check.rows[0]) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
    return NextResponse.json({ error: "Username not found" }, { status: 401 });
  }

  // VULN: A07 - no rate limiting, no lockout
  const token = signToken({ userId: Number(user.id), username: String(user.username), role: String(user.role) });

  const response = NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      // VULN: A02 - returning password hash to client
      passwordHash: user.password,
    },
  });

  // VULN: A02 - httpOnly:false — JS can steal the token
  response.cookies.set("token", token, { httpOnly: false, path: "/" });
  return response;
}
