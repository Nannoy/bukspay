"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/Sidebar";
import { Alert, Spinner } from "@/components/Alert";

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ phone: "", address: "", newPassword: "" });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const url = userId ? `/api/profile?userId=${userId}` : "/api/profile";
    fetch(url).then((r) => r.json()).then((d) => {
      if (d.user) {
        setUser(d.user);
        setForm((f) => ({ ...f, phone: d.user.phone || "", address: d.user.address || "" }));
      }
    });
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg({ type: "error", text: d.error });
    } else {
      setMsg({ type: "success", text: d.message || "Profile updated successfully" });
      if (d.user) setUser(d.user);
    }
  }

  if (!user) return <AppShell><div style={{ padding: 40, color: "var(--text-muted)" }}>Loading…</div></AppShell>;

  return (
    <AppShell username={user.username}>
      <div style={{ padding: "40px 48px", maxWidth: 640 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-sub">Manage your account information</p>
        </div>

        {/* Avatar row */}
        <div className="card fade-up fade-up-1" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--accent-dim)", border: "2px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "var(--accent)", flexShrink: 0,
          }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{user.username}</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{user.email}</p>
            <p style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace" }}>{user.account_number}</p>
          </div>
          <span className={`badge badge-${user.role}`} style={{ marginLeft: "auto" }}>{user.role}</span>
        </div>

        {/* Form */}
        <div className="card fade-up fade-up-2">
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="field" placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="field" placeholder="Your address" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                New password <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>(leave blank to keep current)</span>
              </label>
              <input type="password" value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="field" placeholder="Enter new password" />
            </div>

            {msg && <Alert type={msg.type} message={msg.text} />}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ alignSelf: "flex-start", padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {loading && <Spinner size={14} color="#fff" />}
              {loading ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<AppShell><div style={{ padding: 40, color: "var(--text-muted)" }}>Loading…</div></AppShell>}><ProfileContent /></Suspense>;
}
