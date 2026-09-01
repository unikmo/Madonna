'use client';

import { useEffect, useMemo, useState } from 'react';

const API = 'https://phhpiqwvgwlgjmyiksqe.supabase.co/functions/v1/finclose-lab-api';

type Country = { code:string; name:string; currency:string };
type InitRecord = { initialization_id:string; filename:string; legal_name?:string; country?:string; country_code?:string; country_name?:string; service_scope?:string; status:string; ready:boolean; blockers?:{message:string}[]; warnings?:{message:string}[] };
type Company = { company_id:string; legal_name:string; country_code:string; country_name:string; service_scope:string; status:string };

async function api(path:string, init?:RequestInit) {
  const r = await fetch(API + path, init);
  const text = await r.text();
  let data:any;
  try { data = JSON.parse(text); } catch { data = { detail:text }; }
  if (!r.ok) throw new Error(data.detail || text || `HTTP ${r.status}`);
  return data;
}

function toBase64(file:File) {
  return new Promise<string>((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = ()=> reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function FinCloseLab() {
  const [countries,setCountries] = useState<Country[]>([]);
  const [country,setCountry] = useState('GE');
  const [email,setEmail] = useState('');
  const [download,setDownload] = useState('');
  const [reqNote,setReqNote] = useState('Ready.');
  const [uploadNote,setUploadNote] = useState('No file uploaded.');
  const [dataNote,setDataNote] = useState('Awaiting initialized company.');
  const [records,setRecords] = useState<InitRecord[]>([]);
  const [companies,setCompanies] = useState<Company[]>([]);
  const [companyId,setCompanyId] = useState('');
  const [stage,setStage] = useState('bookkeeping');
  const [initFile,setInitFile] = useState<File|null>(null);
  const [dataFile,setDataFile] = useState<File|null>(null);
  const [health,setHealth] = useState('Checking persistence…');

  const ready = useMemo(()=>records.filter(r=>r.ready).length,[records]);
  const blocked = records.length-ready;

  async function refreshCompanies(){
    const list:Company[] = await api('/companies');
    setCompanies(list);
    setCompanyId(v=> v && list.some(c=>c.company_id===v) ? v : (list[0]?.company_id || ''));
  }

  useEffect(()=>{
    (async()=>{
      try {
        const [cs,h] = await Promise.all([api('/initialization/countries'), api('/health')]);
        setCountries(cs); setHealth(`Supabase persistence active · ${h.version}`);
        await refreshCompanies();
      } catch(e:any) { setHealth('Backend error: '+e.message); }
    })();
  },[]);

  async function requestTemplate(){
    setReqNote('Requesting…');
    try {
      const d = await api('/initialization/template/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country,email})});
      setDownload(d.download_url || '');
      setReqNote(d.note || 'Template ready.');
    } catch(e:any){ setReqNote('Error: '+e.message); }
  }

  async function uploadInitialization(){
    if(!initFile) return setUploadNote('Choose an XLSX or ZIP first.');
    setUploadNote('Validating and saving…');
    try {
      const d = await api('/initialization/upload',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({filename:initFile.name,content_base64:await toBase64(initFile)})});
      setRecords(r=>[...r,...d.records]);
      setUploadNote(`Validated ${d.records.length} template(s) and persisted the result.`);
    } catch(e:any){ setUploadNote('Error: '+e.message); }
  }

  async function initializeOne(id:string){
    try {
      const d = await api(`/initialization/${id}/initialize`,{method:'POST'});
      setRecords(r=>r.map(x=>x.initialization_id===id?d:x));
      await refreshCompanies();
      setUploadNote(`${d.legal_name || 'Company'} initialized and stored in Supabase.`);
    } catch(e:any){ setUploadNote('Error: '+e.message); }
  }

  async function initializeAll(){
    const ids=records.filter(r=>r.ready&&r.status!=='INITIALIZED').map(r=>r.initialization_id);
    if(!ids.length) return setUploadNote('No uninitialized READY companies.');
    try {
      const d=await api('/initialization/initialize-ready',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({initialization_ids:ids})});
      const map=new Map<string,InitRecord>(d.initialized.map((x:InitRecord)=>[x.initialization_id,x]));
      setRecords(r=>r.map(x=>map.get(x.initialization_id)||x));
      await refreshCompanies();
      setUploadNote(`Initialized ${d.initialized.length}; blocked ${d.blocked.length}.`);
    }catch(e:any){setUploadNote('Error: '+e.message)}
  }

  async function uploadChunk(){
    if(!companyId) return setDataNote('Initialize a company first.');
    if(!dataFile) return setDataNote('Choose a data file.');
    setDataNote('Uploading to persistent storage…');
    try {
      const d=await api(`/companies/${companyId}/data-chunks`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({stage,filename:dataFile.name,content_base64:await toBase64(dataFile)})});
      const rows=d.metadata?.sheet_rows ? Object.values(d.metadata.sheet_rows).reduce((a:any,b:any)=>Number(a)+Number(b),0) : null;
      setDataNote(`${d.status}: ${d.filename} · ${d.bytes} bytes · ${d.country_name} context${rows?` · ${rows} non-empty spreadsheet rows`:''} · SHA ${String(d.sha256).slice(0,12)}…`);
    } catch(e:any){ setDataNote('Error: '+e.message); }
  }

  return <>
    <style jsx global>{`
      :root{--nav:#091522;--bg:#f5f7fa;--card:#fff;--line:#dce3eb;--text:#101821;--muted:#697589;--blue:#2457f5;--green:#15985b;--red:#c83b3b}
      *{box-sizing:border-box} body{margin:0;background:var(--bg);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--text)}
      .fc-top{height:70px;background:var(--nav);color:#fff;display:flex;align-items:center}.fc-topin,.fc-shell{width:min(1180px,calc(100% - 40px));margin:auto}.fc-topin{display:flex;justify-content:space-between;align-items:center}.fc-brand{display:flex;gap:12px;align-items:center}.fc-logo{width:40px;height:40px;border-radius:10px;background:#fff;color:#111c28;display:grid;place-items:center;font-weight:850}.fc-brand small{display:block;color:#aeb9c7;margin-top:2px}.fc-pills{display:flex;gap:9px}.fc-pill{border:1px solid #354453;background:#ffffff08;border-radius:8px;padding:8px 11px;font-size:11px}
      .fc-shell{margin-top:34px;margin-bottom:70px}.fc-hero{display:grid;grid-template-columns:1fr 360px;gap:38px;align-items:center;margin-bottom:24px}.fc-eyebrow{font-size:10px;letter-spacing:.15em;color:#355d9c;font-weight:800}.fc-hero h1{font-size:42px;letter-spacing:-.045em;margin:10px 0 8px;line-height:1.05}.fc-hero p{color:var(--muted);font-size:14px;line-height:1.6;max-width:760px}.fc-safe{background:#fff;border:1px solid var(--line);border-radius:13px;padding:18px 20px;box-shadow:0 10px 30px #1020300a}.fc-safe b{font-size:13px}.fc-safe p{font-size:11px;margin:6px 0 0}.fc-good{color:#167649}
      .fc-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.fc-card{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 2px 20px #0f17200b;overflow:hidden}.fc-head{padding:18px 20px;border-bottom:1px solid var(--line)}.fc-head h2{font-size:15px;margin:0 0 4px}.fc-head p{font-size:11px;color:var(--muted);margin:0}.fc-body{padding:20px}.fc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.fc-label span{display:block;font-size:10px;font-weight:750;color:#566279;margin:0 0 6px 2px}.fc-select,.fc-input,.fc-button{height:42px;border-radius:9px;font:inherit}.fc-select,.fc-input{width:100%;border:1px solid #ccd6e2;background:#fff;padding:0 11px;color:#1b2633}.fc-file{padding:8px}.fc-primary{border:1px solid #184ce1;background:#2457f5;color:#fff;font-size:11px;font-weight:750;padding:0 16px}.fc-secondary{border:1px solid #d4dce6;background:#fff;color:#46536a;font-size:11px;font-weight:700;padding:0 14px}.fc-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:12px}.fc-note{background:#f3f6fa;border:1px solid #e2e7ee;border-radius:9px;padding:12px;font-size:11px;color:#59667a;min-height:42px}.fc-full{grid-column:1/-1}.fc-stats{display:flex;gap:8px;margin:0 0 14px}.fc-stat{background:#f5f7fa;border:1px solid #e4e9ef;border-radius:8px;padding:8px 11px;font-size:10px}.fc-tablewrap{overflow:auto}.fc-table{width:100%;border-collapse:collapse;font-size:10px}.fc-table th{text-align:left;color:#657187;border-bottom:1px solid var(--line);padding:9px 7px}.fc-table td{border-bottom:1px solid #edf1f5;padding:10px 7px;vertical-align:top}.fc-badge{display:inline-block;padding:4px 8px;border-radius:7px;font-size:9px;font-weight:800}.fc-ok{background:#e9f8f0;color:#167649}.fc-bad{background:#fff0f0;color:#b92d2d}.fc-warn{background:#fff7df;color:#8d6400}.fc-muted{color:var(--muted)}.fc-footer{text-align:center;color:#7a8798;font-size:10px;margin-top:22px}
      @media(max-width:860px){.fc-hero,.fc-grid{grid-template-columns:1fr}.fc-hero h1{font-size:36px}.fc-row{grid-template-columns:1fr}.fc-topin,.fc-shell{width:min(100% - 24px,1180px)}}
    `}</style>
    <header className="fc-top"><div className="fc-topin"><div className="fc-brand"><div className="fc-logo">F</div><div><b>FinClose Lab</b><small>Persistent financial-operations sandbox</small></div></div><div className="fc-pills"><span className="fc-pill">Vercel test UI</span><span className="fc-pill">v0.21</span><span className="fc-pill">Supabase</span></div></div></header>
    <main className="fc-shell">
      <section className="fc-hero"><div><span className="fc-eyebrow">COMPANY INITIALIZATION + DATA TAKEOVER</span><h1>Initialize once. Keep the company.</h1><p>Company identity and operational uploads now persist in Supabase, so a later server request can still resolve the same company and jurisdiction.</p></div><aside className="fc-safe"><b>Persistence check</b><p className={health.startsWith('Supabase')?'fc-good':''}>{health}</p><p>Synthetic/test data only.</p></aside></section>
      <section className="fc-grid">
        <div className="fc-card"><div className="fc-head"><h2>1 · Request initialization template</h2><p>Choose the jurisdiction and get a prefilled Lab workbook.</p></div><div className="fc-body"><div className="fc-row"><label className="fc-label"><span>Country</span><select className="fc-select" value={country} onChange={e=>setCountry(e.target.value)}>{countries.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></label><label className="fc-label"><span>Email (optional)</span><input className="fc-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="finance@example.com"/></label></div><div className="fc-actions"><button className="fc-button fc-primary" onClick={requestTemplate}>Request template</button>{download&&<a href={download}><button className="fc-button fc-secondary">Download directly</button></a>}</div><div className="fc-note" style={{marginTop:12}}>{reqNote}</div></div></div>
        <div className="fc-card"><div className="fc-head"><h2>2 · Validate and initialize company</h2><p>Upload XLSX/ZIP; READY records can be initialized into persistent company state.</p></div><div className="fc-body"><label className="fc-label"><span>Initialization file</span><input className="fc-input fc-file" type="file" accept=".xlsx,.zip" onChange={e=>setInitFile(e.target.files?.[0]||null)}/></label><div className="fc-actions"><button className="fc-button fc-primary" onClick={uploadInitialization}>Validate upload</button><button className="fc-button fc-secondary" onClick={initializeAll}>Initialize all ready</button></div><div className="fc-note" style={{marginTop:12}}>{uploadNote}</div></div></div>
        <div className="fc-card fc-full"><div className="fc-head"><h2>Initialization review</h2><p>Validation results are persisted before company creation.</p></div><div className="fc-body"><div className="fc-stats"><span className="fc-stat">{records.length} uploaded</span><span className="fc-stat">{ready} ready</span><span className="fc-stat">{blocked} blocked</span></div><div className="fc-tablewrap"><table className="fc-table"><thead><tr><th>Status</th><th>Company</th><th>Country</th><th>Scope</th><th>Validation</th><th>Action</th></tr></thead><tbody>{records.length?records.map(r=><tr key={r.initialization_id}><td><span className={`fc-badge ${r.ready?'fc-ok':'fc-bad'}`}>{r.status}</span></td><td><b>{r.legal_name||r.filename}</b><br/><span className="fc-muted">{r.filename}</span></td><td>{r.country_name||r.country_code||r.country}</td><td>{r.service_scope||'—'}</td><td>{r.ready?(r.warnings?.length?<span className="fc-badge fc-warn">{r.warnings.length} warning</span>:'No blockers'):(r.blockers||[]).slice(0,3).map((b,i)=><div key={i}>{b.message}</div>)}</td><td>{r.ready&&r.status!=='INITIALIZED'?<button className="fc-button fc-secondary" onClick={()=>initializeOne(r.initialization_id)}>Initialize</button>:'—'}</td></tr>):<tr><td colSpan={6} className="fc-muted">Upload a template to begin.</td></tr>}</tbody></table></div></div></div>
        <div className="fc-card"><div className="fc-head"><h2>3 · Persistent companies</h2><p>Reload this page: initialized companies must still be here.</p></div><div className="fc-body"><div className="fc-tablewrap"><table className="fc-table"><thead><tr><th>Company</th><th>Country</th><th>Scope</th><th>Status</th></tr></thead><tbody>{companies.length?companies.map(c=><tr key={c.company_id}><td><b>{c.legal_name}</b><br/><span className="fc-muted">{c.company_id.slice(0,8)}…</span></td><td>{c.country_name}</td><td>{c.service_scope}</td><td><span className="fc-badge fc-ok">{c.status}</span></td></tr>):<tr><td colSpan={4} className="fc-muted">No initialized companies.</td></tr>}</tbody></table></div><div className="fc-actions"><button className="fc-button fc-secondary" onClick={refreshCompanies}>Refresh from Supabase</button></div></div></div>
        <div className="fc-card"><div className="fc-head"><h2>4 · Upload company data</h2><p>The selected company supplies the jurisdiction context. Files go to Supabase Storage.</p></div><div className="fc-body"><div className="fc-row"><label className="fc-label"><span>Company</span><select className="fc-select" value={companyId} onChange={e=>setCompanyId(e.target.value)}>{companies.map(c=><option key={c.company_id} value={c.company_id}>{c.legal_name} · {c.country_name}</option>)}</select></label><label className="fc-label"><span>Stage</span><select className="fc-select" value={stage} onChange={e=>setStage(e.target.value)}><option value="bookkeeping">Bookkeeping</option><option value="opening_state">Opening state</option><option value="master_data">Master data</option><option value="payroll">Payroll</option></select></label></div><label className="fc-label"><span>Data file</span><input className="fc-input fc-file" type="file" onChange={e=>setDataFile(e.target.files?.[0]||null)}/></label><div className="fc-actions"><button className="fc-button fc-primary" onClick={uploadChunk}>Upload chunk</button></div><div className="fc-note" style={{marginTop:12}}>{dataNote}</div></div></div>
      </section><div className="fc-footer">FinClose Lab v0.21 · Vercel UI · Supabase PostgreSQL + private Storage · synthetic-data test environment</div>
    </main>
  </>;
}
