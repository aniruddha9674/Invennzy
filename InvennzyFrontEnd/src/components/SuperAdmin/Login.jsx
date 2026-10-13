import React, { useState, useRef } from "react";
import { Eye, EyeOff, Crown, Lock, Mail, User, ShieldCheck } from "lucide-react";

// ── Inline keyframes via a <style> tag ──────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
      70%  { box-shadow: 0 0 0 14px rgba(245,158,11,0); }
      100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }

    .fade-up { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.12s; }
    .fade-up-3 { animation-delay: 0.19s; }
    .fade-up-4 { animation-delay: 0.26s; }
    .fade-up-5 { animation-delay: 0.33s; }

    .crown-icon { animation: pulse-ring 2.4s ease infinite; }

    .shimmer-btn {
      background: linear-gradient(90deg,
        #b45309 0%, #d97706 30%, #fbbf24 50%, #d97706 70%, #b45309 100%);
      background-size: 400px 100%;
      animation: shimmer 2.8s linear infinite;
      transition: opacity .2s, transform .15s;
    }
    .shimmer-btn:hover  { opacity: .92; transform: translateY(-1px); }
    .shimmer-btn:active { transform: translateY(0); }

    .field-input {
      width: 100%;
      padding: 13px 16px;
      background: #18181b;
      border: 1.5px solid #3f3f46;
      border-radius: 10px;
      color: #f4f4f5;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      transition: border-color .2s, box-shadow .2s;
      outline: none;
    }
    .field-input::placeholder { color: #71717a; }
    .field-input:focus {
      border-color: #d97706;
      box-shadow: 0 0 0 3px rgba(217,119,6,.18);
    }
    .field-input:disabled { opacity: .5; cursor: not-allowed; }

    .tab-pill {
      flex: 1;
      padding: 9px 0;
      border-radius: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .03em;
      border: none;
      cursor: pointer;
      transition: background .2s, color .2s;
    }
    .tab-pill.active {
      background: #d97706;
      color: #0c0a09;
    }
    .tab-pill.inactive {
      background: transparent;
      color: #a1a1aa;
    }
    .tab-pill.inactive:hover { color: #e4e4e7; }
  `}</style>
);

// ── helpers ──────────────────────────────────────────────────────────────────
const validatePassword = (p) => {
  if (p.length < 8)          return "At least 8 characters required";
  if (!/[A-Z]/.test(p))     return "Needs at least one uppercase letter";
  if (!/[a-z]/.test(p))     return "Needs at least one lowercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(p))
                              return "Needs at least one special character";
  return "";
};

// ── component ─────────────────────────────────────────────────────────────────
const SuperAdminAuth = () => {
  const [mode, setMode] = useState("login");          // "login" | "signup" | "forgot"
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pwError, setPwError]   = useState("");
  const [message, setMessage]   = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  const showMsg = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "password" && mode === "signup") setPwError(validatePassword(value));
  };

  const handleSubmit = async () => {
    if (mode === "signup") {
      const err = validatePassword(form.password);
      if (err)                            { showMsg(err);                          return; }
      if (form.password !== form.confirmPassword) { showMsg("Passwords don't match!"); return; }
      if (!form.password)                         { showMsg("Password is required");             return; }
    }

    setIsLoading(true);
    try {
      const endpoint =
        mode === "login"  ? "/api/auth/superadmin/login"  :
        mode === "signup" ? "/api/auth/superadmin/signup" :
                            "/api/auth/superadmin/forgot-password";

      const payload =
        mode === "login"  ? { email: form.email, password: form.password }        :
        mode === "signup" ? { name: form.name, email: form.email, password: form.password } :
                            { email: form.email };

      // Replace with your actual api call, e.g. await api.post(endpoint, payload)
      console.log("POST", endpoint, payload);
      showMsg("Request sent successfully!", "success");
    } catch (err) {
      showMsg(err?.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setPwError("");
    setMessage({ text: "", type: "" });
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: "100vh",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(217,119,6,.18) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: -120, right: -120, width: 480, height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,83,9,.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Card */}
        <div className="fade-up" style={{
          width: "100%", maxWidth: 920,
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.03)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
        }}>
          {/* ── Left panel ─────────────────────────────────────── */}
          <div style={{
            width: "38%",
            minWidth: 260,
            background: "linear-gradient(160deg, #1c1007 0%, #0c0a09 60%, #0f0d0b 100%)",
            borderRight: "1px solid #27272a",
            padding: "48px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* decorative ring */}
            <div style={{
              position: "absolute", bottom: -80, left: -80,
              width: 300, height: 300, borderRadius: "50%",
              border: "1px solid rgba(217,119,6,.12)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -40, left: -40,
              width: 200, height: 200, borderRadius: "50%",
              border: "1px solid rgba(217,119,6,.08)",
              pointerEvents: "none",
            }} />

            {/* Crown badge */}
            <div className="crown-icon fade-up fade-up-1" style={{
              width: 60, height: 60, borderRadius: 16,
              background: "linear-gradient(135deg, #92400e, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 28,
            }}>
              <Crown size={28} color="#fff" />
            </div>

            <h1 className="fade-up fade-up-2" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 26, fontWeight: 800,
              color: "#fef3c7",
              lineHeight: 1.2,
              marginBottom: 12,
            }}>
              Super Admin<br />Portal
            </h1>

            <p className="fade-up fade-up-3" style={{
              color: "#78716c", fontSize: 13.5, lineHeight: 1.7, marginBottom: 40,
            }}>
              Restricted access. Authorised personnel only. All activity is monitored and logged.
            </p>

            {/* Info chips */}
            {[
              { icon: <ShieldCheck size={14}/>, text: "Full system access" },
              { icon: <Lock size={14}/>,       text: "Encrypted sessions" },
              { icon: <User size={14}/>,        text: "Role: Super Administrator" },
            ].map(({ icon, text }, i) => (
              <div key={i} className={`fade-up fade-up-${i + 3}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 10,
                marginBottom: 10,
                color: "#a8a29e",
                fontSize: 13,
              }}>
                <span style={{ color: "#d97706" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>

          {/* ── Right panel ────────────────────────────────────── */}
          <div style={{ flex: 1, padding: "48px 44px", position: "relative" }}>


            {/* Heading */}
            <div className="fade-up fade-up-1" style={{ marginBottom: 28 }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22, fontWeight: 700,
                color: "#fafafa", marginBottom: 6,
              }}>
                {mode === "login"  ? "Welcome back"          :
                 mode === "signup" ? "Create super admin"    :
                                    "Reset your password"}
              </h2>
              <p style={{ color: "#71717a", fontSize: 13.5 }}>
                {mode === "login"  ? "Sign in to your super admin dashboard"      :
                 mode === "signup" ? "Set up a new super administrator account"   :
                                    "Enter your email to receive a reset link"}
              </p>
            </div>

            {/* Alert */}
            {message.text && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                fontSize: 13,
                background: message.type === "success" ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
                border:     `1px solid ${message.type === "success" ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`,
                color:      message.type === "success" ? "#34d399" : "#f87171",
              }}>
                {message.text}
              </div>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Name – signup only */}
              {mode === "signup" && (
                <div className="fade-up fade-up-3">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 7 }}>
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                    <input className="field-input" style={{ paddingLeft: 38 }}
                      type="text" name="name" placeholder="Your full name"
                      value={form.name} onChange={handleChange} disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="fade-up fade-up-3">
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 7 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                  <input className="field-input" style={{ paddingLeft: 38 }}
                    type="email" name="email" placeholder="superadmin@example.com"
                    value={form.email} onChange={handleChange} disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div className="fade-up fade-up-4">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 7 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                    <input className="field-input" style={{ paddingLeft: 38, paddingRight: 44 }}
                      type={showPw ? "text" : "password"} name="password"
                      placeholder="Enter your password"
                      value={form.password} onChange={handleChange} disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                               background: "none", border: "none", cursor: "pointer", color: "#52525b" }}>
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {mode === "signup" && (
                    <>
                      {pwError ? (
                        <p style={{ marginTop: 6, fontSize: 12, color: "#f87171" }}>{pwError}</p>
                      ) : form.password ? (
                        <p style={{ marginTop: 6, fontSize: 12, color: "#34d399" }}>Password looks good ✓</p>
                      ) : null}
                      <p style={{ marginTop: 6, fontSize: 11.5, color: "#52525b", lineHeight: 1.7 }}>
                        Min 8 chars · uppercase · lowercase · special character
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Confirm password – signup only */}
              {mode === "signup" && (
                <div className="fade-up fade-up-4">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 7 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                    <input className="field-input" style={{ paddingLeft: 38, paddingRight: 44 }}
                      type={showCpw ? "text" : "password"} name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword} onChange={handleChange} disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowCpw(!showCpw)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                               background: "none", border: "none", cursor: "pointer", color: "#52525b" }}>
                      {showCpw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
              )}



              {/* Submit */}
              <div className="fade-up fade-up-5">
                <button
                  className="shimmer-btn"
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{
                    width: "100%", padding: "14px 0",
                    border: "none", borderRadius: 12,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 15, fontWeight: 700,
                    color: "#0c0a09",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                    letterSpacing: ".02em",
                  }}
                >
                  {isLoading ? "Processing…"
                    : mode === "login"  ? "Sign In to Dashboard"
                    : mode === "signup" ? "Create Super Admin Account"
                    :                    "Send Reset Link"}
                </button>
              </div>

              {/* Footer links — contextual, like normal websites */}
              <div className="fade-up fade-up-5" style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                {/* Forgot password — only on login */}
                {mode === "login" && (
                  <button type="button" onClick={() => switchMode("forgot")} disabled={isLoading}
                    style={{ background: "none", border: "none", cursor: "pointer",
                             color: "#d97706", fontWeight: 500, fontSize: 13 }}>
                    Forgot your password?
                  </button>
                )}

                {/* Sign up / sign in toggle */}
                <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button type="button" onClick={() => switchMode("signup")} disabled={isLoading}
                        style={{ background: "none", border: "none", cursor: "pointer",
                                 color: "#d97706", fontWeight: 600, fontSize: 13, padding: 0 }}>
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchMode("login")} disabled={isLoading}
                        style={{ background: "none", border: "none", cursor: "pointer",
                                 color: "#d97706", fontWeight: 600, fontSize: 13, padding: 0 }}>
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminAuth;