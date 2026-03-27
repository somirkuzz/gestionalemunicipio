'use client';
import React, { useState } from 'react';

// --- LISTA COMPLETA 20 DIPENDENTI ---
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

// --- CONFIGURAZIONE PERMESSI ---
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

export default function App() {
  const [user, setUser] = useState(null);
  const [nick, setNick] = useState('');
  const [err, setErr] = useState(false);

  if (!user) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'350px', boxShadow:'0 15px 35px rgba(0,0,0,0.4)'}}>
        <h1 style={{color:'#1e3a8a', fontSize:'22px', fontWeight:'800', marginBottom:'10px'}}>MUNICIPIO ATLANTIS</h1>
        <p style={{fontSize:'12px', color:'#64748b', marginBottom:'25px'}}>ACCESSO RISERVATO DIPENDENTI</p>
        <input 
          style={{width:'100%', padding:'15px', marginBottom:'10px', borderRadius:'10px', border:'2px solid #f1f5f9', boxSizing:'border-box', outline:'none'}} 
          placeholder="Nickname Minecraft" 
          value={nick} 
          onChange={(e) => setNick(e.target.value)} 
        />
        {err && <p style={{color:'#ef4444', fontSize:'11px', fontWeight:'bold', marginBottom:'10px'}}>NON SEI IN WHITELIST</p>}
        <button 
          onClick={() => { if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else setErr(true); }} 
          style={{width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}
        >
          VERIFICA E ACCEDI
        </button>
      </div>
    </div>
  );

  const can = (p) => PERMESSI[user.r]?.includes(p);

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <nav style={{background:'#1e3a8a', color:'white', padding:'15px 35px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:0, fontSize:'18px'}}>SISTEMA MUNICIPIO</h2>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:'bold', fontSize:'14px'}}>{user.n}</div>
          <div style={{fontSize:'10px', color:'#cbd5e1', fontWeight:'bold'}}>{user.r.replace(/_/g, ' ')}</div>
        </div>
      </nav>
      <div style={{padding:'40px', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px', maxWidth:'1200px', margin:'0 auto'}}>
        {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiesta ferie o assenze." c="#1e3a8a" />}
        {can("ANAGRAFE") && <Card t="Pratiche Anagrafe" d="Cambi nome, adozioni, divorzi." c="#10b981" />}
        {can("AMMINISTRATIVO") && <Card t="Ufficio Amministrativo" d="Cambio data e rettifiche." c="#f59e0b" />}
        {can("DIRIGENZA") && <Card t="Pannello Controllo" d="Visualizzazione archivio totale." c="#ef4444" />}
      </div>
    </div>
  );
}

function Card({t, d, c}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
      <h4 style={{margin:'0 0 10px 0', color:'#1e293b'}}>{t}</h4>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px'}}>{d}</p>
      <button style={{width:'100%', padding:'10px', borderRadius:'8px', border:`1px solid ${c}`, background:'white', color:c, fontWeight:'bold', cursor:'pointer'}}>APRI MODULO</button>
    </div>
  );
}
