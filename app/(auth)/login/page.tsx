"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error); // VULN: A07
    else router.push("/dashboard");
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: "#111",
    background: "#fff",
    border: `1.5px solid ${focused === name ? "#1347E8" : "#E0DED8"}`,
    borderRadius: 12,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow: focused === name ? "0 0 0 4px rgba(19,71,232,0.08)" : "0 1px 2px rgba(0,0,0,0.04)",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", colorScheme: "light" }}>
      {/* ── Left dark panel ── */}
      <div className="auth-left">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#1347E8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: "#fff" }}>BuksPay</span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 400, fontStyle: "italic", color: "#F1F5F9", lineHeight: 1.15, marginBottom: 14 }}>
            The bank that<br />teaches security
          </h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>
            A deliberate lab environment exposing real OWASP vulnerabilities in a fintech context.
          </p>
        </div>

      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Card */}
          <div style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid #EEEDE8",
          }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: "#111", marginBottom: 4, letterSpacing: "-0.3px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
              Sign in to your BuksPay account
            </p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Username */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7, letterSpacing: "0.01em" }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.35 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    style={{ ...fieldStyle("username"), paddingLeft: 42 }}
                    placeholder="e.g. alice"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 7, letterSpacing: "0.01em" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.35 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    style={{ ...fieldStyle("password"), paddingLeft: 42, paddingRight: 44 }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#999", display: "flex", alignItems: "center" }}
                  >
                    {showPw
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "12px 14px", borderRadius: 10,
                  background: "#FFF2F2", border: "1px solid #FECACA",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize: 13, color: "#DC2626", fontFamily: "'JetBrains Mono', monospace" }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  background: loading ? "#6B8CE8" : "linear-gradient(135deg, #1347E8 0%, #0F39CC 100%)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(19,71,232,0.35), 0 1px 2px rgba(19,71,232,0.2)",
                  letterSpacing: "0.01em",
                  marginTop: 4,
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign in →"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: "#999", marginTop: 20 }}>
              No account?{" "}
              <Link href="/register" style={{ color: "#1347E8", fontWeight: 600, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}
