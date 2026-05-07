"use client";
import { useState } from "react";
import { AppShell } from "@/components/Sidebar";
import { Alert, Spinner } from "@/components/Alert";

export default function TransferPage() {
  const [form, setForm] = useState({ toAccountNumber: "", amount: "", memo: "", fromUserId: "" });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error);
    else setResult(data);
  }

  return (
    <AppShell>
      <div className="page-pad" style={{ maxWidth: 600 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Send Money</h1>
          <p className="page-sub">Transfer funds to any BuksPay account</p>
        </div>

        {result && (
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <Alert type="success" message={`Transfer successful — ₦${Number(result.amount).toLocaleString()} sent from ${result.from} to ${result.to}`} />
          </div>
        )}

        <div className="card fade-up fade-up-1">
          <form onSubmit={handleTransfer} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                Recipient account number
              </label>
              <input value={form.toAccountNumber}
                onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })}
                className="field" placeholder="BUK-0002" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                Amount <span style={{ color: "var(--text-faint)" }}>(₦)</span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none" }}>₦</span>
                <input type="number" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="field" placeholder="0.00" style={{ paddingLeft: 28 }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>
                Memo <span style={{ color: "var(--text-faint)" }}>(optional)</span>
              </label>
              <input value={form.memo}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
                className="field" placeholder="Payment for services…" />
            </div>

            {error && (
              <Alert type="error" message={error} />
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <Spinner size={16} color="#fff" /> : null}
              {loading ? "Processing…" : "Send money"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
