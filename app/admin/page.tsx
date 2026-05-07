"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/Sidebar";
import { Alert, Spinner } from "@/components/Alert";

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [action, setAction] = useState({ action: "", userId: "", amount: "", role: "" });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"users" | "transactions" | "loans">("users");

  function loadData() {
    fetch("/api/admin").then((r) => r.json()).then(setData);
  }

  useEffect(() => { loadData(); }, []);

  async function runAction(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg({ type: "error", text: d.error });
    } else {
      setMsg({ type: "success", text: d.message || "Action completed" });
      setAction({ action: "", userId: "", amount: "", role: "" });
      loadData();
    }
  }

  const tabStyle = (t: string) => ({
    padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500,
    cursor: "pointer", border: "none", transition: "all 0.12s",
    background: tab === t ? "var(--accent)" : "transparent",
    color: tab === t ? "#fff" : "var(--text-muted)",
  } as React.CSSProperties);

  return (
    <AppShell>
      <div style={{ padding: "40px 48px" }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-sub">Manage users, transactions, and loans</p>
        </div>

        {data?.error && (
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <Alert type="error" message={data.error} />
          </div>
        )}

        {/* Admin actions */}
        <div className="card fade-up fade-up-1" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Admin Actions</p>
          <form onSubmit={runAction} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
            <select value={action.action} onChange={(e) => setAction({ ...action, action: e.target.value })}
              className="field" style={{ width: 160 }}>
              <option value="">Select action</option>
              <option value="adjustBalance">Adjust balance</option>
              <option value="changeRole">Change role</option>
              <option value="deleteUser">Delete user</option>
            </select>
            <input value={action.userId} onChange={(e) => setAction({ ...action, userId: e.target.value })}
              className="field" style={{ width: 90 }} placeholder="User ID" />
            <input value={action.amount} onChange={(e) => setAction({ ...action, amount: e.target.value })}
              className="field" style={{ width: 110 }} placeholder="Amount" />
            <input value={action.role} onChange={(e) => setAction({ ...action, role: e.target.value })}
              className="field" style={{ width: 130 }} placeholder="Role" />
            <button type="submit" className="btn btn-danger" disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {loading && <Spinner size={14} color="#fff" />}
              {loading ? "Executing…" : "Execute"}
            </button>
          </form>
          {msg && <div style={{ marginTop: 12 }}><Alert type={msg.type} message={msg.text} /></div>}
        </div>

        {/* Data tables */}
        {data && !data.error && (
          <div className="fade-up fade-up-2">
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--surface-2)", padding: 4, borderRadius: 8, width: "fit-content" }}>
              <button style={tabStyle("users")} onClick={() => setTab("users")}>
                Users ({data.users?.length ?? 0})
              </button>
              <button style={tabStyle("transactions")} onClick={() => setTab("transactions")}>
                Transactions ({data.transactions?.length ?? 0})
              </button>
              <button style={tabStyle("loans")} onClick={() => setTab("loans")}>
                Loans ({data.loans?.length ?? 0})
              </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {tab === "users" && (
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Username</th><th>Email</th>
                        <th>Password Hash</th>
                        <th>Balance</th><th>Role</th><th>Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.users || []).map((u: any) => (
                        <tr key={u.id}>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{u.id}</td>
                          <td style={{ fontWeight: 600 }}>{u.username}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{u.email}</td>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-faint)" }}>{u.password}</td>
                          <td style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                            ₦{parseFloat(u.balance).toLocaleString()}
                          </td>
                          <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)" }}>{u.account_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "transactions" && (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Sender</th><th>Receiver</th><th>Amount</th><th>Memo</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {(data.transactions || []).map((t: any) => (
                      <tr key={t.id}>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>#{t.id}</td>
                        <td>{t.sender_id}</td>
                        <td>{t.receiver_id}</td>
                        <td style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                          ₦{parseFloat(t.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{t.memo || "—"}</td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-faint)" }}>{t.created_at?.slice(0, 10)}</td>
                      </tr>
                    ))}
                    {!data.transactions?.length && (
                      <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-faint)" }}>No transactions</td></tr>
                    )}
                  </tbody>
                </table>
              )}
              {tab === "loans" && (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>User</th><th>Amount</th><th>Purpose</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {(data.loans || []).map((l: any) => (
                      <tr key={l.id}>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>#{l.id}</td>
                        <td>{l.user_id}</td>
                        <td style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                          ₦{parseFloat(l.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{l.purpose}</td>
                        <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-faint)" }}>{l.created_at?.slice(0, 10)}</td>
                      </tr>
                    ))}
                    {!data.loans?.length && (
                      <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-faint)" }}>No loans</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
