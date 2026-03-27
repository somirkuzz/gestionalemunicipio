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
  "DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO"],
  "VICE_DIRIGENTE": ["ANAGRAFE", "AMMINISTRAZIONE", "CONGEDO", "ARCHIVIO"],
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
  const [archivio, setArchivio] = useState([]);
  const [tabellaCorrente, setTabellaCorrente] = useState('');

  useEffect(() => {
    if (user && pagina.startsWith('form_')) {
      setForm({ data: new Date().toLocaleDateString('it-IT'), nome_dipendente: user.n });
    }
  }, [pagina, user]);

  const can = (p) => user && (PERMESSI[user.r] || []).includes(p);

  const inviaPratica = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify(form)
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
      else { const err = await res.json(); alert("Errore: " + err.message); }
    } catch (e) { alert("Connessione fallita."); }
  };

  const fetchArchivio = async (tabella) => {
    setTabellaCorrente(tabella);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}?select=*&order=id.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setArchivio(data || []);
      setPagina('visualizza_archivio');
    } catch (e) { alert("Errore caricamento."); }
  };

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a', marginBottom:'20px'}}>MUNICIPIO ATLANTIS</h2>
      <input style={inputStyle} placeholder="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
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
            {can("AMMINISTRAZIONE") && <Card t="Ufficio Amministrativo" d="Correzioni Dati" c="#f59e0b" onClick={()=>setPagina('menu_amministrativo')} />}
            {can("CONGEDO") && <Card t="Modulo Congedi" d="Gestione Ferie" c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
            {can("ARCHIVIO") && <Card t="Archivio Centrale" d="Storico Registri" c="#ef4444" onClick={()=>setPagina('menu_archivio')} />}
          </div>
        )}

        {pagina === 'menu_anagrafe' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Nome" d="Nomi/Cognomi" c="#10b981" onClick={()=>setPagina('form_nome')} />
              <Card t="Adozione" d="Nuclei Familiari" c="#10b981" onClick={()=>setPagina('form_adozione')} />
              <Card t="Disconoscimento" d="Legami" c="#059669" onClick={()=>setPagina('form_disconoscimento')} />
              <Card t="Divorzio" d="Scioglimento" c="#059669" onClick={()=>setPagina('form_divorzio')} />
              <Card t="Unione Civile" d="Matrimoni" c="#047857" onClick={()=>setPagina('form_unione')} />
            </div>
          </div>
        )}

        {pagina === 'menu_amministrativo' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              <Card t="Cambio Data Nascita" d="Correzione Registro" c="#f59e0b" onClick={()=>setPagina('form_cambiodata')} />
            </div>
          </div>
        )}

        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Indietro</button>
            <div style={gridStyle}>
              {can("ANAGRAFE") && (
                <>
                  <Card t="Registro Nomi" d="Anagrafe" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_nomi')} />
                  <Card t="Registro Adozioni" d="Anagrafe" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_adozioni')} />
                  <Card t="Registro Disc." d="Anagrafe" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_disconoscimento')} />
                  <Card t="Registro Divorzi" d="Anagrafe" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_divorzi')} />
                  <Card t="Registro Unioni" d="Anagrafe" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_unioni')} />
                </>
              )}
              {can("AMMINISTRAZIONE") && (
                <Card t="Registro Cambio Data" d="Amministrativo" c="#f59e0b" onClick={()=>fetchArchivio('amm_cambiodata')} />
              )}
              <Card t="Registro Congedi" d="Ferie" c="#1e3a8a" onClick={()=>fetchArchivio('congedi')} />
            </div>
          </div>
        )}

        {/* --- SEZIONE FORM --- */}
        {pagina.startsWith('form_') && (
          <div style={{maxWidth:'500px', margin:'0 auto'}}>
            <button onClick={()=>{
              if(pagina==='form_cambiodata') setPagina('menu_amministrativo');
              else if(pagina==='form_congedo') setPagina('home');
              else setPagina('menu_anagrafe');
            }} style={backBtn}>← Annulla</button>
            <div style={formCard}>
              <h2 style={{marginTop:0, color:'#1e3a8a'}}>{pagina.replace('form_','').replace('_',' ').toUpperCase()}</h2>
              <label style={labStyle}>Data</label><input style={inputStyle} value={form.data || ''} readOnly />
              <label style={labStyle}>Operatore</label><input style={inputStyle} value={form.nome_dipendente || ''} readOnly />

              {pagina==='form_cambiodata' && (<>
                <label style={labStyle}>Nome Cliente</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_cliente:e.target.value})} />
                <label style={labStyle}>Data Nascita Vecchia</label><input style={inputStyle} placeholder="GG/MM/AAAA" onChange={(e)=>setForm({...form, datanascita_vecchia:e.target.value})} />
                <label style={labStyle}>Data Nascita Nuova</label><input style={inputStyle} placeholder="GG/MM/AAAA" onChange={(e)=>setForm({...form, datanascita_nuova:e.target.value})} />
                <label style={labStyle}>Motivo</label><textarea style={{...inputStyle, height:'80px'}} onChange={(e)=>setForm({...form, motivo:e.target.value})} />
              </>)}

              {pagina==='form_nome' && (<><label style={labStyle}>Vecchio Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, vecchio_nome:e.target.value})} /><label style={labStyle}>Nuovo Nome</label><input style={inputStyle} onChange={(e)=>setForm({...form, nuovo_nome:e.target.value})} /></>)}
              {(pagina==='form_adozione' || pagina==='form_disconoscimento') && (<><label style={labStyle}>Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} /><label style={labStyle}>Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} /><label style={labStyle}>Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} /></>)}
              {(pagina==='form_divorzio' || pagina==='form_unione') && (<><label style={labStyle}>Coniuge 1</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1:e.target.value})} /><label style={labStyle}>Coniuge 2</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2:e.target.value})} /></>)}
              {pagina==='form_congedo' && (<><label style={labStyle}>Periodo</label><input style={inputStyle} onChange={(e)=>setForm({...form, periodo:e.target.value})} /><label style={labStyle}>Motivo</label><input style={inputStyle} onChange={(e)=>setForm({...form, motivazione:e.target.value})} /></>)}

              <button style={submitBtn} onClick={() => {
                const map = { form_nome: 'anagrafe_nomi', form_adozione: 'anagrafe_adozioni', form_disconoscimento: 'anagrafe_disconoscimento', form_divorzio: 'anagrafe_divorzi', form_unione: 'anagrafe_unioni', form_congedo: 'congedi', form_cambiodata: 'amm_cambiodata' };
                inviaPratica(map[pagina]);
              }}>INVIA</button>
            </div>
          </div>
        )}

        {/* --- SEZIONE ARCHIVIO --- */}
        {pagina === 'visualizza_archivio' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna Registri</button>
            <h2 style={{color:'#1e3a8a'}}>{tabellaCorrente.toUpperCase().replace('ANAGRAFE_','').replace('AMM_','')}</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'15px'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #ddd', background:'#f1f5f9'}}>
                    <th style={td}>DATA</th><th style={td}>OPERATORE</th>
                    {tabellaCorrente === 'amm_cambiodata' && <><th style={td}>CLIENTE</th><th style={td}>VECCHIA</th><th style={td}>NUOVA</th><th style={td}>MOTIVO</th></>}
                    {tabellaCorrente === 'anagrafe_nomi' && <><th style={td}>VECCHIO</th><th style={td}>NUOVO</th></>}
                    {(tabellaCorrente === 'anagrafe_adozioni' || tabellaCorrente === 'anagrafe_disconoscimento') && <><th style={td}>FIGLIO</th><th style={td}>PADRE</th><th style={td}>MADRE</th></>}
                    {(tabellaCorrente === 'anagrafe_unioni' || tabellaCorrente === 'anagrafe_divorzi') && <><th style={td}>CONIUGE 1</th><th style={td}>CONIUGE 2</th></>}
                    {tabellaCorrente === 'congedi' && <><th style={td}>PERIODO</th><th style={td}>MOTIVO</th></>}
                  </tr>
                </thead>
                <tbody>
                  {archivio.map(i => (
                    <tr key={i.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={td}>{i.data}</td><td style={td}>{i.nome_dipendente}</td>
                      {tabellaCorrente === 'amm_cambiodata' && <><td style={td}>{i.nome_cliente}</td><td style={td}>{i.datanascita_vecchia}</td><td style={td}>{i.datanascita_nuova}</td><td style={td}>{i.motivo}</td></>}
                      {tabellaCorrente === 'anagrafe_nomi' && <><td style={td}>{i.vecchio_nome}</td><td style={td}>{i.nuovo_nome}</td></>}
                      {(tabellaCorrente === 'anagrafe_adozioni' || tabellaCorrente === 'anagrafe_disconoscimento') && <><td style={td}>{i.nome_figlio}</td><td style={td}>{i.nome_padre}</td><td style={td}>{i.nome_madre}</td></>}
                      {(tabellaCorrente === 'anagrafe_unioni' || tabellaCorrente === 'anagrafe_divorzi') && <><td style={td}>{i.nome_coniuge1}</td><td style={td}>{i.nome_coniuge2}</td></>}
                      {tabellaCorrente === 'congedi' && <><td style={td}>{i.periodo}</td><td style={td}>{i.motivazione}</td></>}
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
