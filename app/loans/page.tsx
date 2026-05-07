"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/Sidebar";
import { Alert, Spinner } from "@/components/Alert";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [form, setForm] = useState({ amount: "", purpose: "", employment: "", monthlyIncome: "" });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function loadLoans() {
    fetch("/api/loans").then((r) => r.json()).then((d) => setLoans(d.loans || []));
  }

  useEffect(() => { loadLoans(); }, []);

  async function applyLoan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(form.amount),
        purpose: form.purpose,
        employment: form.employment,
        monthlyIncome: parseFloat(form.monthlyIncome),
      }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg({ type: "error", text: d.error });
    } else {
      setMsg({ type: "success", text: d.message || "Application submitted successfully" });
      setForm({ amount: "", purpose: "", employment: "", monthlyIncome: "" });
      loadLoans();
    }
  }

  return (
    <AppShell>
      <div style={{ padding: "40px 48px", maxWidth: 760 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Loan Application</h1>
          <p className="page-sub">Apply for credit — instant decisions</p>
        </div>

        {/* Form card */}
        <div className="card fade-up fade-up-1" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>New application</p>
          <form onSubmit={applyLoan} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                  Loan amount <span style={{ color: "var(--text-faint)" }}>(₦)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none" }}>₦</span>
                  <input type="number" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="field" placeholder="50,000" style={{ paddingLeft: 28 }} required />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                  Monthly income <span style={{ color: "var(--text-faint)" }}>(₦)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none" }}>₦</span>
                  <input type="number" value={form.monthlyIncome}
                    onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                    className="field" placeholder="100,000" style={{ paddingLeft: 28 }} required />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                Loan purpose
              </label>
              <input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="field" placeholder="Business expansion, home renovation…" required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Employment status</label>
              <input value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })}
                className="field" placeholder="Employed / Self-employed / Business owner" required />
            </div>

            {msg && <Alert type={msg.type} message={msg.text} />}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ alignSelf: "flex-start", padding: "10px 24px", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {loading && <Spinner size={14} color="#fff" />}
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </div>

        {/* Loans list */}
        <div className="fade-up fade-up-2">
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>Your applications</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loans.map((l) => (
              <div key={l.id} className="card card-sm" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>
                    ₦{parseFloat(l.amount).toLocaleString()}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{l.purpose}</p>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                    {l.employment} · ₦{parseFloat(l.monthly_income || 0).toLocaleString()}/mo
                  </p>
                </div>
                <span className={`badge badge-${l.status}`}>{l.status}</span>
              </div>
            ))}
            {loans.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-faint)" }}>
                No loan applications yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
