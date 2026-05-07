"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/Sidebar";
import { Alert } from "@/components/Alert";
import Link from "next/link";

const actions = [
  { label: "Send Money",    href: "/transfer",      bg: "#1347E8", icon: "→" },
  { label: "View History",  href: "/transactions",  bg: "#0B7B55", icon: "↗" },
  { label: "Beneficiaries", href: "/beneficiaries", bg: "#6C3FC5", icon: "♥" },
  { label: "Apply Loan",    href: "/loans",         bg: "#C47D0E", icon: "+" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const url = userId ? `/api/dashboard?userId=${userId}` : "/api/dashboard";
    fetch(url).then((r) => r.json()).then((data) => {
      if (data.error) setError(data.error);
      else setUser(data.user);
    });
  }, [searchParams]);

  if (error) return (
    <AppShell>
      <div style={{ padding: 40 }}>
        <Alert type="error" message={error} />
      </div>
    </AppShell>
  );
  if (!user) return (
    <AppShell>
      <div style={{ padding: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 60, borderRadius: 8, background: "var(--surface-2)", animation: "pulse 1.5s infinite" }} />)}
        </div>
      </div>
    </AppShell>
  );

  const bal = parseFloat(user.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <AppShell username={user.username}>
      <div style={{ padding: "40px 48px", maxWidth: 900 }}>

        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Good day, {user.username}</h1>
          <p className="page-sub">Here's your financial overview</p>
        </div>

        <div className="balance-card fade-up fade-up-1" style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            Available Balance
          </p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 300, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
            ₦{bal}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Account Number</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{user.account_number}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>User ID</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{user.id}</p>
            </div>
          </div>
        </div>

        <div className="fade-up fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {actions.map((a) => (
            <Link key={a.href} href={a.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "20px 12px", borderRadius: 12,
              background: a.bg + "14", border: `1px solid ${a.bg}30`,
              textDecoration: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = a.bg + "25"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = a.bg + "14"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: 20, color: a.bg }}>{a.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: a.bg }}>{a.label}</span>
            </Link>
          ))}
        </div>

        <div className="card fade-up fade-up-3">
          <p className="label" style={{ marginBottom: 16 }}>Account Details</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Username", user.username],
              ["Email", user.email],
              ["Role", user.role],
              ["Member since", user.created_at?.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
