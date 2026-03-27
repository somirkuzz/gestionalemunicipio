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
  "DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
  "VICE_DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
  "SEGRETARIO_COMUNALE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
  "COORDINATORE_UFFICI": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
  "RESPONSABILE_ANAGRAFE": ["ANAGRAFE", "CONGEDO", "ARCHIVIO"],
  "VICE_RESPONSABILE_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "SUPERVISORE_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "IMPIEGATO_ANAGRAFE": ["ANAGRAFE", "CONGEDO"],
  "RESPONSABILE_AMMINISTRATIVO": ["AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
  "VICE_RESPONSABILE_AMMINISTRATIVO": ["AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO", "VIEW_CARTELLONI"],
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
    } catch (e) { alert("Errore nel caricamento dell'archivio."); }
  };

  const inviaDati = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify(form)
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
      else { const err = await res.json(); alert("Errore: " + err.message); }
    } catch (e) { alert("Errore invio dati."); }
  };

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>MUNICIPIO ATLANTIS</h2>
      <input style={inputStyle} placeholder="Inserisci Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button style={submitBtn} onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); }}>ACCEDI</button>
    </div></div>
  );

  return (
    <div style={pageBg}>
      {/* Navbar scura fedele all'immagine */}
      <nav style={navStyle}>
        <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0, fontSize:'18px'}}>PORTALE MUNICIPIO</h2>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span style={roleBadge}>{user.r.replace(/_/g, ' ')}</span>
          <button onClick={()=>setUser(null)} style={logoutBtnNav}>Esci</button>
        </div>
      </nav>

      <div style={container}>
        {/* Banner Area Dirigenziale */}
        {can("DIRIGENZA_BANNER") && pagina === 'home' && (
          <div style={dirigenzaBanner}>
            <h3 style={{color:'#991b1b', marginTop:0}}>AREA DIRIGENZIALE</h3>
            <p style={{color:'#475569', fontSize:'14px'}}>Hai accesso alla visualizzazione di tutti i moduli inviati dai cittadini e dipendenti.</p>
            <button onClick={()=>setPagina('menu_archivio')} style={dirigenzaBtn}>VAI ALL'ARCHIVIO MODULI →</button>
          </div>
        )}

        {pagina === 'home' && (
          <div>
            <h2 style={sectionTitle}>Modulistica Disponibile</h2>
            <div style={gridStyle}>
              {can("CONGEDO") && <FormCard t="Modulo Congedo" d="Richiesta ferie/permessi per tutti i gradi." c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
              {can("ANAGRAFE") && <>
                <FormCard t="Cambio Nome/Cognome" d="Gestione cambio identità anagrafica." c="#10b981" onClick={()=>setPagina('form_nome')} />
                <FormCard t="Modulo Adozione" d="Registrazione nuovi legami parentali." c="#f59e0b" onClick={()=>setPagina('form_adozione')} />
                <FormCard t="Disconoscimento" d="Pratica per cessazione legami parentali." c="#f59e0b" onClick={()=>setPagina('form_disconoscimento')} />
                <FormCard t="Modulo Divorzio" d="Cessazione legale del matrimonio." c="#ef4444" onClick={()=>setPagina('form_divorzio')} />
                <FormCard t="Unione Civile" d="Registrazione atti di matrimonio." c="#8b5cf6" onClick={()=>setPagina('form_unione')} />
              </>}
              {can("AMMINISTRAZIONE") && <FormCard t="Cambio Data" d="Modifica dati cronologici e registri." c="#f59e0b" onClick={()=>setPagina('form_cambiodata')} />}
              {can("AMMINISTRAZIONE") && <FormCard t="Database Cartelloni" d="Visualizza stato spazi e rendite." c="#f59e0b" onClick={() => window.open(LINK_GOOGLE_SHEETS, '_blank')} />}
            </div>
          </div>
        )}

        {/* ... Restanti menu, archivio e form (con stili aggiornati) ... */}
        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <h2 style={sectionTitle}>Archivio Centrale Registri</h2>
            <div style={gridStyle}>
              {can("ANAGRAFE") && <>
                <FormCard t="Registro Nomi" d="Storico cambi nomi." c="#ef4444" onClick={()=>fetchDati('anagrafe_nomi', 'visualizza_archivio')} />
                <FormCard t="Registro Adozioni" d="Storico atti adozione." c="#ef4444" onClick={()=>fetchDati('anagrafe_adozioni', 'visualizza_archivio')} />
                <FormCard t="Registro Disc." d="Storico disconoscimenti." c="#ef4444" onClick={()=>fetchDati('anagrafe_disconoscimento', 'visualizza_archivio')} />
                <FormCard t="Registro Divorzi" d="Storico atti divorzio." c="#ef4444" onClick={()=>fetchDati('anagrafe_divorzi', 'visualizza_archivio')} />
                <FormCard t="Registro Unioni" d="Storico unioni civili." c="#ef4444" onClick={()=>fetchDati('anagrafe_unioni', 'visualizza_archivio')} />
              </>}
              {can("AMMINISTRAZIONE") && <FormCard t="Registro Cambio Data" d="Storico modifiche date." c="#f59e0b" onClick={()=>fetchDati('amm_cambiodata', 'visualizza_archivio')} />}
              <CardCongedi t="Registro Congedi" d="Storico ferie dipendenti." c="#1e3a8a" onClick={()=>fetchDati('congedi', 'visualizza_archivio')} />
            </div>
          </div>
        )}

        {pagina.startsWith('form_') && (
          <div style={{maxWidth:'600px', margin:'0 auto'}}>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Annulla</button>
            <div style={formCardStyle}>
              <h2 style={{marginTop:0, color:'#1e3a8a', textTransform:'uppercase', fontSize:'18px'}}>{pagina.replace('form_','').replace('_',' ')}</h2>
              <div style={divider}></div>
              <label style={labStyle}>Data Pratica</label><input style={inputStyleForm} value={form.data || ''} readOnly />
              <label style={labStyle}>Nome Operatore</label><input style={inputStyleForm} value={form.nome_dipendente || ''} readOnly />
              {pagina==='form_cambiodata' && (<><label style={labStyle}>Cliente</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_cliente:e.target.value})} /><label style={labStyle}>Data Vecchia</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, datanascita_vecchia:e.target.value})} /><label style={labStyle}>Data Nuova</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, datanascita_nuova:e.target.value})} /><label style={labStyle}>Motivo</label><textarea style={textareaStyle} onChange={(e)=>setForm({...form, motivo:e.target.value})} /></>)}
              {pagina==='form_nome' && (<><label style={labStyle}>Vecchio Nome</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, vecchio_nome:e.target.value})} /><label style={labStyle}>Nuovo Nome</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nuovo_nome:e.target.value})} /></>)}
              {(pagina==='form_adozione' || pagina==='form_disconoscimento') && (<><label style={labStyle}>Figlio</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} /><label style={labStyle}>Padre</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} /><label style={labStyle}>Madre</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} /></>)}
              {(pagina==='form_divorzio' || pagina==='form_unione') && (<><label style={labStyle}>Coniuge 1</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_coniuge1:e.target.value})} /><label style={labStyle}>Coniuge 2</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, nome_coniuge2:e.target.value})} /></>)}
              {pagina==='form_congedo' && (<><label style={labStyle}>Periodo</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, periodo:e.target.value})} /><label style={labStyle}>Motivo</label><input style={inputStyleForm} onChange={(e)=>setForm({...form, motivazione:e.target.value})} /></>)}
              <button style={submitBtnForm} onClick={() => {
                const map = { form_nome:'anagrafe_nomi', form_adozione:'anagrafe_adozioni', form_disconoscimento:'anagrafe_disconoscimento', form_divorzio:'anagrafe_divorzi', form_unione:'anagrafe_unioni', form_congedo:'congedi', form_cambiodata:'amm_cambiodata' };
                inviaDati(map[pagina]);
              }}>INVIA MODULO</button>
            </div>
          </div>
        )}

        {pagina === 'visualizza_archivio' && (
          <div style={formCardStyle}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna Registri</button>
            <h2 style={{color:'#1e3a8a', textTransform:'uppercase'}}>{tabellaNome.replace('_',' ')}</h2>
            <div style={divider}></div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'15px'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #e2e8f0', background:'#f8fafc'}}>
                    <th style={tdHead}>DATA</th><th style={tdHead}>OPERATORE</th>
                    {tabellaNome === 'amm_cambiodata' && <><th style={tdHead}>CLIENTE</th><th style={tdHead}>VECCHIA</th><th style={tdHead}>NUOVA</th></>}
                    {tabellaNome === 'anagrafe_nomi' && <><th style={tdHead}>VECCHIO</th><th style={tdHead}>NUOVO</th></>}
                    {(tabellaNome === 'anagrafe_adozioni' || tabellaNome === 'anagrafe_disconoscimento') && <><th style={tdHead}>FIGLIO</th><th style={tdHead}>PADRE</th><th style={tdHead}>MADRE</th></>}
                    {(tabellaNome === 'anagrafe_unioni' || tabellaNome === 'anagrafe_divorzi') && <><th style={tdHead}>CONIUGE 1</th><th style={tdHead}>CONIUGE 2</th></>}
                    {tabellaNome === 'congedi' && <><th style={tdHead}>PERIODO</th><th style={tdHead}>MOTIVO</th></>}
                  </tr>
                </thead>
                <tbody>
                  {datiTabella.length > 0 ? datiTabella.map((i, index) => (
                    <tr key={index} style={trBody}>
                      <td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td>
                      {tabellaNome === 'amm_cambiodata' && <><td style={td}>{i.nome_cliente}</td><td style={td}>{i.datanascita_vecchia}</td><td style={td}>{i.datanascita_nuova}</td></>}
                      {tabellaNome === 'anagrafe_nomi' && <><td style={td}>{i.vecchio_nome}</td><td style={td}>{i.nuovo_nome}</td></>}
                      {(tabellaNome === 'anagrafe_adozioni' || tabellaNome === 'anagrafe_disconoscimento') && <><td style={td}>{i.nome_figlio}</td><td style={td}>{i.nome_padre}</td><td style={td}>{i.nome_madre}</td></>}
                      {(tabellaNome === 'anagrafe_unioni' || tabellaNome === 'anagrafe_divorzi') && <><td style={td}>{i.nome_coniuge1}</td><td style={td}>{i.nome_coniuge2}</td></>}
                      {tabellaNome === 'congedi' && <><td style={td}>{i.periodo}</td><td style={td}>{i.motivazione}</td></>}
                    </tr>
                  )) : <tr><td colSpan="6" style={{padding:'30px', textAlign:'center', color:'#64748b'}}>Nessun record trovato in questo registro.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagina === 'successo' && <div style={{textAlign:'center'}}><div style={formCardStyle}><h2>✅ Operazione Riuscita</h2><button onClick={()=>setPagina('home')} style={submitBtnForm}>TORNA IN HOME</button></div></div>}
      </div>
    </div>
  );
}

