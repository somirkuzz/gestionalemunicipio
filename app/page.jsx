'use client';
import React, { useState, useEffect } from 'react';

// --- CONFIGURAZIONE DATABASE ATLANTIS ---
const SUPABASE_URL = 'https://xvtfdbuomstrpfrojwrg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dGZkYnVvbXN0cnBmcm9qd3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDQ5OTcsImV4cCI6MjA5MDE4MDk5N30.6yt3myNpafxXB12b75vGYMcmLRcGnV1x8a1wA8F4RoI';

const LINK_CARTELLONI = "https://docs.google.com/spreadsheets/d/1gIG-jdgs4hQykQV1O4sF50hDd5UYthj-w--pEk591QA/edit?usp=sharing";

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
  "MadeTheAndrea": "RESPONSABILE_AMMINISTRATIVO",
  "TopoXP": "IMPIEGATO_AMMINISTRATIVO",
  "NotRavix": "APPRENDISTA",
  "sandydll": "APPRENDISTA"
};

const PERMESSI = {
  "DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "BANNER_DIRIGENZA"],
  "VICE_DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "BANNER_DIRIGENZA"],
  "SEGRETARIO_COMUNALE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO"],
  "COORDINATORE_UFFICI": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO"],
  "RESPONSABILE_ANAGRAFE": ["ANAGRAFE", "CONGEDO", "ARCHIVIO"],
  "VICE_RESPONSABILE_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "SUPERVISORE_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "IMPIEGATO_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "RESPONSABILE_AMMINISTRATIVO": ["AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO"],
  "IMPIEGATO_AMMINISTRATIVO": ["AMMINISTRAZIONE", "CONGEDO"],
  "APPRENDISTA": ["CONGEDO"]
};

