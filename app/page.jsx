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
    // Aggiungiamo un log per vedere cosa succede nella console del browser (F12)
    console.log("Tentativo di recupero dati...");
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?select=*`, {
      method: 'GET',
      headers: { 
        "apikey": SUPABASE_KEY, 
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Dati ricevuti:", data);
      setPratiche(data || []);
    } else {
      console.error("Errore risposta Supabase:", data);
    }
  } catch (e) { 
    console.error("Errore di rete:", e); 
  }
};

  useEffect(() => {
    if (pagina === 'archivio' && can("DIRIGENZA")) fetchPratiche();
  }, [pagina]);

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
    } catch (e) { alert("Errore di invio"); }
    setLoading(false);
  };

  // --- NUOVA FUNZIONE PER AGGIORNARE LO STATO ---
  const aggiornaStato = async (id, nuovoStato) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/congedi?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`, 
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({ stato: nuovoStato })
      });
      if (res.ok) fetchPratiche(); // Ricarica la lista aggiornata
      else alert("Errore durante l'aggiornamento.");
    } catch (e) { console.error(e); }
  };

  if (!user) return (
    <div style={loginBg}>
      <div style={loginCard}>
        <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>ATLANTIS RP</h2>
        <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
        <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); }} style={submitBtn}>ACCEDI</button>
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

  if (pagina === 'congedo') return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a', marginTop:0}}>Richiesta Congedo</h2>
          <label style={labStyle}>Nome Lore</label>
          <input style={inputStyle} onChange={(e)=>setForm({...form, lore: e.target.value})} />
          <label style={labStyle}>Periodo</label>
          <input style={inputStyle} placeholder="es. dal 10/05 al 15/05" onChange={(e)=>setForm({...form, tempo: e.target.value})} />
          <label style={labStyle}>Motivazione</label>
          <textarea style={{...inputStyle, height:'100px'}} onChange={(e)=>setForm({...form, motivo: e.target.value})} />
          <button onClick={inviaCongedo} disabled={loading} style={submitBtn}>{loading ? "INVIO..." : "INVIA"}</button>
        </div>
      </div>
    </div>
  );

  if (pagina === 'archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a', marginTop:0}}>Archivio Pratiche</h2>
          <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse', marginTop:'20px'}}>
            <thead><tr style={{borderBottom:'2px solid #f1f5f9', color:'#64748b', fontSize:'12px'}}>
              <th style={{padding:'10px'}}>DIPENDENTE</th><th>PERIODO</th><th>STATO</th><th>AZIONI</th>
            </tr></thead>
            <tbody>
              {pratiche.map((p, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f8fafc', fontSize:'13px'}}>
                  <td style={{padding:'12px'}}><b>{p.nickname}</b><br/><small>{p.nome_lore}</small></td>
                  <td>{p.periodo}</td>
                  <td style={{fontWeight:'bold', color: p.stato === 'APPROVATA' ? '#10b981' : p.stato === 'RIFIUTATA' ? '#ef4444' : '#f59e0b'}}>{p.stato}</td>
                  <td>
                    {p.stato === 'IN ATTESA' && (
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={()=>aggiornaStato(p.id, 'APPROVATA')} style={{padding:'5px', background:'#10b981', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'10px'}}>SÌ</button>
                        <button onClick={()=>aggiornaStato(p.id, 'RIFIUTATA')} style={{padding:'5px', background:'#ef4444', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'10px'}}>NO</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2>Inviata! ✅</h2><button onClick={()=>setPagina('home')} style={submitBtn}>HOME</button></div></div>
  );

  return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1 style={{marginBottom:'30px'}}>Dashboard</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Invia richiesta." c="#1e3a8a" onClick={()=>setPagina('congedo')} />}
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Approva/Rifiuta pratiche." c="#ef4444" onClick={()=>setPagina('archivio')} />}
          <Card t="Anagrafe" d="Prossimamente..." c="#10b981" onClick={()=>alert("In sviluppo")} />
          <Card t="Amministrazione" d="Prossimamente..." c="#f59e0b" onClick={()=>alert("In sviluppo")} />
        </div>
      </div>
    </div>
  );
}

// STILI CSS
const loginBg = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif' };
const loginCard = { background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'300px' };
const pageBg = { minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif' };
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 12px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'10px' };
const container = { padding:'40px', maxWidth:'1200px', margin:'0 auto' };
const formCard = { background:'white', padding:'30px', borderRadius:'15px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)' };
const labStyle = { display:'block', fontSize:'11px', fontWeight:'bold', color:'#64748b', marginBottom:'5px' };
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