// NUOVI STILI REPLICATI DALL'IMMAGINE
const navStyle={background:'#1e3a8a',color:'white',padding:'10px 30px',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'"Helvetica Neue",Helvetica,Arial,sans-serif'};
const roleBadge={background:'#be123c',color:'white',padding:'5px 10px',borderRadius:'4px',fontSize:'12px',fontWeight:'bold',textTransform:'uppercase'};
const logoutBtnNav={background:'#e11d48',color:'white',border:'none',padding:'6px 15px',borderRadius:'4px',cursor:'pointer',fontWeight:'bold',fontSize:'12px'};
const loginBg={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a', fontFamily:'sans-serif'};
const loginCard={background:'white',padding:'40px',borderRadius:'12px',textAlign:'center',width:'320px',boxShadow:'0 10px 25px rgba(0,0,0,0.2)'};
const inputStyle={width:'100%',padding:'12px',marginBottom:'15px',borderRadius:'6px',border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'};
const submitBtn={width:'100%',padding:'12px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'6px',cursor:'pointer', fontWeight:'bold'};
const pageBg={minHeight:'100vh',background:'#f1f5f9', fontFamily:'sans-serif'};
const container={padding:'30px 50px',maxWidth:'1400px',margin:'0 auto'};

// Banner dirigenziale rosso
const dirigenzaBanner={background:'#fee2e2',border:'2px solid #fecaca',padding:'20px',borderRadius:'8px',marginBottom:'30px',boxShadow:'0 4px 6px rgba(0,0,0,0.05)'};
const dirigenzaBtn={background:'#be123c',color:'white',border:'none',padding:'10px 20px',borderRadius:'6px',cursor:'pointer',fontWeight:'bold',fontSize:'13px'};

const sectionTitle={fontSize:'18px',color:'#1e3a8a',marginBottom:'15px',paddingBottom:'10px',borderBottom:'2px solid #1e3a8a',display:'inline-block'};
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px'};

// Card moduli con bordo sinistro colorato
function FormCard({t,d,c,onClick}){return(<div style={{background:'white',padding:'20px',borderRadius:'8px',borderLeft:`6px solid ${c}`,boxShadow:'0 2px 5px rgba(0,0,0,0.05)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}><div><h3 style={{marginTop:0,fontSize:'16px',color:'#1e293b'}}>{t}</h3><p style={{fontSize:'13px',color:'#64748b',marginBottom:'15px'}}>{d}</p></div><button onClick={onClick} style={{width:'100%',padding:'8px',background:'white',color:'#1e3a8a',border:'1px solid #cbd5e1',borderRadius:'6px',cursor:'pointer',fontWeight:'bold',fontSize:'12px',textTransform:'uppercase'}}>APRI</button></div>);}

function CardCongedi({t,d,c,onClick}){return(<div style={{background:'white',padding:'20px',borderRadius:'8px',borderLeft:`6px solid ${c}`,boxShadow:'0 2px 5px rgba(0,0,0,0.05)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}><div><h3 style={{marginTop:0,fontSize:'16px',color:'#1e293b'}}>{t}</h3><p style={{fontSize:'13px',color:'#64748b',marginBottom:'15px'}}>{d}</p></div><button onClick={onClick} style={{width:'100%',padding:'8px',background:'white',color:'#1e3a8a',border:'1px solid #cbd5e1',borderRadius:'6px',cursor:'pointer',fontWeight:'bold',fontSize:'12px',textTransform:'uppercase'}}>APRI ARCHIVIO</button></div>);}

const backBtn={background:'none',border:'none',color:'#be123c',fontWeight:'bold',cursor:'pointer',marginBottom:'15px',fontSize:'13px'};

// Stili form e tabelle
const formCardStyle={background:'white',padding:'30px',borderRadius:'12px',boxShadow:'0 5px 15px rgba(0,0,0,0.05)'};
const divider={height:'2px',background:'#e2e8f0',margin:'15px 0'};
const labStyle={fontSize:'11px',fontWeight:'bold',color:'#475569',textTransform:'uppercase',marginBottom:'5px',display:'block'};
const inputStyleForm={width:'100%',padding:'10px',marginBottom:'15px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'14px',boxSizing:'border-box',background:'#f8fafc'};
const textareaStyle={width:'100%',height:'80px',padding:'10px',marginBottom:'15px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'14px',boxSizing:'border-box',background:'#f8fafc',resize:'vertical'};
const submitBtnForm={width:'100%',padding:'12px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'bold',textTransform:'uppercase',fontSize:'13px',marginTop:'10px'};

const tdHead={padding:'12px 15px',textAlign:'left',fontSize:'11px',fontWeight:'bold',color:'#475569',textTransform:'uppercase'};
const trBody={borderBottom:'1px solid #f1f5f9'};
const td={padding:'12px 15px',textAlign:'left',fontSize:'13px',color:'#1e293b'};
