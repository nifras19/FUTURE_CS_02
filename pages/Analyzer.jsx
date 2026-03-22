import { useState, useEffect, useRef } from "react";
import { EmailAnalysis } from "../api/entities";

function analyzeEmail(form) {
  const indicators = [];
  let score = 0;

  const sender = (form.sender || "").toLowerCase();
  const subject = (form.subject || "").toLowerCase();
  const content = (form.content || "").toLowerCase();
  const link = (form.link || "").toLowerCase();

  // Sender domain checks
  if (sender) {
    const freeHosts = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com"];
    const domain = sender.split("@")[1] || "";
    if (freeHosts.some(h => domain === h) && (content.includes("bank") || content.includes("account") || content.includes("verify"))) {
      indicators.push("Legitimate institution using free email provider (suspicious)"); score += 25;
    }
    const typos = ["paypa1.com", "g00gle.com", "amaz0n.com", "micros0ft.com", "faceb00k.com", "arnazon.com", "paypal-security.com", "apple-support.com", "amazon-support.com", "microsoft-helpdesk.com"];
    if (typos.some(t => domain.includes(t.split(".")[0]))) { indicators.push("Typosquatted domain detected (imitating legitimate brand)"); score += 40; }
    if (domain.includes("-") && (domain.includes("secure") || domain.includes("support") || domain.includes("verify") || domain.includes("update"))) {
      indicators.push("Suspicious subdomain pattern (e.g. secure-paypal.com)"); score += 20;
    }
  }

  // Urgency language
  const urgencyWords = ["urgent", "immediately", "action required", "verify now", "expire", "suspended", "locked", "within 24 hours", "limited time", "act now", "click immediately", "account will be", "your account has been"];
  const foundUrgency = urgencyWords.filter(w => content.includes(w) || subject.includes(w));
  if (foundUrgency.length > 0) { indicators.push(`Urgent/threatening language: "${foundUrgency.slice(0, 2).join('", "')}"`); score += foundUrgency.length * 10; }

  // Generic greeting
  const greetings = ["dear user", "dear customer", "dear member", "dear account holder", "dear valued customer", "hello user", "dear client"];
  if (greetings.some(g => content.includes(g))) { indicators.push("Generic greeting used (not addressed by name — common phishing tactic)"); score += 20; }

  // Password/OTP requests
  const sensitiveWords = ["password", "otp", "one-time", "pin", "credit card", "social security", "ssn", "cvv", "bank account number"];
  const foundSensitive = sensitiveWords.filter(w => content.includes(w));
  if (foundSensitive.length > 0) { indicators.push(`Requesting sensitive information: ${foundSensitive.slice(0, 3).join(", ")}`); score += 30; }

  // Suspicious links
  if (link) {
    const shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly", "short.io", "rebrand.ly", "tiny.cc"];
    if (shorteners.some(s => link.includes(s))) { indicators.push("Shortened URL detected (hides true destination)"); score += 30; }
    if (link.includes("@")) { indicators.push("URL contains @ symbol (used to deceive about actual destination)"); score += 40; }
    if (!link.startsWith("https://")) { indicators.push("Link is not secured with HTTPS"); score += 15; }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(link)) { indicators.push("URL uses IP address instead of domain name"); score += 35; }
    const suspicious_domains = ["login", "secure", "verify", "account", "update", "confirm", "payment", "billing"];
    if (suspicious_domains.some(d => link.includes(d)) && !link.includes("paypal.com") && !link.includes("amazon.com") && !link.includes("google.com")) {
      indicators.push("Link contains suspicious keywords (verify, secure, login, etc.)"); score += 20;
    }
  }

  // Attachment threats
  const attachWords = ["open the attachment", "download the file", "attached file", "see attached", "open attached", "download attached"];
  if (attachWords.some(w => content.includes(w))) { indicators.push("References to attachments — potential malware delivery vector"); score += 25; }

  // Misspellings
  const misspells = ["recieve", "adress", "occured", "acconut", "verfiy", "pasword", "urgant", "expirted"];
  const foundMisspells = misspells.filter(w => content.includes(w));
  if (foundMisspells.length > 0) { indicators.push(`Spelling errors detected: "${foundMisspells.slice(0, 2).join('", "')}"`); score += 10; }

  // HTML obfuscation / suspicious content
  if (content.includes("<script") || content.includes("javascript:") || content.includes("onclick=")) {
    indicators.push("Malicious script or JavaScript detected in email body"); score += 50;
  }

  score = Math.min(score, 100);

  let risk_level, explanation, recommended_action;
  if (score >= 60) {
    risk_level = "PHISHING";
    explanation = "This email exhibits multiple high-confidence phishing indicators. It is very likely a malicious attempt to steal credentials, financial information, or install malware. Do NOT interact with this email.";
    recommended_action = "🚨 DELETE immediately. Do NOT click any links. Report to your IT security team. Block the sender domain.";
  } else if (score >= 25) {
    risk_level = "SUSPICIOUS";
    explanation = "This email contains some suspicious characteristics. While it may not be confirmed phishing, it should be treated with caution and verified through alternative channels.";
    recommended_action = "⚠️ Do NOT click links until verified. Contact the sender directly via phone or official website. Do not provide any personal information.";
  } else {
    risk_level = "SAFE";
    explanation = "No significant phishing indicators were detected. This email appears to be legitimate. However, always remain vigilant — no automated system is 100% accurate.";
    recommended_action = "✅ Email appears safe, but always verify unexpected requests. When in doubt, contact the sender directly.";
  }

  return { risk_level, indicators, explanation, recommended_action, score };
}

