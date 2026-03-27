'use client';
import React, { useState } from 'react';

// DATABASE COMPLETO 20 DIPENDENTI (Memorizzato)
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

// CONFIGURAZIONE ACCESSI
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
  const [err, setErr] = useState(false);
  const [paginaAttiva, setPaginaAttiva] = useState('dashboard'); 

  // Funzione Logout
  const handleLogout = () => {
    setUser(null);
    setNick('');
    setPaginaAttiva('dashboard');
  };

  // --- LOGIN ---
  if (!user) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'320px', boxShadow:'0 10px 25px rgba(0,0,0,0.4)'}}>
        <h2 style={{color:'#1e3a8a', marginBottom:'10px', fontSize:'24px', fontWeight:'800'}}>ATLANTIS RP</h2>
        <p style={{fontSize:'12px', color:'#64748b', marginBottom:'25px', letterSpacing:'1px'}}>SISTEMA MUNICIPIO</p>
        <input style={loginInput} placeholder="Nickname Minecraft" value={nick} onChange={(e) => setNick(e.target.value)} />
        {err && <p style={{color:'#ef4444', fontSize:'11px', fontWeight:'bold', marginBottom:'10px'}}>ACCESSO NEGATO</p>}
        <button onClick={() => { if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else setErr(true); }} style={loginBtn}>ACCEDI</button>
      </div>
    </div>
  );

  const can = (p) => PERMESSI[user.r]?.includes(p);

  // --- BARRA DI NAVIGAZIONE (HEADER) ---
  const Header = () => (
    <nav style={navStyle}>
      <h2 style={{margin:0, fontSize:'20px', cursor:'pointer'}} onClick={() => setPaginaAttiva('dashboard')}>MUNICIPIO</h2>
      <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:'bold', fontSize:'14px'}}>{user.n}</div>
          <div style={{fontSize:'10px', color:'#cbd5e1', fontWeight:'bold'}}>{user.r.replace(/_/g, ' ')}</div>
        </div>
        <button 
          onClick={handleLogout}
          style={logoutBtn}
          onMouseOver={(e) => e.target.style.background = '#be123c'}
          onMouseOut={(e) => e.target.style.background = '#ef4444'}
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );

  // --- VISTA: MODULO CONGEDO ---
  if (paginaAttiva === 'congedo') return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'700px', margin:'0 auto'}}>
        <button onClick={() => setPaginaAttiva('dashboard')} style={backBtn}>← Torna alla Dashboard</button>
        <div style={formCard}>
          <h2 style={{marginTop:0, color:'#1e3a8a', borderBottom:'2px solid #f1f5f9', paddingBottom:'15px'}}>Richiesta Congedo</h2>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
            <div>
              <label style={labelStyle}>Nome e Cognome Lore</label>
              <input style={inputStyle} placeholder="Nome Cognome IC" />
            </div>
            <div>
              <label style={labelStyle}>Nickname</label>
              <input style={{...inputStyle, background:'#f1f5f9'}} value={user.n} disabled />
            </div>
          </div>

          <label style={labelStyle}>Ruolo Lavorativo</label>
          <input style={{...inputStyle, background:'#f1f5f9'}} value={user.r.replace(/_/g, ' ')} disabled />

          <label style={labelStyle}>Tempo del Congedo</label>
          <input style={inputStyle} placeholder="es. dal 15/05 al 20/05" />

          <label style={labelStyle}>Motivazione</label>
          <textarea style={{...inputStyle, height:'120px', resize:'none'}} placeholder="Inserisci il motivo della richiesta..."></textarea>

          <button style={submitBtn}>INVIA PRATICA UFFICIALE</button>
        </div>
      </div>
    </div>
  );

  // --- VISTA: DASHBOARD ---
  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        <h1 style={{color:'#0f172a', marginBottom:'5px', fontSize:'28px'}}>Benvenuto, {user.n}</h1>
        <p style={{color:'#64748b', marginBottom:'40px'}}>Seleziona l'ufficio con cui vuoi interagire.</p>
        
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Compila la richiesta di ferie o assenza." c="#1e3a8a" btn="Vai al modulo" onClick={() => setPaginaAttiva('congedo')} />}
          {can("ANAGRAFE") && <Card t="Pratiche Anagrafe" d="Gestione cittadini, nomi e documenti." c="#10b981" btn="Apri Ufficio" />}
          {can("AMMINISTRATIVO") && <Card t="Ufficio Amministrativo" d="Rettifiche date e atti pubblici." c="#f59e0b" btn="Apri Ufficio" />}
          {can("DIRIGENZA") && <Card t="Archivio Totale" d="Pannello di controllo supremo." c="#ef4444" btn="Entra" />}
        </div>
      </div>
    </div>
  );
}

// --- STILI ---
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 15px', borderRadius:'6px', fontWeight:'bold', cursor:'pointer', fontSize:'11px', transition:'0.2s' };
const loginInput = { width:'100%', padding:'15px', marginBottom:'15px', borderRadius:'10px', border:'2px solid #f1f5f9', outline:'none', boxSizing:'border-box' };
const loginBtn = { width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold', fontSize:'16px' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'20px', fontSize:'14px' };
const formCard = { background:'white', padding:'40px', borderRadius:'20px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)' };
const labelStyle = { display:'block', fontSize:'11px', fontWeight:'800', color:'#475569', marginBottom:'8px', textTransform:'uppercase' };
const inputStyle = { width:'100%', padding:'12px', marginBottom:'25px', borderRadius:'8px', border:'2px solid #f1f5f9', outline:'none', boxSizing:'border-box', fontSize:'14px' };
const submitBtn = { width:'100%', padding:'18px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', fontSize:'16px', boxShadow:'0 4px 12px rgba(30, 58, 138, 0.3)' };

function Card({t, d, c, btn, onClick}) {
  return (
    <div style={{background:'white', padding:'30px', borderRadius:'18px', borderTop:`8px solid ${c}`, boxShadow:'0 4px 20px rgba(0,0,0,0.05)', transition:'0.3s'}}>
      <h3 style={{margin:'0 0 10px 0', color:'#1e293b', fontSize:'20px'}}>{t}</h3>
      <p style={{fontSize:'13px', color:'#64748b', marginBottom:'25px', lineHeight:'1.5'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'none', background:c, color:'white', fontWeight:'bold', cursor:'pointer'}}>{btn}</button>
    </div>
  );
}
