"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/Sidebar";

function TransactionsContent() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    const uid = searchParams.get("userId") || "";
    if (uid) params.set("userId", uid);
    setLoading(true);
    fetch(`/api/transactions?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setTransactions(d.transactions || []);
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <AppShell>
      <div className="page-pad" style={{ maxWidth: 900 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-sub">{loading ? "Loading…" : `${transactions.length} transaction${transactions.length !== 1 ? "s" : ""} found`}</p>
        </div>

        <div className="card fade-up fade-up-1" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Memo</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "var(--text-faint)", fontSize: 14 }}>
                      Loading transactions…
                    </td>
                  </tr>
                )}
                {!loading && transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-faint)" }}>
                      #{t.id}
                    </td>
                    <td style={{ fontWeight: 500 }}>{t.sender_name || "—"}</td>
                    <td style={{ fontWeight: 500 }}>{t.receiver_name || "—"}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--success)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                        ₦{parseFloat(t.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}
                      dangerouslySetInnerHTML={{ __html: t.memo || "<span style='color:var(--text-faint)'>—</span>" }} />
                    <td style={{ fontSize: 12, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {t.created_at?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
                {!loading && transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "var(--text-faint)", fontSize: 14 }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function TransactionsPage() {
  return <Suspense fallback={<AppShell><div style={{ padding: 40, color: "var(--text-muted)" }}>Loading…</div></AppShell>}><TransactionsContent /></Suspense>;
}
