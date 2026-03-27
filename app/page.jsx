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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [datiArchivio, setDatiArchivio] = useState([]);
  const [tabellaAttiva, setTabellaAttiva] = useState('');

  const can = (p) => user && PERMESSI[user.r]?.includes(p);

  // --- FUNZIONI DATABASE ---
  const inviaDato = async (tabella, payload) => {
    setLoading(true);
    const oggi = new Date().toLocaleDateString('it-IT');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nome_dipendente: user.n, data: oggi, stato: 'IN ATTESA' })
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
      else alert("Errore: Verifica che le colonne sulla tabella Supabase siano corrette.");
    } catch (e) { alert("Errore di connessione."); }
    setLoading(false);
  };

  const fetchArchivio = async (tabella) => {
    setLoading(true);
    setTabellaAttiva(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*&order=id.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setDatiArchivio(data || []);
      setPagina('visualizza_archivio');
    } catch (e) { alert("Errore nel caricamento dati."); }
    setLoading(false);
  };

  const cambiaStato = async (id, nuovoStato) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/${tabellaAttiva}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ stato: nuovoStato })
      });
      fetchArchivio(tabellaAttiva);
    } catch (e) { console.error(e); }
  };

  // --- UI COMPONENTS ---
  const Header = () => (
    <nav style={navStyle}>
      <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>MUNICIPIO ATLANTIS</h2>
      <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
        <div style={{textAlign:'right'}}><b>{user.n}</b><br/><small>{user.r.replace(/_/g, ' ')}</small></div>
        <button onClick={() => {setUser(null); setPagina('home');}} style={logoutBtn}>LOGOUT</button>
      </div>
    </nav>
  );

  // --- LOGIC PAGINE ---
  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a'}}>PORTALE DIPENDENTI</h2>
      <input style={inputStyle} placeholder="Inserisci Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Nickname non autorizzato."); }} style={submitBtn}>ACCEDI</button>
    </div></div>
  );

  if (pagina === 'home') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <h1>Dashboard Principale</h1>
        <div style={gridStyle}>
          <Card t="Ufficio Anagrafe" d="Gestione moduli e stato civile." c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />
          {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiedi permessi e ferie." c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
          {can("ARCHIVIO") && <Card t="Archivio Centrale" d="Supervisione e approvazione pratiche." c="#ef4444" onClick={()=>setPagina('menu_archivio')} />}
        </div>
      </div>
    </div>
  );

  if (pagina === 'menu_anagrafe') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h2>Sezioni Anagrafe</h2>
        <div style={gridStyle}>
          {can("CAMBIO_NOME") && <Card t="Cambio Nome" d="Modifica generalità visibili." c="#10b981" onClick={()=>setPagina('form_nome')} />}
          {can("ADOZIONE") && <Card t="Adozione" d="Modulo legale adozione figli." c="#10b981" onClick={()=>setPagina('form_adozione')} />}
          {can("DISCONOSCIMENTO") && <Card t="Disconoscimento" d="Modulo disconoscimento familiare." c="#059669" onClick={()=>setPagina('form_disconoscimento')} />}
          {can("DIVORZIO") && <Card t="Divorzio" d="Cessazione matrimonio." c="#059669" onClick={()=>setPagina('form_divorzio')} />}
          {can("UNIONE_CIVILE") && <Card t="Unione Civile" d="Matrimoni e unioni civili." c="#047857" onClick={()=>setPagina('form_unione')} />}
        </div>
      </div>
    </div>
  );

  // --- FORM SPECIFICI ---
  if (pagina.startsWith('form_')) return (
    <div style={pageBg}><Header />
      <div style={{...container, maxWidth:'600px'}}>
        <button onClick={()=>setPagina(pagina === 'form_congedo' ? 'home' : 'menu_anagrafe')} style={backBtn}>← Indietro</button>
        <div style={formCard}>
          {pagina === 'form_nome' && <>
            <h2>Cambio Nome/Cognome</h2>
            <label style={labStyle}>Vecchio Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, vecchio_nome: e.target.value})} />
            <label style={labStyle}>Nuovo Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, nuovo_nome: e.target.value})} />
            <button onClick={()=>inviaDato('anagrafe_nomi', form)} style={submitBtn}>REGISTRA</button>
          </>}
          {pagina === 'form_adozione' && <>
            <h2>Modulo Adozione</h2>
            <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio: e.target.value})} />
            <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre: e.target.value})} />
            <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre: e.target.value})} />
            <button onClick={()=>inviaDato('anagrafe_adozioni', form)} style={submitBtn}>REGISTRA</button>
          </>}
          {pagina === 'form_disconoscimento' && <>
            <h2>Modulo Disconoscimento</h2>
            <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio: e.target.value})} />
            <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre: e.target.value})} />
            <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre: e.target.value})} />
            <button onClick={()=>inviaDato('anagrafe_disconoscimento', form)} style={submitBtn}>REGISTRA</button>
          </>}
          {pagina === 'form_divorzio' && <>
            <h2>Modulo Divorzio</h2>
            <label style={labStyle}>Nome Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1: e.target.value})} />
            <label style={labStyle}>Nome Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2: e.target.value})} />
            <button onClick={()=>inviaDato('anagrafe_divorzi', form)} style={submitBtn}>REGISTRA</button>
          </>}
          {pagina === 'form_unione' && <>
            <h2>Unione Civile / Matrimonio</h2>
            <label style={labStyle}>Nome Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1: e.target.value})} />
            <label style={labStyle}>Nome Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2: e.target.value})} />
            <button onClick={()=>inviaDato('anagrafe_unioni', form)} style={submitBtn}>REGISTRA</button>
          </>}
        </div>
      </div>
    </div>
  );

  // --- ARCHIVIO ---
  if (pagina === 'menu_archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('home')} style={backBtn}>← Dashboard</button>
        <h2>Scegli Registro da Revisionare</h2>
        <div style={gridStyle}>
          <Card t="Registro Nomi" d="Cambio generalità." c="#10b981" onClick={()=>fetchArchivio('anagrafe_nomi')} />
          <Card t="Registro Adozioni" d="Pratiche adozione." c="#10b981" onClick={()=>fetchArchivio('anagrafe_adozioni')} />
          <Card t="Registro Divorzi" d="Pratiche divorzio." c="#059669" onClick={()=>fetchArchivio('anagrafe_divorzi')} />
          <Card t="Registro Unioni" d="Matrimoni effettuati." c="#047857" onClick={()=>fetchArchivio('anagrafe_unioni')} />
        </div>
      </div>
    </div>
  );

  if (pagina === 'visualizza_archivio') return (
    <div style={pageBg}><Header />
      <div style={container}>
        <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Menu Archivio</button>
        <div style={formCard}>
          <h2>Registro: {tabellaAttiva.toUpperCase()}</h2>
          <div style={{overflowX:'auto'}}>
            <table style={tableStyle}>
              <thead>
                <tr style={{borderBottom:'2px solid #ddd'}}>
                  <th style={th}>DATA</th><th style={th}>DIPENDENTE</th><th style={th}>STATO</th><th style={th}>AZIONI</th>
                </tr>
              </thead>
              <tbody>
                {datiArchivio.map(d => (
                  <tr key={d.id} style={{borderBottom:'1px solid #eee'}}>
                    <td style={td}>{d.data}</td>
                    <td style={td}>{d.nome_dipendente}</td>
                    <td style={{...td, fontWeight:'bold', color: d.stato === 'APPROVATA' ? '#10b981' : d.stato === 'RIFIUTATA' ? '#ef4444' : '#f59e0b'}}>{d.stato}</td>
                    <td style={td}>
                      {d.stato === 'IN ATTESA' && (
                        <div style={{display:'flex', gap:'5px'}}>
                          <button onClick={()=>cambiaStato(d.id, 'APPROVATA')} style={btnOk}>SÌ</button>
                          <button onClick={()=>cambiaStato(d.id, 'RIFIUTATA')} style={btnNo}>NO</button>
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
    </div>
  );

  if (pagina === 'successo') return (
    <div style={loginBg}><div style={loginCard}><h2>Operazione Riuscita! ✅</h2><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>
  );

  return null;
}

// --- STILI CSS ---
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'25px'};
const loginBg={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a',fontFamily:'sans-serif'};
const loginCard={background:'white',padding:'40px',borderRadius:'20px',textAlign:'center',width:'350px'};
const pageBg={minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'};
const navStyle={background:'#1e3a8a',color:'white',padding:'15px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'};
const logoutBtn={background:'#ef4444',color:'white',border:'none',padding:'8px 12px',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'};
const container={padding:'40px',maxWidth:'1200px',margin:'0 auto'};
const formCard={background:'white',padding:'30px',borderRadius:'15px',boxShadow:'0 4px 15px rgba(0,0,0,0.05)'};
const labStyle={display:'block',fontSize:'11px',fontWeight:'bold',color:'#64748b',marginBottom:'5px',marginTop:'10px'};
const inputStyle={width:'100%',padding:'10px',marginBottom:'5px',borderRadius:'8px',border:'1px solid #ddd',boxSizing:'border-box'};
const submitBtn={width:'100%',padding:'12px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',marginTop:'20px'};
const backBtn={background:'none',border:'none',color:'#1e3a8a',fontWeight:'bold',cursor:'pointer',marginBottom:'15px'};
const tableStyle={width:'100%',textAlign:'left',borderCollapse:'collapse',marginTop:'20px'};
const th={padding:'10px',fontSize:'12px',color:'#64748b'};
const td={padding:'12px',fontSize:'13px'};
const btnOk={background:'#10b981',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',cursor:'pointer'};
const btnNo={background:'#ef4444',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',cursor:'pointer'};

function Card({t,d,c,onClick}){return(<div style={{background:'white',padding:'25px',borderRadius:'15px',borderTop:`6px solid ${c}`,boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}><h3>{t}</h3><p style={{fontSize:'12px',color:'#64748b'}}>{d}</p><button onClick={onClick} style={{width:'100%',padding:'10px',background:c,color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>ENTRA</button></div>);}
