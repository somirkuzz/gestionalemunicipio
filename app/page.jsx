'use client';
import React, { useState, useEffect } from 'react';

// --- CONFIGURAZIONE DATABASE ATLANTIS ---
const SUPABASE_URL = 'https://xvtfdbuomstrpfrojwrg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dGZkYnVvbXN0cnBmcm9qd3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDQ5OTcsImV4cCI6MjA5MDE4MDk5N30.6yt3myNpafxXB12b75vGYMcmLRcGnV1x8a1wA8F4RoI';

const DIPENDENTI = {
  "Paolix09XL": "DIRIGENTE",
  "Gen408patrone": "VICE_DIRIGENTE",
  "crilochia29": "VICE_DIRIGENTE",
  "Snake_Nik6": "SEGRETARIO_COMUNALE",
  "Leopold": "COORDINATORE_UFFICI",
  "Giuk004": "RESPONSABILE_ANAGRAFE",
  "SoMirkuz_": "VICE_RESPONSABILE_ANAGRAFE",
  "gjoxo": "VICE_RESPONSABILE_ANAGRAFE",
  "Tortello_09": "SUPERVISORE_ANAGRAFE",
  "Amico89": "IMPIEGATO_ANAGRAFE",
  "_ImYukii_": "IMPIEGATO_ANAGRAFE",
  "Mikelino21": "IMPIEGATO_ANAGRAFE",
  "scarpettina": "IMPIEGATO_ANAGRAFE",
  "Alessio_vgs": "IMPIEGATO_ANAGRAFE",
  "Benny_45": "IMPIEGATO_ANAGRAFE",
  "3d0ardin00123": "IMPIEGATO_ANAGRAFE",
  "_Belzebu_": "RESPONSABILE_AMMINISTRATIVO",
  "TopoXP": "IMPIEGATO_AMMINISTRATIVO",
  "NotRavix": "APPRENDISTA",
  "sandydll": "APPRENDISTA"
};

const PERMESSI = {
  "DIRIGENTE": ["CONGEDO", "ANAGRAFE", "AMMINISTRATIVO", "DIRIGENZA"],
  "VICE_DIRIGENTE": ["CONGEDO", "ANAGRAFE", "AMMINISTRATIVO", "DIRIGENZA"],
  "SEGRETARIO_COMUNALE": ["CONGEDO", "ANAGRAFE", "AMMINISTRATIVO"],
  "COORDINATORE_UFFICI": ["CONGEDO", "ANAGRAFE", "AMMINISTRATIVO"],
  "RESPONSABILE_ANAGRAFE": ["CONGEDO", "ANAGRAFE"],
  "VICE_RESPONSABILE_ANAGRAFE": ["CONGEDO", "ANAGRAFE"],
  "SUPERVISORE_ANAGRAFE": ["CONGEDO", "ANAGRAFE"],
  "IMPIEGATO_ANAGRAFE": ["CONGEDO", "ANAGRAFE"],
  "RESPONSABILE_AMMINISTRATIVO": ["CONGEDO", "AMMINISTRATIVO"],
  "IMPIEGATO_AMMINISTRATIVO": ["CONGEDO", "AMMINISTRATIVO"],
  "APPRENDISTA": ["CONGEDO"]
};

