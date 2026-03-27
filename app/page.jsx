'use client';
import React, { useState } from 'react';

// --- DATABASE COMPLETO DIPENDENTI ---
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

// --- CONFIGURAZIONE PERMESSI PER RUOLO ---
const PERMESSI_RUOLI = {
  "DIRIGENTE": ["CONGEDO", "CAMBIO_NOME", "CAMBIO_DATA", "ADOZIONE", "DIVORZIO", "AMMINISTRAZIONE"],
  "VICE_DIRIGENTE": ["CONGEDO", "CAMBIO_NOME", "CAMBIO_DATA", "ADOZIONE", "DIVORZIO", "AMMINISTRAZIONE"],
  "SEGRETARIO_COMUNALE": ["CONGEDO", "CAMBIO_NOME", "CAMBIO_DATA", "ADOZIONE", "DIVORZIO"],
  "COORDINATORE_UFFICI": ["CONGEDO", "CAMBIO_NOME", "CAMBIO_DATA", "ADOZIONE", "DIVORZIO"],
  "RESPONSABILE_ANAGRAFE": ["CONGEDO", "CAMBIO_NOME", "ADOZIONE", "DIVORZIO"],
  "VICE_RESPONSABILE_ANAGRAFE": ["CONGEDO", "CAMBIO_NOME", "ADOZIONE", "DIVORZIO"],
  "SUPERVISORE_ANAGRAFE": ["CONGEDO", "CAMBIO_NOME", "ADOZIONE"],
  "IMPIEGATO_ANAGRAFE": ["CONGEDO", "CAMBIO_NOME"],
  "RESPONSABILE_AMMINISTRATIVO": ["CONGEDO", "CAMBIO_DATA"],
  "IMPIEGATO_AMMINISTRATIVO": ["CONGEDO"],
  "APPRENDISTA": ["CONGEDO"]
};

export default function Gestionale() {
  const [user, setUser] = useState(null);
  const [nickInput, setNickInput] = useState('');
  const [error, setError] = useState(false);

  const login = () => {
    const ruolo = DIPENDENTI[nickInput];
    if (ruolo) {
      setUser({ nick: nickInput, ruolo: ruolo });
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'Arial, sans-serif'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'20px', width:'350px', textAlign:'center', boxShadow:'0 15px 35px rgba(0,0,0,0.4)'}}>
          <h1 style={{color:'#1e3a8a', fontSize:'24px', margin:'0 0 10px 0', fontWeight:'800'}}>ATLANTIS RP</h1>
          <p style={{color:'#64748b', fontSize:'13px', marginBottom:'25px', fontWeight:'600'}}>MUNICIPIO - ACCESSO DIPENDENTI</p>
          <input 
            style={{width:'100%', padding:'15px', marginBottom:'10px', border:'2px solid #f1f5f9', borderRadius:'10px', boxSizing:'border-box', outline:'none'}}
            placeholder="Nickname Minecraft"
            value={nickInput}
            onChange={(e) => setNickInput(e.target.value)}
          />
          {error && <p style={{color:'#ef4444', fontSize:'11px', fontWeight:'bold', marginBottom:'10px'}}>NICKNAME NON AUTORIZZATO</p>}
          <button 
            onClick={login}
            style={{width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}
          >
            ENTRA NEL SISTEMA
          </button>
        </div>
      </div>
    );
  }

  const check = (perm) => PERMESSI_RUOLI[user.ruolo]?.includes(perm);

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'Arial, sans-serif'}}>
      <nav style={{background:'#1e3a8a', color:'white', padding:'15px 30px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin:0, fontSize:'20px'}}>SISTEMA MUNICIPIO</h2>
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:'bold', fontSize:'14px'}}>{user.nick}</div>
            <div style={{fontSize:'10px', color:'#cbd5e1', fontWeight:'bold'}}>{user.ruolo.replace(/_/g, ' ')}</div>
          </div>
          <button onClick={() => setUser(null)} style={{background:'#ef4444', border:'none', color:'white', padding:'8px 12px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'}}>ESCI</button>
        </div>
      </nav>

      <div style={{padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          {check("CONGEDO") && <Card t="Modulo Congedo" d="Richiesta di ferie o permessi." c="#1e3a8a" />}
          {check("CAMBIO_NOME") && <Card t="Cambio Nome/Cognome" d="Pratica per modifica dati cittadini." c="#10b981" />}
          {check("CAMBIO_DATA") && <Card t="Cambio Data" d="Rettifica registri ufficiali." c="#f59e0b" />}
          {check("ADOZIONE") && <Card t="Modulo Adozione" d="Pratiche per nuovi legami familiari." c="#8b5cf6" />}
          {check("DIVORZIO") && <Card t="Modulo Divorzio" d="Cessazione vincoli matrimoniali." c="#ef4444" />}
        </div>

        {check("AMMINISTRAZIONE") && (
          <div style={{marginTop:'40px', padding:'25px', background:'#fef2f2', border:'2px dashed #ef4444', borderRadius:'15px', textAlign:'center'}}>
            <h3 style={{color:'#991b1b', margin:'0 0 10px 0'}}>PANNELLO DIRIGENZA</h3>
            <p style={{color:'#b91c1c', fontSize:'13px'}}>Hai accesso completo all'archivio e alla gestione del personale.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({t, d, c}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 10px 15px rgba(0,0,0,0.05)'}}>
      <h4 style={{margin:'0 0 10px 0', color:'#1e293b'}}>{t}</h4>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px'}}>{d}</p>
      <button style={{width:'100%', padding:'10px', borderRadius:'8px', border:`1px solid ${c}`, background:'white', color:c, fontWeight:'bold', cursor:'pointer'}}>APRI MODULO</button>
    </div>
  );
}