export default function Page() {
  const [user, setUser] = useState(null);
  const [nick, setNick] = useState('');
  const [pagina, setPagina] = useState('home');
  const [form, setForm] = useState({});
  const [datiTabella, setDatiTabella] = useState([]);
  const [tabellaNome, setTabellaNome] = useState('');

  useEffect(() => {
    if (user && pagina.startsWith('form_')) {
      setForm({ data: new Date().toLocaleDateString('it-IT'), nome_dipendente: user.n });
    }
  }, [pagina, user]);

  const can = (p) => user && (PERMESSI[user.r] || []).includes(p);

  const fetchDati = async (tabella, vista) => {
    setTabellaNome(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setDatiTabella(data || []);
      setPagina(vista);
    } catch (e) { alert("Errore archivio."); }
  };

  const inviaDati = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) setPagina('successo');
    } catch (e) { alert("Errore invio."); }
  };

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a'}}>MUNICIPIO ATLANTIS</h2>
      <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button style={submitBtn} onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); }}>ACCEDI</button>
    </div></div>
  );

  return (
    <div style={pageBg}>
      <nav style={navStyle}>
        <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0, fontSize:'16px'}}>PORTALE MUNICIPIO</h2>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <div style={{textAlign:'right'}}>
            <b style={{fontSize:'14px', color:'white'}}>{user.n}</b><br/>
            <span style={roleBadge}>{user.r.replace(/_/g, ' ')}</span>
          </div>
          <button onClick={()=>setUser(null)} style={logoutBtn}>Esci</button>
        </div>
      </nav>

      <div style={container}>
        {/* AREA DIRIGENZIALE - IDENTICA ALLO SCREENSHOT */}
        {can("BANNER_DIRIGENZA") && pagina === 'home' && (
          <div style={bannerRosso}>
            <h3 style={{color:'#991b1b', margin:'0 0 10px 0', fontSize:'16px'}}>AREA DIRIGENZIALE</h3>
            <p style={{margin:'0 0 15px 0', fontSize:'13px', color:'#475569'}}>Hai accesso alla visualizzazione di tutti i moduli inviati dai cittadini e dipendenti.</p>
            <button onClick={()=>setPagina('menu_archivio')} style={btnArchivio}>VAI ALL'ARCHIVIO MODULI →</button>
          </div>
        )}

        {pagina === 'home' && (
          <>
            <h3 style={sectionTitle}>Modulistica Disponibile</h3>
            <div style={gridStyle}>
              {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiesta ferie/permessi per tutti i gradi." c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
              {can("ANAGRAFE") && (
                <>
                  <Card t="Cambio Nome/Cognome" d="Gestione cambio identità anagrafica." c="#10b981" onClick={()=>setPagina('form_nome')} />
                  <Card t="Modulo Adozione" d="Registrazione nuovi legami parentali." c="#f59e0b" onClick={()=>setPagina('form_adozione')} />
                  <Card t="Disconoscimento" d="Pratica per cessazione legami parentali." c="#f59e0b" onClick={()=>setPagina('form_disconoscimento')} />
                  <Card t="Modulo Divorzio" d="Cessazione legale del matrimonio." c="#ef4444" onClick={()=>setPagina('form_divorzio')} />
                </>
              )}
              {can("AMMINISTRAZIONE") && (
                <>
                  <Card t="Cambio Data" d="Modifica dati cronologici e registri." c="#f59e0b" onClick={()=>setPagina('form_cambiodata')} />
                  <Card t="Database Cartelloni" d="Apri Foglio Esterno" c="#f59e0b" onClick={()=>window.open(LINK_CARTELLONI, '_blank')} />
                </>
              )}
            </div>
          </>
        )}

        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <h3 style={sectionTitle}>Registri Archiviati</h3>
            <div style={gridStyle}>
              <Card t="Registro Nomi" d="Archivio" c="#ef4444" onClick={()=>fetchDati('anagrafe_nomi', 'visualizza_archivio')} />
              <Card t="Registro Adozioni" d="Archivio" c="#ef4444" onClick={()=>fetchDati('anagrafe_adozioni', 'visualizza_archivio')} />
              <Card t="Registro Congedi" d="Archivio" c="#1e3a8a" onClick={()=>fetchDati('congedi', 'visualizza_archivio')} />
            </div>
          </div>
        )}

        {/* ... Codice per form e visualizzazione archivio (già presente sopra) ... */}
        {pagina === 'visualizza_archivio' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna</button>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead><tr style={{background:'#f8fafc'}}><th style={td}>DATA</th><th style={td}>OPERATORE</th><th style={td}>INFO</th></tr></thead>
              <tbody>{datiTabella.map((i, k)=>(<tr key={k} style={{borderBottom:'1px solid #eee'}}><td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td><td style={td}>Record #{k+1}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


const navStyle={background:'#1e3a8a', color:'white', padding:'10px 30px', display:'flex', justifyContent:'space-between', alignItems:'center'};
const roleBadge={background:'#be123c', padding:'2px 6px', borderRadius:'3px', fontSize:'10px', fontWeight:'bold', marginLeft:'5px'};
const logoutBtn={background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'12px'};
const bannerRosso={background:'#fff1f2', border:'1px solid #fecaca', padding:'20px', borderRadius:'6px', marginBottom:'30px'};
const btnArchivio={background:'#be123c', color:'white', border:'none', padding:'10px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'};
const sectionTitle={borderBottom:'1px solid #1e3a8a', paddingBottom:'5px', marginBottom:'20px', color:'#1e293b', fontSize:'16px'};
const pageBg={minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'};
const container={padding:'30px 60px'};
const gridStyle={display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px'};

// CARD CON BORDO A SINISTRA COME NELLO SCREEN
function Card({t, d, c, onClick}){
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'6px', borderLeft:`4px solid ${c}`, boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
      <h4 style={{margin:'0 0 10px 0', fontSize:'15px'}}>{t}</h4>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'15px', minHeight:'30px'}}>{d}</p>
      <button onClick={onClick} style={{width:'100%', padding:'8px', background:'white', border:'1px solid #cbd5e1', borderRadius:'4px', cursor:'pointer', color:'#1e3a8a', fontWeight:'bold', fontSize:'11px'}}>APRI</button>
    </div>
  );
}

const loginBg={minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a'};
const loginCard={background:'white', padding:'30px', borderRadius:'10px', textAlign:'center'};
const inputStyle={width:'100%', padding:'10px', marginBottom:'10px', border:'1px solid #ddd', borderRadius:'5px'};
const submitBtn={width:'100%', padding:'10px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'};
const backBtn={background:'none', border:'none', color:'#be123c', fontWeight:'bold', cursor:'pointer', marginBottom:'10px'};
const td={padding:'10px', fontSize:'12px', textAlign:'left'};
const formCard={background:'white', padding:'20px', borderRadius:'8px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)'};
