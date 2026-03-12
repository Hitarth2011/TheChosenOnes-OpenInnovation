import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  🔑  CONFIG — FILL THESE IN
// ═══════════════════════════════════════════════════════════
const ANTHROPIC_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
const DAILY_API_KEY = "YOUR_DAILY_API_KEY_HERE";
const DAILY_DOMAIN  = "YOUR_SUBDOMAIN.daily.co";

// ── DATA ─────────────────────────────────────────────────
const EXPERTS = [
  { id:1, name:"Anita Sharma",     icon:"👩‍🏫", title:"Retired Principal & Math Expert",  location:"Pune",      exp:35, rate:"₹2,500/hr", rateNum:2500, skills:["Mathematics","Pedagogy","Curriculum"],        rating:4.9, reviews:42, available:true,  img:"https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&q=80", persona:`You are Anita Sharma, a retired school principal with 35 years in mathematics education from Pune, India. You are warm, patient, and methodical. Speak as a wise educator. Keep replies to 2-4 sentences, practical and encouraging.` },
  { id:2, name:"Rajesh Iyer",      icon:"👨‍💼", title:"Former Chief Manager, SBI",         location:"Mumbai",    exp:40, rate:"₹4,000/hr", rateNum:4000, skills:["Finance","Banking","Risk Management"],       rating:4.8, reviews:38, available:true,  img:"https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&q=80", persona:`You are Rajesh Iyer, a retired Chief Manager from SBI with 40 years in banking. You are sharp and precise. Keep replies to 2-4 sentences, data-driven and direct.` },
  { id:3, name:"Col. Vikram Singh", icon:"🎖️", title:"Retired Army Officer – Leadership",  location:"Delhi",     exp:32, rate:"₹3,500/hr", rateNum:3500, skills:["Leadership","Strategy","Operations"],         rating:4.7, reviews:29, available:false, img:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80", persona:`You are Colonel Vikram Singh, a retired Indian Army officer with 32 years of service. You are disciplined and strategic. Keep replies to 2-4 sentences, structured and motivating.` },
  { id:4, name:"Dr. Priya Nair",   icon:"👩‍⚕️", title:"Former AIIMS Cardiologist",          location:"Chennai",   exp:38, rate:"₹6,000/hr", rateNum:6000, skills:["Cardiology","Research","Healthcare"],        rating:5.0, reviews:55, available:true,  img:"https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80", persona:`You are Dr. Priya Nair, a retired AIIMS cardiologist with 38 years in healthcare. You are calm and precise. Keep replies to 2-4 sentences, clear and evidence-based.` },
  { id:5, name:"S. Krishnamurthy", icon:"👨‍💻", title:"Ex-VP Engineering, Infosys",         location:"Bangalore", exp:30, rate:"₹5,000/hr", rateNum:5000, skills:["Software Arch","Agile","Digital"],           rating:4.6, reviews:31, available:true,  img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", persona:`You are S. Krishnamurthy, a retired VP of Engineering from Infosys with 30 years in software. You are analytical and pragmatic. Keep replies to 2-4 sentences, technical but accessible.` },
  { id:6, name:"Meera Joshi",      icon:"👩‍⚖️", title:"Former IAS Officer",                 location:"Jaipur",    exp:28, rate:"₹3,000/hr", rateNum:3000, skills:["Policy","Governance","Urban Planning"],      rating:4.8, reviews:22, available:false, img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", persona:`You are Meera Joshi, a retired IAS Officer with 28 years in public administration. You are articulate and principled. Keep replies to 2-4 sentences, thoughtful and policy-focused.` },
];

const INIT_COMMUNITY = [
  { id:1, user:"Ravi M.",  avatar:"R", expert:"Dr. Priya Nair",    rating:5, text:"Dr. Nair's healthcare insights saved us months of research. Absolutely world-class.", time:"2h ago", likes:12 },
  { id:2, user:"Sneha T.", avatar:"S", expert:"Rajesh Iyer",       rating:5, text:"Rajesh brought clarity to our Series A financial planning. His banking background is invaluable!", time:"5h ago", likes:8 },
  { id:3, user:"Arjun P.", avatar:"A", expert:"Anita Sharma",      rating:4, text:"Brilliant educator. Our curriculum improved dramatically. Very patient and methodical.", time:"1d ago", likes:15 },
  { id:4, user:"Divya K.", avatar:"D", expert:"Col. Vikram Singh", rating:5, text:"The Colonel's leadership training was phenomenal. Our entire team benefited.", time:"2d ago", likes:21 },
  { id:5, user:"Mohit R.", avatar:"M", expert:"S. Krishnamurthy",  rating:4, text:"Technical architecture review was thorough and practical. Really knows enterprise systems.", time:"3d ago", likes:6 },
];

const INIT_INQUIRIES = [
  { id:1, from:"TechStart Inc.",     subject:"Need financial advisory for Series A",      time:"2h ago", status:"new",     thread:[{ sender:"them", text:"Hi, we are looking for financial guidance for our upcoming Series A. Would you be available?", time:"2h ago" }] },
  { id:2, from:"EduBridge Learning", subject:"Curriculum design consultation",            time:"1d ago", status:"read",    thread:[{ sender:"them", text:"We are redesigning our K-12 curriculum and need expert guidance. Can you help?", time:"1d ago" }] },
  { id:3, from:"GovConnect",         subject:"Policy advisory for smart city initiative", time:"3d ago", status:"replied", thread:[{ sender:"them", text:"We need policy expertise for our smart city project.", time:"3d ago" }, { sender:"me", text:"Happy to help! I have extensive experience in urban governance.", time:"2d ago" }] },
];

// ── STYLES ───────────────────────────────────────────────
const S = {
  root:    { fontFamily:"'Segoe UI',sans-serif", background:"#020b18", color:"#e8f4ff", minHeight:"100vh" },
  nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 32px", background:"rgba(2,11,24,0.95)", borderBottom:"1px solid rgba(0,212,255,0.15)", position:"sticky", top:0, zIndex:99 },
  logo:    { fontWeight:800, fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 },
  logoIcon:{ background:"linear-gradient(135deg,#0055aa,#0099ff)", borderRadius:8, padding:"4px 8px" },
  navBtn:  { background:"none", border:"none", color:"#7ba8cc", cursor:"pointer", fontSize:".9rem", padding:"6px 12px", borderRadius:20 },
  navActive:{ color:"#00d4ff" },
  btnP:    { background:"linear-gradient(135deg,#0066cc,#0099ff)", color:"#fff", border:"none", padding:"11px 22px", borderRadius:30, cursor:"pointer", fontWeight:700, fontSize:".9rem" },
  btnO:    { background:"transparent", color:"#00d4ff", border:"1.5px solid rgba(0,212,255,0.4)", padding:"9px 20px", borderRadius:30, cursor:"pointer", fontWeight:600, fontSize:".88rem" },
  btnG:    { background:"rgba(255,255,255,0.04)", color:"#e8f4ff", border:"1.5px solid rgba(0,212,255,0.15)", padding:"11px 22px", borderRadius:30, cursor:"pointer", fontWeight:600, fontSize:".9rem" },
  btnRed:  { background:"linear-gradient(135deg,#cc0000,#ff4444)", color:"#fff", border:"none", padding:"12px 28px", borderRadius:30, cursor:"pointer", fontWeight:700, fontSize:".9rem" },
  card:    { background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22 },
  tag:     { background:"rgba(0,212,255,0.08)", color:"#00d4ff", border:"1px solid rgba(0,212,255,0.2)", fontSize:".72rem", padding:"3px 9px", borderRadius:20 },
  input:   { background:"#0a1e3a", border:"1.5px solid rgba(0,212,255,0.15)", borderRadius:8, color:"#e8f4ff", padding:"10px 13px", fontSize:".9rem", outline:"none", width:"100%", boxSizing:"border-box" },
  label:   { fontSize:".72rem", fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:"#3d6080", display:"block", marginBottom:5 },
  overlay: { position:"fixed", inset:0, background:"rgba(2,11,24,0.92)", backdropFilter:"blur(8px)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
};

const Stars = ({ n, size=14 }) => (
  <span style={{ fontSize:size, letterSpacing:1 }}>
    {[1,2,3,4,5].map(i=><span key={i} style={{ color:i<=n?"#f5a623":"#1a2d44" }}>★</span>)}
  </span>
);

// ══════════════════════════════════════════════════════════
//  AI CHAT
// ══════════════════════════════════════════════════════════
async function askExpert(expert, history, userMsg) {
  const messages = [
    ...history.map(m=>({ role:m.sender==="me"?"user":"assistant", content:m.text })),
    { role:"user", content:userMsg },
  ];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key":ANTHROPIC_KEY, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:300, system:expert.persona, messages }),
  });
  if (!res.ok) { const e=await res.json().catch(()=>({})); throw new Error(e?.error?.message||"API error"); }
  const data = await res.json();
  return data.content?.[0]?.text || "I'm sorry, I couldn't respond just now.";
}

function ChatModal({ expert, onClose }) {
  const [log, setLog]       = useState([{ sender:"them", text:`Hello! I'm ${expert.name}. How can I help you today?`, time:"now" }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [log]);
  useEffect(()=>{ inputRef.current?.focus(); }, []);

  const send = async () => {
    const msg = input.trim();
    if (!msg||loading) return;
    setInput(""); setError("");
    setLog(p=>[...p,{ sender:"me", text:msg, time:"now" }]);
    setLoading(true);
    try {
      const reply = await askExpert(expert, log, msg);
      setLog(p=>[...p,{ sender:"them", text:reply, time:"now" }]);
    } catch(e) {
      setError(e.message.includes("API key")||e.message.includes("auth") ? "⚠️ Invalid API key. Add your Anthropic key at the top of App.js" : "⚠️ "+e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={S.overlay} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.3)", borderRadius:22, width:"100%", maxWidth:500, display:"flex", flexDirection:"column", maxHeight:"88vh", boxShadow:"0 24px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(0,212,255,0.12)", display:"flex", alignItems:"center", gap:14, background:"linear-gradient(135deg,#071528,#0a1e3a)", borderRadius:"22px 22px 0 0" }}>
          <div style={{ width:46, height:46, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(0,212,255,0.4)", flexShrink:0 }}>
            <img src={expert.img} alt={expert.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.style.display="none"; e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:#0a1e3a">${expert.icon}</div>`; }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:"1rem" }}>{expert.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#00ff88", display:"inline-block", boxShadow:"0 0 6px #00ff88" }}/>
              <span style={{ fontSize:".75rem", color:"#7ba8cc" }}>AI-powered · Replies instantly</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#7ba8cc", cursor:"pointer", borderRadius:"50%", width:32, height:32, fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 18px", display:"flex", flexDirection:"column", gap:12 }}>
          {log.map((m,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:m.sender==="me"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
              {m.sender==="them" && <div style={{ width:30, height:30, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:"1.5px solid rgba(0,212,255,0.3)" }}><img src={expert.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.9rem;background:#0a1e3a">${expert.icon}</div>`; }}/></div>}
              <div style={{ maxWidth:"75%", background:m.sender==="me"?"linear-gradient(135deg,#0055cc,#0088ff)":"#0d2040", border:m.sender==="me"?"none":"1px solid rgba(0,212,255,0.15)", padding:"11px 15px", borderRadius:m.sender==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", fontSize:".9rem", lineHeight:1.6 }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", overflow:"hidden", border:"1.5px solid rgba(0,212,255,0.3)" }}><img src={expert.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.9rem;background:#0a1e3a">${expert.icon}</div>`; }}/></div>
              <div style={{ background:"#0d2040", border:"1px solid rgba(0,212,255,0.15)", padding:"12px 16px", borderRadius:"18px 18px 18px 4px", display:"flex", gap:5 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#00d4ff", animation:"bounce 1s infinite", animationDelay:`${i*0.2}s` }}/>)}
              </div>
            </div>
          )}
          {error && <div style={{ background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.3)", color:"#ff8888", borderRadius:10, padding:"10px 14px", fontSize:".85rem" }}>{error}</div>}
          <div ref={endRef}/>
        </div>
        <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(0,212,255,0.1)", display:"flex", gap:9, background:"rgba(2,11,24,0.5)", borderRadius:"0 0 22px 22px" }}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={`Ask ${expert.name.split(" ")[0]} anything…`} disabled={loading} style={{ ...S.input, flex:1, borderRadius:22, padding:"11px 18px", opacity:loading?0.6:1 }}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{ ...S.btnP, padding:"11px 18px", borderRadius:22, opacity:(loading||!input.trim())?0.5:1, minWidth:70 }}>{loading?"…":"Send"}</button>
        </div>
        <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SIMULATED CALL / VIDEO
// ══════════════════════════════════════════════════════════
function SimCallModal({ expert, mode, onClose }) {
  const [state, setState] = useState("ringing");
  const [timer, setTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(()=>{ const t=setTimeout(()=>setState("connected"),2500); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ if(state==="connected"){ timerRef.current=setInterval(()=>setTimer(p=>p+1),1000); } return ()=>clearInterval(timerRef.current); },[state]);

  useEffect(()=>{
    if(mode!=="video"||state!=="connected"||camOff||!canvasRef.current) return;
    const canvas=canvasRef.current; const ctx=canvas.getContext("2d"); let t=0;
    const draw=()=>{
      t+=0.008;
      ctx.fillStyle="#05111f"; ctx.fillRect(0,0,canvas.width,canvas.height);
      const cx=canvas.width/2, cy=canvas.height/2-20;
      const g=ctx.createRadialGradient(cx,cy-30,10,cx,cy-30,80);
      g.addColorStop(0,"rgba(0,180,255,0.18)"); g.addColorStop(1,"rgba(0,60,120,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx+Math.sin(t)*4,cy-30+Math.cos(t*0.7)*3,52,62,0,0,Math.PI*2); ctx.fill();
      const g2=ctx.createRadialGradient(cx,cy+60,20,cx,cy+60,110);
      g2.addColorStop(0,"rgba(0,140,200,0.14)"); g2.addColorStop(1,"rgba(0,30,80,0)");
      ctx.fillStyle=g2; ctx.beginPath(); ctx.ellipse(cx,cy+70,100,55,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="rgba(0,212,255,0.04)"; ctx.lineWidth=1;
      for(let x=0;x<canvas.width;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
      for(let y=0;y<canvas.height;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
      ctx.fillStyle="rgba(0,212,255,0.7)"; ctx.font="bold 11px Segoe UI"; ctx.fillText(expert.name,10,canvas.height-10);
      animRef.current=requestAnimationFrame(draw);
    };
    draw(); return ()=>cancelAnimationFrame(animRef.current);
  },[mode,state,camOff,expert.name]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const end=()=>{ clearInterval(timerRef.current); cancelAnimationFrame(animRef.current); setState("ended"); setTimeout(onClose,1600); };

  return (
    <div style={S.overlay}>
      <div style={{ background:"#060f1e", border:"1px solid rgba(0,212,255,0.25)", borderRadius:24, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 30px 100px rgba(0,0,0,0.85)" }}>
        {mode==="video" && (
          <div style={{ position:"relative", background:"#05111f", height:240 }}>
            {state==="connected"&&!camOff ? <canvas ref={canvasRef} width={440} height={240} style={{ width:"100%", height:"100%", display:"block" }}/> :
              <div style={{ height:240, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
                <div style={{ fontSize:"3.5rem" }}>{expert.icon}</div>
                {state==="ringing"&&<div style={{ color:"#7ba8cc", fontSize:".85rem" }}>Connecting…</div>}
                {camOff&&state==="connected"&&<div style={{ color:"#7ba8cc", fontSize:".85rem" }}>Camera is off</div>}
              </div>}
            {state==="connected"&&<div style={{ position:"absolute", bottom:10, right:10, width:80, height:56, background:"#0a1e3a", border:"1.5px solid rgba(0,212,255,0.4)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>{camOff?"🚫":"🤳"}<div style={{ position:"absolute", bottom:3, right:5, fontSize:".55rem", color:"#00d4ff" }}>You</div></div>}
            {state==="connected"&&<div style={{ position:"absolute", top:10, left:10, background:"rgba(2,11,24,0.75)", backdropFilter:"blur(4px)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:8, padding:"4px 10px", fontSize:".78rem", color:"#00d4ff", fontWeight:600 }}>🔴 {fmt(timer)}</div>}
          </div>
        )}
        {mode==="call" && (
          <div style={{ padding:"40px 24px 24px", textAlign:"center", background:"linear-gradient(180deg,#05111f,#071528)" }}>
            <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
              <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden", border:"3px solid rgba(0,212,255,0.4)", margin:"0 auto", boxShadow:state==="connected"?"0 0 30px rgba(0,212,255,0.35)":"none" }}>
                <img src={expert.img} alt={expert.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.parentNode.innerHTML=`<div style="width:90px;height:90px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:#0a1e3a;border-radius:50%">${expert.icon}</div>`; }}/>
              </div>
              {state==="connected"&&<div style={{ position:"absolute", bottom:2, right:2, width:20, height:20, borderRadius:"50%", background:"#00ff88", border:"2px solid #060f1e", boxShadow:"0 0 8px #00ff88" }}/>}
            </div>
            <div style={{ fontWeight:700, fontSize:"1.2rem", marginBottom:4 }}>{expert.name}</div>
            <div style={{ color:state==="ringing"?"#f5a623":state==="ended"?"#ff6b6b":"#00d4ff", fontSize:".9rem", marginBottom:4 }}>{state==="ringing"?"📳 Connecting…":state==="ended"?"Call Ended":fmt(timer)}</div>
            {state==="connected"&&<div style={{ color:"#3d6080", fontSize:".78rem" }}>Voice call in progress</div>}
          </div>
        )}
        <div style={{ padding:"18px 24px 24px", background:"#071528" }}>
          {state==="connected"&&(
            <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:18 }}>
              {[{ icon:muted?"🔇":"🎙️", label:muted?"Unmute":"Mute", action:()=>setMuted(p=>!p), active:muted }, ...(mode==="video"?[{ icon:camOff?"📷":"📸", label:camOff?"Cam On":"Cam Off", action:()=>setCamOff(p=>!p), active:camOff }]:[]), { icon:speaker?"🔊":"🔈", label:"Speaker", action:()=>setSpeaker(p=>!p), active:!speaker }].map(btn=>(
                <div key={btn.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                  <button onClick={btn.action} style={{ width:52, height:52, borderRadius:"50%", background:btn.active?"rgba(0,212,255,0.15)":"#0a1e3a", border:`1.5px solid ${btn.active?"rgba(0,212,255,0.5)":"rgba(0,212,255,0.2)"}`, fontSize:"1.3rem", cursor:"pointer" }}>{btn.icon}</button>
                  <span style={{ fontSize:".65rem", color:"#3d6080" }}>{btn.label}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"center" }}>
            {state!=="ended" ? <button onClick={end} style={{ ...S.btnRed, padding:"13px 44px" }}>{state==="ringing"?"Cancel":"End "+(mode==="video"?"Video":"Call")}</button>
              : <div style={{ color:"#ff6b6b", fontWeight:600 }}>Call ended</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  REAL VIDEO — Daily.co
// ══════════════════════════════════════════════════════════
function RealVideoModal({ expert, onClose }) {
  const [status, setStatus] = useState("idle");
  const [roomUrl, setRoomUrl] = useState("");
  const [error, setError] = useState("");
  const iframeRef = useRef(null);

  const createRoom = useCallback(async()=>{
    setStatus("creating"); setError("");
    if(DAILY_API_KEY==="YOUR_DAILY_API_KEY_HERE"){ setError("no_key"); setStatus("error"); return; }
    try {
      const res=await fetch("https://api.daily.co/v1/rooms",{ method:"POST", headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${DAILY_API_KEY}` }, body:JSON.stringify({ properties:{ exp:Math.floor(Date.now()/1000)+3600, enable_chat:true } }) });
      if(!res.ok) throw new Error("Failed to create room");
      const room=await res.json(); setRoomUrl(room.url); setStatus("ready");
    } catch(e){ setError(e.message); setStatus("error"); }
  },[]);

  useEffect(()=>{ createRoom(); },[createRoom]);

  return (
    <div style={S.overlay}>
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.25)", borderRadius:22, width:"100%", maxWidth:720, overflow:"hidden", boxShadow:"0 30px 100px rgba(0,0,0,0.85)" }}>
        <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(0,212,255,0.12)", display:"flex", alignItems:"center", gap:12, background:"#060f1e" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", border:"1.5px solid rgba(0,212,255,0.4)" }}><img src={expert.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0a1e3a">${expert.icon}</div>`; }}/></div>
          <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:".95rem" }}>Real Video Call with {expert.name}</div><div style={{ fontSize:".72rem", color:"#7ba8cc" }}>Powered by Daily.co · End-to-end encrypted</div></div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#7ba8cc", cursor:"pointer", borderRadius:"50%", width:30, height:30, fontSize:"1rem" }}>✕</button>
        </div>
        {status==="creating"&&<div style={{ height:380, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}><div style={{ width:48, height:48, border:"3px solid rgba(0,212,255,0.15)", borderTop:"3px solid #00d4ff", borderRadius:"50%", animation:"spin 1s linear infinite" }}/><div style={{ color:"#7ba8cc" }}>Setting up your video room…</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}
        {status==="ready"&&roomUrl&&<iframe ref={iframeRef} src={roomUrl} allow="camera; microphone; fullscreen; display-capture" style={{ width:"100%", height:480, border:"none", display:"block" }} title="Video Call"/>}
        {status==="error"&&(
          <div style={{ padding:"40px 32px", textAlign:"center" }}>
            {error==="no_key"?(<>
              <div style={{ fontSize:"2.5rem", marginBottom:16 }}>🔑</div>
              <div style={{ fontWeight:700, fontSize:"1.1rem", marginBottom:10 }}>Daily.co API Key Needed</div>
              <div style={{ background:"#0a1e3a", border:"1px solid rgba(0,212,255,0.15)", borderRadius:12, padding:20, textAlign:"left", marginBottom:20 }}>
                {[["1","Go to daily.co → Sign up free"],["2","Dashboard → Developers → copy API key"],["3","In App.js, set DAILY_API_KEY = 'your-key'"],["4","Save & refresh — real video calls work!"]].map(([n,s])=>(
                  <div key={n} style={{ display:"flex", gap:10, marginBottom:8, fontSize:".85rem", color:"#7ba8cc" }}><span style={{ color:"#00d4ff", fontWeight:700 }}>{n}.</span>{s}</div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <a href="https://daily.co" target="_blank" rel="noreferrer" style={{ ...S.btnP, textDecoration:"none", display:"inline-block" }}>Open Daily.co →</a>
                <button onClick={onClose} style={S.btnG}>Close</button>
              </div>
            </>):(<><div style={{ color:"#ff8888", marginBottom:16 }}>⚠️ {error}</div><div style={{ display:"flex", gap:10, justifyContent:"center" }}><button onClick={createRoom} style={S.btnP}>Retry</button><button onClick={onClose} style={S.btnG}>Close</button></div></>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  CONTACT BUTTONS (4 ways to approach expert)
// ══════════════════════════════════════════════════════════
function ContactButtons({ expert }) {
  const [modal, setModal] = useState(null);
  return (
    <>
      {modal==="chat"      && <ChatModal      expert={expert} onClose={()=>setModal(null)}/>}
      {modal==="call"      && <SimCallModal   expert={expert} mode="call"  onClose={()=>setModal(null)}/>}
      {modal==="video"     && <SimCallModal   expert={expert} mode="video" onClose={()=>setModal(null)}/>}
      {modal==="realvideo" && <RealVideoModal expert={expert} onClose={()=>setModal(null)}/>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:7 }}>
        {[{ key:"call", icon:"📞", label:"Call" },{ key:"chat", icon:"💬", label:"AI Chat" },{ key:"video", icon:"🎥", label:"Video" },{ key:"realvideo", icon:"🌐", label:"Live Meet" }].map(btn=>(
          <button key={btn.key} onClick={()=>setModal(btn.key)}
            style={{ background:"#0a1e3a", border:"1px solid rgba(0,212,255,0.2)", borderRadius:10, padding:"10px 4px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(0,212,255,0.55)"; e.currentTarget.style.background="#0d2444"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(0,212,255,0.2)"; e.currentTarget.style.background="#0a1e3a"; }}>
            <span style={{ fontSize:"1.15rem" }}>{btn.icon}</span>
            <span style={{ fontSize:".63rem", color:"#7ba8cc" }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
//  NOTIFICATIONS BELL
// ══════════════════════════════════════════════════════════
function NotificationBell({ go }) {
  const [open, setOpen]   = useState(false);
  const [notifs, setNotifs] = useState([
    { id:1, icon:"💬", text:"Rajesh Iyer replied to your inquiry",        time:"2m ago",  read:false, pg:"dashboard" },
    { id:2, icon:"🏆", text:"Dr. Priya Nair accepted your session request", time:"1h ago",  read:false, pg:"hired" },
    { id:3, icon:"📅", text:"Session with Anita Sharma is tomorrow at 10am", time:"3h ago", read:true,  pg:"hired" },
    { id:4, icon:"⭐", text:"New expert joined: S. Krishnamurthy",           time:"1d ago",  read:true,  pg:"experts" },
  ]);
  const ref = useRef(null);
  useEffect(()=>{
    const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h);
  },[]);
  const unread = notifs.filter(n=>!n.read).length;
  const markAll = ()=>setNotifs(p=>p.map(n=>({...n,read:true})));

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={()=>setOpen(!open)} style={{ width:36, height:36, borderRadius:"50%", background:open?"linear-gradient(135deg,#0044aa,#0099ff)":"#0a1e3a", border:"1.5px solid rgba(0,212,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", boxShadow:open?"0 0 14px rgba(0,212,255,0.5)":"none" }}>
        <span style={{ fontSize:"1.1rem" }}>🔔</span>
        {unread>0&&<div style={{ position:"absolute", top:-3, right:-3, width:16, height:16, borderRadius:"50%", background:"#ff4444", border:"2px solid #020b18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", fontWeight:800, color:"white" }}>{unread}</div>}
      </div>
      {open&&(
        <div style={{ position:"absolute", top:44, right:0, background:"#071528", border:"1px solid rgba(0,212,255,0.25)", borderRadius:16, width:300, boxShadow:"0 12px 40px rgba(0,0,0,0.5)", zIndex:300, overflow:"hidden" }}>
          <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(0,212,255,0.12)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, fontSize:".95rem" }}>Notifications</span>
            {unread>0&&<button onClick={markAll} style={{ background:"none", border:"none", color:"#00d4ff", cursor:"pointer", fontSize:".75rem" }}>Mark all read</button>}
          </div>
          {notifs.map(n=>(
            <div key={n.id} onClick={()=>{ setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x)); go(n.pg); setOpen(false); }}
              style={{ padding:"12px 16px", borderBottom:"1px solid rgba(0,212,255,0.08)", cursor:"pointer", background:n.read?"transparent":"rgba(0,212,255,0.04)", display:"flex", gap:10, alignItems:"flex-start" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,0.07)"}
              onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(0,212,255,0.04)"}>
              <span style={{ fontSize:"1.2rem", marginTop:1 }}>{n.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:".83rem", color:"#e8f4ff", lineHeight:1.4, marginBottom:3 }}>{n.text}</div>
                <div style={{ fontSize:".72rem", color:"#3d6080" }}>{n.time}</div>
              </div>
              {!n.read&&<div style={{ width:8, height:8, borderRadius:"50%", background:"#00d4ff", marginTop:4, flexShrink:0 }}/>}
            </div>
          ))}
          <div style={{ padding:"10px 16px", textAlign:"center" }}>
            <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", color:"#00d4ff", cursor:"pointer", fontSize:".82rem" }}>View all</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  AVATAR DROPDOWN
// ══════════════════════════════════════════════════════════
function AvatarMenu({ go }) {
  const [open, setOpen]   = useState(false);
  const [toast, setToast] = useState("");
  const ref = useRef(null);
  useEffect(()=>{
    const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h);
  },[]);
  const showToast=msg=>{ setToast(msg); setTimeout(()=>setToast(""),2500); };
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={()=>setOpen(!open)} style={{ width:36, height:36, borderRadius:"50%", background:open?"linear-gradient(135deg,#0044aa,#0099ff)":"#0a1e3a", border:"1.5px solid rgba(0,212,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".85rem", color:"#00d4ff", cursor:"pointer", boxShadow:open?"0 0 14px rgba(0,212,255,0.5)":"none" }}>A</div>
      {open&&(
        <div style={{ position:"absolute", top:44, right:0, background:"#071528", border:"1px solid rgba(0,212,255,0.25)", borderRadius:14, padding:8, minWidth:200, boxShadow:"0 12px 40px rgba(0,0,0,0.6)", zIndex:200 }}>
          <div style={{ padding:"10px 14px 12px", borderBottom:"1px solid rgba(0,212,255,0.1)", marginBottom:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0044aa,#0099ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"white" }}>A</div>
              <div><div style={{ fontWeight:700, fontSize:".92rem" }}>Avani</div><div style={{ color:"#3d6080", fontSize:".75rem" }}>avani@email.com</div></div>
            </div>
          </div>
          {[["👤","My Profile","dashboard"],["📨","Inquiries","dashboard"],["🏆","Hired Experts","hired"],["💬","Community","community"]].map(([icon,label,pg])=>(
            <div key={label} onClick={()=>{ go(pg); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:9, cursor:"pointer", fontSize:".88rem", color:"#7ba8cc" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,212,255,0.07)"; e.currentTarget.style.color="#e8f4ff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#7ba8cc"; }}>
              <span>{icon}</span>{label}
            </div>
          ))}
          <div style={{ borderTop:"1px solid rgba(0,212,255,0.1)", marginTop:6, paddingTop:6 }}>
            <div onClick={()=>{ setOpen(false); showToast("🚪 Logged out!"); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:9, cursor:"pointer", fontSize:".88rem", color:"#ff6b6b" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,80,80,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span>🚪</span> Log Out
            </div>
          </div>
        </div>
      )}
      {toast&&<div style={{ position:"fixed", bottom:28, right:28, background:"#071528", border:"1px solid rgba(0,212,255,0.3)", borderRadius:12, padding:"13px 20px", color:"#e8f4ff", fontSize:".9rem", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", zIndex:9999 }}>{toast}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════
function Navbar({ page, go }) {
  return (
    <nav style={S.nav}>
      <div style={S.logo} onClick={()=>go("home")}><span style={S.logoIcon}>SI</span> Second Innings</div>
      <div style={{ display:"flex", gap:8 }}>
        {[["experts","Find Experts"],["how","How it Works"],["community","Community"]].map(([p,l])=>(
          <button key={p} style={{...S.navBtn,...(page===p?S.navActive:{})}} onClick={()=>go(p)}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <button style={S.btnO} onClick={()=>go("dashboard")}>Dashboard</button>
        <NotificationBell go={go}/>
        <AvatarMenu go={go}/>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════════
function Home({ go }) {
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 32px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", marginBottom:64 }}>
        <div>
          <div style={{ display:"inline-block", background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.2)", color:"#00d4ff", fontSize:".73rem", fontWeight:600, padding:"6px 13px", borderRadius:30, marginBottom:20 }}>✦ Verified Professionals · Flexible Engagements</div>
          <h1 style={{ fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, lineHeight:1.12, marginBottom:16 }}>Your experience<br/>is your<br/><span style={{ color:"#f5a623", fontStyle:"italic" }}>greatest asset.</span></h1>
          <p style={{ color:"#7ba8cc", fontSize:".97rem", lineHeight:1.7, marginBottom:28, maxWidth:460 }}>Connect with startups, students, and businesses who need your decades of wisdom.</p>
          <div style={{ display:"flex", gap:12, marginBottom:36 }}>
            <button style={S.btnP} onClick={()=>go("experts")}>Find an Expert →</button>
            <button style={S.btnG} onClick={()=>go("forbusiness")}>For Business</button>
          </div>
          <div style={{ display:"flex", gap:16, background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:14, padding:"16px 20px", width:"fit-content" }}>
            {[["1,200+","Mentorship Hours"],["850+","Verified Experts"],["300+","Businesses Served"]].map(([n,l],i)=>(
              <div key={l} style={{ display:"contents" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"1.4rem", fontWeight:800, color:"#00d4ff" }}>{n}</div>
                  <div style={{ fontSize:".7rem", color:"#3d6080", marginTop:2 }}>{l}</div>
                </div>
                {i<2&&<div style={{ width:1, height:32, background:"rgba(0,212,255,0.12)" }}/>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,100,220,0.35),transparent 70%)", top:0, left:20, filter:"blur(48px)", pointerEvents:"none" }}/>
          <div style={{ position:"relative", borderRadius:28, overflow:"hidden", border:"1.5px solid rgba(0,212,255,0.35)", boxShadow:"0 0 50px rgba(0,100,220,0.25)" }}>
            <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=700&q=80" alt="Senior professional mentoring" style={{ width:"100%", height:360, objectFit:"cover", objectPosition:"center top", display:"block" }} onError={e=>{ e.target.style.display="none"; e.target.parentNode.innerHTML=`<div style="height:360px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:#071528">👴💼</div>`; }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(2,11,24,0.5),transparent 60%)" }}/>
            <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(2,11,24,0.82)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,212,255,0.25)", borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:"1.3rem" }}>🎓</span>
              <div><div style={{ fontSize:".68rem", color:"#3d6080" }}>Mentorship</div><div style={{ fontWeight:700, color:"#00d4ff", fontSize:".95rem" }}>1,200+ Hours</div></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:64 }}>
        {[
          { icon:"🔍", n:"01", title:"Discover Experts",  desc:"Browse verified retired professionals with ratings." },
          { icon:"💬", n:"02", title:"Chat, Call & Meet", desc:"AI chat, voice call, or live video — your choice." },
          { icon:"🚀", n:"03", title:"Book & Pay",        desc:"Schedule sessions and pay securely in minutes." },
        ].map(s=>(
          <div key={s.n} style={{...S.card, cursor:"default"}}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}><span style={{ fontSize:"1.6rem" }}>{s.icon}</span><span style={{ fontSize:"1.8rem", fontWeight:800, color:"rgba(0,212,255,0.1)" }}>{s.n}</span></div>
            <div style={{ fontWeight:700, marginBottom:8 }}>{s.title}</div>
            <p style={{ color:"#7ba8cc", fontSize:".87rem", lineHeight:1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background:"linear-gradient(135deg,#071d3d,#0a2a5c)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:24, padding:"56px 48px", textAlign:"center" }}>
        <h2 style={{ fontSize:"2rem", fontWeight:800, marginBottom:12 }}>Ready to start your next chapter?</h2>
        <p style={{ color:"#7ba8cc", marginBottom:28 }}>Join thousands of retired professionals making a difference.</p>
        <button style={{...S.btnP, padding:"14px 34px", fontSize:"1rem"}} onClick={()=>go("dashboard")}>Create Your Profile Today ✦</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  FOR BUSINESS
// ══════════════════════════════════════════════════════════
function ForBusiness({ go }) {
  const [form,setForm] = useState({ company:"", industry:"", size:"", need:"", budget:"", contact:"" });
  const [submitted,setSubmitted] = useState(false);
  const fc = e=>setForm({...form,[e.target.name]:e.target.value});
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 32px" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"inline-block", background:"rgba(245,166,35,0.1)", border:"1px solid rgba(245,166,35,0.3)", color:"#f5a623", fontSize:".73rem", fontWeight:600, padding:"6px 13px", borderRadius:30, marginBottom:16 }}>🏢 For Businesses & Startups</div>
        <h1 style={{ fontSize:"2.4rem", fontWeight:800, marginBottom:12 }}>Hire Seasoned Experts<br/>for Your Business</h1>
        <p style={{ color:"#7ba8cc", maxWidth:560, margin:"0 auto" }}>Access decades of industry expertise. Our experts have built and scaled companies — let them help yours.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:40 }}>
        {[{ icon:"⚡",title:"Fractional Leadership",desc:"Hire a CFO, CTO or CMO part-time." },{ icon:"🎯",title:"Project Advisory",desc:"One-time strategic reviews and consulting." },{ icon:"🏫",title:"Team Training",desc:"Corporate workshops by industry veterans." },{ icon:"🤝",title:"Board Advisory",desc:"Add experienced voices to your advisory board." }].map(b=>(
          <div key={b.title} style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22 }}>
            <div style={{ fontSize:"1.8rem", marginBottom:10 }}>{b.icon}</div>
            <div style={{ fontWeight:700, marginBottom:6 }}>{b.title}</div>
            <div style={{ color:"#7ba8cc", fontSize:".87rem", lineHeight:1.6 }}>{b.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.2)", borderRadius:20, padding:32 }}>
        <h2 style={{ fontWeight:800, fontSize:"1.4rem", marginBottom:6 }}>Get a Custom Match</h2>
        <p style={{ color:"#7ba8cc", fontSize:".88rem", marginBottom:24 }}>Tell us your needs — we'll match you within 24 hours.</p>
        {submitted?(
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:"3rem", marginBottom:14 }}>✅</div>
            <div style={{ fontWeight:700, fontSize:"1.2rem", marginBottom:8 }}>Request Submitted!</div>
            <div style={{ color:"#7ba8cc" }}>Our team will match you with the perfect expert within 24 hours.</div>
            <button style={{...S.btnP, marginTop:20}} onClick={()=>go("experts")}>Browse Experts Now</button>
          </div>
        ):(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {[["company","Company Name"],["industry","Industry"],["contact","Your Email"]].map(([n,l])=>(
                <div key={n}><label style={S.label}>{l}</label><input name={n} value={form[n]} onChange={fc} style={S.input}/></div>
              ))}
              <div><label style={S.label}>Company Size</label><select name="size" value={form.size} onChange={fc} style={S.input}><option value="">Select...</option>{["1-10","11-50","51-200","201-500","500+"].map(o=><option key={o}>{o}</option>)}</select></div>
              <div style={{ gridColumn:"1/-1" }}><label style={S.label}>What do you need help with?</label><textarea name="need" value={form.need} onChange={fc} rows={3} placeholder="e.g. Financial strategy, Tech audit…" style={{...S.input,resize:"vertical"}}/></div>
              <div><label style={S.label}>Monthly Budget</label><select name="budget" value={form.budget} onChange={fc} style={S.input}><option value="">Select...</option>{["Under ₹20,000","₹20,000–50,000","₹50,000–1,00,000","₹1,00,000+"].map(o=><option key={o}>{o}</option>)}</select></div>
            </div>
            <button style={{...S.btnP, padding:"12px 32px"}} onClick={()=>{ if(form.company&&form.need) setSubmitted(true); }}>Find My Expert →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  FIND EXPERTS
// ══════════════════════════════════════════════════════════
function FindExperts({ go, pick, hired, onHire }) {
  const [q,setQ] = useState(""); const [f,setF] = useState("All");
  const filtered = EXPERTS.filter(e=>{
    const match = !q||e.name.toLowerCase().includes(q)||e.title.toLowerCase().includes(q)||e.skills.some(s=>s.toLowerCase().includes(q));
    const fm = f==="All"||e.skills.some(s=>s.toLowerCase().includes(f.toLowerCase()))||e.title.toLowerCase().includes(f.toLowerCase());
    return match&&fm;
  });
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px" }}>
      <h1 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:10 }}>Find the Right Expert</h1>
      <p style={{ color:"#7ba8cc", marginBottom:24 }}>Browse our community of seasoned professionals.</p>
      <div style={{ display:"flex", alignItems:"center", gap:10, background:"#071528", border:"1.5px solid rgba(0,212,255,0.15)", borderRadius:30, padding:"10px 18px", marginBottom:14 }}>
        <span>🔍</span>
        <input style={{ background:"none", border:"none", outline:"none", color:"#e8f4ff", fontSize:".92rem", flex:1 }} placeholder="Search by role, skill, or name…" value={q} onChange={e=>setQ(e.target.value.toLowerCase())}/>
        {q&&<button onClick={()=>setQ("")} style={{ background:"none", border:"none", color:"#3d6080", cursor:"pointer" }}>✕</button>}
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:28, flexWrap:"wrap" }}>
        {["All","Finance","Education","Healthcare","Technology","Leadership"].map(chip=>(
          <button key={chip} onClick={()=>setF(chip)} style={{ padding:"6px 14px", borderRadius:30, border:`1px solid ${f===chip?"rgba(0,212,255,0.4)":"rgba(0,212,255,0.12)"}`, background:f===chip?"rgba(0,212,255,0.1)":"transparent", color:f===chip?"#00d4ff":"#7ba8cc", cursor:"pointer", fontSize:".8rem" }}>{chip}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {filtered.map(e=>(
          <div key={e.id} style={{ ...S.card, position:"relative", cursor:"default" }}
            onMouseEnter={ev=>ev.currentTarget.style.borderColor="rgba(0,212,255,0.4)"}
            onMouseLeave={ev=>ev.currentTarget.style.borderColor="rgba(0,212,255,0.12)"}>
            {hired.includes(e.id)&&<div style={{ position:"absolute", top:12, right:12, background:"rgba(80,200,80,0.15)", border:"1px solid rgba(80,200,80,0.4)", color:"#5cc85c", fontSize:".65rem", fontWeight:700, padding:"2px 8px", borderRadius:10 }}>HIRED</div>}
            <div style={{ display:"flex", gap:11, alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", overflow:"hidden", border:"1.5px solid rgba(0,212,255,0.35)", flexShrink:0 }}><img src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={ev=>{ ev.target.parentNode.innerHTML=`<div style="width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:#0a1e3a;border-radius:50%">${e.icon}</div>`; }}/></div>
              <div>
                <div style={{ fontWeight:700, fontSize:".95rem" }}>{e.name}</div>
                <div style={{ color:"#7ba8cc", fontSize:".77rem" }}>{e.title}</div>
                <div style={{ marginTop:3 }}><Stars n={Math.floor(e.rating)}/> <span style={{ fontSize:".72rem", color:"#3d6080" }}>({e.reviews})</span></div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, color:"#3d6080", fontSize:".78rem", marginBottom:10 }}>
              <span>📍 {e.location}</span><span>⚡ {e.exp} yrs</span>
              <span style={{ color:e.available?"#5cc85c":"#ff6b6b" }}>{e.available?"● Available":"● Busy"}</span>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
              {e.skills.slice(0,2).map(s=><span key={s} style={S.tag}>{s}</span>)}
            </div>
            <button style={{...S.btnP, padding:"9px 14px", fontSize:".8rem", width:"100%", marginBottom:8}} onClick={()=>{ pick(e); go("profile"); }}>View Profile →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  HOW IT WORKS
// ══════════════════════════════════════════════════════════
function HowItWorks({ go }) {
  const [open,setOpen] = useState(null);
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"40px 32px" }}>
      <h1 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:12, textAlign:"center" }}>How Second Innings Works</h1>
      <p style={{ color:"#7ba8cc", textAlign:"center", marginBottom:48 }}>A dignified platform for seasoned experts.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:52 }}>
        {[{ n:"01",icon:"🔍",title:"Discover Experts",desc:"Browse thousands of verified retired professionals." },{ n:"02",icon:"💬",title:"AI Chat Instantly",desc:"Chat powered by AI — the expert replies in-character, instantly." },{ n:"03",icon:"📅",title:"Book a Session",desc:"Pick a date and time slot — scheduling takes under a minute." },{ n:"04",icon:"💳",title:"Pay Securely",desc:"Pay via UPI, card or wallet. Get a booking confirmation instantly." }].map(s=>(
          <div key={s.n} style={{ display:"flex", gap:18, alignItems:"center", background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:"20px 22px" }}>
            <div style={{ width:50, height:50, background:"#0a1e3a", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:".72rem", fontWeight:700, color:"#00d4ff", letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>Step {s.n}</div>
              <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:3 }}>{s.title}</div>
              <div style={{ color:"#7ba8cc", fontSize:".88rem" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize:"1.6rem", fontWeight:700, textAlign:"center", marginBottom:20 }}>Common Questions</h2>
      {[{ q:"Is the AI chat really intelligent?",a:"Yes! It uses Claude AI and replies as the expert, in character." },{ q:"How do real video calls work?",a:"Via Daily.co (free tier). Add your API key to App.js." },{ q:"Is browsing free?",a:"Yes! You pay only when you book a session." },{ q:"Can I cancel a booking?",a:"Yes, with 48 hours notice for a full refund." }].map((faq,i)=>(
        <div key={i} onClick={()=>setOpen(open===i?null:i)} style={{ background:"#071528", border:`1px solid ${open===i?"rgba(0,212,255,0.35)":"rgba(0,212,255,0.12)"}`, borderRadius:12, padding:"15px 18px", marginBottom:9, cursor:"pointer" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:600, fontSize:".93rem" }}><span>{faq.q}</span><span style={{ color:"#00d4ff" }}>{open===i?"−":"+"}</span></div>
          {open===i&&<div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(0,212,255,0.1)", color:"#7ba8cc", fontSize:".87rem" }}>{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SCHEDULE PAGE
// ══════════════════════════════════════════════════════════
function SchedulePage({ expert, go, goPayment }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmed,    setConfirmed]    = useState(false);

  const today = new Date();
  const days  = [];
  for(let i=1; i<=14; i++){ const d=new Date(today); d.setDate(today.getDate()+i); days.push(d); }
  const slots    = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if(confirmed) return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"60px 32px", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(80,200,80,0.1)", border:"2px solid rgba(80,200,80,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem", margin:"0 auto 20px" }}>✅</div>
      <h2 style={{ fontWeight:800, fontSize:"1.6rem", marginBottom:8 }}>Session Scheduled!</h2>
      <p style={{ color:"#7ba8cc", marginBottom:24 }}>Your session has been confirmed. Proceed to payment to complete your booking.</p>
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.15)", borderRadius:14, padding:20, textAlign:"left", marginBottom:24 }}>
        {[["Expert",expert?.name||"—"],["Date",selectedDate?`${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`:"—"],["Time",selectedTime||"—"],["Duration","1 Hour"],["Rate",expert?.rate||"—"]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(0,212,255,0.08)", fontSize:".88rem" }}>
            <span style={{ color:"#7ba8cc" }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button style={{ background:"linear-gradient(135deg,#007700,#00aa44)", color:"#fff", border:"none", padding:"13px 28px", borderRadius:30, cursor:"pointer", fontWeight:700, fontSize:"1rem" }} onClick={()=>goPayment()}>💳 Proceed to Pay</button>
        <button style={S.btnG} onClick={()=>go("home")}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 32px" }}>
      <button onClick={()=>go("profile")} style={{ background:"none", border:"none", color:"#7ba8cc", cursor:"pointer", fontSize:".87rem", marginBottom:20 }}>← Back to Profile</button>
      <h1 style={{ fontSize:"2rem", fontWeight:800, marginBottom:6 }}>Schedule a Session</h1>
      {expert&&<p style={{ color:"#7ba8cc", marginBottom:28 }}>with <span style={{ color:"#00d4ff", fontWeight:600 }}>{expert.name}</span> · <span style={{ color:"#f5a623" }}>{expert.rate}</span></p>}

      {/* Date */}
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22, marginBottom:18 }}>
        <div style={{ fontWeight:700, marginBottom:16 }}>📅 Pick a Date <span style={{ color:"#3d6080", fontSize:".78rem", fontWeight:400 }}>(weekdays only)</span></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:8 }}>
          {dayNames.map(d=><div key={d} style={{ textAlign:"center", fontSize:".68rem", fontWeight:700, color:"#3d6080", paddingBottom:4 }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
          {days.map((d,i)=>{
            const isSel  = selectedDate&&d.toDateString()===selectedDate.toDateString();
            const isWknd = d.getDay()===0||d.getDay()===6;
            return (
              <div key={i} onClick={()=>!isWknd&&setSelectedDate(d)}
                style={{ textAlign:"center", padding:"9px 2px", borderRadius:9, cursor:isWknd?"not-allowed":"pointer", background:isSel?"linear-gradient(135deg,#0066cc,#0099ff)":isWknd?"transparent":"#0a1e3a", color:isSel?"#fff":isWknd?"#1a2d44":"#e8f4ff", fontSize:".82rem", fontWeight:isSel?700:400, border:`1px solid ${isSel?"rgba(0,212,255,0.5)":"transparent"}`, opacity:isWknd?0.3:1, transition:"all .15s" }}>
                <div style={{ fontSize:".58rem", color:isSel?"rgba(255,255,255,0.7)":"#3d6080", marginBottom:1 }}>{months[d.getMonth()]}</div>
                {d.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time */}
      {selectedDate&&(
        <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22, marginBottom:18 }}>
          <div style={{ fontWeight:700, marginBottom:14 }}>🕐 Pick a Time — <span style={{ color:"#00d4ff" }}>{dayNames[selectedDate.getDay()]}, {selectedDate.getDate()} {months[selectedDate.getMonth()]}</span></div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9 }}>
            {slots.map(t=>{
              const isSel = selectedTime===t;
              return <div key={t} onClick={()=>setSelectedTime(t)} style={{ textAlign:"center", padding:"11px 4px", borderRadius:10, cursor:"pointer", background:isSel?"linear-gradient(135deg,#0066cc,#0099ff)":"#0a1e3a", color:isSel?"#fff":"#e8f4ff", fontSize:".83rem", fontWeight:isSel?700:400, border:`1px solid ${isSel?"rgba(0,212,255,0.5)":"rgba(0,212,255,0.1)"}`, transition:"all .15s" }}>{t}</div>;
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedDate&&selectedTime&&(
        <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:14, padding:18, marginBottom:18 }}>
          <div style={{ fontWeight:700, marginBottom:10 }}>📋 Session Summary</div>
          {[["Expert",expert?.name||"—"],["Date",`${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`],["Time",selectedTime],["Duration","1 Hour"],["Rate",expert?.rate||"—"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(0,212,255,0.07)", fontSize:".88rem" }}>
              <span style={{ color:"#7ba8cc" }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <button style={{ background:"linear-gradient(135deg,#0066cc,#0099ff)", color:"#fff", border:"none", padding:"13px", borderRadius:30, cursor:"pointer", fontWeight:700, fontSize:"1rem", width:"100%", opacity:(!selectedDate||!selectedTime)?0.4:1 }}
        onClick={()=>{ if(selectedDate&&selectedTime) setConfirmed(true); }}>
        Confirm Schedule →
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAYMENT PAGE
// ══════════════════════════════════════════════════════════
function PaymentPage({ expert, go }) {
  const [step,  setStep]   = useState(1);
  const [plan,  setPlan]   = useState(null);
  const [method,setMethod] = useState("upi");
  const [upiId, setUpiId]  = useState("");
  const [card,  setCard]   = useState({ num:"", name:"", exp:"", cvv:"" });
  const [paying,setPaying] = useState(false);
  const [bookId,setBookId] = useState("");

  const plans = [
    { id:"session", label:"Single Session",  price:expert?.rate||"₹3,000/hr", icon:"⚡", desc:"1-on-1 session, 1 hour" },
    { id:"monthly", label:"Monthly Retainer",price:"₹15,000/mo",              icon:"📅", desc:"8 sessions per month"  },
    { id:"project", label:"Project Based",   price:"₹40,000",                 icon:"🚀", desc:"Full project engagement" },
  ];

  const pay = ()=>{
    setPaying(true);
    setTimeout(()=>{ setPaying(false); setBookId("SI-"+Math.floor(Math.random()*900000+100000)); setStep(3); }, 2200);
  };

  const inputStyle = { background:"#0a1e3a", border:"1.5px solid rgba(0,212,255,0.15)", borderRadius:8, color:"#e8f4ff", padding:"10px 13px", fontSize:".9rem", outline:"none", width:"100%", boxSizing:"border-box" };

  return (
    <div style={{ maxWidth:620, margin:"0 auto", padding:"40px 32px" }}>
      <button onClick={()=>go(expert?"profile":"experts")} style={{ background:"none", border:"none", color:"#7ba8cc", cursor:"pointer", fontSize:".87rem", marginBottom:20 }}>← Back</button>
      <h1 style={{ fontSize:"2rem", fontWeight:800, marginBottom:6 }}>Book a Session</h1>
      {expert&&<p style={{ color:"#7ba8cc", marginBottom:28 }}>with <span style={{ color:"#00d4ff", fontWeight:600 }}>{expert.name}</span></p>}

      {/* Steps */}
      <div style={{ display:"flex", gap:0, marginBottom:32, background:"#071528", borderRadius:12, padding:4, border:"1px solid rgba(0,212,255,0.12)" }}>
        {[["1","Choose Plan"],["2","Payment"],["3","Confirm"]].map(([n,l],i)=>(
          <div key={n} style={{ flex:1, textAlign:"center", padding:"9px 4px", borderRadius:9, background:step===i+1?"linear-gradient(135deg,#0066cc,#0099ff)":"transparent", transition:"all .2s" }}>
            <div style={{ fontWeight:700, fontSize:".82rem", color:step===i+1?"white":"#3d6080" }}>{n}. {l}</div>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step===1&&(
        <div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
            {plans.map(p=>(
              <div key={p.id} onClick={()=>setPlan(p.id)} style={{ background:plan===p.id?"rgba(0,80,180,0.15)":"#071528", border:`1.5px solid ${plan===p.id?"rgba(0,212,255,0.6)":"rgba(0,212,255,0.12)"}`, borderRadius:14, padding:18, cursor:"pointer", display:"flex", alignItems:"center", gap:16, transition:"all .2s" }}>
                <div style={{ width:48, height:48, borderRadius:12, background:plan===p.id?"linear-gradient(135deg,#0055cc,#0099ff)":"#0a1e3a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>{p.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, marginBottom:3 }}>{p.label}</div>
                  <div style={{ color:"#7ba8cc", fontSize:".83rem" }}>{p.desc}</div>
                </div>
                <div style={{ fontWeight:800, color:"#00d4ff", fontSize:"1.05rem", whiteSpace:"nowrap" }}>{p.price}</div>
                <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${plan===p.id?"#00d4ff":"rgba(0,212,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {plan===p.id&&<div style={{ width:10, height:10, borderRadius:"50%", background:"#00d4ff" }}/>}
                </div>
              </div>
            ))}
          </div>
          <button style={{ ...S.btnP, width:"100%", padding:"14px", fontSize:"1rem", opacity:plan?1:0.4 }} onClick={()=>{ if(plan) setStep(2); }}>Continue to Payment →</button>
        </div>
      )}

      {/* Step 2 */}
      {step===2&&(
        <div>
          {/* Selected plan summary */}
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:"1.5rem" }}>{plans.find(p=>p.id===plan)?.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700 }}>{plans.find(p=>p.id===plan)?.label}</div>
              <div style={{ color:"#7ba8cc", fontSize:".83rem" }}>{plans.find(p=>p.id===plan)?.desc}</div>
            </div>
            <div style={{ fontWeight:800, color:"#00d4ff", fontSize:"1.1rem" }}>{plans.find(p=>p.id===plan)?.price}</div>
          </div>

          {/* Payment method */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {[["upi","📱 UPI"],["card","💳 Card"],["wallet","👛 Wallet"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMethod(m)} style={{ flex:1, padding:"10px 8px", borderRadius:10, border:`1.5px solid ${method===m?"rgba(0,212,255,0.5)":"rgba(0,212,255,0.12)"}`, background:method===m?"rgba(0,212,255,0.1)":"#071528", color:method===m?"#00d4ff":"#7ba8cc", cursor:"pointer", fontWeight:600, fontSize:".82rem" }}>{l}</button>
            ))}
          </div>

          {method==="upi"&&(
            <div style={{ marginBottom:20 }}>
              <label style={S.label}>UPI ID</label>
              <input value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@upi" style={inputStyle}/>
              <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
                {["GPay","PhonePe","Paytm","BHIM"].map(app=>(
                  <button key={app} onClick={()=>setUpiId(app.toLowerCase()+"@ok")} style={{ padding:"7px 14px", borderRadius:20, background:"#0a1e3a", border:"1px solid rgba(0,212,255,0.15)", color:"#7ba8cc", cursor:"pointer", fontSize:".8rem" }}>{app}</button>
                ))}
              </div>
            </div>
          )}

          {method==="card"&&(
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              <div><label style={S.label}>Card Number</label><input value={card.num} onChange={e=>setCard({...card,num:e.target.value})} placeholder="1234 5678 9012 3456" maxLength={19} style={inputStyle}/></div>
              <div><label style={S.label}>Name on Card</label><input value={card.name} onChange={e=>setCard({...card,name:e.target.value})} placeholder="AVANI SHARMA" style={inputStyle}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label style={S.label}>Expiry</label><input value={card.exp} onChange={e=>setCard({...card,exp:e.target.value})} placeholder="MM/YY" maxLength={5} style={inputStyle}/></div>
                <div><label style={S.label}>CVV</label><input value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value})} placeholder="•••" maxLength={3} type="password" style={inputStyle}/></div>
              </div>
            </div>
          )}

          {method==="wallet"&&(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[["Paytm Wallet","💰"],["Amazon Pay","🛒"],["Mobikwik","📲"],["Freecharge","⚡"]].map(([w,ic])=>(
                <div key={w} style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:12, padding:16, textAlign:"center", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,212,255,0.4)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,212,255,0.12)"}>
                  <div style={{ fontSize:"1.5rem", marginBottom:6 }}>{ic}</div>
                  <div style={{ fontSize:".82rem" }}>{w}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background:"rgba(80,200,80,0.07)", border:"1px solid rgba(80,200,80,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:".83rem", color:"#5cc85c" }}>
            🔒 Secured by 256-bit SSL encryption. Your payment is safe.
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ ...S.btnG, flex:1 }}>← Back</button>
            <button onClick={pay} disabled={paying} style={{ ...S.btnP, flex:2, padding:"14px", fontSize:"1rem", opacity:paying?0.8:1 }}>
              {paying ? "Processing… ⏳" : `Pay ${plans.find(p=>p.id===plan)?.price} →`}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Success */}
      {step===3&&(
        <div style={{ textAlign:"center", padding:"30px 10px" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(80,200,80,0.1)", border:"2px solid rgba(80,200,80,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem", margin:"0 auto 20px" }}>✅</div>
          <h2 style={{ fontWeight:800, fontSize:"1.5rem", marginBottom:8 }}>Payment Successful!</h2>
          <p style={{ color:"#7ba8cc", marginBottom:20 }}>Your session has been booked and confirmed.</p>
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.15)", borderRadius:14, padding:20, textAlign:"left", marginBottom:20 }}>
            {[["Expert",expert?.name||"—"],["Plan",plans.find(p=>p.id===plan)?.label||"—"],["Amount",plans.find(p=>p.id===plan)?.price||"—"],["Booking ID",bookId],["Status","✓ Confirmed"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(0,212,255,0.08)", fontSize:".88rem" }}>
                <span style={{ color:"#7ba8cc" }}>{k}</span><span style={{ fontWeight:600, color:k==="Status"?"#5cc85c":"#e8f4ff" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button style={S.btnP} onClick={()=>go("hired")}>View Hired Experts</button>
            <button style={S.btnG} onClick={()=>go("home")}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  EXPERT PROFILE
// ══════════════════════════════════════════════════════════
function Profile({ expert, go, hired, goSchedule, goPayment }) {
  const [msg,setMsg]           = useState("");
  const [sent,setSent]         = useState(false);
  const [userRating,setUserRating] = useState(0);
  if(!expert) return null;
  const isHired = hired.includes(expert.id);

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"36px 32px" }}>
      <button onClick={()=>go("experts")} style={{ background:"none", border:"none", color:"#7ba8cc", cursor:"pointer", fontSize:".87rem", marginBottom:20 }}>← Back to Experts</button>
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:22 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Expert card */}
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.35)", borderRadius:16, padding:22, textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", overflow:"hidden", border:"3px solid rgba(0,212,255,0.4)", margin:"0 auto 12px", boxShadow:"0 0 20px rgba(0,212,255,0.2)" }}>
              <img src={expert.img} alt={expert.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ e.target.parentNode.innerHTML=`<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:#0a1e3a;border-radius:50%">${expert.icon}</div>`; }}/>
            </div>
            <h2 style={{ fontWeight:800, fontSize:"1.2rem", marginBottom:4 }}>{expert.name}</h2>
            <p style={{ color:"#7ba8cc", fontSize:".8rem", marginBottom:8 }}>{expert.title}</p>
            <div style={{ marginBottom:10 }}><Stars n={Math.floor(expert.rating)} size={16}/><span style={{ color:"#f5a623", fontWeight:700, marginLeft:6 }}>{expert.rating}</span><span style={{ color:"#3d6080", fontSize:".78rem" }}> ({expert.reviews})</span></div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", color:"#3d6080", fontSize:".78rem", marginBottom:10 }}><span>📍 {expert.location}</span><span>⚡ {expert.exp} yrs</span></div>
            <div style={{ fontSize:"1.3rem", fontWeight:800, color:"#00d4ff", marginBottom:8 }}>{expert.rate}</div>
            <div style={{ marginBottom:16 }}><span style={{ ...S.tag, color:expert.available?"#5cc85c":"#ff6b6b", borderColor:expert.available?"rgba(80,200,80,0.3)":"rgba(255,100,100,0.3)", background:expert.available?"rgba(80,200,80,0.08)":"rgba(255,100,100,0.08)" }}>{expert.available?"● Available Now":"● Currently Busy"}</span></div>

            {/* 4 contact buttons */}
            <div style={{ marginBottom:16 }}><ContactButtons expert={expert}/></div>

            {/* Approach action buttons — NO hire button */}
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              <button style={{ background:"linear-gradient(135deg,#0066cc,#0099ff)", color:"#fff", border:"none", padding:"11px", borderRadius:24, cursor:"pointer", fontWeight:700, fontSize:".88rem" }}
                onClick={()=>goSchedule()}>📅 Schedule a Session</button>
              <button style={{ background:"linear-gradient(135deg,#007700,#00aa44)", color:"#fff", border:"none", padding:"11px", borderRadius:24, cursor:"pointer", fontWeight:700, fontSize:".88rem" }}
                onClick={()=>goPayment()}>💳 Book & Pay Now</button>
              {isHired&&<div style={{ background:"rgba(80,200,80,0.1)", border:"1px solid rgba(80,200,80,0.3)", color:"#5cc85c", borderRadius:10, padding:"8px", fontSize:".82rem", fontWeight:600 }}>✓ Already in your team</div>}
            </div>
          </div>

          {/* Rate */}
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, marginBottom:10 }}>Rate This Expert</div>
            <div style={{ display:"flex", gap:4, marginBottom:8 }}>
              {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setUserRating(s)} style={{ fontSize:"1.6rem", cursor:"pointer", color:s<=userRating?"#f5a623":"#1a2d44" }}>★</span>)}
            </div>
            {userRating>0&&<div style={{ fontSize:".82rem", color:"#5cc85c" }}>Thanks for your {userRating}★ rating!</div>}
          </div>

          {/* Inquiry */}
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, marginBottom:10 }}>Send Inquiry</div>
            {sent?<div style={{ color:"#5cc85c", fontSize:".87rem", padding:10, background:"rgba(80,200,80,0.08)", borderRadius:8 }}>✓ Inquiry sent!</div>
              :<><textarea rows={3} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your project…" style={{...S.input,resize:"vertical",marginBottom:8}}/>
                <button style={{...S.btnP,width:"100%"}} onClick={()=>{ if(msg.trim()){setSent(true);setMsg("");} }}>Send</button></>}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22 }}>
            <h3 style={{ fontWeight:700, marginBottom:10 }}>About</h3>
            <p style={{ color:"#7ba8cc", lineHeight:1.75, fontSize:".92rem" }}>{expert.name} is a seasoned professional with {expert.exp} years of experience in {expert.skills.join(", ")}. They bring decades of real-world expertise to help organisations grow and avoid common pitfalls.</p>
          </div>
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22 }}>
            <h3 style={{ fontWeight:700, marginBottom:12 }}>Skills & Expertise</h3>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{expert.skills.map(s=><span key={s} style={{...S.tag,fontSize:".83rem",padding:"6px 12px"}}>{s}</span>)}</div>
          </div>
          <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:22 }}>
            <h3 style={{ fontWeight:700, marginBottom:14 }}>Community Reviews</h3>
            {INIT_COMMUNITY.filter(r=>r.expert===expert.name).length===0
              ?<p style={{ color:"#3d6080", fontSize:".88rem" }}>No reviews yet. Be the first!</p>
              :INIT_COMMUNITY.filter(r=>r.expert===expert.name).map(r=>(
                <div key={r.id} style={{ borderBottom:"1px solid rgba(0,212,255,0.08)", paddingBottom:12, marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0044aa,#0099ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".8rem" }}>{r.avatar}</div>
                    <span style={{ fontWeight:600, fontSize:".88rem" }}>{r.user}</span>
                    <Stars n={r.rating} size={12}/>
                  </div>
                  <p style={{ color:"#7ba8cc", fontSize:".85rem", lineHeight:1.6 }}>{r.text}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  HIRED EXPERTS
// ══════════════════════════════════════════════════════════
function HiredExperts({ hiredList, go, pick }) {
  if(hiredList.length===0) return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"80px 32px", textAlign:"center" }}>
      <div style={{ fontSize:"4rem", marginBottom:20 }}>📋</div>
      <h2 style={{ fontWeight:800, fontSize:"1.6rem", marginBottom:10 }}>No Sessions Booked Yet</h2>
      <p style={{ color:"#7ba8cc", marginBottom:24 }}>Browse our experts and book a session to get started.</p>
      <button style={S.btnP} onClick={()=>go("experts")}>Find Experts →</button>
    </div>
  );
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"40px 32px" }}>
      <h1 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:6 }}>Your Hired Experts</h1>
      <p style={{ color:"#7ba8cc", marginBottom:28 }}>{hiredList.length} expert{hiredList.length>1?"s":""} currently engaged</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 }}>
        {hiredList.map(e=>(
          <div key={e.id} style={{ background:"#071528", border:"1px solid rgba(80,200,80,0.25)", borderRadius:18, padding:22 }}>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(80,200,80,0.5)", flexShrink:0 }}><img src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={ev=>{ ev.target.parentNode.innerHTML=`<div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:#0a1e3a;border-radius:50%">${e.icon}</div>`; }}/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:"1rem" }}>{e.name}</div>
                <div style={{ color:"#7ba8cc", fontSize:".8rem" }}>{e.title}</div>
                <Stars n={Math.floor(e.rating)} size={12}/>
              </div>
              <div style={{ background:"rgba(80,200,80,0.1)", border:"1px solid rgba(80,200,80,0.3)", color:"#5cc85c", fontSize:".7rem", fontWeight:700, padding:"4px 10px", borderRadius:20 }}>● ACTIVE</div>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {[["📍",e.location],["⚡",`${e.exp} yrs`],["💰",e.rate]].map(([ic,val])=>(
                <span key={val} style={{ background:"#0a1e3a", border:"1px solid rgba(0,212,255,0.1)", borderRadius:8, padding:"4px 10px", fontSize:".75rem", color:"#7ba8cc" }}>{ic} {val}</span>
              ))}
            </div>
            <ContactButtons expert={e}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════
function Dashboard({ go, inquiries, setInquiries }) {
  const [tab,setTab]           = useState("profile");
  const [form,setForm]         = useState({ headline:"Banker", location:"Mumbai", experience:"25", bio:"Seasoned banking professional.", skills:"Financial Analysis, Risk Management", rate:"₹5,000", availability:"Part-time" });
  const [saved,setSaved]       = useState(false);
  const [activeInq,setActiveInq] = useState(null);
  const [replyText,setReplyText] = useState("");
  const chatEndRef = useRef(null);
  const fc = e=>setForm({...form,[e.target.name]:e.target.value});
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[activeInq,inquiries]);

  const sendReply = inqId=>{
    if(!replyText.trim()) return;
    setInquiries(prev=>prev.map(inq=>inq.id===inqId?{...inq,status:"replied",thread:[...inq.thread,{sender:"me",text:replyText,time:"just now"}]}:inq));
    setReplyText("");
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20, marginBottom:32 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:58, height:58, borderRadius:"50%", background:"linear-gradient(135deg,#0044aa,#0099ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.4rem", boxShadow:"0 0 18px rgba(0,153,255,0.4)" }}>A</div>
          <div><h1 style={{ fontSize:"1.8rem", fontWeight:800, marginBottom:3 }}>Welcome, Avani</h1><p style={{ color:"#7ba8cc", fontSize:".88rem" }}>Manage your profile and inquiries.</p></div>
        </div>
        <div style={{ display:"flex", gap:11 }}>
          {[["12","Profile Views"],["3","Inquiries"],["2","Active Projects"]].map(([n,l])=>(
            <div key={l} style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:12, padding:"13px 18px", textAlign:"center" }}>
              <div style={{ fontSize:"1.6rem", fontWeight:800, color:"#00d4ff" }}>{n}</div>
              <div style={{ fontSize:".7rem", color:"#3d6080" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:4, borderBottom:"1px solid rgba(0,212,255,0.12)", marginBottom:24 }}>
        {[["profile","👤 My Profile"],["inquiries","📨 Inquiries"]].map(([t,l])=>(
          <button key={t} onClick={()=>{ setTab(t); setActiveInq(null); }} style={{ padding:"10px 18px", border:`1px solid ${tab===t?"rgba(0,212,255,0.2)":"transparent"}`, borderBottom:`1px solid ${tab===t?"#071528":"transparent"}`, borderRadius:"12px 12px 0 0", background:tab===t?"#071528":"transparent", color:tab===t?"#00d4ff":"#3d6080", cursor:"pointer", fontWeight:600, fontSize:".87rem", position:"relative", bottom:-1 }}>
            {l}{t==="inquiries"&&<span style={{ marginLeft:6, background:"#00d4ff", color:"#020b18", fontSize:".65rem", fontWeight:800, padding:"1px 5px", borderRadius:10 }}>{inquiries.filter(i=>i.status==="new").length}</span>}
          </button>
        ))}
      </div>
      {tab==="profile"&&(
        <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.12)", borderRadius:16, padding:24, maxWidth:800 }}>
          <h3 style={{ fontWeight:700, marginBottom:5 }}>Expertise Setup</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {[["headline","Professional Headline"],["location","Location"],["experience","Years of Experience"],["rate","Hourly Rate"]].map(([n,l])=>(
              <div key={n}><label style={S.label}>{l}</label><input name={n} value={form[n]} onChange={fc} style={S.input}/></div>
            ))}
            <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Bio</label><textarea name="bio" value={form.bio} onChange={fc} rows={3} style={{...S.input,resize:"vertical"}}/></div>
            <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Skills</label><input name="skills" value={form.skills} onChange={fc} style={S.input}/></div>
            <div><label style={S.label}>Availability</label>
              <select name="availability" value={form.availability} onChange={fc} style={S.input}>
                {["Part-time","Full-time","One-time sessions","Project-based"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button style={S.btnP} onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500); }}>{saved?"✓ Saved!":"Save Profile"}</button>
            {saved&&<span style={{ color:"#00d4ff", fontSize:".87rem" }}>Profile updated!</span>}
          </div>
        </div>
      )}
      {tab==="inquiries"&&(
        <div style={{ display:"grid", gridTemplateColumns:activeInq?"320px 1fr":"1fr", gap:18, alignItems:"start" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {inquiries.map(inq=>(
              <div key={inq.id} onClick={()=>setActiveInq(inq.id===activeInq?null:inq.id)}
                style={{ background:"#071528", border:`1px solid ${activeInq===inq.id?"rgba(0,212,255,0.5)":"rgba(0,212,255,0.12)"}`, borderRadius:14, padding:18, cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontWeight:700 }}>{inq.from}</span>
                  <span style={{ color:"#3d6080", fontSize:".77rem" }}>{inq.time}</span>
                </div>
                <div style={{ color:"#7ba8cc", fontSize:".87rem", marginBottom:10 }}>{inq.subject}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", padding:"3px 9px", borderRadius:20, background:inq.status==="new"?"rgba(0,212,255,0.12)":inq.status==="replied"?"rgba(80,200,80,0.12)":"rgba(255,255,255,0.05)", color:inq.status==="new"?"#00d4ff":inq.status==="replied"?"#5cc85c":"#3d6080" }}>{inq.status}</span>
                  <span style={{ color:"#00d4ff", fontSize:".8rem" }}>{activeInq===inq.id?"▲ Close":"▼ Reply"}</span>
                </div>
              </div>
            ))}
          </div>
          {activeInq&&(()=>{
            const inq=inquiries.find(i=>i.id===activeInq);
            if(!inq) return null;
            return (
              <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.25)", borderRadius:16, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(0,212,255,0.1)" }}>
                  <div style={{ fontWeight:700, marginBottom:2 }}>{inq.from}</div>
                  <div style={{ color:"#7ba8cc", fontSize:".8rem" }}>{inq.subject}</div>
                </div>
                <div style={{ overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12, maxHeight:340, minHeight:120 }}>
                  {inq.thread.map((msg,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:msg.sender==="me"?"flex-end":"flex-start" }}>
                      <div style={{ maxWidth:"80%", background:msg.sender==="me"?"linear-gradient(135deg,#0066cc,#0099ff)":"#0a1e3a", border:msg.sender==="me"?"none":"1px solid rgba(0,212,255,0.12)", padding:"10px 14px", borderRadius:msg.sender==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", fontSize:".88rem", lineHeight:1.55 }}>
                        {msg.text}
                        <div style={{ fontSize:".68rem", color:msg.sender==="me"?"rgba(255,255,255,0.5)":"#3d6080", marginTop:4 }}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef}/>
                </div>
                <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(0,212,255,0.1)", display:"flex", gap:8 }}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply(activeInq)} placeholder="Type reply and press Enter…" style={{...S.input,flex:1}}/>
                  <button style={{...S.btnP,padding:"10px 16px"}} onClick={()=>sendReply(activeInq)}>Send</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  COMMUNITY
// ══════════════════════════════════════════════════════════
function Community({ reviews, setReviews }) {
  const [form,setForm]       = useState({ user:"", expert:"", rating:0, text:"" });
  const [hovered,setHovered] = useState(0);
  const [submitted,setSubmitted] = useState(false);
  const fc = e=>setForm({...form,[e.target.name]:e.target.value});

  const submit = ()=>{
    if(!form.user||!form.expert||!form.rating||!form.text) return;
    setReviews(prev=>[{ id:Date.now(), avatar:form.user[0].toUpperCase(), ...form, time:"just now", likes:0 },...prev]);
    setForm({ user:"", expert:"", rating:0, text:"" });
    setSubmitted(true);
    setTimeout(()=>setSubmitted(false),2500);
  };

  const avgRating = (reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1);

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"40px 32px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <h1 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:10 }}>Community Reviews</h1>
        <p style={{ color:"#7ba8cc", marginBottom:16 }}>Real experiences from professionals who've worked with our experts.</p>
        <div style={{ display:"inline-flex", gap:24, background:"#071528", border:"1px solid rgba(0,212,255,0.15)", borderRadius:16, padding:"16px 28px" }}>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:"2rem", fontWeight:800, color:"#f5a623" }}>{avgRating}</div><Stars n={Math.round(avgRating)} size={16}/><div style={{ color:"#3d6080", fontSize:".72rem", marginTop:3 }}>Overall Rating</div></div>
          <div style={{ width:1, background:"rgba(0,212,255,0.1)" }}/>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:"2rem", fontWeight:800, color:"#00d4ff" }}>{reviews.length}</div><div style={{ color:"#3d6080", fontSize:".72rem", marginTop:8 }}>Total Reviews</div></div>
          <div style={{ width:1, background:"rgba(0,212,255,0.1)" }}/>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:"2rem", fontWeight:800, color:"#5cc85c" }}>{EXPERTS.length}</div><div style={{ color:"#3d6080", fontSize:".72rem", marginTop:8 }}>Experts Listed</div></div>
        </div>
      </div>
      <div style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.2)", borderRadius:18, padding:24, marginBottom:32 }}>
        <h3 style={{ fontWeight:700, marginBottom:4 }}>✍️ Write a Review</h3>
        <p style={{ color:"#7ba8cc", fontSize:".85rem", marginBottom:18 }}>Share your experience with the community.</p>
        {submitted&&<div style={{ background:"rgba(80,200,80,0.1)", border:"1px solid rgba(80,200,80,0.3)", color:"#5cc85c", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:".88rem" }}>✓ Review posted!</div>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div><label style={S.label}>Your Name</label><input name="user" value={form.user} onChange={fc} placeholder="e.g. Rahul S." style={S.input}/></div>
          <div><label style={S.label}>Expert</label><select name="expert" value={form.expert} onChange={fc} style={S.input}><option value="">Select expert…</option>{EXPERTS.map(e=><option key={e.id}>{e.name}</option>)}</select></div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={S.label}>Rating</label>
          <div style={{ display:"flex", gap:6, marginTop:4 }}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(0)} onClick={()=>setForm({...form,rating:s})}
                style={{ fontSize:"1.8rem", cursor:"pointer", color:s<=(hovered||form.rating)?"#f5a623":"#1a2d44", transition:"color .1s" }}>★</span>
            ))}
            {form.rating>0&&<span style={{ color:"#f5a623", fontSize:".85rem", alignSelf:"center", marginLeft:4 }}>{["","Poor","Fair","Good","Great","Excellent"][form.rating]}</span>}
          </div>
        </div>
        <div style={{ marginBottom:16 }}><label style={S.label}>Review</label><textarea name="text" value={form.text} onChange={fc} rows={3} placeholder="Share your experience…" style={{...S.input,resize:"vertical"}}/></div>
        <button style={{...S.btnP,padding:"11px 28px"}} onClick={submit}>Post Review ✦</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {reviews.map(r=>(
          <div key={r.id} style={{ background:"#071528", border:"1px solid rgba(0,212,255,0.1)", borderRadius:16, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#0044aa,#0099ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:".95rem" }}>{r.avatar||r.user[0]}</div>
                <div><div style={{ fontWeight:700, fontSize:".92rem" }}>{r.user}</div><div style={{ color:"#3d6080", fontSize:".75rem" }}>reviewed <span style={{ color:"#00d4ff" }}>{r.expert}</span></div></div>
              </div>
              <div style={{ textAlign:"right" }}><Stars n={r.rating}/><div style={{ color:"#3d6080", fontSize:".72rem", marginTop:2 }}>{r.time}</div></div>
            </div>
            <p style={{ color:"#c4daf0", fontSize:".9rem", lineHeight:1.65, marginBottom:12 }}>{r.text}</p>
            <button onClick={()=>setReviews(prev=>prev.map(rv=>rv.id===r.id?{...rv,likes:rv.likes+1}:rv))} style={{ background:"rgba(0,212,255,0.06)", border:"1px solid rgba(0,212,255,0.15)", color:"#7ba8cc", borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:".8rem" }}>👍 {r.likes} Helpful</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [page,setPage]           = useState("home");
  const [expert,setExpert]       = useState(null);
  const [hired,setHired]         = useState([]);
  const [inquiries,setInquiries] = useState(INIT_INQUIRIES);
  const [reviews,setReviews]     = useState(INIT_COMMUNITY);
  const [toast,setToast]         = useState("");

  const go = p=>{ setPage(p); window.scrollTo(0,0); };

  const handleHire = e=>{
    if(!hired.includes(e.id)){
      setHired(p=>[...p,e.id]);
      setToast(`✅ ${e.name} added to your team!`);
      setTimeout(()=>setToast(""),3500);
    }
  };

  const hiredList = EXPERTS.filter(e=>hired.includes(e.id));

  return (
    <div style={S.root}>
      <Navbar page={page} go={go}/>

      {page==="home"       && <Home go={go}/>}
      {page==="experts"    && <FindExperts go={go} pick={setExpert} hired={hired} onHire={handleHire}/>}
      {page==="how"        && <HowItWorks go={go}/>}
      {page==="forbusiness"&& <ForBusiness go={go}/>}
      {page==="profile"    && <Profile expert={expert} go={go} hired={hired}
                                goSchedule={()=>go("schedule")}
                                goPayment={()=>go("payment")}/>}
      {page==="schedule"   && <SchedulePage expert={expert} go={go} goPayment={()=>go("payment")}/>}
      {page==="payment"    && <PaymentPage  expert={expert} go={go}/>}
      {page==="hired"      && <HiredExperts hiredList={hiredList} go={go} pick={setExpert}/>}
      {page==="dashboard"  && <Dashboard go={go} inquiries={inquiries} setInquiries={setInquiries}/>}
      {page==="community"  && <Community go={go} reviews={reviews} setReviews={setReviews}/>}

      {toast&&(
        <div style={{ position:"fixed", bottom:28, right:28, background:"#071528", border:"1px solid rgba(80,200,80,0.4)", borderRadius:14, padding:"14px 22px", color:"#e8f4ff", fontSize:".92rem", boxShadow:"0 8px 40px rgba(0,0,0,0.6)", zIndex:9999, display:"flex", alignItems:"center", gap:10 }}>
          {toast}
          <button onClick={()=>{ setToast(""); go("hired"); }} style={{ background:"none", border:"none", color:"#5cc85c", cursor:"pointer", fontWeight:700 }}>View →</button>
        </div>
      )}
    </div>
  );
}
