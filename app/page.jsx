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

  // --- LOGIN ---
  if (!user) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'320px', boxShadow:'0 10px 25px rgba(0,0,0,0.3)'}}>
        <h2 style={{color:'#1e3a8a', marginBottom:'10px', fontSize:'22px'}}>ATLANTIS RP</h2>
        <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px'}}>SISTEMA MUNICIPIO</p>
        <input style={{width:'100%', padding:'12px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box'}} placeholder="Nickname" value={nick} onChange={(e) => setNick(e.target.value)} />
        {err && <p style={{color:'red', fontSize:'11px', marginBottom:'10px'}}>Utente non autorizzato</p>}
        <button onClick={() => { if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else setErr(true); }} style={{width:'100%', padding:'12px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>ACCEDI</button>
      </div>
    </div>
  );

  const can = (p) => PERMESSI[user.r]?.includes(p);

  // --- VISTA: MODULO CONGEDO (PAGINA INTERA) ---
  if (paginaAttiva === 'congedo') return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <div style={{background:'#1e3a8a', padding:'20px 40px', color:'white', display:'flex', alignItems:'center', gap:'20px'}}>
         <button onClick={() => setPaginaAttiva('dashboard')} style={{background:'rgba(255,255,255,0.1)', border:'1px solid white', color:'white', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}>← Indietro</button>
         <h2 style={{margin:0, fontSize:'18px'}}>Nuova Richiesta di Congedo</h2>
      </div>

      <div style={{padding:'40px', maxWidth:'700px', margin:'0 auto'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
            <div>
              <label style={labelStyle}>Nome e Cognome Lore</label>
              <input style={inputStyle} placeholder="Nome e Cognome Roleplay" />
            </div>
            <div>
              <label style={labelStyle}>Nickname</label>
              <input style={{...inputStyle, background:'#e2e8f0'}} value={user.n} disabled />
            </div>
          </div>

          <label style={labelStyle}>Ruolo Attuale</label>
          <input style={{...inputStyle, background:'#e2e8f0'}} value={user.r.replace(/_/g, ' ')} disabled />

          <label style={labelStyle}>Periodo del Congedo</label>
          <input style={inputStyle} placeholder="Esempio: dal 10/04 al 15/04" />

          <label style={labelStyle}>Motivazione della richiesta</label>
          <textarea style={{...inputStyle, height:'120px', resize:'none'}} placeholder="Descrivi il motivo..."></textarea>

          <button style={{width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}>INVIA PRATICA</button>
        </div>
      </div>
    </div>
  );

  // --- VISTA: DASHBOARD PRINCIPALE ---
  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <nav style={{background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin:0, fontSize:'20px'}}>MUNICIPIO</h2>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:'bold'}}>{user.n}</div>
          <div style={{fontSize:'10px', color:'#cbd5e1'}}>{user.r.replace(/_/g, ' ')}</div>
        </div>
      </nav>

      <div style={{padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        <h1 style={{color:'#0f172a', marginBottom:'30px'}}>Benvenuto nel Gestionale</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Compila la richiesta di ferie." c="#1e3a8a" btn="Vai al modulo" onClick={() => setPaginaAttiva('congedo')} />}
          {can("ANAGRAFE") && <Card t="Pratiche Anagrafe" d="Gestione cittadini e nomi." c="#10b981" btn="Apri Ufficio" />}
          {can("AMMINISTRATIVO") && <Card t="Ufficio Amministrativo" d="Rettifiche e documenti." c="#f59e0b" btn="Apri Ufficio" />}
          {can("DIRIGENZA") && <Card t="Archivio Totale" d="Pannello di controllo supremo." c="#ef4444" btn="Entra" />}
        </div>
      </div>
    </div>
  );
}

// STILI RAPIDI
const labelStyle = { display:'block', fontSize:'11px', fontWeight:'800', color:'#475569', marginBottom:'5px', textTransform:'uppercase' };
const inputStyle = { width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'2px solid #f1f5f9', outline:'none', boxSizing:'border-box' };

function Card({t, d, c, btn, onClick}) {
  return (
    <div style={{background:'white', padding:'30px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
      <h3 style={{margin:'0 0 10px 0', color:'#1e293b'}}>{t}</h3>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px', height:'35px'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'none', background:c, color:'white', fontWeight:'bold', cursor:'pointer'}}>{btn}</button>
    </div>
  );
}
