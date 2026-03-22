import { useState, useEffect, useRef } from "react";

export default function Register() {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.4 + 0.1,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(124,58,237,0.04)";
      for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) { setError("All fields are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = JSON.parse(localStorage.getItem("phishguard_users") || "[]");
      if (users.find(u => u.email === form.email)) { setError("An account with this email already exists."); return; }
      users.push({ name: form.name, email: form.email, password: btoa(form.password), created: new Date().toISOString() });
      localStorage.setItem("phishguard_users", JSON.stringify(users));
      setSuccess(true);
    }, 1500);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#ff4444", width: "30%" };
    if (p.length < 10) return { label: "Fair", color: "#ffaa00", width: "60%" };
    return { label: "Strong", color: "#00ff88", width: "100%" };
  };
  const strength = passwordStrength();

  if (success) return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.container}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
          <h1 style={styles.title}>Account Created!</h1>
          <p style={{ color: "#7090c0", fontSize: 16, marginBottom: 30, lineHeight: 1.6 }}>
            Welcome to PhishGuard, <strong style={{ color: "#00c8ff" }}>{form.name}</strong>!<br />
            Your security account has been successfully created.
          </p>
          <button style={styles.btn} onClick={() => window.location.href = "/Login"}>🚀 Proceed to Login</button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
    </div>
  );

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => window.location.href = "/"}>
          <span>🛡️</span>
          <span style={styles.navTitle}>PhishGuard</span>
        </div>
      </nav>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardGlow} />
          <div style={{ textAlign: "center", marginBottom: 16 }}><span style={{ fontSize: 56 }}>👤</span></div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join the PhishGuard security platform</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>👤 Full Name</label>
              <input style={styles.input} type="text" placeholder="John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>📧 Email Address</label>
              <input style={styles.input} type="email" placeholder="analyst@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>🔑 Password</label>
              <input style={styles.input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              {strength && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "all 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 12, color: strength.color, marginTop: 4, display: "block" }}>Password strength: {strength.label}</span>
                </div>
              )}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>🔑 Confirm Password</label>
              <input style={styles.input} type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              {form.confirm && (
                <span style={{ fontSize: 12, color: form.password === form.confirm ? "#00ff88" : "#ff4444", marginTop: 4, display: "block" }}>
                  {form.password === form.confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                </span>
              )}
            </div>
            <button style={loading ? styles.btnLoading : styles.btn} type="submit" disabled={loading}>
              {loading ? <><span style={styles.spinner} />Creating Account...</> : "🛡️ Create Account"}
            </button>
          </form>

          <p style={{ ...styles.registerText, marginTop: 20 }}>
            Already have an account?{" "}
            <span style={styles.link} onClick={() => window.location.href = "/Login"}>Login →</span>
          </p>
          <button style={styles.backBtn} onClick={() => window.location.href = "/"}>← Back to Home</button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap'); * { box-sizing: border-box; } input:focus { outline: none; border-color: rgba(124,58,237,0.6) !important; box-shadow: 0 0 20px rgba(124,58,237,0.2) !important; } @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #050510 0%, #0a0a2e 50%, #050515 100%)", fontFamily: "'Rajdhani', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", padding: "15px 40px", background: "rgba(5,5,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.2)" },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navTitle: { fontSize: 20, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(90deg, #00c8ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  container: { position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "100px 20px 40px" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 460, backdropFilter: "blur(20px)", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(124,58,237,0.1)" },
  cardGlow: { position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  title: { fontSize: 26, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, textAlign: "center", color: "#e0e8ff", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#7090c0", textAlign: "center", marginBottom: 32 },
  error: { background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#ff8080", marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "#7090c0", letterSpacing: 1, textTransform: "uppercase" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8, padding: "13px 16px", fontSize: 15, color: "#e0e8ff", fontFamily: "'Rajdhani', sans-serif", transition: "all 0.2s" },
  btn: { background: "linear-gradient(135deg, #7c3aed, #00c8ff)", border: "none", borderRadius: 8, padding: "15px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif", boxShadow: "0 0 30px rgba(124,58,237,0.3)", transition: "all 0.2s", marginTop: 4 },
  btnLoading: { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, padding: "15px", fontSize: 16, fontWeight: 700, color: "#a78bfa", cursor: "not-allowed", letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4, animation: "pulse 1.5s infinite" },
  spinner: { width: 16, height: 16, border: "2px solid rgba(124,58,237,0.3)", borderTop: "2px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  registerText: { textAlign: "center", fontSize: 15, color: "#7090c0" },
  link: { color: "#a78bfa", cursor: "pointer", fontWeight: 700 },
  backBtn: { width: "100%", marginTop: 12, background: "transparent", border: "none", color: "#506080", cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", padding: 8 },
};
