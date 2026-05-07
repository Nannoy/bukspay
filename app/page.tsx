import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{ padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#1347E8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#fff" }}>BuksPay</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{
            padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: "#94A3B8", border: "1px solid #1E293B", textDecoration: "none",
            transition: "all 0.15s",
          }}>Sign in</Link>
          <Link href="/register" style={{
            padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: "#fff", background: "#1347E8", textDecoration: "none",
          }}>Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>

<h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(44px, 7vw, 80px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#F8FAFC",
          lineHeight: 1.1,
          letterSpacing: "-1px",
          maxWidth: 720,
          marginBottom: 24,
        }}>
          Banking built for<br />
          <em style={{ color: "#60A5FA" }}>breaking</em>
        </h1>

        <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
          A deliberately vulnerable fintech app for teaching real-world security vulnerabilities.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/register" style={{
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            color: "#fff", background: "#1347E8", textDecoration: "none",
            boxShadow: "0 0 0 1px #1347E8, 0 4px 20px rgba(19,71,232,0.4)",
          }}>
            Create account
          </Link>
          <Link href="/login" style={{
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500,
            color: "#CBD5E1", border: "1px solid #1E293B", textDecoration: "none",
            background: "rgba(255,255,255,0.03)",
          }}>
            Sign in
          </Link>
        </div>

      </main>

      {/* Feature strip */}
      <div style={{ borderTop: "1px solid #1E293B", padding: "24px 48px", display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
        {["A01 Broken Access", "A02 Crypto Failures", "A03 SQL Injection", "A05 Misconfiguration", "A07 Auth Failures"].map((v) => (
          <span key={v} style={{ fontSize: 12, fontWeight: 500, color: "#475569", letterSpacing: "0.05em" }}>{v}</span>
        ))}
      </div>
    </div>
  );
}