export default function Page() {
  const [user, setUser] = useState(null);
  const [nick, setNick] = useState('');
  const [pagina, setPagina] = useState('home'); 
  const [pratiche, setPratiche] = useState([]);
  const [form, setForm] = useState({ lore: '', tempo: '', motivo: '' });
  const [loading, setLoading] = useState(false);

  const can = (p) => user && PERMESSI[user.r]?.includes(p);

  const fetchPratiche = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?select=*&order=id.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      if (res.ok) setPratiche(data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (pagina === 'lista_congedi') fetchPratiche();
  }, [pagina]);

  const aggiornaStato = async (id, nuovoStato) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?id=eq.${id}`, {
        method: 'PATCH',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ stato: nuovoStato })
      });
      if (res.ok) fetchPratiche();
    } catch (e) { console.error(e); }
  };

  const eliminaPratica = async (id) => {
    if(!confirm("Vuoi davvero eliminare questa pratica?")) return;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?id=eq.${id}`, {
        method: 'DELETE',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      if (res.ok) fetchPratiche();
    } catch (e) { console.error(e); }
  };

  const inviaCongedo = async () => {
    if (!form.lore || !form.tempo) return alert("Inserisci i dati obbligatori!");
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ nome_lore: form.lore, nickname: user.n, ruolo: user.r, periodo: form.tempo, motivazione: form.motivo, stato: 'IN ATTESA' })
      });
      if (res.ok) setPagina('successo');
    } catch (e) { alert("Errore invio"); }
    setLoading(false);
  };

  if (!user) return (
    <div style={loginBg}>
      <div style={loginCard}>
        <h2 style={{color:'#1e3a8a', marginBottom:'20px', letterSpacing:'1px'}}>ATLANTIS RP</h2>
        <input style={inputStyle} placeholder="Inserisci il tuo Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
        <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Non autorizzato"); }} style={submitBtn}>ACCEDI AL SISTEMA</button>
      </div>
    </div>
  );

  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0, fontSize:'18px'}}>MUNICIPIO ATLANTIS</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right', lineHeight:'1.2'}}>
          <span style={{fontSize:'14px', fontWeight:'bold'}}>{user.n}</span><br/>
          <small style={{fontSize:'10px', color:'#bfdbfe'}}>{user.r.replace(/_/g, ' ')}</small>
        </div>
        <button onClick={() => {setUser(null); setPagina('home');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // --- PAGINA: NUOVO CONGEDO ---
  if (pagina === 'congedo') return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Torna alla Dashboard</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a', marginTop:0, borderBottom:'2px solid #f1f5f9', paddingBottom:'10px'}}>Richiesta Congedo</h2>
          <div style={{marginTop:'20px'}}>
            <label style={labStyle}>Nome Personaggio (Lore)</label>
            <input style={inputStyle} value={form.lore} onChange={(e)=>setForm({...form, lore: e.target.value})} placeholder="es. Mario Rossi" />
            <label style={labStyle}>Periodo Assenza</label>
            <input style={inputStyle} value={form.tempo} onChange={(e)=>setForm({...form, tempo: e.target.value})} placeholder="es. dal 15/04 al 20/04" />
            <label style={labStyle}>Motivazione</label>
            <textarea style={{...inputStyle, height:'120px'}} value={form.motivo} onChange={(e)=>setForm({...form, motivo: e.target.value})} placeholder="Spiega brevemente il motivo..." />
            <button onClick={inviaCongedo} disabled={loading} style={submitBtn}>{loading ? "INVIO IN CORSO..." : "INVIA RICHIESTA"}</button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- PAGINA: MENU ARCHIVI ---
  if (pagina === 'archivio_menu') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Torna alla Dashboard</button>
        <h1 style={{color:'#1e293b', marginBottom:'30px'}}>Archivi di Stato</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'30px'}}>
          <Card t="Archivio Congedi" d="Gestisci le assenze e i permessi del personale." c="#1e3a8a" onClick={()=>setPagina('lista_congedi')} />
          <Card t="Anagrafe Storica" d="Registro dei cittadini e documenti d'identità." c="#10b981" onClick={()=>alert("Sezione in allestimento")} />
          <Card t="Atti Amministrativi" d="Multe, licenze e ordinanze comunali." c="#f59e0b" onClick={()=>alert("Sezione in allestimento")} />
        </div>
      </div>
    </div>
  );

  // --- PAGINA: TABELLA CONGEDI ---
  if (pagina === 'lista_congedi') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('archivio_menu')} style={backBtn}>← Torna agli Archivi</button>
        <div style={formCard}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <h2 style={{color:'#1e3a8a', margin:0}}>Registro Congedi Personale</h2>
            <button onClick={fetchPratiche} style={refreshBtn}>Aggiorna ↻</button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f8fafc', borderBottom:'2px solid #e2e8f0'}}>
                  <th style={thStyle}>DIPENDENTE</th>
                  <th style={thStyle}>PERIODO</th>
                  <th style={thStyle}>STATO</th>
                  <th style={thStyle}>AZIONI</th>
                </tr>
              </thead>
              <tbody>
                {pratiche.map((p) => (
                  <tr key={p.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                    <td style={tdStyle}><b>{p.nickname}</b><br/><small style={{color:'#64748b'}}>{p.nome_lore}</small></td>
                    <td style={tdStyle}>{p.periodo}</td>
                    <td style={{...tdStyle, fontWeight:'bold', color: p.stato === 'APPROVATA' ? '#10b981' : p.stato === 'RIFIUTATA' ? '#ef4444' : '#f59e0b'}}>{p.stato}</td>
                    <td style={tdStyle}>
                      <div style={{display:'flex', gap:'8px'}}>
                        {p.stato === 'IN ATTESA' && (
                          <>
                            <button onClick={()=>aggiornaStato(p.id, 'APPROVATA')} style={btnApprove}>OK</button>
                            <button onClick={()=>aggiornaStato(p.id, 'RIFIUTATA')} style={btnReject}>NO</button>
                          </>
                        )}
                        <button onClick={()=>eliminaPratica(p.id)} style={btnDelete}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2 style={{color:'#10b981'}}>Richiesta Inviata! ✅</h2><p style={{fontSize:'14px', color:'#64748b'}}>Il municipio valuterà la tua pratica.</p><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>
  );

  // --- HOME DASHBOARD ---
  return (
    <div style={pageBg}><Header />
      <div style={container}>
        <div style={{marginBottom:'40px'}}>
          <h1 style={{color:'#0f172a', margin:0}}>Benvenuto, {user.n}</h1>
          <p style={{color:'#64748b', marginTop:'5px'}}>Sistema di gestione uffici Atlantis RP</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {can("CONGEDO") && <Card t="Richiesta Congedo" d="Invia una nuova domanda di assenza." c="#1e3a8a" onClick={()=>setPagina('congedo')} />}
          <Card t="Ufficio Anagrafe" d="Gestione dei cittadini (Prossimamente)." c="#10b981" onClick={()=>alert("In sviluppo")} />
          <Card t="Ufficio Amministrativo" d="Gestione documenti (Prossimamente)." c="#f59e0b" onClick={()=>alert("In sviluppo")} />
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Pannello controllo Dirigenti e Vice." c="#ef4444" onClick={()=>setPagina('archivio_menu')} />}
        </div>
      </div>
    </div>
  );
}

// --- STILI ---
const loginBg = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif' };
const loginCard = { background:'white', padding:'45px', borderRadius:'24px', textAlign:'center', width:'340px', boxShadow:'0 20px 50px rgba(0,0,0,0.3)' };
const pageBg = { minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif' };
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 50px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' };
const logoutBtn = { background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', fontSize:'11px', fontWeight:'bold' };
const container = { padding:'50px', maxWidth:'1200px', margin:'0 auto' };
const formCard = { background:'white', padding:'35px', borderRadius:'20px', boxShadow:'0 10px 25px rgba(0,0,0,0.05)' };
const labStyle = { display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'8px', textTransform:'uppercase' };
const inputStyle = { width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#f8fafc', boxSizing:'border-box', outline:'none' };
const submitBtn = { width:'100%', padding:'14px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold', fontSize:'14px', transition:'0.3s' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'15px', display:'flex', alignItems:'center', gap:'5px' };
const refreshBtn = { background:'#f1f5f9', border:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', color:'#475569', fontWeight:'bold', fontSize:'12px' };
const thStyle = { padding:'15px', textAlign:'left', fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' };
const tdStyle = { padding:'15px', fontSize:'14px', color:'#1e293b' };
const btnApprove = { padding:'6px 12px', background:'#10b981', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'10px' };
const btnReject = { padding:'6px 12px', background:'#ef4444', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'10px' };
const btnDelete = { padding:'6px 10px', background:'#f1f5f9', color:'#94a3b8', border:'none', borderRadius:'6px', cursor:'pointer' };

function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'30px', borderRadius:'20px', borderLeft:`8px solid ${c}`, boxShadow:'0 4px 15px rgba(0,0,0,0.03)', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      <div>
        <h3 style={{margin:'0 0 10px 0', color:'#1e293b', fontSize:'18px'}}>{t}</h3>
        <p style={{fontSize:'13px', color:'#64748b', lineHeight:'1.5', marginBottom:'25px'}}>{d}</p>
      </div>
      <button onClick={onClick} style={{width:'100%', padding:'12px', background:c, color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'}}>ACCEDI</button>
    </div>
  );
}
