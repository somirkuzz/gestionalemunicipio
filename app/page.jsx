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
  "DIRIGENTE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO", "DIRIGENZA"],
  "VICE_DIRIGENTE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO", "DIRIGENZA"],
  "VICE_DIRIGENTE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO"],
  "COORDINATORE_UFFICI": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO"],
  "RESPONSABILE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "CONGEDO"],
  "VICE_RESPONSABILE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "CONGEDO"],
  "SUPERVISORE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "CONGEDO"],
  "IMPIEGATO_ANAGRAFE": ["CAMBIO_NOME", "CONGEDO"],
  "RESPONSABILE_AMMINISTRATIVO": ["CONGEDO", "AMMINISTRATIVO"],
  "IMPIEGATO_AMMINISTRATIVO": ["CONGEDO", "AMMINISTRATIVO"],
  "APPRENDISTA": ["CONGEDO"]
};

export default function Page() {
  const [user, setUser] = useState(null);
  const [nick, setNick] = useState('');
  const [pagina, setPagina] = useState('home');
  const [pratiche, setPratiche] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const can = (p) => user && PERMESSI[user.r]?.includes(p);

  // --- LOGICA DATABASE ---
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
      await fetch(`${SUPABASE_URL}/rest/v1/congedi?id=eq.${id}`, {
        method: 'PATCH',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ stato: nuovoStato })
      });
      fetchPratiche();
    } catch (e) { console.error(e); }
  };

  const inviaPratica = async (tabella, payload) => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, creato_da: user.n, stato: 'IN ATTESA' })
      });
      if (res.ok) setPagina('successo');
      else alert("Errore nell'invio");
    } catch (e) { alert("Errore di connessione"); }
    setLoading(false);
  };

  // --- LOGIN ---
  if (!user) return (
    <div style={loginBg}>
      <div style={loginCard}>
        <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>SISTEMA MUNICIPIO</h2>
        <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
        <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Utente non censito"); }} style={submitBtn}>ACCEDI</button>
      </div>
    </div>
  );

  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>ATLANTIS RP</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right'}}><b>{user.n}</b><br/><small>{user.r.replace(/_/g, ' ')}</small></div>
        <button onClick={() => {setUser(null); setPagina('home');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // --- VISTA: DASHBOARD HOME ---
  if (pagina === 'home') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1 style={{marginBottom:'30px'}}>Dashboard Principale</h1>
        <div style={gridStyle}>
          <Card t="Ufficio Anagrafe" d="Moduli cambio nome, adozioni e stato civile." c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Invia richiesta di assenza." c="#1e3a8a" onClick={()=>setPagina('congedo')} />}
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Gestione e approvazione pratiche." c="#ef4444" onClick={()=>setPagina('archivio_menu')} />}
        </div>
      </div>
    </div>
  );

  // --- VISTA: MENU ANAGRAFE (I 5 MODULI) ---
  if (pagina === 'menu_anagrafe') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h1 style={{marginBottom:'30px'}}>Sezioni Anagrafe</h1>
        <div style={gridStyle}>
          {can("CAMBIO_NOME") && <Card t="Cambio Nome/Cognome" d="Registra variazione di identità." c="#10b981" onClick={()=>setPagina('form_nome')} />}
          {can("ADOZIONE") && <Card t="Modulo Adozione" d="Pratiche legali per adozioni." c="#10b981" onClick={()=>setPagina('form_adozione')} />}
          {can("DISCONOSCIMENTO") && <Card t="Disconoscimento" d="Rottura legami di parentela." c="#059669" onClick={()=>setPagina('form_disconoscimento')} />}
          {can("DIVORZIO") && <Card t="Modulo Divorzio" d="Cessazione matrimonio/unione." c="#059669" onClick={()=>setPagina('form_divorzio')} />}
          {can("UNIONE_CIVILE") && <Card t="Unione Civile" d="Registrazione nuovi nuclei." c="#047857" onClick={()=>setPagina('form_unione')} />}
        </div>
      </div>
    </div>
  );

  // --- VISTA: FORM ANAGRAFE (ESEMPIO) ---
  if (pagina.startsWith('form_')) return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('menu_anagrafe')} style={backBtn}>← Torna al menu</button>
        <div style={formCard}>
          <h2>{pagina.replace('form_', 'MODULO ').replace('_', ' ').toUpperCase()}</h2>
          <label style={labStyle}>Nome Soggetto (Lore)</label>
          <input style={inputStyle} onChange={(e)=>setForm({...form, soggetto: e.target.value})} />
          <label style={labStyle}>Dettagli Pratica</label>
          <textarea style={{...inputStyle, height:'100px'}} placeholder="Inserisci tutti i dettagli necessari..." onChange={(e)=>setForm({...form, dettagli: e.target.value})} />
          <button onClick={()=>inviaPratica('anagrafe_pratiche', {tipo: pagina, ...form})} disabled={loading} style={submitBtn}>REGISTRA PRATICA</button>
        </div>
      </div>
    </div>
  );

  // --- VISTA: MODULO CONGEDO ---
  if (pagina === 'congedo') return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a'}}>Nuovo Congedo</h2>
          <label style={labStyle}>Nome Lore</label>
          <input style={inputStyle} onChange={(e)=>setForm({...form, nome_lore: e.target.value})} />
          <label style={labStyle}>Periodo</label>
          <input style={inputStyle} placeholder="es. dal 10 al 15" onChange={(e)=>setForm({...form, periodo: e.target.value})} />
          <label style={labStyle}>Motivazione</label>
          <textarea style={{...inputStyle, height:'80px'}} onChange={(e)=>setForm({...form, motivazione: e.target.value})} />
          <button onClick={()=>inviaPratica('congedi', form)} disabled={loading} style={submitBtn}>INVIA</button>
        </div>
      </div>
    </div>
  );

  // --- VISTA: MENU ARCHIVIO ---
  if (pagina === 'archivio_menu') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h1 style={{marginBottom:'30px'}}>Archivio Centrale</h1>
        <div style={gridStyle}>
          <Card t="Archivio Congedi" d="Approva o rifiuta le assenze." c="#ef4444" onClick={()=>setPagina('lista_congedi')} />
          <Card t="Archivio Anagrafe" d="Storico pratiche anagrafiche." c="#10b981" onClick={()=>alert("In sviluppo")} />
        </div>
      </div>
    </div>
  );

  // --- VISTA: LISTA CONGEDI ---
  if (pagina === 'lista_congedi') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('archivio_menu')} style={backBtn}>← Menu Archivi</button>
        <div style={formCard}>
          <h2>Gestione Congedi</h2>
          <table style={tableStyle}>
            <thead><tr style={{borderBottom:'2px solid #eee'}}><th style={th}>DIPENDENTE</th><th style={th}>PERIODO</th><th style={th}>STATO</th><th style={th}>AZIONI</th></tr></thead>
            <tbody>
              {pratiche.map(p => (
                <tr key={p.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                  <td style={td}><b>{p.nickname}</b><br/>{p.nome_lore}</td>
                  <td style={td}>{p.periodo}</td>
                  <td style={{...td, fontWeight:'bold', color: p.stato==='APPROVATA'?'#10b981':p.stato==='RIFIUTATA'?'#ef4444':'#f59e0b'}}>{p.stato}</td>
                  <td style={td}>
                    {p.stato === 'IN ATTESA' && (
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={()=>aggiornaStato(p.id, 'APPROVATA')} style={btnOk}>SÌ</button>
                        <button onClick={()=>aggiornaStato(p.id, 'RIFIUTATA')} style={btnNo}>NO</button>
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
    <div style={loginBg}><div style={loginCard}><h2>Operazione Completata! ✅</h2><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>
  );

  return null;
}

// --- COMPONENTI E STILI ---
function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
      <h3>{t}</h3><p style={{fontSize:'12px', color:'#64748b'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'10px', background:c, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>ENTRA</button>
    </div>
  );
}

const gridStyle = { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px' };
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
const tableStyle = { width:'100%', textAlign:'left', borderCollapse:'collapse' };
const th = { padding:'10px', fontSize:'12px', color:'#64748b' };
const td = { padding:'12px', fontSize:'13px' };
const btnOk = { background:'#10b981', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' };
const btnNo = { background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' };
