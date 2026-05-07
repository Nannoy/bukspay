import { NextResponse } from "next/server";
import { getDb, SCHEMA_SQL, SEED_SQL } from "@/lib/db";

// One-time setup endpoint — run after deploying to Turso
// VULN: A05 - no auth on this endpoint; anyone can reset the DB
export async function GET() {
  const db = getDb();
  try {
    // Run schema statements individually (libsql doesn't support multi-statement exec)
    const statements = SCHEMA_SQL.split(";").map((s) => s.trim()).filter(Boolean);
    for (const sql of statements) {
      await db.execute(sql);
    }
    for (const sql of SEED_SQL) {
      await db.execute(sql);
    }
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
