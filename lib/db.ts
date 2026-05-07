// VULN: A05 - DB URL/token exposed via env vars with weak defaults
import { createClient, type Client } from "@libsql/client";
import { createHash } from "crypto";

let client: Client;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      // Falls back to local file when env vars are not set
      url: process.env.TURSO_DATABASE_URL ?? "file:bukspay.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export function md5(s: string): string {
  return createHash("md5").update(s).digest("hex");
}

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    balance REAL DEFAULT 5000.00,
    account_number TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    phone TEXT,
    address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    amount REAL,
    memo TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    account_number TEXT,
    bank TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    purpose TEXT,
    status TEXT DEFAULT 'pending',
    employment TEXT,
    monthly_income REAL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

export const SEED_SQL = [
  `INSERT OR IGNORE INTO users (username, email, password, balance, account_number, role) VALUES ('alice','alice@bukspay.com','${md5("password123")}',15000,'BUK-0001','user')`,
  `INSERT OR IGNORE INTO users (username, email, password, balance, account_number, role) VALUES ('bob','bob@bukspay.com','${md5("letmein")}',8500,'BUK-0002','user')`,
  `INSERT OR IGNORE INTO users (username, email, password, balance, account_number, role) VALUES ('charlie','charlie@bukspay.com','${md5("charlie123")}',3200,'BUK-0003','user')`,
  `INSERT OR IGNORE INTO users (username, email, password, balance, account_number, role) VALUES ('admin','admin@bukspay.com','${md5("admin123")}',99999,'BUK-ADMIN','admin')`,
];
