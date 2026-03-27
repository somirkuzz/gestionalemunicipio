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

  const login = () => {
    if (DIPENDENTI[nick]) {
      setUser({ n: nick, r: DIPENDENTI[nick] });
      setErr(false);
    } else {
      setErr(true);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', fontFamily: 'sans-serif' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#1e3a8a', marginBottom: '20px', fontSize: '22px' }}>MUNICIPIO ATLANTIS</h2>
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} 
            placeholder="Nickname Minecraft" 
            value={nick} 
            onChange={(e) => setNick(e.target.value)} 
          />
          {err && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>Nickname non in Whitelist</p>}
          <button 
            onClick={login} 
            style={{ width: '100%', padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
          >
            ACCEDI AL SISTEMA
          </button>
        </div>
      </div>
    );
  }

  const can = (p) => PERMESSI[user.r]?.includes(p);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1e3a8a', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: 0, letterSpacing: '1px' }}>GESTIONALE MUNICIPIO</h3>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 'bold', display: 'block' }}>{user.n}</span>
          <span style={{ fontSize: '11px', color: '#cbd5e1', textTransform: 'uppercase' }}>{user.r.replace(/_/g, ' ')}</span>
        </div>
      </nav>

      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
        {can("CONGEDO") && <Card t="Modulo Congedo" d="Richiesta ferie e permessi orari." c="#1e3a8a" />}
        {can("ANAGRAFE") && <Card t="Servizi Anagrafici" d="Cambi nome, adozioni e divorzi." c="#10b981" />}
        {can("AMMINISTRATIVO") && <Card t="Ufficio Amministrativo" d="Rettifica date e documenti." c="#f59e0b" />}
        {can("DIRIGENZA") && <Card t="Archivio Centrale" d="Accesso totale a tutte le pratiche." c="#ef4444" />}
      </div>
    </div>
  );
}

function Card({ t, d, c }) {
  return (
    <div style={{ background: 'white', padding: '25px', borderRadius: '15px', borderTop: `6px solid ${c}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '18px' }}>{t}</h4>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>{d}</p>
      <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${c}`, background: 'white', color: c, fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
        APRI MODULO
      </button>
    </div>
  );
}