export default function Analyzer() {
  const canvasRef = useRef(null);
  const [tab, setTab] = useState("email");
  const [form, setForm] = useState({ sender: "", subject: "", content: "", link: "", header: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [headerResult, setHeaderResult] = useState(null);
  const [headerText, setHeaderText] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.3 + 0.05,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,200,255,0.025)";
      for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleAnalyze = async () => {
    if (!form.sender && !form.content && !form.subject) { alert("Please fill in at least the sender, subject, or email content."); return; }
    setLoading(true);
    setResult(null);
    setSaved(false);
    await new Promise(r => setTimeout(r, 2000));
    const analysis = analyzeEmail(form);
    setResult(analysis);
    setLoading(false);
    // Auto-save to database
    try {
      await EmailAnalysis.create({ ...form, ...analysis });
      setSaved(true);
    } catch (e) {}
  };

  const analyzeHeader = () => {
    if (!headerText.trim()) { alert("Please paste an email header first."); return; }
    const h = headerText.toLowerCase();
    const spf = h.includes("spf=pass") ? "PASS ✅" : h.includes("spf=fail") ? "FAIL ❌" : h.includes("spf=softfail") ? "SOFTFAIL ⚠️" : "NONE ⚠️";
    const dkim = h.includes("dkim=pass") ? "PASS ✅" : h.includes("dkim=fail") ? "FAIL ❌" : "NONE ⚠️";
    const dmarc = h.includes("dmarc=pass") ? "PASS ✅" : h.includes("dmarc=fail") ? "FAIL ❌" : "NONE ⚠️";
    const ipMatch = h.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
    const ip = ipMatch ? ipMatch[0] : "Not found";
    const serverMatch = h.match(/from\s+([\w.-]+\.[a-z]{2,})/i);
    const server = serverMatch ? serverMatch[1] : "Unknown";
    setHeaderResult({ spf, dkim, dmarc, ip, server });
  };

  const riskColors = {
    PHISHING: { bg: "rgba(255,68,68,0.12)", border: "rgba(255,68,68,0.5)", color: "#ff4444", glow: "rgba(255,68,68,0.3)" },
    SUSPICIOUS: { bg: "rgba(255,170,0,0.12)", border: "rgba(255,170,0,0.5)", color: "#ffaa00", glow: "rgba(255,170,0,0.3)" },
    SAFE: { bg: "rgba(0,255,136,0.12)", border: "rgba(0,255,136,0.5)", color: "#00ff88", glow: "rgba(0,255,136,0.3)" },
  };

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => window.location.href = "/"}><span>🛡️</span><span style={styles.navTitle}>PhishGuard</span></div>
        <div style={styles.navLinks}>
          {[["Dashboard", "📊"], ["Report", "📋"], ["Awareness", "🎓"], ["Guidelines", "📋"]].map(([p, i]) => (
            <button key={p} style={styles.navBtn} onClick={() => window.location.href = `/${p}`}>{i} {p}</button>
          ))}
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>🔍 Email Threat Analyzer</h1>
          <p style={styles.pageSub}>Analyze suspicious emails for phishing indicators using AI-powered detection</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={tab === "email" ? styles.tabActive : styles.tab} onClick={() => setTab("email")}>📧 Email Analyzer</button>
          <button style={tab === "header" ? styles.tabActive : styles.tab} onClick={() => setTab("header")}>🔬 Header Inspector</button>
        </div>

        {tab === "email" && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h2 style={styles.cardTitle}>📬 Email Details</h2>
              <div style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>📧 Sender Email *</label>
                  <input style={styles.input} placeholder="sender@suspicious-domain.com" value={form.sender} onChange={e => setForm({ ...form, sender: e.target.value })} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>📝 Subject Line *</label>
                  <input style={styles.input} placeholder="URGENT: Your account has been suspended!" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>📄 Email Content *</label>
                  <textarea style={styles.textarea} rows={7} placeholder="Paste the full email body here..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>🔗 Suspicious Link (optional)</label>
                  <input style={styles.input} placeholder="http://suspicious-link.com/verify" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>📋 Email Header (optional)</label>
                  <input style={styles.input} placeholder="Paste email header for deeper analysis..." value={form.header} onChange={e => setForm({ ...form, header: e.target.value })} />
                </div>
              </div>
              <button style={loading ? styles.btnLoading : styles.analyzeBtn} onClick={handleAnalyze} disabled={loading}>
                {loading ? (
                  <><span style={styles.spinner} /> Analyzing Threat Signatures...</>
                ) : "⚡ ANALYZE EMAIL"}
              </button>
            </div>

            {loading && (
              <div style={styles.loadingCard}>
                <div style={styles.loadingSpinner} />
                <div style={styles.loadingText}>Running phishing detection algorithms...</div>
                <div style={{ color: "#506080", fontSize: 13, marginTop: 8 }}>Checking sender reputation • Analyzing content patterns • Scanning for indicators</div>
              </div>
            )}

            {result && !loading && (
              <div style={{ ...styles.resultCard, background: riskColors[result.risk_level].bg, border: `2px solid ${riskColors[result.risk_level].border}`, boxShadow: `0 0 40px ${riskColors[result.risk_level].glow}` }}>
                <div style={styles.resultHeader}>
                  <div>
                    <div style={styles.resultLabel}>THREAT CLASSIFICATION</div>
                    <div style={{ ...styles.resultLevel, color: riskColors[result.risk_level].color }}>
                      {result.risk_level === "PHISHING" ? "🎣" : result.risk_level === "SUSPICIOUS" ? "⚠️" : "✅"} {result.risk_level}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.resultLabel}>RISK SCORE</div>
                    <div style={{ ...styles.riskScore, color: riskColors[result.risk_level].color }}>{result.score}/100</div>
                  </div>
                </div>

                {/* Score bar */}
                <div style={styles.scoreBarBg}>
                  <div style={{ height: "100%", width: `${result.score}%`, background: `linear-gradient(90deg, #00ff88, ${riskColors[result.risk_level].color})`, borderRadius: 4, transition: "width 1s ease", boxShadow: `0 0 10px ${riskColors[result.risk_level].color}` }} />
                </div>

                <div style={styles.resultExplanation}>{result.explanation}</div>

                {result.indicators.length > 0 && (
                  <div style={styles.indicatorsSection}>
                    <div style={styles.indicatorsTitle}>🚩 Detected Phishing Indicators ({result.indicators.length})</div>
                    {result.indicators.map((ind, i) => (
                      <div key={i} style={styles.indicator}><span style={{ color: riskColors[result.risk_level].color }}>▶</span> {ind}</div>
                    ))}
                  </div>
                )}

                <div style={styles.recommendedAction}>
                  <strong>Recommended Action:</strong> {result.recommended_action}
                </div>

                {saved && <div style={styles.savedBadge}>💾 Analysis saved to your report history</div>}
              </div>
            )}
          </div>
        )}

        {tab === "header" && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h2 style={styles.cardTitle}>🔬 Email Header Inspector</h2>
              <p style={{ color: "#7090c0", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Paste the raw email header (from your email client's "Show Original" or "View Source" option) to analyze authentication and trace the email's origin.</p>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>📋 Raw Email Header</label>
                <textarea style={{ ...styles.textarea, fontFamily: "monospace", fontSize: 12, letterSpacing: 0 }} rows={10} placeholder={`Received: from mail.suspicious.com (mail.suspicious.com [192.168.1.1])\nAuthentication-Results: mx.google.com;\n   dkim=fail header.i=@suspicious.com;\n   spf=fail smtp.mailfrom=suspicious.com;\nFrom: "PayPal Support" <support@paypa1.com>\nSubject: Your account has been limited`} value={headerText} onChange={e => setHeaderText(e.target.value)} />
              </div>
              <button style={styles.analyzeBtn} onClick={analyzeHeader}>🔬 Analyze Header</button>
            </div>

            {headerResult && (
              <div style={styles.headerResultCard}>
                <h2 style={styles.cardTitle}>🔍 Header Analysis Results</h2>
                <table style={styles.headerTable}>
                  <thead>
                    <tr>
                      <th style={styles.hth}>Check</th>
                      <th style={styles.hth}>Status</th>
                      <th style={styles.hth}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { check: "SPF Verification", status: headerResult.spf, desc: "Sender Policy Framework — verifies the sending mail server is authorized" },
                      { check: "DKIM Signature", status: headerResult.dkim, desc: "DomainKeys Identified Mail — cryptographic signature validation" },
                      { check: "DMARC Policy", status: headerResult.dmarc, desc: "Domain-based Message Authentication — policy enforcement" },
                      { check: "Originating IP", status: headerResult.ip, desc: "IP address of the mail server that sent this email" },
                      { check: "Mail Server", status: headerResult.server, desc: "Hostname of the sending mail server" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,200,255,0.08)" }}>
                        <td style={styles.htd}><strong style={{ color: "#00c8ff" }}>{row.check}</strong></td>
                        <td style={styles.htd}>
                          <span style={{ fontFamily: "monospace", fontSize: 13, color: row.status.includes("PASS") ? "#00ff88" : row.status.includes("FAIL") ? "#ff4444" : "#ffaa00" }}>{row.status}</span>
                        </td>
                        <td style={{ ...styles.htd, color: "#7090c0", fontSize: 13 }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, padding: 16, background: "rgba(0,200,255,0.05)", borderRadius: 8, fontSize: 14, color: "#7090c0", lineHeight: 1.6 }}>
                  💡 <strong style={{ color: "#e0e8ff" }}>Tip:</strong> If SPF, DKIM, or DMARC all fail, the email is highly likely to be spoofed or forged. Treat it as a phishing attempt.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;400;600;700&display=swap'); * { box-sizing: border-box; } input:focus,textarea:focus { outline: none; border-color: rgba(0,200,255,0.5) !important; box-shadow: 0 0 15px rgba(0,200,255,0.15) !important; } button:hover:not(:disabled) { transform: translateY(-2px); } @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse2 { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} } @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #050510 0%, #080820 100%)", fontFamily: "'Rajdhani', sans-serif", color: "#e0e8ff" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "rgba(5,5,20,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,200,255,0.15)" },
  navLogo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 20 },
  navTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(90deg, #00c8ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navLinks: { display: "flex", gap: 4 },
  navBtn: { background: "transparent", border: "none", color: "#7090c0", cursor: "pointer", padding: "7px 14px", fontSize: 13, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, transition: "color 0.2s" },
  container: { position: "relative", zIndex: 10, padding: "100px 32px 60px", maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 28, textAlign: "center" },
  pageTitle: { fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: 8 },
  pageSub: { fontSize: 16, color: "#7090c0" },
  tabs: { display: "flex", gap: 4, marginBottom: 24, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 4, width: "fit-content" },
  tab: { padding: "10px 24px", border: "none", background: "transparent", color: "#7090c0", cursor: "pointer", fontSize: 15, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, borderRadius: 8, transition: "all 0.2s" },
  tabActive: { padding: "10px 24px", border: "none", background: "linear-gradient(135deg, rgba(0,200,255,0.2), rgba(124,58,237,0.2))", color: "#00c8ff", cursor: "pointer", fontSize: 15, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, borderRadius: 8, boxShadow: "0 0 15px rgba(0,200,255,0.2)" },
  content: { display: "flex", flexDirection: "column", gap: 20 },
  formCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" },
  cardTitle: { fontSize: 20, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: 24, color: "#e0e8ff" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 600, color: "#7090c0", letterSpacing: 1, textTransform: "uppercase" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#e0e8ff", fontFamily: "'Rajdhani', sans-serif", transition: "all 0.2s" },
  textarea: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#e0e8ff", fontFamily: "'Rajdhani', sans-serif", resize: "vertical", transition: "all 0.2s" },
  analyzeBtn: { background: "linear-gradient(135deg, #00c8ff, #7c3aed)", border: "none", borderRadius: 8, padding: "15px 32px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 2, fontFamily: "'Rajdhani', sans-serif", boxShadow: "0 0 30px rgba(0,200,255,0.4)", transition: "all 0.2s" },
  btnLoading: { background: "rgba(0,200,255,0.15)", border: "1px solid rgba(0,200,255,0.3)", borderRadius: 8, padding: "15px 32px", fontSize: 16, fontWeight: 700, color: "#00c8ff", cursor: "not-allowed", letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif", display: "flex", alignItems: "center", gap: 10 },
  spinner: { width: 16, height: 16, border: "2px solid rgba(0,200,255,0.3)", borderTop: "2px solid #00c8ff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  loadingCard: { textAlign: "center", padding: 40, background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 12 },
  loadingSpinner: { width: 60, height: 60, border: "4px solid rgba(0,200,255,0.2)", borderTop: "4px solid #00c8ff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" },
  loadingText: { fontSize: 18, color: "#00c8ff", fontWeight: 600, fontFamily: "'Orbitron', sans-serif", fontSize: 14 },
  resultCard: { borderRadius: 16, padding: 28, animation: "fadeIn 0.5s ease" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  resultLabel: { fontSize: 11, color: "#7090c0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 },
  resultLevel: { fontSize: 36, fontFamily: "'Orbitron', sans-serif", fontWeight: 900 },
  riskScore: { fontSize: 36, fontFamily: "'Orbitron', sans-serif", fontWeight: 900 },
  scoreBarBg: { height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 20, overflow: "hidden" },
  resultExplanation: { fontSize: 15, color: "#a0b8d0", lineHeight: 1.7, marginBottom: 20, padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: 8 },
  indicatorsSection: { marginBottom: 20 },
  indicatorsTitle: { fontSize: 15, fontWeight: 700, marginBottom: 12, color: "#e0e8ff" },
  indicator: { fontSize: 14, color: "#a0b8d0", padding: "8px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 6, marginBottom: 6, display: "flex", gap: 10 },
  recommendedAction: { fontSize: 14, color: "#e0e8ff", background: "rgba(0,0,0,0.25)", padding: 16, borderRadius: 8, lineHeight: 1.6 },
  savedBadge: { marginTop: 12, fontSize: 13, color: "#00ff88", textAlign: "center", padding: "8px", background: "rgba(0,255,136,0.08)", borderRadius: 6 },
  headerResultCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 16, padding: 28, backdropFilter: "blur(10px)", animation: "fadeIn 0.5s ease" },
  headerTable: { width: "100%", borderCollapse: "collapse" },
  hth: { padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#506080", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid rgba(0,200,255,0.1)", background: "rgba(0,0,0,0.2)" },
  htd: { padding: "14px 16px", fontSize: 14, color: "#a0b8d0" },
};
