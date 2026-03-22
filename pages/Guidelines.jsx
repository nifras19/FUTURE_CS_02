export default function Guidelines() {
  const dos = [
    { icon: "✅", title: "Verify Sender Email", desc: "Always check the actual email address, not just the display name. Look for subtle misspellings or unusual domains." },
    { icon: "🖱️", title: "Hover Before Clicking", desc: "Hover over links to preview the destination URL. Never click if the URL doesn't match the expected website." },
    { icon: "📢", title: "Report Suspicious Emails", desc: "Forward phishing emails to your IT security team and report them to your email provider as spam/phishing." },
    { icon: "🔐", title: "Use Multi-Factor Authentication", desc: "Enable MFA on all accounts. Even if your password is stolen, attackers can't access your account without the second factor." },
    { icon: "🔄", title: "Keep Software Updated", desc: "Phishing emails often deliver malware that exploits outdated software. Keep your OS and applications patched." },
    { icon: "📞", title: "Verify via Alternate Channel", desc: "If you receive a suspicious request from a colleague or vendor, call them directly to confirm using a known phone number." },
    { icon: "🔒", title: "Use Strong Unique Passwords", desc: "Use a password manager to generate and store strong, unique passwords for every account." },
    { icon: "📧", title: "Check for HTTPS", desc: "Before entering any credentials, ensure the website uses HTTPS and has a valid SSL certificate." },
  ];

  const donts = [
    { icon: "🚫", title: "Share Passwords via Email", desc: "Never send passwords, OTPs, PINs, or any credentials via email. Legitimate services will never ask for this." },
    { icon: "📎", title: "Download Unknown Attachments", desc: "Never open attachments from unknown senders. Even familiar senders can be compromised — verify first." },
    { icon: "💸", title: "Click Urgent Payment Links", desc: "Never click links in emails demanding immediate payment. Always navigate directly to the official website." },
    { icon: "🔑", title: "Trust OTP Requests via Email", desc: "Legitimate services send OTPs to your phone, not email. Email OTP requests are almost always phishing." },
    { icon: "📋", title: "Fill Forms from Email Links", desc: "Never fill in personal information on a page you reached by clicking an email link. Go directly to the official site." },
    { icon: "📤", title: "Forward Sensitive Information", desc: "Don't forward emails containing sensitive company data, financial information, or personal details." },
    { icon: "🌐", title: "Trust HTTP Websites for Login", desc: "Never enter credentials on a site that doesn't have HTTPS. Look for the padlock icon in your browser." },
    { icon: "📱", title: "Ignore Security Alerts", desc: "Don't dismiss browser or email security warnings. They exist for a reason — investigate before proceeding." },
  ];

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => window.location.href = "/"}><span>🛡️</span><span style={s.logoTxt}>PhishGuard</span></div>
        <div style={s.navLinks}>
          {[["Dashboard","📊"],["Analyzer","🔍"],["Awareness","🎓"],["Report","📋"]].map(([p,ic]) => (
            <button key={p} style={s.navBtn} onClick={() => window.location.href = `/${p}`}>{ic} {p}</button>
          ))}
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.hero}>
          <div style={s.badge}>📋 Security Best Practices</div>
          <h1 style={s.heroTitle}>Security Guidelines</h1>
          <p style={s.heroSub}>Follow these essential rules to protect yourself and your organization from phishing attacks and email-based threats.</p>
        </div>

        <div style={s.twoCol}>
          {/* DOs */}
          <div>
            <div style={s.colHeader}>
              <div style={{...s.colBadge, background:"rgba(0,255,136,0.15)", border:"2px solid rgba(0,255,136,0.4)", color:"#00ff88"}}>✅ DO</div>
              <p style={s.colDesc}>Follow these practices to stay secure</p>
            </div>
            <div style={s.cardList}>
              {dos.map((item, i) => (
                <div key={i} style={s.doCard}>
                  <div style={s.doIcon}>{item.icon}</div>
                  <div>
                    <div style={{...s.cardTitle, color:"#00ff88"}}>{item.title}</div>
                    <div style={s.cardDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DON'Ts */}
          <div>
            <div style={s.colHeader}>
              <div style={{...s.colBadge, background:"rgba(255,68,68,0.15)", border:"2px solid rgba(255,68,68,0.4)", color:"#ff4444"}}>🚫 DON'T</div>
              <p style={s.colDesc}>Avoid these dangerous behaviors</p>
            </div>
            <div style={s.cardList}>
              {donts.map((item, i) => (
                <div key={i} style={s.dontCard}>
                  <div style={s.dontIcon}>{item.icon}</div>
                  <div>
                    <div style={{...s.cardTitle, color:"#ff6060"}}>{item.title}</div>
                    <div style={s.cardDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Response */}
        <div style={s.emergSection}>
          <h2 style={s.emergTitle}>🚨 If You've Been Phished — Immediate Response</h2>
          <div style={s.steps}>
            {[
              {n:"1", t:"Change Your Passwords Immediately", d:"Change the compromised password and any accounts that use the same password. Start with email, then banking, then other accounts."},
              {n:"2", t:"Enable Multi-Factor Authentication", d:"Turn on MFA everywhere to prevent further unauthorized access even if passwords were stolen."},
              {n:"3", t:"Notify Your IT Security Team", d:"Report the incident immediately. Your security team can investigate, contain the breach, and prevent it from spreading."},
              {n:"4", t:"Monitor Your Accounts", d:"Watch for unusual activity in your bank accounts, email sent folder, and any connected services for the next 30 days."},
              {n:"5", t:"Report to Authorities", d:"File a report with your national cybercrime agency. In the US: IC3.gov. In the UK: Action Fraud. This helps track and stop attackers."},
            ].map((step, i) => (
              <div key={i} style={s.step}>
                <div style={s.stepNum}>{step.n}</div>
                <div>
                  <div style={s.stepTitle}>{step.t}</div>
                  <div style={s.stepDesc}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick reference card */}
        <div style={s.quickRef}>
          <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,marginBottom:20,color:"#e0e8ff"}}>⚡ Quick Reference Checklist</h2>
          <div style={s.checkGrid}>
            {["Check the sender's actual email domain","Hover over links before clicking","Look for HTTPS in URLs","Verify unexpected requests by phone","Never share credentials via email","Enable MFA on all accounts","Report suspicious emails to IT","Keep software and OS updated"].map((item,i) => (
              <div key={i} style={s.checkItem}>
                <span style={{color:"#00c8ff",fontSize:16}}>◆</span>
                <span style={{fontSize:14,color:"#a0b8d0"}}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.cta}>
          <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,marginBottom:10}}>🔍 Analyze a Suspicious Email</h2>
          <p style={{color:"#7090c0",marginBottom:22,fontSize:15}}>Use our AI engine to instantly check if an email is phishing.</p>
          <button style={s.ctaBtn} onClick={() => window.location.href = "/Analyzer"}>⚡ Go to Email Analyzer</button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;400;600;700&display=swap');*{box-sizing:border-box;}button:hover{transform:translateY(-2px);transition:all 0.2s;}.doCard:hover{border-color:rgba(0,255,136,0.4)!important;}.dontCard:hover{border-color:rgba(255,68,68,0.4)!important;}`}</style>
    </div>
  );
}

const s = {
  root:{minHeight:"100vh",background:"linear-gradient(135deg,#050510 0%,#080820 100%)",fontFamily:"'Rajdhani',sans-serif",color:"#e0e8ff"},
  nav:{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 32px",background:"rgba(5,5,20,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,0.15)"},
  logo:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:20},
  logoTxt:{fontSize:18,fontWeight:700,fontFamily:"'Orbitron',sans-serif",background:"linear-gradient(90deg,#00c8ff,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  navLinks:{display:"flex",gap:4},
  navBtn:{background:"transparent",border:"none",color:"#7090c0",cursor:"pointer",padding:"7px 14px",fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:600},
  container:{padding:"90px 32px 60px",maxWidth:1100,margin:"0 auto"},
  hero:{textAlign:"center",padding:"36px 0 36px"},
  badge:{display:"inline-block",background:"rgba(0,200,255,0.1)",border:"1px solid rgba(0,200,255,0.3)",color:"#00c8ff",padding:"5px 18px",borderRadius:20,fontSize:13,letterSpacing:1,marginBottom:14},
  heroTitle:{fontSize:"clamp(26px,5vw,48px)",fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:14,background:"linear-gradient(90deg,#00c8ff,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroSub:{fontSize:16,color:"#7090c0",maxWidth:680,margin:"0 auto",lineHeight:1.7},
  twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,marginBottom:40},
  colHeader:{textAlign:"center",marginBottom:20},
  colBadge:{display:"inline-block",padding:"10px 28px",borderRadius:30,fontSize:18,fontWeight:700,letterSpacing:2,fontFamily:"'Orbitron',sans-serif",marginBottom:10},
  colDesc:{fontSize:14,color:"#7090c0"},
  cardList:{display:"flex",flexDirection:"column",gap:10},
  doCard:{display:"flex",gap:14,background:"rgba(0,255,136,0.05)",border:"1px solid rgba(0,255,136,0.15)",borderRadius:10,padding:"14px 16px",alignItems:"flex-start",transition:"all 0.2s"},
  dontCard:{display:"flex",gap:14,background:"rgba(255,68,68,0.05)",border:"1px solid rgba(255,68,68,0.15)",borderRadius:10,padding:"14px 16px",alignItems:"flex-start",transition:"all 0.2s"},
  doIcon:{fontSize:22,flexShrink:0,marginTop:2},
  dontIcon:{fontSize:22,flexShrink:0,marginTop:2},
  cardTitle:{fontSize:14,fontWeight:700,marginBottom:4},
  cardDesc:{fontSize:13,color:"#7090c0",lineHeight:1.5},
  emergSection:{background:"rgba(255,68,68,0.05)",border:"1px solid rgba(255,68,68,0.2)",borderRadius:16,padding:28,marginBottom:32},
  emergTitle:{fontSize:20,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:20,color:"#ff8080"},
  steps:{display:"flex",flexDirection:"column",gap:14},
  step:{display:"flex",gap:16,alignItems:"flex-start"},
  stepNum:{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#ff4444,#ff8c00)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,flexShrink:0,color:"#fff"},
  stepTitle:{fontSize:15,fontWeight:700,color:"#e0e8ff",marginBottom:4},
  stepDesc:{fontSize:13,color:"#7090c0",lineHeight:1.5},
  quickRef:{background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.15)",borderRadius:14,padding:24,marginBottom:32},
  checkGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10},
  checkItem:{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",background:"rgba(0,0,0,0.2)",borderRadius:6},
  cta:{textAlign:"center",background:"linear-gradient(135deg,rgba(0,200,255,0.07),rgba(124,58,237,0.07))",border:"1px solid rgba(0,200,255,0.2)",borderRadius:16,padding:"32px 24px"},
  ctaBtn:{background:"linear-gradient(135deg,#00c8ff,#7c3aed)",border:"none",color:"#fff",padding:"13px 28px",borderRadius:8,cursor:"pointer",fontSize:15,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1},
};
