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

  const can = (p) => user && (PERMESSI[user.r] || []).includes(p);

  // Auto-compila dati operatore quando apri un form
  useEffect(() => {
    if (user && pagina.startsWith('form_')) {
      setForm({ data: new Date().toLocaleDateString('it-IT'), nome_dipendente: user.n });
    }
  }, [pagina, user]);

  const inviaDati = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) setPagina('successo');
      else alert("Errore nell'invio dei dati.");
    } catch (e) { alert("Errore di connessione."); }
  };

  const fetchDati = async (tabella) => {
    setTabellaNome(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setDatiTabella(data || []);
      setPagina('visualizza_archivio');
    } catch (e) { alert("Errore nel caricamento dei dati."); }
  };

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a', fontWeight:'800', marginBottom:'20px'}}>MUNICIPIO ATLANTIS</h2>
      <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button style={submitBtn} onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Nome non riconosciuto"); }}>ACCEDI</button>
    </div></div>
  );

  return (
    <div style={pageBg}>
      {/* NAVBAR MODERNA */}
      <nav style={navStyle}>
        <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0, fontSize:'18px'}}>PORTALE MUNICIPIO</h2>
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <div style={{textAlign:'right', lineHeight:'1.2'}}>
            <div style={{fontSize:'14px', fontWeight:'700', color:'white'}}>{user.n}</div>
            <div style={roleBadge}>{user.r.replace(/_/g, ' ')}</div>
          </div>
          <button onClick={()=>setUser(null)} style={logoutBtn}>Esci</button>
        </div>
      </nav>

      <div style={container}>
        {/* BANNER DIRIGENZA (Sempre visibile in home per ruoli alti) */}
        {can("BANNER_DIRIGENZA") && pagina === 'home' && (
          <div style={bannerRosso}>
            <h3 style={{color:'#991b1b', margin:'0 0 10px 0', fontSize:'16px', fontWeight:'700'}}>AREA DIRIGENZIALE</h3>
            <p style={{margin:'0 0 15px 0', fontSize:'14px', color:'#475569'}}>Accesso rapido ai registri centralizzati per il controllo dei moduli.</p>
            <button onClick={()=>setPagina('menu_archivio')} style={btnArchivio}>VAI ALL'ARCHIVIO REGISTRI →</button>
          </div>
        )}

        {/* HOME VIEW */}
        {pagina === 'home' && (
          <>
            <h3 style={sectionTitle}>Modulistica Disponibile</h3>
            <div style={gridStyle}>
              {can("CONGEDO") && <Card t="Modulo Congedo" d="Gestione ferie e permessi personale." c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
              {can("ANAGRAFE") && <Card t="Ufficio Anagrafe" d="Cambi nome, adozioni, divorzi e unioni." c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />}
              {can("AMMINISTRAZIONE") && <Card t="Ufficio Amministrativo" d="Cambio data e link database cartelloni." c="#f59e0b" onClick={()=>setPagina('menu_amministrativo')} />}
            </div>
          </>
        )}

        {/* MENU ANAGRAFE */}
        {pagina === 'menu_anagrafe' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Torna indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Nome" d="Modifica identità civile." c="#10b981" onClick={()=>setPagina('form_nome')} />
              <Card t="Adozione" d="Pratica registrazione nuovi figli." c="#10b981" onClick={()=>setPagina('form_adozione')} />
              <Card t="Disconoscimento" d="Cessazione legami parentali." c="#059669" onClick={()=>setPagina('form_disconoscimento')} />
              <Card t="Divorzio" d="Cessazione legale matrimonio." c="#ef4444" onClick={()=>setPagina('form_divorzio')} />
              <Card t="Unione Civile" d="Registrazione nuovo matrimonio." c="#8b5cf6" onClick={()=>setPagina('form_unione')} />
            </div>
          </div>
        )}

        {/* MENU AMMINISTRATIVO */}
        {pagina === 'menu_amministrativo' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Torna indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Data Nascita" d="Correzione registri di nascita." c="#f59e0b" onClick={()=>setPagina('form_cambiodata')} />
              <Card t="Database Cartelloni" d="Foglio Google esterno." c="#06b6d4" onClick={()=>window.open(LINK_CARTELLONI, '_blank')} />
            </div>
          </div>
        )}

        {/* MENU ARCHIVIO */}
        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Torna indietro</button>
            <h3 style={sectionTitle}>Registri Archiviati</h3>
            <div style={gridStyle}>
              <Card t="Registro Nomi" d="Storico cambi nome." c="#ef4444" onClick={()=>fetchDati('anagrafe_nomi')} />
              <Card t="Registro Adozioni" d="Storico adozioni." c="#ef4444" onClick={()=>fetchDati('anagrafe_adozioni')} />
              <Card t="Registro Congedi" d="Storico ferie dipendenti." c="#1e3a8a" onClick={()=>fetchDati('congedi')} />
              <Card t="Registro Cambio Data" d="Storico modifiche date." c="#f59e0b" onClick={()=>fetchDati('amm_cambiodata')} />
            </div>
          </div>
        )}

        {/* RENDER FORM (Qui ho sistemato la logica dei campi) */}
        {pagina.startsWith('form_') && (
          <div style={{maxWidth:'600px', margin:'0 auto'}}>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Annulla e torna</button>
            <div style={formCard}>
              <h2 style={{color:'#1e3a8a', fontSize:'18px', textTransform:'uppercase'}}>{pagina.replace('form_','').replace('_',' ')}</h2>
              <div style={{margin:'20px 0'}}>
                <label style={labStyle}>Data Pratica</label><input style={inputStyleForm} value={form.data || ''} readOnly />
                <label style={labStyle}>Operatore</label><input style={inputStyleForm} value={form.nome_dipendente || ''} readOnly />
                
                {pagina==='form_congedo' && (<><label style={labStyle}>Periodo richiesto</label><input style={inputStyleForm} placeholder="Es: dal 20/04 al 25/04" onChange={(e)=>setForm({...form, periodo:e.target.value})} /><label style={labStyle}>Motivazione</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, motivazione:e.target.value})} /></>)}
                {pagina==='form_nome' && (<><label style={labStyle}>Vecchio Nome</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, vecchio_nome:e.target.value})} /><label style={labStyle}>Nuovo Nome</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nuovo_nome:e.target.value})} /></>)}
                {pagina==='form_cambiodata' && (<><label style={labStyle}>Nome Cliente</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_cliente:e.target.value})} /><label style={labStyle}>Vecchia Data</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, datanascita_vecchia:e.target.value})} /><label style={labStyle}>Nuova Data</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, datanascita_nuova:e.target.value})} /></>)}
                {(pagina==='form_adozione' || pagina==='form_disconoscimento') && (<><label style={labStyle}>Figlio</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} /><label style={labStyle}>Padre</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} /><label style={labStyle}>Madre</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} /></>)}
              </div>
              <button style={submitBtn} onClick={() => {
                const mapping = { form_nome:'anagrafe_nomi', form_adozione:'anagrafe_adozioni', form_disconoscimento:'anagrafe_disconoscimento', form_divorzio:'anagrafe_divorzi', form_unione:'anagrafe_unioni', form_congedo:'congedi', form_cambiodata:'amm_cambiodata' };
                inviaDati(mapping[pagina]);
              }}>INVIA MODULO AL DATABASE</button>
            </div>
          </div>
        )}

        {/* TABELLA ARCHIVIO */}
        {pagina === 'visualizza_archivio' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna ai registri</button>
            <h2 style={{color:'#1e3a8a', textTransform:'uppercase', fontSize:'16px'}}>{tabellaNome}</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'15px'}}>
                <thead><tr style={{background:'#f8fafc', borderBottom:'2px solid #e2e8f0'}}><th style={tdTh}>DATA</th><th style={tdTh}>OPERATORE</th><th style={tdTh}>INFO REGISTRATE</th></tr></thead>
                <tbody>{datiTabella.map((i, k)=>(<tr key={k} style={{borderBottom:'1px solid #f1f5f9'}}><td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td><td style={td}>{i.periodo || i.nuovo_nome || i.nome_cliente || "Pratica archiviata"}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {pagina === 'successo' && <div style={{textAlign:'center', padding:'50px'}}><div style={formCard}><h2>✅ Modulo Inviato Correttamente</h2><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>}
      </div>
    </div>
  );
}

// COMPONENTE CARD CON HOVER E OMBRA
function Card({t, d, c, onClick}){
  const [isHover, setIsHover] = useState(false);
  return (
    <div 
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>setIsHover(false)}
      onClick={onClick}
      style={{
        background:'white', padding:'25px', borderRadius:'16px', borderLeft:`6px solid ${c}`, cursor:'pointer',
        boxShadow: isHover ? '0 15px 35px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.03)',
        transform: isHover ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
      <h4 style={{margin:'0 0 10px 0', fontSize:'16px', color:'#1e293b', fontWeight:'700'}}>{t}</h4>
      <p style={{fontSize:'13px', color:'#64748b', marginBottom:'20px', lineHeight:'1.5'}}>{d}</p>
      <div style={{color:c, fontWeight:'800', fontSize:'11px', textTransform:'uppercase'}}>Apri Modulo →</div>
    </div>
  );
}

// STILI CSS
const navStyle={background:'#1e3a8a', color:'white', padding:'15px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'};
const roleBadge={fontSize:'10px', background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:'12px', textTransform:'uppercase', fontWeight:'700', marginTop:'4px', display:'inline-block'};
const logoutBtn={background:'#ef4444', color:'white', border:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', fontWeight:'700', fontSize:'12px'};
const bannerRosso={background:'#fff1f2', border:'1px solid #fecaca', padding:'25px', borderRadius:'20px', marginBottom:'30px', boxShadow:'0 4px 6px rgba(0,0,0,0.02)'};
const btnArchivio={background:'#be123c', color:'white', border:'none', padding:'12px 20px', borderRadius:'12px', cursor:'pointer', fontWeight:'700', fontSize:'13px'};
const pageBg={minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'};
const container={padding:'40px 60px', maxWidth:'1300px', margin:'0 auto'};
const gridStyle={display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'30px'};
const sectionTitle={fontSize:'18px', color:'#334155', fontWeight:'700', marginBottom:'25px', borderBottom:'2px solid #e2e8f0', paddingBottom:'12px'};
const formCard={background:'white', padding:'40px', borderRadius:'24px', boxShadow:'0 10px 30px rgba(0,0,0,0.05)'};
const inputStyleForm={width:'100%', padding:'14px', marginBottom:'15px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#f8fafc', fontSize:'14px', boxSizing:'border-box', outline:'none'};
const labStyle={fontSize:'11px', fontWeight:'800', color:'#475569', textTransform:'uppercase', marginBottom:'6px', display:'block'};
const submitBtn={width:'100%', padding:'16px', background:'#1e3a8a', color:'white', border:'none', borderRadius:'14px', cursor:'pointer', fontWeight:'700'};
const backBtn={background:'#f1f5f9', border:'none', color:'#475569', padding:'10px 20px', borderRadius:'10px', fontWeight:'700', cursor:'pointer', marginBottom:'25px'};
const tdTh={padding:'15px', textAlign:'left', fontSize:'12px', color:'#94a3b8', fontWeight:'800'};
const td={padding:'15px', fontSize:'14px', color:'#1e293b'};
const loginBg={minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a'};
const loginCard={background:'white', padding:'40px', borderRadius:'24px', textAlign:'center', width:'350px', boxShadow:'0 20px 40px rgba(0,0,0,0.2)'};
const inputStyle={width:'100%', padding:'14px', marginBottom:'15px', border:'1px solid #e2e8f0', borderRadius:'12px', textAlign:'center'};
