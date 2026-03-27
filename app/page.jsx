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

  const inviaDati = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify(form)
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
    } catch (e) { alert("Errore invio."); }
  };

  const fetchDati = async (tabella, vista) => {
    setTabellaNome(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setDatiTabella(data || []);
      setPagina(vista);
    } catch (e) { alert("Errore caricamento."); }
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
      <nav style={navStyle}>
        <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>MUNICIPIO ATLANTIS</h2>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <div style={{textAlign:'right'}}><b style={{fontSize:'14px'}}>{user.n}</b><br/><small style={{fontSize:'10px'}}>{user.r.replace(/_/g, ' ')}</small></div>
          <button onClick={()=>setUser(null)} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={container}>
        {pagina === 'home' && (
          <div style={gridStyle}>
            {can("ANAGRAFE") && <Card t="Ufficio Anagrafe" d="Moduli Civili" c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />}
            {can("AMMINISTRAZIONE") && <Card t="Ufficio Amministrativo" d="Gestione Interna" c="#f59e0b" onClick={()=>setPagina('menu_amministrativo')} />}
            {can("CONGEDO") && <Card t="Modulo Congedi" d="Gestione Ferie" c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
            {can("ARCHIVIO") && <Card t="Archivio Centrale" d="Storico Registri" c="#ef4444" onClick={()=>setPagina('menu_archivio')} />}
          </div>
        )}

        {pagina === 'menu_amministrativo' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Data Nascita" d="Correzione Registro" c="#f59e0b" onClick={()=>setPagina('form_cambiodata')} />
              {can("VIEW_CARTELLONI") && <Card t="Database Cartelloni" d="Visualizza Stato Spazi" c="#f59e0b" onClick={()=>fetchDati('amm_cartelloni', 'vista_cartelloni')} />}
            </div>
          </div>
        )}

        {pagina === 'vista_cartelloni' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_amministrativo')} style={backBtn}>← Torna Ufficio</button>
            <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>DATABASE CARTELLONI</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f1f5f9', borderBottom:'2px solid #cbd5e1'}}>
                    <th style={td}>LUOGO</th><th style={td}>COSTO</th><th style={td}>STATO</th><th style={td}>RICHIEDENTE</th><th style={td}>SCADENZA</th>
                  </tr>
                </thead>
                <tbody>
                  {datiTabella.map(i => (
                    <tr key={i.id} style={{borderBottom:'1px solid #e2e8f0'}}>
                      <td style={td}>{i.luogo}</td>
                      <td style={td}>€ {i.costo}</td>
                      <td style={td}>
                        <span style={{
                          padding:'4px 10px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold',
                          background: i.stato === 'occupato' ? '#991b1b' : '#166534',
                          color: 'white'
                        }}>{i.stato ? i.stato.toUpperCase() : '-'}</span>
                      </td>
                      <td style={td}>{i.richiedente || '-'}</td>
                      <td style={td}>{i.scadenza || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{marginTop:'20px', textAlign:'right', fontWeight:'bold', color:'#1e3a8a', fontSize:'18px'}}>
                TOT: € {datiTabella.reduce((acc, curr) => acc + (Number(curr.costo) || 0), 0).toLocaleString('it-IT')}
              </div>
            </div>
          </div>
        )}

        {pagina === 'menu_anagrafe' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Nome" d="Anagrafe" c="#10b981" onClick={()=>setPagina('form_nome')} />
              <Card t="Adozione" d="Anagrafe" c="#10b981" onClick={()=>setPagina('form_adozione')} />
              <Card t="Disconoscimento" d="Anagrafe" c="#059669" onClick={()=>setPagina('form_disconoscimento')} />
              <Card t="Divorzio" d="Anagrafe" c="#059669" onClick={()=>setPagina('form_divorzio')} />
              <Card t="Unione Civile" d="Anagrafe" c="#047857" onClick={()=>setPagina('form_unione')} />
            </div>
          </div>
        )}

        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              {can("ANAGRAFE") && (
                <>
                  <Card t="Registro Nomi" d="Storico" c="#ef4444" onClick={()=>fetchDati('anagrafe_nomi', 'visualizza_archivio')} />
                  <Card t="Registro Adozioni" d="Storico" c="#ef4444" onClick={()=>fetchDati('anagrafe_adozioni', 'visualizza_archivio')} />
                  <Card t="Registro Disc." d="Storico" c="#ef4444" onClick={()=>fetchDati('anagrafe_disconoscimento', 'visualizza_archivio')} />
                  <Card t="Registro Divorzi" d="Storico" c="#ef4444" onClick={()=>fetchDati('anagrafe_divorzi', 'visualizza_archivio')} />
                  <Card t="Registro Unioni" d="Storico" c="#ef4444" onClick={()=>fetchDati('anagrafe_unioni', 'visualizza_archivio')} />
                </>
              )}
              {can("AMMINISTRAZIONE") && <Card t="Registro Cambio Data" d="Storico" c="#f59e0b" onClick={()=>fetchDati('amm_cambiodata', 'visualizza_archivio')} />}
              <Card t="Registro Congedi" d="Storico" c="#1e3a8a" onClick={()=>fetchDati('congedi', 'visualizza_archivio')} />
            </div>
          </div>
        )}

        {pagina.startsWith('form_') && (
          <div style={{maxWidth:'500px', margin:'0 auto'}}>
            <button onClick={()=>setPagina(pagina==='form_cambiodata'?'menu_amministrativo':pagina==='form_congedo'?'home':'menu_anagrafe')} style={backBtn}>← Annulla</button>
            <div style={formCard}>
              <h2 style={{marginTop:0, color:'#1e3a8a'}}>{pagina.replace('form_','').replace('_',' ').toUpperCase()}</h2>
              <label style={labStyle}>Data</label><input style={inputStyle} value={form.data || ''} readOnly />
              <label style={labStyle}>Operatore</label><input style={inputStyle} value={form.nome_dipendente || ''} readOnly />
              {pagina==='form_cambiodata' && (<><label style={labStyle}>Cliente</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_cliente:e.target.value})} /><label style={labStyle}>Data Vecchia</label><input style={inputStyle} onChange={(e)=>setForm({...form, datanascita_vecchia:e.target.value})} /><label style={labStyle}>Data Nuova</label><input style={inputStyle} onChange={(e)=>setForm({...form, datanascita_nuova:e.target.value})} /><label style={labStyle}>Motivo</label><textarea style={inputStyle} onChange={(e)=>setForm({...form, motivo:e.target.value})} /></>)}
              {pagina==='form_nome' && (<><label style={labStyle}>Vecchio Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, vecchio_nome:e.target.value})} /><label style={labStyle}>Nuovo Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, nuovo_nome:e.target.value})} /></>)}
              {(pagina==='form_adozione' || pagina==='form_disconoscimento') && (<><label style={labStyle}>Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} /><label style={labStyle}>Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} /><label style={labStyle}>Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} /></>)}
              {(pagina==='form_divorzio' || pagina==='form_unione') && (<><label style={labStyle}>Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1:e.target.value})} /><label style={labStyle}>Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2:e.target.value})} /></>)}
              {pagina==='form_congedo' && (<><label style={labStyle}>Periodo</label><input style={inputStyle} onChange={(e)=>setForm({...form, periodo:e.target.value})} /><label style={labStyle}>Motivo</label><input style={inputStyle} onChange={(e)=>setForm({...form, motivazione:e.target.value})} /></>)}
              <button style={submitBtn} onClick={() => {
                const map = { form_nome:'anagrafe_nomi', form_adozione:'anagrafe_adozioni', form_disconoscimento:'anagrafe_disconoscimento', form_divorzio:'anagrafe_divorzi', form_unione:'anagrafe_unioni', form_congedo:'congedi', form_cambiodata:'amm_cambiodata' };
                inviaDati(map[pagina]);
              }}>INVIA</button>
            </div>
          </div>
        )}

        {pagina === 'visualizza_archivio' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna Registri</button>
            <h2 style={{color:'#1e3a8a'}}>{tabellaNome.toUpperCase()}</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'15px'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #ddd', background:'#f1f5f9'}}>
                    <th style={td}>DATA</th><th style={td}>OPERATORE</th>
                    {tabellaNome === 'amm_cambiodata' && <><th style={td}>CLIENTE</th><th style={td}>VECCHIA</th><th style={td}>NUOVA</th></>}
                    {tabellaNome === 'anagrafe_nomi' && <><th style={td}>VECCHIO</th><th style={td}>NUOVO</th></>}
                    {(tabellaNome === 'anagrafe_adozioni' || tabellaNome === 'anagrafe_disconoscimento') && <><th style={td}>FIGLIO</th><th style={td}>PADRE</th><th style={td}>MADRE</th></>}
                    {(tabellaNome === 'anagrafe_unioni' || tabellaNome === 'anagrafe_divorzi') && <><th style={td}>CONIUGE 1</th><th style={td}>CONIUGE 2</th></>}
                    {tabellaNome === 'congedi' && <><th style={td}>PERIODO</th><th style={td}>MOTIVO</th></>}
                  </tr>
                </thead>
                <tbody>
                  {datiTabella.map(i => (
                    <tr key={i.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td>
                      {tabellaNome === 'amm_cambiodata' && <><td style={td}>{i.nome_cliente}</td><td style={td}>{i.datanascita_vecchia}</td><td style={td}>{i.datanascita_nuova}</td></>}
                      {tabellaNome === 'anagrafe_nomi' && <><td style={td}>{i.vecchio_nome}</td><td style={td}>{i.nuovo_nome}</td></>}
                      {(tabellaNome === 'anagrafe_adozioni' || tabellaNome === 'anagrafe_disconoscimento') && <><td style={td}>{i.nome_figlio}</td><td style={td}>{i.nome_padre}</td><td style={td}>{i.nome_madre}</td></>}
                      {(tabellaNome === 'anagrafe_unioni' || tabellaNome === 'anagrafe_divorzi') && <><td style={td}>{i.nome_coniuge1}</td><td style={td}>{i.nome_coniuge2}</td></>}
                      {tabellaNome === 'congedi' && <><td style={td}>{i.periodo}</td><td style={td}>{i.motivazione}</td></>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagina === 'successo' && <div style={{textAlign:'center'}}><div style={formCard}><h2>✅ Operazione Riuscita</h2><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA IN HOME</button></div></div>}
      </div>
    </div>
  );
}

// STILI
const navStyle={background:'#1e3a8a',color:'white',padding:'15px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'};
const loginBg={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a', fontFamily:'sans-serif'};
const loginCard={background:'white',padding:'40px',borderRadius:'20px',textAlign:'center',width:'300px'};
const pageBg={minHeight:'100vh',background:'#f8fafc', fontFamily:'sans-serif'};
const container={padding:'40px',maxWidth:'1200px',margin:'0 auto'};
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'20px', marginTop:'20px'};
const formCard={background:'white',padding:'30px',borderRadius:'15px',boxShadow:'0 4px 15px rgba(0,0,0,0.05)'};
const inputStyle={width:'100%',padding:'12px',marginBottom:'15px',borderRadius:'8px',border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'};
const labStyle={fontSize:'11px',fontWeight:'bold',color:'#1e3a8a', textTransform:'uppercase', marginBottom:'5px', display:'block'};
const submitBtn={width:'100%',padding:'14px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'8px',cursor:'pointer', fontWeight:'bold'};
const logoutBtn={background:'#ef4444',color:'white',border:'none',padding:'8px 12px',borderRadius:'6px',cursor:'pointer', fontWeight:'bold', fontSize:'12px'};
const backBtn={background:'none',border:'none',color:'#1e3a8a',fontWeight:'bold',cursor:'pointer',marginBottom:'15px'};
const td={padding:'12px', textAlign:'left', fontSize:'12px', color:'#334155'};

function Card({t,d,c,onClick}){return(<div style={{background:'white',padding:'25px',borderRadius:'15px',borderTop:`6px solid ${c}`,boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}><h3>{t}</h3><p style={{fontSize:'13px',color:'#64748b'}}>{d}</p><button onClick={onClick} style={{width:'100%',padding:'10px',background:c,color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>APRI</button></div>);}
