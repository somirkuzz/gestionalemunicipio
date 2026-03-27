'use client';
import React, { useState, useEffect } from 'react';

// CONFIGURAZIONE DATABASE
const SUPABASE_URL = 'https://xvtfdbuomstrpfmprojwrg.supabase.co';
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
  const [pagina, setPagina] = useState('dashboard');
  const [pratiche, setPratiche] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ lore: '', tempo: '', motivo: '' });

  const can = (p) => user && PERMESSI[user.r]?.includes(p);

  // CARICA DATI (Metodo Nativo)
  const fetchPratiche = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?select=*&order=created_at.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setPratiche(data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (pagina === 'archivio' && can("DIRIGENZA")) fetchPratiche();
  }, [pagina]);

  // INVIA DATI (Metodo Nativo)
  const inviaPratica = async () => {
    if (!form.lore || !form.tempo) return alert("Inserisci Nome Lore e Periodo!");
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi`, {
        method: 'POST',
        headers: { 
          "apikey": SUPABASE_KEY, 
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          nome_lore: form.lore,
          nickname: user.n,
          ruolo: user.r,
          periodo: form.tempo,
          motivazione: form.motivo,
          stato: 'IN ATTESA'
        })
      });
      if (res.ok) setPagina('successo');
    } catch (e) { alert("Errore di connessione"); }
    setLoading(false);
  };

  if (!user) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'300px'}}>
        <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>ATLANTIS RP</h2>
        <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
        <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); }} style={submitBtn}>ACCEDI</button>
      </div>
    </div>
  );

  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('dashboard')} style={{cursor:'pointer', margin:0}}>MUNICIPIO</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right'}}><b>{user.n}</b><br/><small>{user.r.replace(/_/g, ' ')}</small></div>
        <button onClick={() => {setUser(null); setPagina('dashboard');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  if (pagina === 'archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('dashboard')} style={backBtn}>← Dashboard</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>Archivio Pratiche</h2>
          <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid #f1f5f9', color:'#64748b', fontSize:'12px'}}>
              <th style={{padding:'10px'}}>NICK</th><th>LORE</th><th>PERIODO</th><th>STATO</th>
            </tr></thead>
            <tbody>
              {pratiche.map((p, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f8fafc', fontSize:'13px'}}>
                  <td style={{padding:'12px'}}><b>{p.nickname}</b></td><td>{p.nome_lore}</td><td>{p.periodo}</td>
                  <td style={{color:'#f59e0b', fontWeight:'bold'}}>{p.stato}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pratiche.length === 0 && <p style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>Nessuna richiesta presente.</p>}
        </div>
      </div>
    </div>
  );

  if (pagina === 'congedo') return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a'}}>Modulo Congedo</h2>
          <label style={labStyle}>Nome Lore</label>
          <input style={inputStyle} value={form.lore} onChange={(e)=>setForm({...form, lore: e.target.value})} />
          <label style={labStyle}>Periodo</label>
          <input style={inputStyle} placeholder="Dal... Al..." value={form.tempo} onChange={(e)=>setForm({...form, tempo: e.target.value})} />
          <label style={labStyle}>Motivazione</label>
          <textarea style={{...inputStyle, height:'100px'}} value={form.motivo} onChange={(e)=>setForm({...form, motivo: e.target.value})} />
          <button onClick={inviaPratica} disabled={loading} style={submitBtn}>
            {loading ? "INVIO IN CORSO..." : "INVIA AL MUNICIPIO"}
          </button>
        </div>
      </div>
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2>Inviata! ✅</h2><button onClick={()=>setPagina('dashboard')} style={submitBtn}>TORNA ALLA HOME</button></div></div>
  );

  return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1 style={{marginBottom:'30px'}}>Servizi Online</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiedi permessi." c="#1e3a8a" onClick={()=>setPagina('congedo')} />}
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Accesso riservato." c="#ef4444" onClick={()=>setPagina('archivio')} />}
        </div>
      </div>
    </div>
  );
}

// STILI
const loginBg = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif' };
const loginCard = { background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'300px' };
const pageBg = { minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif' };
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 12px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'10px' };
const container = { padding:'40px', maxWidth:'1200px', margin:'0 auto' };
const formCard = { background:'white', padding:'30px', borderRadius:'15px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)' };
const labStyle = { display:'block', fontSize:'11px', fontWeight:'bold', color:'#475569', marginBottom:'5px' };
const inputStyle = { width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box' };
const submitBtn = { width:'100%', padding:'12px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'10px' };

function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
      <h3>{t}</h3><p style={{fontSize:'12px', color:'#64748b'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'10px', background:c, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>ENTRA</button>
    </div>
  );
}
