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
  "DIRIGENTE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO", "ARCHIVIO"],
  "VICE_DIRIGENTE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO", "ARCHIVIO"],
  "SEGRETARIO_COMUNALE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO", "ARCHIVIO"],
  "COORDINATORE_UFFICI": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "UNIONE_CIVILE", "CONGEDO"],
  "RESPONSABILE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "CONGEDO"],
  "VICE_RESPONSABILE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "DIVORZIO", "CONGEDO"],
  "SUPERVISORE_ANAGRAFE": ["CAMBIO_NOME", "ADOZIONE", "DISCONOSCIMENTO", "CONGEDO"],
  "IMPIEGATO_ANAGRAFE": ["CAMBIO_NOME", "CONGEDO"],
  "RESPONSABILE_AMMINISTRATIVO": ["CONGEDO"],
  "IMPIEGATO_AMMINISTRATIVO": ["CONGEDO"],
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
      setForm({
        data: new Date().toLocaleDateString('it-IT'),
        nome_dipendente: user.n
      });
    }
  }, [pagina, user]);

  const can = (perm) => user && (PERMESSI[user.r] || []).includes(perm);

  const inviaPratica = async (tabella) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabella}`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify(form)
      });
      if (res.ok) { setPagina('successo'); setForm({}); }
      else { const err = await res.json(); alert("Errore Database: " + err.message); }
    } catch (e) { alert("Errore di connessione."); }
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

  const CommonFields = () => (
    <>
      <label style={labStyle}>Data</label>
      <input style={inputStyle} value={form.data || ''} onChange={(e)=>setForm({...form, data:e.target.value})} />
      <label style={labStyle}>Dipendente Responsabile</label>
      <input style={inputStyle} value={form.nome_dipendente || ''} onChange={(e)=>setForm({...form, nome_dipendente:e.target.value})} />
    </>
  );

  if (!user) return (
    <div style={loginBg}><div style={loginCard}>
      <h2 style={{color:'#1e3a8a'}}>MUNICIPIO ATLANTIS</h2>
      <p style={{fontSize:'12px', color:'#64748b', marginBottom:'20px'}}>Accesso Gestionale Dipendenti</p>
      <input style={inputStyle} placeholder="Inserisci il tuo Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} />
      <button style={submitBtn} onClick={()=>{ if(DIPENDENTI[nick]) setUser({n:nick, r:DIPENDENTI[nick]}); else alert("Nickname non autorizzato."); }}>ACCEDI</button>
    </div></div>
  );

  return (
    <div style={pageBg}>
      <nav style={navStyle}>
        <h2 onClick={() => setPagina('home')} style={{cursor:'pointer', margin:0}}>MUNICIPIO ATLANTIS</h2>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <div style={{textAlign:'right'}}><b style={{display:'block', fontSize:'14px'}}>{user.n}</b><small style={{fontSize:'10px', opacity:0.8}}>{user.r.replace(/_/g, ' ')}</small></div>
          <button onClick={()=>setUser(null)} style={logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={container}>
        {pagina === 'home' && (
          <div>
            <h1>Dashboard Principale</h1>
            <div style={gridStyle}>
              <Card t="Ufficio Anagrafe" d="Moduli Nomi, Matrimoni e Adozioni" c="#10b981" onClick={()=>setPagina('menu_anagrafe')} />
              {can("CONGEDO") && <Card t="Richiesta Congedo" d="Gestione ferie e assenze" c="#1e3a8a" onClick={()=>setPagina('form_congedo')} />}
              {can("ARCHIVIO") && <Card t="Archivio Centrale" d="Visualizza tutti i registri" c="#ef4444" onClick={()=>setPagina('menu_archivio')} />}
            </div>
          </div>
        )}

        {pagina === 'menu_anagrafe' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Torna alla Dashboard</button>
            <div style={gridStyle}>
              {can("CAMBIO_NOME") && <Card t="Cambio Nome" d="Registro Nomi" c="#10b981" onClick={()=>setPagina('form_nome')} />}
              {can("ADOZIONE") && <Card t="Adozione" d="Nuclei Familiari" c="#10b981" onClick={()=>setPagina('form_adozione')} />}
              {can("DISCONOSCIMENTO") && <Card t="Disconoscimento" d="Pratiche Legami" c="#059669" onClick={()=>setPagina('form_disconoscimento')} />}
              {can("DIVORZIO") && <Card t="Divorzio" d="Scioglimento Coniugale" c="#059669" onClick={()=>setPagina('form_divorzio')} />}
              {can("UNIONE_CIVILE") && <Card t="Unione Civile" d="Matrimoni e Accordi" c="#047857" onClick={()=>setPagina('form_unione')} />}
            </div>
          </div>
        )}

        {pagina === 'menu_archivio' && (
          <div>
            <button onClick={()=>setPagina('home')} style={backBtn}>← Torna alla Dashboard</button>
            <div style={gridStyle}>
              <Card t="Registro Nomi" d="Storico Cambi Nomi" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_nomi')} />
              <Card t="Registro Adozioni" d="Storico Adozioni" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_adozioni')} />
              <Card t="Registro Disc." d="Storico Disconoscimenti" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_disconoscimento')} />
              <Card t="Registro Divorzi" d="Storico Divorzi" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_divorzi')} />
              <Card t="Registro Unioni" d="Storico Unioni" c="#ef4444" onClick={()=>fetchArchivio('anagrafe_unioni')} />
              <Card t="Registro Congedi" d="Storico Assenze" c="#1e3a8a" onClick={()=>fetchArchivio('congedi')} />
            </div>
          </div>
        )}

        {pagina.startsWith('form_') && (
          <div style={{maxWidth:'500px', margin:'0 auto'}}>
            <button onClick={()=>setPagina(pagina==='form_congedo'?'home':'menu_anagrafe')} style={backBtn}>← Annulla</button>
            <div style={formCard}>
              <h2 style={{marginTop:0, color:'#1e3a8a'}}>{pagina.replace('form_','').replace('_',' ').toUpperCase()}</h2>
              <CommonFields />
              {pagina==='form_nome' && (<>
                <label style={labStyle}>Vecchio Nome/Cognome</label><input style={inputStyle} onChange={(e)=>setForm({...form, vecchio_nome:e.target.value})} />
                <label style={labStyle}>Nuovo Nome/Cognome</label><input style={inputStyle} onChange={(e)=>setForm({...form, nuovo_nome:e.target.value})} />
              </>)}
              {pagina==='form_adozione' && (<>
                <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} />
                <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} />
                <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} />
              </>)}
              {pagina==='form_disconoscimento' && (<>
                <label style={labStyle}>Nome Figlio</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_figlio:e.target.value})} />
                <label style={labStyle}>Nome Padre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_padre:e.target.value})} />
                <label style={labStyle}>Nome Madre</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_madre:e.target.value})} />
              </>)}
              {(pagina==='form_divorzio' || pagina==='form_unione') && (<>
                <label style={labStyle}>Nome Primo Coniuge</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge1:e.target.value})} />
                <label style={labStyle}>Nome Secondo Coniuge</label><input style={inputStyle} onChange={(e)=>setForm({...form, nome_coniuge2:e.target.value})} />
              </>)}
              {pagina==='form_congedo' && (<>
                <label style={labStyle}>Periodo (es. dal... al...)</label><input style={inputStyle} onChange={(e)=>setForm({...form, periodo:e.target.value})} />
                <label style={labStyle}>Motivazione</label><input style={inputStyle} onChange={(e)=>setForm({...form, motivazione:e.target.value})} />
              </>)}
              <button style={submitBtn} onClick={()=>inviaPratica(pagina==='form_nome'?'anagrafe_nomi':pagina==='form_adozione'?'anagrafe_adozioni':pagina==='form_disconoscimento'?'anagrafe_disconoscimento':pagina==='form_divorzio'?'anagrafe_divorzi':pagina==='form_unione'?'anagrafe_unioni':'congedi')}>INVIA PRATICA</button>
            </div>
          </div>
        )}

        {pagina === 'visualizza_archivio' && (
          <div style={formCard}>
            <button onClick={()=>setPagina('menu_archivio')} style={backBtn}>← Torna ai Registri</button>
            <h2 style={{color:'#1e3a8a'}}>{tabellaCorrente.toUpperCase()}</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'15px'}}>
                <thead><tr style={{borderBottom:'2px solid #ddd'}}><th style={td}>DATA</th><th style={td}>DIPENDENTE</th><th style={td}>DETTAGLI</th></tr></thead>
                <tbody>
                  {archivio.map(i => (
                    <tr key={i.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={td}>{i.data}</td>
                      <td style={td}>{i.nome_dipendente}</td>
                      <td style={td}>{i.vecchio_nome || i.nome_figlio || i.nome_coniuge1 || i.periodo || 'N/D'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagina === 'successo' && <div style={{textAlign:'center', padding:'50px'}}><div style={formCard}><h2>Operazione Completata! ✅</h2><p>I dati sono stati salvati correttamente nel database.</p><button onClick={()=>setPagina('home')} style={submitBtn}>TORNA ALLA HOME</button></div></div>}
      </div>
    </div>
  );
}

const navStyle={background:'#1e3a8a',color:'white',padding:'15px 40px',display:'flex',justifyContent:'space-between',alignItems:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.1)'};
const loginBg={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a', fontFamily:'sans-serif'};
const loginCard={background:'white',padding:'40px',borderRadius:'20px',textAlign:'center',width:'350px', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'};
const pageBg={minHeight:'100vh',background:'#f8fafc', fontFamily:'sans-serif'};
const container={padding:'40px',maxWidth:'1200px',margin:'0 auto'};
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px', marginTop:'20px'};
const formCard={background:'white',padding:'30px',borderRadius:'15px',boxShadow:'0 4px 15px rgba(0,0,0,0.05)'};
const inputStyle={width:'100%',padding:'12px',marginBottom:'15px',borderRadius:'8px',border:'1px solid #cbd5e1', fontSize:'14px', boxSizing:'border-box'};
const labStyle={fontSize:'11px',fontWeight:'bold',color:'#1e3a8a', textTransform:'uppercase', marginBottom:'5px', display:'block'};
const submitBtn={width:'100%',padding:'14px',background:'#1e3a8a',color:'white',border:'none',borderRadius:'8px',cursor:'pointer', fontWeight:'bold', fontSize:'14px', marginTop:'10px'};
const logoutBtn={background:'#ef4444',color:'white',border:'none',padding:'8px 12px',borderRadius:'6px',cursor:'pointer', fontWeight:'bold', fontSize:'12px'};
const backBtn={background:'none',border:'none',color:'#1e3a8a',fontWeight:'bold',cursor:'pointer',marginBottom:'15px', fontSize:'14px'};
const td={padding:'12px', textAlign:'left', fontSize:'13px', color:'#334155'};

function Card({t,d,c,onClick}){return(<div style={{background:'white',padding:'25px',borderRadius:'15px',borderTop:`6px solid ${c}`,boxShadow:'0 4px 12px rgba(0,0,0,0.05)', transition:'transform 0.2s'}}><h3>{t}</h3><p style={{fontSize:'13px',color:'#64748b', marginBottom:'20px'}}>{d}</p><button onClick={onClick} style={{width:'100%',padding:'10px',background:c,color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold', fontSize:'12px'}}>ACCEDI</button></div>);}
