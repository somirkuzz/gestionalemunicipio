'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xvtfdbuomstrpfmprojwrg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dGZkYnVvbXN0cnBmcm9qd3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDQ5OTcsImV4cCI6MjA5MDE4MDk5N30.6yt3myNpafxXB12b75vGYMcmLRcGnV1x8a1wA8F4RoI'
);

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
  const [err, setErr] = useState(false);
  const [paginaAttiva, setPaginaAttiva] = useState('dashboard'); 
  const [pratiche, setPratiche] = useState([]);
  const [form, setForm] = useState({ nome_lore: '', periodo: '', motivazione: '' });

  // --- CARICA PRATICHE NELL'ARCHIVIO ---
  useEffect(() => {
    if (paginaAttiva === 'archivio') {
      supabase.from('congedi').select('*').order('id', { ascending: false })
        .then(({ data }) => setPratiche(data || []));
    }
  }, [paginaAttiva]);

  // --- INVIA CONGEDO ---
  const inviaCongedo = async () => {
    const { error } = await supabase.from('congedi').insert([{
      nome_lore: form.nome_lore,
      nickname: user.n,
      ruolo: user.r,
      periodo: form.periodo,
      motivazione: form.motivazione,
      stato: 'IN ATTESA'
    }]);
    if (!error) setPaginaAttiva('successo');
  };

  if (!user) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', width:'320px', boxShadow:'0 10px 25px rgba(0,0,0,0.4)'}}>
        <h2 style={{color:'#1e3a8a', marginBottom:'10px', fontSize:'24px', fontWeight:'800'}}>ATLANTIS RP</h2>
        <input style={loginInput} placeholder="Nickname" value={nick} onChange={(e) => setNick(e.target.value)} />
        <button onClick={() => { if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else setErr(true); }} style={loginBtn}>ACCEDI</button>
      </div>
    </div>
  );

  const Header = () => (
    <nav style={navStyle}>
      <h2 style={{margin:0, fontSize:'18px', cursor:'pointer'}} onClick={() => setPaginaAttiva('dashboard')}>MUNICIPIO ATLANTIS</h2>
      <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:'bold'}}>{user.n}</div>
          <div style={{fontSize:'10px', color:'#cbd5e1'}}>{user.r.replace(/_/g, ' ')}</div>
        </div>
        <button onClick={() => setUser(null)} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // --- ARCHIVIO (SOLO DIREZIONE) ---
  if (paginaAttiva === 'archivio' && PERMESSI[user.r].includes("DIRIGENZA")) return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'1000px', margin:'0 auto'}}>
        <button onClick={() => setPaginaAttiva('dashboard')} style={backBtn}>← Torna Home</button>
        <div style={{background:'white', borderRadius:'15px', padding:'25px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
          <h2 style={{color:'#1e3a8a', marginBottom:'25px'}}>Gestione Richieste Congedi</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left', color:'#64748b', fontSize:'12px', borderBottom:'2px solid #f1f5f9'}}>
                <th style={{padding:'10px'}}>NICKNAME</th>
                <th>NOME LORE</th>
                <th>PERIODO</th>
                <th>STATO</th>
              </tr>
            </thead>
            <tbody>
              {pratiche.map((p) => (
                <tr key={p.id} style={{borderBottom:'1px solid #f8fafc', fontSize:'13px'}}>
                  <td style={{padding:'15px', fontWeight:'bold'}}>{p.nickname}</td>
                  <td>{p.nome_lore}</td>
                  <td>{p.periodo}</td>
                  <td style={{color: p.stato === 'IN ATTESA' ? '#f59e0b' : '#10b981', fontWeight:'bold'}}>{p.stato}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pratiche.length === 0 && <p style={{textAlign:'center', marginTop:'20px', color:'#94a3b8'}}>Nessuna pratica trovata.</p>}
        </div>
      </div>
    </div>
  );

  // --- MODULO CONGEDO ---
  if (paginaAttiva === 'congedo') return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'600px', margin:'0 auto'}}>
        <div style={formCard}>
          <h2 style={{color:'#1e3a8a'}}>Modulo Congedo</h2>
          <label style={labelStyle}>Nome Lore</label>
          <input style={inputStyle} onChange={(e) => setForm({...form, nome_lore: e.target.value})} />
          <label style={labelStyle}>Periodo</label>
          <input style={inputStyle} placeholder="es. dal 1/05 al 5/05" onChange={(e) => setForm({...form, periodo: e.target.value})} />
          <label style={labelStyle}>Motivo</label>
          <textarea style={{...inputStyle, height:'100px'}} onChange={(e) => setForm({...form, motivazione: e.target.value})} />
          <button onClick={inviaCongedo} style={submitBtn}>INVIA AL MUNICIPIO</button>
        </div>
      </div>
    </div>
  );

  if (paginaAttiva === 'successo') return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', boxShadow:'0 10px 25px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:'50px', color:'#10b981'}}>✓</div>
        <h2>Inviata con Successo!</h2>
        <button onClick={() => setPaginaAttiva('dashboard')} style={submitBtn}>TORNA ALLA HOME</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <Header />
      <div style={{padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        <h1>Dashboard Uffici</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
          <Card t="Modulo Congedo" d="Richiedi ferie." c="#1e3a8a" onClick={() => setPaginaAttiva('congedo')} />
          {PERMESSI[user.r].includes("DIRIGENZA") && <Card t="Archivio Centrale" d="Gestione pratiche." c="#ef4444" onClick={() => setPaginaAttiva('archivio')} />}
        </div>
      </div>
    </div>
  );
}

// STILI (Mantenuti per coerenza)
const navStyle = { background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' };
const logoutBtn = { background:'#ef4444', color:'white', border:'none', padding:'8px 12px', borderRadius:'6px', cursor:'pointer', fontSize:'11px' };
const loginInput = { width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'10px', border:'1px solid #ddd' };
const loginBtn = { width:'100%', padding:'12px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', cursor:'pointer' };
const backBtn = { background:'none', border:'none', color:'#1e3a8a', fontWeight:'bold', cursor:'pointer', marginBottom:'10px' };
const formCard = { background:'white', padding:'30px', borderRadius:'20px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)' };
const labelStyle = { display:'block', fontSize:'11px', fontWeight:'bold', color:'#475569', marginBottom:'5px' };
const inputStyle = { width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #f1f5f9', boxSizing:'border-box' };
const submitBtn = { width:'100%', padding:'15px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer' };

function Card({t, d, c, onClick}) {
  return (
    <div style={{background:'white', padding:'25px', borderRadius:'15px', borderTop:`6px solid ${c}`, boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
      <h3>{t}</h3>
      <p style={{fontSize:'12px', color:'#64748b'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'none', background:c, color:'white', fontWeight:'bold', cursor:'pointer'}}>ENTRA</button>
    </div>
  );
}
