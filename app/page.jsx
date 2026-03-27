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

  // --- CARICA DATI DALL'ARCHIVIO ---
  const fetchPratiche = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?select=*&order=created_at.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      if (res.ok) setPratiche(data || []);
      else console.error("Errore caricamento:", data);
    } catch (e) { console.error("Errore di rete:", e); }
  };

  useEffect(() => {
    if (pagina === 'archivio' && can("DIRIGENZA")) fetchPratiche();
  }, [pagina]);

  // --- INVIO PRATICA AL DATABASE ---
  const inviaCongedo = async () => {
    if (!form.lore || !form.tempo) return alert("Completa i campi obbligatori!");
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

      if (res.ok) {
        setPagina('successo');
        setForm({ lore: '', tempo: '', motivo: '' }); // Resetta il form
      } else {
        const errData = await res.json();
        alert(`Errore DB: ${errData.message || "Controlla le colonne della tabella"}`);
      }
    } catch (e) {
      alert("Errore di connessione. Verifica che l'URL di Supabase sia corretto.");
    } finally {
      setLoading(false);
    }
  };

  // SCHERMATA LOGIN
  if (!user) return (
    <div style={loginBg}>
      <div style={loginCard}>
        <h2 style={{color:'#1e3a8a', marginBottom:'20px', fontWeight:'800'}}>ATLANTIS RP</h2>
        <input style={inputStyle} placeholder="Inserisci il tuo Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
        <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Nickname non autorizzato!"); }} style={submitBtn}>ACCEDI</button>
      </div>
    </div>
  );

  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>SISTEMA MUNICIPIO</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right'}}><b>{user.n}</b><br/><small>{user.r.replace(/_/g, ' ')}</small></div>
        <button onClick={() => {setUser(null); setPagina('home');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // PAGINA: MODULO CONGEDO
  if (pagina === 'congedo') return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a', marginTop:0}}>Modulo Richiesta Congedo</h2>
          <label style={labStyle}>Nome Lore</label>
          <input style={inputStyle} value={form.lore} onChange={(e)=>setForm({...form, lore: e.target.value})} />
          <label style={labStyle}>Tempo/Periodo</label>
          <input style={inputStyle} placeholder="es. dal 01/05 al 05/05" value={form.tempo} onChange={(e)=>setForm({...form, tempo: e.target.value})} />
          <label style={labStyle}>Motivazione</label>
          <textarea style={{...inputStyle, height:'100px'}} value={form.motivo} onChange={(e)=>setForm({...form, motivo: e.target.value})} />
          <button onClick={inviaCongedo} disabled={loading} style={submitBtn}>
            {loading ? "INVIO IN CORSO..." : "INVIA AL MUNICIPIO"}
          </button>
        </div>
      </div>
    </div>
  );

  // PAGINA: ARCHIVIO CENTRALE
  if (pagina === 'archivio' && can("DIRIGENZA")) return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <div style={formCard}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <h2 style={{color:'#1e3a8a', margin:0}}>Archivio Pratiche Centrale</h2>
            <button onClick={fetchPratiche} style={{background:'#f1f5f9', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer', fontSize:'12px'}}>Aggiorna ↻</button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:'2px solid #f1f5f9', color:'#64748b', fontSize:'12px'}}>
                <th style={{padding:'10px'}}>NICKNAME</th><th>LORE</th><th>PERIODO</th><th>STATO</th>
              </tr></thead>
              <tbody>
                {pratiche.map((p, i) => (
                  <tr key={i} style={{borderBottom:'1px solid #f8fafc', fontSize:'13px'}}>
                    <td style={{padding:'12px'}}><b>{p.nickname}</b></td><td>{p.nome_lore}</td><td>{p.periodo}</td>
                    <td style={{color: p.stato === 'IN ATTESA' ? '#f59e0b' : '#10b981', fontWeight:'bold'}}>{p.stato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pratiche.length === 0 && <p style={{textAlign:'center', color:'#94a3b8', padding:'20px'}}>Nessun dato trovato nel database.</p>}
        </div>
      </div>
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2>Inviata! ✅</h2><p>La tua pratica è ora in archivio.</p><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>
  );

  // HOME: DASHBOARD GENERALE
  return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1 style={{marginBottom:'30px', color:'#0f172a'}}>Dashboard Gestionale</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Compila per richiedere un'assenza." c="#1e3a8a" onClick={()=>setPagina('congedo')} />}
          {can("ANAGRAFE") && <Card t="Servizi Anagrafe" d="Gestione cittadini (Prossimamente)" c="#10b981" onClick={()=>alert("Modulo in allestimento...")} />}
          {can("AMMINISTRATIVO") && <Card t="Ufficio Amministrativo" d="Documentazione (Prossimamente)" c="#f59e0b" onClick={()=>alert("Modulo in allestimento...")} />}
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Pannello di controllo Direzione." c="#ef4444" onClick={()=>setPagina('archivio')} />}
        </div>
      </div>
    </div>
  );
}

// --- STILI CSS-IN-JS ---
const loginBg = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif' };
const loginCard = { background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'320px', boxShadow:'0 10px 30px rgba(0,0,0,0.3)' };
const pageBg = { minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif' };
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 15px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'10px' };
const container = { padding:'40px', maxWidth:'1200px', margin:'0 auto' };
const formCard = { background:'white', padding:'30px', borderRadius:'15px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)' };
const labStyle = { display:'block', fontSize:'11px', fontWeight:'bold', color:'#64748b', marginBottom:'5px', textTransform:'uppercase' };
const inputStyle = { width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box' };
const submitBtn = { width:'100%', padding:'12px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'10px' };

function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
      <h3 style={{margin:'0 0 10px 0', color:'#1e293b'}}>{t}</h3>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'10px', background:c, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>ENTRA</button>
    </div>
  );
}
