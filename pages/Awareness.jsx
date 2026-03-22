import { useState } from "react";

export default function Awareness() {
  const [activeCard, setActiveCard] = useState(null);

  const techniques = [
    { icon: "🎣", title: "Spear Phishing", color: "#ff4444", desc: "Highly targeted attacks using personalized info from social media to deceive specific individuals.", example: "An email from your 'CEO' asking you to wire money urgently." },
    { icon: "📱", title: "Smishing (SMS)", color: "#ff7700", desc: "Phishing via text messages impersonating banks, delivery services, or government agencies.", example: "\"Your FedEx package is held. Verify your address: bit.ly/xyz123\"" },
    { icon: "📞", title: "Vishing (Voice)", color: "#ffaa00", desc: "Phone call attacks where criminals impersonate bank officials or tech support.", example: "A call claiming your Social Security Number has been suspended." },
    { icon: "🐋", title: "Whaling", color: "#a855f7", desc: "Attacks targeting senior executives (CEOs, CFOs) to authorize large financial transfers.", example: "Fake board meeting email asking the CFO to approve a wire transfer." },
    { icon: "🔄", title: "Clone Phishing", color: "#3b82f6", desc: "Criminals copy a legitimate email, replace links/attachments with malicious content and resend.", example: "A duplicate PayPal receipt email with a malicious 'view transaction' link." },
    { icon: "🏢", title: "BEC Attack", color: "#ec4899", desc: "Compromising business email accounts to trick employees into sending money or data.", example: "Your vendor's email hacked to redirect invoice payment to a fraudulent account." },
    { icon: "🌐", title: "Domain Spoofing", color: "#06b6d4", desc: "Creating fake websites nearly identical to real ones using typosquatting techniques.", example: "paypa1.com instead of paypal.com — one character difference." },
    { icon: "💉", title: "Pharming", color: "#10b981", desc: "Redirecting users from legitimate websites to fraudulent ones by poisoning DNS servers.", example: "Typing your bank URL correctly but landing on a fake banking site." },
  ];

  const realExamples = [
    { type: "PHISHING", from: "security@paypa1-verify.com", subject: "⚠️ URGENT: Your PayPal account has been limited", preview: "Dear valued customer, We detected unusual activity on your account. Your account access has been limited. Click here to verify your identity within 24 hours or your account will be permanently suspended...", indicators: ["Fake domain (paypa1 not paypal)", "Urgent language", "Generic greeting", "Threatening deadline"] },
    { type: "PHISHING", from: "it-helpdesk@company-support247.net", subject: "Action Required: Update your Microsoft 365 password", preview: "Hello User, Your Microsoft 365 password will expire in 24 hours. Click the link below to update your password immediately. Failure to do so will result in loss of email access...", indicators: ["External domain for internal IT", "Generic 'Hello User'", "Password harvesting", "Artificial urgency"] },
    { type: "SUSPICIOUS", from: "hr.department@company-benefits.com", subject: "Important: Year-end bonus disbursement form", preview: "Dear Employee, Please complete the attached form to receive your year-end bonus. The form requires your bank account details to process the direct deposit. Deadline is December 31st...", indicators: ["External domain", "Requesting bank details", "Deadline pressure"] },
  ];

  const riskMap = {
    PHISHING: { color: "#ff4444", bg: "rgba(255,68,68,0.1)", border: "rgba(255,68,68,0.4)" },
    SUSPICIOUS: { color: "#ffaa00", bg: "rgba(255,170,0,0.1)", border: "rgba(255,170,0,0.4)" },
  };

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => window.location.href = "/"}><span>🛡️</span><span style={s.logoTxt}>PhishGuard</span></div>
        <div style={s.navLinks}>
          {[["Dashboard","📊"],["Analyzer","🔍"],["Report","📋"],["Guidelines","📋"]].map(([p,i]) => (
            <button key={p} style={s.navBtn} onClick={() => window.location.href = `/${p}`}>{i} {p}</button>
          ))}
        </div>
      </nav>
      <div style={s.container}>
        <div style={s.hero}>
          <div style={s.badge}>📚 Security Awareness Training</div>
          <h1 style={s.heroTitle}>Phishing Awareness</h1>
          <p style={s.heroSub}>Knowledge is your first line of defense. Learn to identify and avoid phishing attacks before they compromise your security.</p>
        </div>

        <div style={s.infoCard}>
          <span style={{fontSize:56,flexShrink:0}}>🎣</span>
          <div>
            <h2 style={s.infoTitle}>What is Phishing?</h2>
            <p style={s.infoText}>Phishing is a social engineering attack where cybercriminals impersonate trusted entities to trick victims into revealing passwords, credit card numbers, or personal data. It accounts for over <strong style={{color:"#00c8ff"}}>90% of all data breaches</strong> worldwide.</p>
            <p style={{...s.infoText,marginTop:10}}>The term originated in the 1990s — attackers "fish" for victims using convincing-looking bait emails hoping someone takes the hook.</p>
          </div>
        </div>

        <div style={s.statsBanner}>
          {[{v:"3.4B",l:"Phishing emails sent daily",i:"📧"},{v:"90%",l:"Cyberattacks start with phishing",i:"🎯"},{v:"$4.9M",l:"Average cost of a breach",i:"💰"},{v:"97%",l:"Users can't spot sophisticated phishing",i:"👁️"}].map((x,i) => (
            <div key={i} style={s.statCard}>
              <div style={{fontSize:28,marginBottom:6}}>{x.i}</div>
              <div style={s.statVal}>{x.v}</div>
              <div style={s.statLbl}>{x.l}</div>
            </div>
          ))}
        </div>

        <h2 style={s.sectionTitle}>🕵️ Common Phishing Techniques</h2>
        <div style={s.grid4}>
          {techniques.map((t,i) => (
            <div key={i} style={{...s.techCard, borderColor: activeCard===i ? t.color+"50":"rgba(255,255,255,0.07)"}}
              onMouseEnter={()=>setActiveCard(i)} onMouseLeave={()=>setActiveCard(null)}>
              <div style={{fontSize:32,marginBottom:10}}>{t.icon}</div>
              <h3 style={{...s.techTitle,color:t.color}}>{t.title}</h3>
              <p style={s.techDesc}>{t.desc}</p>
              {activeCard===i && <div style={{...s.exBox,borderColor:t.color+"40"}}><strong style={{color:t.color,fontSize:11,letterSpacing:1}}>💡 EXAMPLE:</strong><p style={{margin:"5px 0 0",fontSize:12,color:"#a0b8d0",fontStyle:"italic"}}>"{t.example}"</p></div>}
            </div>
          ))}
        </div>

        <h2 style={{...s.sectionTitle,marginTop:48}}>🚩 Red Flags to Watch For</h2>
        <div style={s.grid2}>
          {[
            {f:"Mismatched sender domain",d:"Display name says 'PayPal' but email is from random123@hotmail.com"},
            {f:"Generic salutations",d:"'Dear Customer' instead of your actual name — companies know who you are"},
            {f:"Urgency and pressure",d:"'Act within 24 hours or your account closes!' — bypasses critical thinking"},
            {f:"Suspicious links",d:"Always hover before clicking. Displayed URL and actual URL must match"},
            {f:"Unexpected attachments",d:".exe, .zip, or macro-enabled Office files you weren't expecting"},
            {f:"Requests for credentials",d:"Legitimate companies NEVER ask for your password or OTP via email"},
            {f:"Spelling & grammar errors",d:"Errors are often intentional to filter security-savvy targets"},
            {f:"Too good to be true",d:"Prize winnings, inheritance, refunds from unknown sources — classic lures"},
          ].map((x,i) => (
            <div key={i} style={s.rfCard}>
              <span style={{color:"#ff4444",fontSize:18,flexShrink:0}}>🚩</span>
              <div><div style={s.rfFlag}>{x.f}</div><div style={s.rfDetail}>{x.d}</div></div>
            </div>
          ))}
        </div>

        <h2 style={{...s.sectionTitle,marginTop:48}}>📧 Real Phishing Email Examples</h2>
        {realExamples.map((ex,i) => {
          const rc = riskMap[ex.type];
          return (
            <div key={i} style={{...s.emailEx, background:rc.bg, borderColor:rc.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:13,marginBottom:3}}><span style={{color:"#506080"}}>From: </span><span style={{color:"#ff8080"}}>{ex.from}</span></div>
                  <div style={{fontSize:14}}><span style={{color:"#506080"}}>Subject: </span><strong>{ex.subject}</strong></div>
                </div>
                <span style={{...s.badge2,background:rc.bg,borderColor:rc.border,color:rc.color}}>{ex.type}</span>
              </div>
              <div style={s.emailPrev}>{ex.preview}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                {ex.indicators.map((ind,j) => <span key={j} style={{...s.indTag,borderColor:rc.border,color:rc.color}}>⚠️ {ind}</span>)}
              </div>
            </div>
          );
        })}

        <div style={s.cta}>
          <h2 style={s.ctaTitle}>🛡️ Ready to Test Your Skills?</h2>
          <p style={s.ctaSub}>Use our AI-powered analyzer to check real suspicious emails instantly.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button style={s.ctaBtn} onClick={()=>window.location.href="/Analyzer"}>⚡ Analyze an Email</button>
            <button style={s.ctaBtn2} onClick={()=>window.location.href="/Guidelines"}>📋 Security Guidelines</button>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;400;600;700&display=swap');*{box-sizing:border-box;}button:hover{transform:translateY(-2px);transition:all 0.2s;}`}</style>
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
  hero:{textAlign:"center",padding:"36px 0 28px"},
  badge:{display:"inline-block",background:"rgba(0,200,255,0.1)",border:"1px solid rgba(0,200,255,0.3)",color:"#00c8ff",padding:"5px 18px",borderRadius:20,fontSize:13,letterSpacing:1,marginBottom:14},
  heroTitle:{fontSize:"clamp(26px,5vw,48px)",fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:14,background:"linear-gradient(90deg,#00c8ff,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroSub:{fontSize:16,color:"#7090c0",maxWidth:680,margin:"0 auto",lineHeight:1.7},
  infoCard:{display:"flex",gap:22,background:"rgba(0,200,255,0.05)",border:"1px solid rgba(0,200,255,0.2)",borderRadius:14,padding:26,marginBottom:32,alignItems:"flex-start"},
  infoTitle:{fontSize:20,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:10,color:"#00c8ff"},
  infoText:{fontSize:15,color:"#a0b8d0",lineHeight:1.7},
  statsBanner:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:40},
  statCard:{textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,padding:"22px 14px"},
  statVal:{fontSize:30,fontFamily:"'Orbitron',sans-serif",fontWeight:700,color:"#a78bfa",marginBottom:6},
  statLbl:{fontSize:13,color:"#7090c0",lineHeight:1.4},
  sectionTitle:{fontSize:22,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:20,color:"#e0e8ff"},
  grid4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:12},
  techCard:{background:"rgba(255,255,255,0.03)",border:"1px solid",borderRadius:12,padding:20,cursor:"pointer",transition:"all 0.3s",backdropFilter:"blur(10px)"},
  techTitle:{fontSize:14,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:8},
  techDesc:{fontSize:13,color:"#7090c0",lineHeight:1.6},
  exBox:{marginTop:12,padding:10,background:"rgba(0,0,0,0.3)",borderRadius:6,border:"1px solid"},
  grid2:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10,marginBottom:12},
  rfCard:{display:"flex",gap:12,background:"rgba(255,68,68,0.05)",border:"1px solid rgba(255,68,68,0.15)",borderRadius:10,padding:"12px 14px",alignItems:"flex-start"},
  rfFlag:{fontSize:14,fontWeight:700,color:"#e0e8ff",marginBottom:3},
  rfDetail:{fontSize:13,color:"#7090c0",lineHeight:1.5},
  emailEx:{borderRadius:12,padding:18,marginBottom:14,border:"1px solid"},
  emailPrev:{fontSize:13,color:"#7090c0",background:"rgba(0,0,0,0.25)",borderRadius:7,padding:"10px 12px",lineHeight:1.6,fontStyle:"italic"},
  badge2:{padding:"3px 10px",borderRadius:16,fontSize:11,fontWeight:700,letterSpacing:1,border:"1px solid",flexShrink:0},
  indTag:{fontSize:11,padding:"3px 9px",borderRadius:10,border:"1px solid",background:"rgba(0,0,0,0.2)",fontWeight:600},
  cta:{textAlign:"center",background:"linear-gradient(135deg,rgba(0,200,255,0.07),rgba(124,58,237,0.07))",border:"1px solid rgba(0,200,255,0.2)",borderRadius:18,padding:"36px 28px",marginTop:48},
  ctaTitle:{fontSize:26,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:10},
  ctaSub:{fontSize:15,color:"#7090c0",marginBottom:24},
  ctaBtn:{background:"linear-gradient(135deg,#00c8ff,#7c3aed)",border:"none",color:"#fff",padding:"13px 26px",borderRadius:8,cursor:"pointer",fontSize:15,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1},
  ctaBtn2:{background:"transparent",border:"1px solid rgba(124,58,237,0.4)",color:"#a78bfa",padding:"13px 26px",borderRadius:8,cursor:"pointer",fontSize:15,fontFamily:"'Rajdhani',sans-serif",fontWeight:700},
};
