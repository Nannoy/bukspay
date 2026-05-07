"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/Sidebar";
import { Alert, Spinner } from "@/components/Alert";

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", accountNumber: "", bank: "" });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function load(q?: string) {
    const params = new URLSearchParams();
    if (q !== undefined ? q : search) params.set("search", q !== undefined ? q : search);
    fetch(`/api/beneficiaries?${params}`)
      .then((r) => r.json())
      .then((d) => setBeneficiaries(d.beneficiaries || []));
  }

  useEffect(() => { load(); }, []);

  async function addBeneficiary(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/beneficiaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg({ type: "error", text: d.error });
    } else {
      setMsg({ type: "success", text: d.message || "Beneficiary added successfully" });
      setForm({ name: "", accountNumber: "", bank: "" });
      load();
    }
  }

  async function deleteBeneficiary(id: number) {
    setDeletingId(id);
    await fetch(`/api/beneficiaries?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  }

  return (
    <AppShell>
      <div className="page-pad" style={{ maxWidth: 760 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Beneficiaries</h1>
          <p className="page-sub">Manage saved recipients for quick transfers</p>
        </div>

        {/* Add form */}
        <div className="card fade-up fade-up-1" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Add beneficiary</p>
          <form onSubmit={addBeneficiary}>
            <div className="g3" style={{ marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field" placeholder="John Doe" required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Account number</label>
                <input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="field" placeholder="BUK-0002" required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 5 }}>Bank</label>
                <input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}
                  className="field" placeholder="BuksPay" />
              </div>
            </div>
            {msg && <div style={{ marginBottom: 12 }}><Alert type={msg.type} message={msg.text} /></div>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {loading && <Spinner size={14} color="#fff" />}
              {loading ? "Adding…" : "Add beneficiary"}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="fade-up fade-up-2" style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
            className="field"
            placeholder="Search beneficiaries…"
            style={{ maxWidth: 320 }}
          />
        </div>

        {/* List */}
        <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {beneficiaries.map((b) => (
            <div key={b.id} className="card card-sm" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--accent-dim)", border: "1px solid var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 600, color: "var(--accent)",
                  flexShrink: 0,
                }}>
                  {String(b.name)?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{b.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{b.account_number}</span>
                    {b.bank ? ` · ${b.bank}` : ""}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteBeneficiary(b.id)} disabled={deletingId === b.id} style={{
                padding: "6px 12px", borderRadius: 6, border: "1px solid #FECACA",
                background: "var(--danger-dim)", color: "var(--danger)",
                fontSize: 12, fontWeight: 500, cursor: "pointer",
                opacity: deletingId === b.id ? 0.6 : 1,
              }}>
                {deletingId === b.id ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
          {beneficiaries.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-faint)" }}>
              No beneficiaries yet
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
