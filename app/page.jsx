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

  const handleLogout = () => { setUser(null); setNick(''); setPaginaAttiva('dashboard'); };

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

  const Header = () => (
    <nav style={navStyle}>
      <h2 style={{margin:0, fontSize:'18px', cursor:'pointer'}} onClick={() => setPaginaAttiva('dashboard')}>MUNICIPIO ATLANTIS</h2>
      <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:'bold', fontSize:'14px'}}>{user.n}</div>
          <div style={{fontSize:'10px', color:'#cbd5e1', fontWeight:'bold'}}>{user.r.replace(/_/g, ' ')}</div>
        </div>
        <button onClick={handleLogout} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // --- SCHERMATA: ARCHIVIO (SOLO DIREZIONE) ---
  if (paginaAttiva === 'archivio' && can("DIRIGENZA")) return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'1000px', margin:'0 auto'}}>
        <button onClick={() => setPaginaAttiva('dashboard')} style={backBtn}>← Dashboard</button>
        <h1 style={{color:'#1e3a8a', marginBottom:'20px'}}>Archivio Pratiche Centrale</h1>
        <div style={{background:'white', borderRadius:'15px', padding:'20px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #f1f5f9', textAlign:'left', color:'#64748b', fontSize:'12px'}}>
                <th style={{padding:'15px'}}>DATA</th>
                <th>TIPO</th>
                <th>DIPENDENTE</th>
                <th>STATO</th>
                <th>AZIONI</th>
              </tr>
            </thead>
            <tbody style={{fontSize:'14px'}}>
              <tr style={{borderBottom:'1px solid #f8fafc'}}>
                <td style={{padding:'15px'}}>27/03/2026</td>
                <td><span style={{background:'#e0f2fe', color:'#0369a1', padding:'4px 8px', borderRadius:'5px', fontSize:'11px', fontWeight:'bold'}}>CONGEDO</span></td>
                <td>Paolix09XL</td>
                <td><span style={{color:'#f59e0b', fontWeight:'bold'}}>IN ATTESA</span></td>
                <td><button style={{background:'#1e3a8a', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer', fontSize:'11px'}}>VEDI</button></td>
              </tr>
              {/* Qui in futuro caricheremo le vere pratiche */}
            </tbody>
          </table>
          <p style={{textAlign:'center', color:'#94a3b8', fontSize:'12px', marginTop:'20px'}}>Nessun'altra pratica recente trovata.</p>
        </div>
      </div>
    </div>
  );

  // --- SCHERMATA: MODULO CONGEDO ---
  if (paginaAttiva === 'congedo') return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'700px', margin:'0 auto'}}>
        <button onClick={() => setPaginaAttiva('dashboard')} style={backBtn}>← Dashboard</button>
        <div style={formCard}>
          <h2 style={{marginTop:0, color:'#1e3a8a'}}>Modulo di Congedo</h2>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
            <div><label style={labelStyle}>Nome Lore</label><input style={inputStyle} placeholder="Nome Cognome IC" /></div>
            <div><label style={labelStyle}>Nickname</label><input style={{...inputStyle, background:'#f1f5f9'}} value={user.n} disabled /></div>
          </div>
          <label style={labelStyle}>Ruolo</label><input style={{...inputStyle, background:'#f1f5f9'}} value={user.r.replace(/_/g, ' ')} disabled />
          <label style={labelStyle}>Periodo</label><input style={inputStyle} placeholder="es. dal 20/06 al 25/06" />
          <label style={labelStyle}>Motivo</label><textarea style={{...inputStyle, height:'100px', resize:'none'}} placeholder="Spiega il motivo..."></textarea>
          <button onClick={() => setPaginaAttiva('successo')} style={submitBtn}>INVIA AL MUNICIPIO</button>
        </div>
      </div>
    </div>
  );

  if (paginaAttiva === 'successo') return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'50px', borderRadius:'25px', textAlign:'center', maxWidth:'400px', boxShadow:'0 20px 50px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:'60px', color:'#10b981', marginBottom:'20px'}}>✓</div>
        <h2 style={{color:'#1e3a8a'}}>Inviata con Successo!</h2>
        <button onClick={() => setPaginaAttiva('dashboard')} style={submitBtn}>TORNA ALLA HOME</button>
      </div>
    </div>
  );

  // --- DASHBOARD ---
  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        <h1 style={{color:'#0f172a', fontSize:'28px'}}>Uffici Municipali</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px', marginTop:'30px'}}>
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiedi ferie o permessi." c="#1e3a8a" onClick={() => setPaginaAttiva('congedo')} />}
          {can("ANAGRAFE") && <Card t="Ufficio Anagrafe" d="Cambi nome, adozioni, divorzi." c="#10b981" onClick={() => {}} />}
          {can("AMMINISTRATIVO") && <Card t="Amministrazione" d="Rettifica documenti e date." c="#f59e0b" onClick={() => {}} />}
          
          {/* VISIBILE SOLO A DIRETTORI E VICE */}
          {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Pannello di controllo riservato." c="#ef4444" onClick={() => setPaginaAttiva('archivio')} />}
        </div>
      </div>
    </div>
  );
}

// STILI
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 15px', borderRadius:'6px', fontWeight:'bold', cursor:'pointer', fontSize:'11px' };
const loginInput = { width:'100%', padding:'15px', marginBottom:'15px', borderRadius:'10px', border:'2px solid #f1f5f9', outline:'none', boxSizing:'border-box' };
const loginBtn = { width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'15px' };
const formCard = { background:'white', padding:'40px', borderRadius:'20px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)' };
const labelStyle = { display:'block', fontSize:'11px', fontWeight:'800', color:'#475569', marginBottom:'5px', textTransform:'uppercase' };
const inputStyle = { width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'8px', border:'2px solid #f1f5f9', outline:'none', boxSizing:'border-box' };
const submitBtn = { width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer' };

function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'30px', borderRadius:'18px', borderTop:`8px solid ${c}`, boxShadow:'0 4px 20px rgba(0,0,0,0.05)'}}>
      <h3 style={{margin:'0 0 10px 0', color:'#1e293b'}}>{t}</h3>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'25px'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'none', background:c, color:'white', fontWeight:'bold', cursor:'pointer'}}>ENTRA</button>
    </div>
  );
}
