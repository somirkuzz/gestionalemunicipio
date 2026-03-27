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
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [archivio, setArchivio] = useState([]);
  const [tabellaCorrente, setTabellaCorrente] = useState('');

  // Funzione di controllo permessi sicura
  const can = (permesso) => {
    if (!user) return false;
    const listaPermessi = PERMESSI[user.r] || [];
    return listaPermessi.includes(permesso);
  };

  const inviaPratica = async (tabella, dati) => {
    setLoading(true);
    const oggi = new Date().toLocaleDateString('it-IT');
    const payload = { ...dati, data: oggi, nome_dipendente: user.n, stato: 'IN ATTESA' };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
      else alert("Errore invio. Verifica le colonne su Supabase.");
    } catch (e) { alert("Errore connessione."); }
    setLoading(false);
  };

  const fetchArchivio = async (tabella) => {
    setLoading(true);
    setTabellaCorrente(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*&order=id.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setArchivio(data || []);
      setPagina('visualizza_archivio');
    } catch (e) { alert("Errore caricamento."); }
    setLoading(false);
  };

  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>ATLANTIS RP</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right'}}><b>{user.n}</b><br/><small>{user.r.replace(/_/g, ' ')}</small></div>
        <button onClick={() => {setUser(null); setPagina('home');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2>LOGIN DIPENDENTI</h2>
      <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Non autorizzato"); }} style={submitBtn}>ACCEDI</button>
    </div></div>
  );

  // --- HOME ---
  if (pagina === 'home') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1>Dashboard</h1>
        <div style={gridStyle}>
          <Card t="Ufficio Anagrafe" d="Moduli e Stato Civile" c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />
          {can("ARCHIVIO") && <Card t="Archivio Centrale" d="Gestione Pratiche" c="#ef4444" onClick={()=>setPagina('menu_archivio')} />}
        </div>
      </div>
    </div>
  );

  // --- MENU ANAGRAFE ---
  if (pagina === 'menu_anagrafe') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h2>Sezioni Disponibili</h2>
        <div style={gridStyle}>
          {can("CAMBIO_NOME") && <Card t="Cambio Nome" d="Nomi/Cognomi" c="#10b981" onClick={()=>setPagina('form_nome')} />}
          {can("ADOZIONE") && <Card t="Adozione" d="Nucleo Familiare" c="#10b981" onClick={()=>setPagina('form_adozione')} />}
          {can("DISCONOSCIMENTO") && <Card t="Disconoscimento" d="Legami Familiari" c="#059669" onClick={()=>setPagina('form_disconoscimento')} />}
          {can("DIVORZIO") && <Card t="Divorzio" d="Cessazione" c="#059669" onClick={()=>setPagina('form_divorzio')} />}
          {can("UNIONE_CIVILE") && <Card t="Unione Civile" d="Matrimoni" c="#047857" onClick={()=>setPagina('form_unione')} />}
        </div>
      </div>
    </div>
  );

  // --- MODULI ---
  if (pagina.startsWith('form_')) return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina('menu_anagrafe')} style={backBtn}>← Torna indietro</button>
        <div style={formCard}>
          {pagina === 'form_nome' && (
            <><h2>Cambio Nome</h2>
            <label style={labStyle}>Vecchio Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, vecchio_nome: e.target.value})} />
            <label style={labStyle}>Nuovo Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, nuovo_nome: e.target.value})} />
            <button onClick={()=>inviaPratica('anagrafe_nomi', form)} style={submitBtn}>INVIA</button></>
          )}
          {pagina === 'form_adozione' && (
            <><h2>Adozione</h2>
            <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio: e.target.value})} />
            <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre: e.target.value})} />
            <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre: e.target.value})} />
            <button onClick={()=>inviaPratica('anagrafe_adozioni', form)} style={submitBtn}>INVIA</button></>
          )}
          {pagina === 'form_disconoscimento' && (
            <><h2>Disconoscimento</h2>
            <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio: e.target.value})} />
            <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre: e.target.value})} />
            <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre: e.target.value})} />
            <button onClick={()=>inviaPratica('anagrafe_disconoscimento', form)} style={submitBtn}>INVIA</button></>
          )}
          {pagina === 'form_divorzio' && (
            <><h2>Divorzio</h2>
            <label style={labStyle}>Nome Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1: e.target.value})} />
            <label style={labStyle}>Nome Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2: e.target.value})} />
            <button onClick={()=>inviaPratica('anagrafe_divorzi', form)} style={submitBtn}>INVIA</button></>
          )}
          {pagina === 'form_unione' && (
            <><h2>Unione Civile</h2>
            <label style={labStyle}>Nome Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1: e.target.value})} />
            <label style={labStyle}>Nome Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2: e.target.value})} />
            <button onClick={()=>inviaPratica('anagrafe_unioni', form)} style={submitBtn}>INVIA</button></>
          )}
        </div>
      </div>
    </div>
  );

  // --- ARCHIVIO ---
  if (pagina === 'menu_archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h2>Revisione Registri</h2>
        <div style={gridStyle}>
          <Card t="Nomi" d="Storico nomi" c="#10b981" onClick={()=>fetchArchivio('anagrafe_nomi')} />
          <Card t="Adozioni" d="Storico adozioni" c="#10b981" onClick={()=>fetchArchivio('anagrafe_adozioni')} />
          <Card t="Disconoscimenti" d="Storico disconoscimenti" c="#059669" onClick={()=>fetchArchivio('anagrafe_disconoscimento')} />
          <Card t="Divorzi" d="Storico divorzi" c="#059669" onClick={()=>fetchArchivio('anagrafe_divorzi')} />
          <Card t="Unioni" d="Storico matrimoni" c="#047857" onClick={()=>fetchArchivio('anagrafe_unioni')} />
        </div>
      </div>
    </div>
  );

  if (pagina === 'visualizza_archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Menu Archivio</button>
        <div style={formCard}>
          <h2>{tabellaCorrente.toUpperCase()}</h2>
          <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid #ddd'}}><th style={td}>DATA</th><th style={td}>DIPENDENTE</th><th style={td}>STATO</th></tr></thead>
            <tbody>
              {archivio.map(i => (
                <tr key={i.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td>
                  <td style={{...td, color: i.stato==='APPROVATA'?'green':'orange', fontWeight:'bold'}}>{i.stato}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2>Inviato! ✅</h2><button onClick={()=>setPagina('home')} style={submitBtn}>DASHBOARD</button></div></div>
  );

  return null;
}

// STILI
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'20px'};
const loginBg={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a',fontFamily:'sans-serif'};
const loginCard={background:'white',padding:'40px',borderRadius:'20px',textAlign:'center',width:'300px'};
const pageBg={minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'};
const navStyle={background:'#1e3a8a',color:'white',padding:'15px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'};
const logoutBtn={background:'#ef4444',color:'white',border:'none',padding:'8px 12px',borderRadius:'6px',cursor:'pointer'};
const container={padding:'40px',maxWidth:'1200px',margin:'0 auto'};
const formCard={background:'white',padding:'30px',borderRadius:'15px',boxShadow:'0 4px 15px rgba(0,0,0,0.05)'};
const labStyle={display:'block',fontSize:'12px',fontWeight:'bold',color:'#64748b',marginTop:'10px'};
const inputStyle={width:'100%',padding:'10px',borderRadius:'8px',border:'1px solid #ddd',boxSizing:'border-box',marginTop:'5px'};
const submitBtn={width:'100%',padding:'12px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',marginTop:'20px'};
const backBtn={background:'none',border:'none',color:'#1e3a8a',fontWeight:'bold',cursor:'pointer',marginBottom:'10px'};
const td={padding:'10px', fontSize:'13px'};

function Card({t,d,c,onClick}){return(<div style={{background:'white',padding:'20px',borderRadius:'12px',borderTop:`5px solid ${c}`,boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}><h3>{t}</h3><p style={{fontSize:'12px',color:'#64748b'}}>{d}</p><button onClick={onClick} style={{width:'100%',padding:'8px',background:c,color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}}>ENTRA</button></div>);}
