import { useState, useEffect } from "react";
import { EmailAnalysis } from "../api/entities";

export default function Report() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    EmailAnalysis.list().then(data => {
      setRecords(data.reverse());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const riskColors = {
    PHISHING: { color: "#ff4444", bg: "rgba(255,68,68,0.15)", border: "rgba(255,68,68,0.4)" },
    SUSPICIOUS: { color: "#ffaa00", bg: "rgba(255,170,0,0.15)", border: "rgba(255,170,0,0.4)" },
    SAFE: { color: "#00ff88", bg: "rgba(0,255,136,0.15)", border: "rgba(0,255,136,0.4)" },
  };

  const filtered = records.filter(r => {
    const matchFilter = filter === "ALL" || r.risk_level === filter;
    const matchSearch = !search || r.sender?.toLowerCase().includes(search.toLowerCase()) || r.subject?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: records.length,
    phishing: records.filter(r => r.risk_level === "PHISHING").length,
    suspicious: records.filter(r => r.risk_level === "SUSPICIOUS").length,
    safe: records.filter(r => r.risk_level === "SAFE").length,
  };

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => window.location.href = "/"}><span>🛡️</span><span style={s.logoTxt}>PhishGuard</span></div>
        <div style={s.navLinks}>
          {[["Dashboard","📊"],["Analyzer","🔍"],["Awareness","🎓"],["Guidelines","📋"]].map(([p,i]) => (
            <button key={p} style={s.navBtn} onClick={() => window.location.href = `/${p}`}>{i} {p}</button>
          ))}
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.pageTitle}>📋 Analysis Reports</h1>
            <p style={s.pageSub}>Complete history of all email threat analyses performed on this platform</p>
          </div>
          <button style={s.analyzeBtn} onClick={() => window.location.href = "/Analyzer"}>+ Analyze New Email</button>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            {l:"Total Analyzed",v:stats.total,c:"#00c8ff",bg:"rgba(0,200,255,0.1)",border:"rgba(0,200,255,0.3)",i:"📧"},
            {l:"Phishing",v:stats.phishing,c:"#ff4444",bg:"rgba(255,68,68,0.1)",border:"rgba(255,68,68,0.3)",i:"🎣"},
            {l:"Suspicious",v:stats.suspicious,c:"#ffaa00",bg:"rgba(255,170,0,0.1)",border:"rgba(255,170,0,0.3)",i:"⚠️"},
            {l:"Safe",v:stats.safe,c:"#00ff88",bg:"rgba(0,255,136,0.1)",border:"rgba(0,255,136,0.3)",i:"✅"},
          ].map((x,i) => (
            <div key={i} style={{...s.statCard,background:x.bg,border:`1px solid ${x.border}`}}>
              <div style={{fontSize:26,marginBottom:4}}>{x.i}</div>
              <div style={{...s.statVal,color:x.c}}>{x.v}</div>
              <div style={s.statLbl}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div style={s.controls}>
          <div style={s.searchWrap}>
            <span style={{color:"#506080",marginRight:8}}>🔍</span>
            <input style={s.searchInput} placeholder="Search by sender or subject..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={s.filterBtns}>
            {["ALL","PHISHING","SUSPICIOUS","SAFE"].map(f => (
              <button key={f} style={filter===f ? s.filterActive : s.filterBtn} onClick={() => setFilter(f)}>
                {f === "ALL" ? "All" : f === "PHISHING" ? "🎣 Phishing" : f === "SUSPICIOUS" ? "⚠️ Suspicious" : "✅ Safe"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={s.loading}><div style={s.spinner}/><p>Loading reports...</p></div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{fontSize:56,marginBottom:14}}>📭</div>
            <p style={{color:"#506080",fontSize:17,marginBottom:20}}>
              {records.length === 0 ? "No emails analyzed yet." : "No results match your filter."}
            </p>
            {records.length === 0 && <button style={s.analyzeBtn} onClick={() => window.location.href = "/Analyzer"}>⚡ Analyze Your First Email</button>}
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>{["#","Date","Sender","Subject","Risk Level","Score","Indicators",""].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((r,i) => {
                  const rc = riskColors[r.risk_level] || riskColors.SAFE;
                  return (
                    <tr key={r.id} style={s.tr}>
                      <td style={{...s.td,color:"#506080",fontSize:12}}>{i+1}</td>
                      <td style={s.td}><span style={{fontSize:12}}>{r.created_date ? new Date(r.created_date).toLocaleDateString() : "-"}</span></td>
                      <td style={s.td}><span style={{fontSize:13,color:"#a0b8d0"}}>{(r.sender||"-").substring(0,28)}{r.sender?.length>28?"…":""}</span></td>
                      <td style={s.td}><span style={{fontSize:13}}>{(r.subject||"-").substring(0,35)}{r.subject?.length>35?"…":""}</span></td>
                      <td style={s.td}>
                        <span style={{...s.badge,background:rc.bg,border:`1px solid ${rc.border}`,color:rc.color}}>
                          {r.risk_level==="PHISHING"?"🎣":r.risk_level==="SUSPICIOUS"?"⚠️":"✅"} {r.risk_level}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{...s.scoreBox,color:rc.color,borderColor:rc.border}}>{r.score||0}</span>
                      </td>
                      <td style={s.td}><span style={{fontSize:12,color:"#7090c0"}}>{r.indicators?.length||0} found</span></td>
                      <td style={s.td}>
                        <button style={s.viewBtn} onClick={() => setSelected(selected?.id===r.id ? null : r)}>
                          {selected?.id===r.id ? "▲ Hide" : "▼ View"}
                        </button>
                      </td>
                    </tr>
                  );
                }).reduce((acc, row, i) => {
                  acc.push(row);
                  const r = filtered[i];
                  if (selected?.id === r.id) {
                    const rc = riskColors[r.risk_level] || riskColors.SAFE;
                    acc.push(
                      <tr key={`detail-${r.id}`}>
                        <td colSpan={8} style={{...s.td,padding:0}}>
                          <div style={{...s.detailPanel,background:rc.bg,borderColor:rc.border}}>
                            <div style={s.detailGrid}>
                              <div>
                                <div style={s.detailLabel}>EXPLANATION</div>
                                <p style={s.detailText}>{r.explanation || "No explanation available."}</p>
                                <div style={{...s.detailLabel,marginTop:14}}>RECOMMENDED ACTION</div>
                                <p style={{...s.detailText,color:"#e0e8ff"}}>{r.recommended_action || "-"}</p>
                              </div>
                              <div>
                                <div style={s.detailLabel}>PHISHING INDICATORS ({r.indicators?.length||0})</div>
                                {(r.indicators||[]).length === 0 ? <p style={s.detailText}>None detected</p> : (r.indicators||[]).map((ind,j) => (
                                  <div key={j} style={s.indItem}><span style={{color:rc.color}}>▶</span> {ind}</div>
                                ))}
                              </div>
                            </div>
                            {r.link && <div style={{marginTop:12}}><div style={s.detailLabel}>LINK ANALYZED</div><div style={{fontFamily:"monospace",fontSize:12,color:"#ff8080",marginTop:4,wordBreak:"break-all"}}>{r.link}</div></div>}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return acc;
                }, [])}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;400;600;700&display=swap');*{box-sizing:border-box;}tr:hover td{background:rgba(0,200,255,0.03);}input:focus{outline:none;}@keyframes spin{to{transform:rotate(360deg);}}`}</style>
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
  container:{padding:"90px 32px 60px",maxWidth:1300,margin:"0 auto"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:14},
  pageTitle:{fontSize:28,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:4},
  pageSub:{fontSize:14,color:"#506080"},
  analyzeBtn:{background:"linear-gradient(135deg,#00c8ff,#7c3aed)",border:"none",color:"#fff",padding:"11px 22px",borderRadius:8,cursor:"pointer",fontSize:14,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1},
  statsRow:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24},
  statCard:{borderRadius:12,padding:"18px 16px",textAlign:"center",backdropFilter:"blur(10px)"},
  statVal:{fontSize:30,fontFamily:"'Orbitron',sans-serif",fontWeight:700,marginBottom:4},
  statLbl:{fontSize:12,color:"#7090c0",letterSpacing:1},
  controls:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:14,flexWrap:"wrap"},
  searchWrap:{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(0,200,255,0.15)",borderRadius:8,padding:"8px 14px",flex:1,minWidth:200,maxWidth:360},
  searchInput:{background:"transparent",border:"none",color:"#e0e8ff",fontSize:14,fontFamily:"'Rajdhani',sans-serif",width:"100%"},
  filterBtns:{display:"flex",gap:6,flexWrap:"wrap"},
  filterBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"#7090c0",padding:"7px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,transition:"all 0.2s"},
  filterActive:{background:"rgba(0,200,255,0.15)",border:"1px solid rgba(0,200,255,0.4)",color:"#00c8ff",padding:"7px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:700},
  loading:{textAlign:"center",padding:60,color:"#7090c0"},
  spinner:{width:48,height:48,border:"3px solid rgba(0,200,255,0.2)",borderTop:"3px solid #00c8ff",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"},
  empty:{textAlign:"center",padding:"60px 20px",background:"rgba(255,255,255,0.02)",borderRadius:12,border:"1px solid rgba(0,200,255,0.1)"},
  tableWrap:{overflowX:"auto",borderRadius:12,border:"1px solid rgba(0,200,255,0.12)"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{padding:"12px 14px",textAlign:"left",fontSize:11,color:"#506080",fontWeight:700,letterSpacing:1,textTransform:"uppercase",background:"rgba(0,0,0,0.35)",borderBottom:"1px solid rgba(0,200,255,0.08)",whiteSpace:"nowrap"},
  tr:{borderBottom:"1px solid rgba(0,200,255,0.05)",transition:"background 0.15s"},
  td:{padding:"13px 14px",fontSize:14,color:"#c0d0e0"},
  badge:{padding:"4px 10px",borderRadius:16,fontSize:11,fontWeight:700,letterSpacing:1,whiteSpace:"nowrap"},
  scoreBox:{fontSize:13,fontWeight:700,fontFamily:"'Orbitron',sans-serif",border:"1px solid",borderRadius:4,padding:"2px 8px"},
  viewBtn:{background:"rgba(0,200,255,0.08)",border:"1px solid rgba(0,200,255,0.2)",color:"#00c8ff",padding:"5px 12px",borderRadius:5,cursor:"pointer",fontSize:12,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,whiteSpace:"nowrap"},
  detailPanel:{padding:20,border:"1px solid",borderRadius:0,animation:"fadeIn 0.3s ease"},
  detailGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20},
  detailLabel:{fontSize:11,color:"#506080",letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700},
  detailText:{fontSize:14,color:"#a0b8d0",lineHeight:1.6},
  indItem:{fontSize:13,color:"#a0b8d0",padding:"5px 8px",background:"rgba(0,0,0,0.2)",borderRadius:4,marginBottom:4,display:"flex",gap:8},
};
