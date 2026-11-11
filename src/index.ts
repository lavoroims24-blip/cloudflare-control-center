interface Bindings {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
}

const apps: Record<string, {name: string; description: string}> = {
  "at-protection-warehouse": {
    name: "AT Protection Warehouse",
    description: "Gestione ordini e magazzino"
  },
  "erp-pro": {
    name: "ERP Pro",
    description: "Gestione aziendale"
  },
  "orario-lavorativo-pro": {
    name: "Orario Lavorativo Pro",
    description: "Gestione orario lavorativo"
  },
  "ordine-materiali": {
    name: "Ordine Materiali",
    description: "Gestione richieste materiali"
  },
  "relayguide-protezioni-cabine": {
    name: "Relayguide Protezioni Cabine",
    description: "Documentazione tecnica"
  },
  "stato-odl": {
    name: "Stato ODL",
    description: "Monitoraggio ordini di lavoro"
  }
};

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloudflare Control Center</title>
<style>
:root{--bg:#f4f6fa;--card:#fff;--nav:#17243a;--text:#263449;--muted:#8995a7;--orange:#f48120;--border:#e9edf3;--green:#16a477}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,sans-serif;background:var(--bg);color:var(--text)}
.layout{display:flex;min-height:100vh}
.sidebar{width:250px;background:var(--nav);color:white;padding:25px 17px;flex-shrink:0}
.logo{display:flex;align-items:center;gap:12px;padding:5px 10px 32px}
.logo-icon{background:var(--orange);width:39px;height:39px;border-radius:11px;display:grid;place-items:center;font-size:23px;font-weight:bold}
.logo strong{font-size:15px;display:block}.logo small{color:#9ba9bd;font-size:11px}
.section-label{font-size:10px;color:#8090a7;font-weight:bold;letter-spacing:1.3px;padding:15px 12px 9px}
.nav{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;color:#c2ccda;font-size:13px;margin-bottom:5px}
.nav.active{background:#2c3d56;color:white}.nav{cursor:pointer}.nav:hover{background:#2c3d56;color:white}.section-heading{scroll-margin-top:25px}.nav .icon{width:20px;text-align:center;font-size:16px}
.sidebar-bottom{margin-top:40px;padding:14px;border:1px solid #34445c;border-radius:9px;font-size:12px;color:#aab7c8}
.sidebar-bottom strong{display:block;color:white;margin-bottom:5px}
.main{flex:1;min-width:0;padding:30px 36px}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;gap:15px}
.breadcrumb{font-size:12px;color:var(--muted)}.breadcrumb strong{color:var(--text)}
.account{background:white;border:1px solid var(--border);padding:10px 14px;border-radius:9px;font-size:12px}
h1{font-size:25px;margin:0 0 8px}.subtitle{font-size:13px;color:var(--muted);margin:0}
.heading-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;gap:15px}
.refresh{background:white;border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-size:12px;cursor:pointer}
.status-banner{background:#edf9f4;border:1px solid #c9ecdc;border-radius:10px;padding:15px 18px;display:flex;gap:12px;align-items:center;margin-bottom:25px;font-size:12px;color:#267454}
.status-banner strong{display:block;margin-bottom:4px;color:#176343}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px;margin-bottom:27px}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(25,40,65,.025)}
.card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.card-title{font-size:13px;font-weight:700}.badge{font-size:10px;padding:5px 8px;border-radius:20px;background:#eaf8f2;color:#16815d}
.metric{font-size:26px;font-weight:750;margin-bottom:6px}.metric-sub{font-size:11px;color:var(--muted)}
.card-foot{display:flex;justify-content:space-between;margin-top:12px;font-size:10px;color:var(--muted)}
.section-heading{font-size:16px;font-weight:700;margin:30px 0 15px}
.panel{background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden}
table{width:100%;border-collapse:collapse}
th{text-align:left;background:#fafbfd;color:#8b97a8;font-size:10px;text-transform:uppercase;letter-spacing:.6px;padding:15px}
td{padding:15px;border-top:1px solid var(--border);font-size:12px}
.app-name{font-weight:650}.app-type{color:var(--muted);font-size:10px;margin-top:4px}
.pill{background:#eaf8f2;color:#16815d;border-radius:20px;padding:5px 9px;font-size:10px}
.footer{font-size:10px;color:#9aa4b3;margin-top:25px;display:flex;justify-content:space-between}
.loading{color:var(--muted)}.error{background:#fff1f0;border-color:#ffd5d2;color:#a33}
.detail-btn{background:#eef3fa;color:#29415f;border:1px solid #dce5f0;padding:7px 11px;border-radius:7px;font-size:11px;cursor:pointer}
.detail-btn:hover{background:#dfe9f5}
.modal-overlay{position:fixed;inset:0;background:rgba(15,27,45,.48);display:none;align-items:center;justify-content:center;padding:20px;z-index:1000}
.modal-overlay.open{display:flex}
.detail-modal{background:white;width:100%;max-width:560px;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden}
.modal-header{padding:22px 25px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.modal-header h2{font-size:19px;margin:0}
.modal-close{border:0;background:#f1f3f7;border-radius:8px;width:32px;height:32px;font-size:20px;cursor:pointer;color:var(--text)}
.modal-body{padding:24px}
.detail-description{font-size:12px;color:var(--muted);margin:0 0 20px}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.detail-item{background:#f7f9fc;border:1px solid var(--border);border-radius:9px;padding:14px}
.detail-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.detail-value{font-size:13px;font-weight:650;overflow-wrap:anywhere}
.modal-footer{padding:15px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end}
@media(max-width:500px){.detail-grid{grid-template-columns:1fr}.modal-header,.modal-body{padding:18px}}
@media(max-width:950px){.sidebar{width:205px}.main{padding:25px 20px}.grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:650px){.sidebar{width:65px;padding:18px 8px}.logo{padding:5px 4px 30px}.logo strong,.logo small,.nav span:not(.icon),.section-label,.sidebar-bottom{display:none}.nav{justify-content:center;padding:13px 5px}.main{padding:20px 13px}.grid{grid-template-columns:1fr}.heading-row{align-items:flex-start;flex-direction:column}.topbar{align-items:flex-start;flex-direction:column}table{min-width:520px}.panel{overflow-x:auto}}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
<div class="logo"><div class="logo-icon">C</div><div><strong>Cloudflare</strong><small>CONTROL CENTER</small></div></div>
<div class="section-label">GENERALE</div>
<div class="nav active" data-target="dashboard-top"><span class="icon">▦</span><span>Dashboard</span></div>
<div class="nav" data-target="applications-section"><span class="icon">▤</span><span>Applicazioni</span></div>
<div class="section-label">RISORSE</div>
<div class="nav" data-target="database-section"><span class="icon">▣</span><span>Database D1</span></div>
<div class="nav" data-target="workers-section"><span class="icon">⚡</span><span>Workers</span></div>
<div class="nav" data-target="r2-section"><span class="icon">▧</span><span>Archiviazione R2</span></div>
<div class="section-label">SISTEMA</div>
<div class="nav" data-target="consumption-section"><span class="icon">◫</span><span>Consumi e capacità</span></div>
<div class="nav" data-target="alerts-section"><span class="icon">♧</span><span>Avvisi</span></div>
<div class="nav" data-target="settings-section"><span class="icon">⚙</span><span>Impostazioni</span></div>
<div class="sidebar-bottom"><strong>Piano Cloudflare</strong>Free · Monitoraggio account</div>
</aside>
<main class="main">
<div class="topbar" id="dashboard-top">
<div class="breadcrumb">CONTROL CENTER / <strong>Dashboard</strong></div>
<div class="account" id="account">☁ Account Cloudflare · Connessione in corso</div>
</div>
<div class="heading-row">
<div><h1>Dashboard</h1><p class="subtitle">Panoramica delle risorse del tuo account Cloudflare</p></div>
<button class="refresh" onclick="loadData()">↻ Aggiorna dati</button>
</div>
<div class="status-banner" id="status">
<span style="font-size:21px">✓</span>
<div><strong>Connessione alle API Cloudflare</strong>Caricamento delle risorse del tuo account...</div>
</div>
<div class="grid">
<div class="card"><div class="card-head"><span class="card-title">DATABASE D1</span><span class="badge" id="d1badge">Caricamento</span></div><div class="metric" id="d1count">—</div><div class="metric-sub">Database collegati</div><div class="card-foot"><span>Dimensione totale</span><span id="d1size">—</span></div></div>
<div class="card"><div class="card-head"><span class="card-title">WORKERS</span><span class="badge" id="wbadge">Caricamento</span></div><div class="metric" id="wcount">—</div><div class="metric-sub">Applicazioni monitorate</div><div class="card-foot"><span>Workers rilevati</span><span id="wtotal">—</span></div></div>
<div class="card"><div class="card-head"><span class="card-title">ARCHIVIAZIONE R2</span><span class="badge" id="r2badge">Caricamento</span></div><div class="metric" id="r2count">—</div><div class="metric-sub">Bucket presenti</div><div class="card-foot"><span>Spazio utilizzato</span><span>Non disponibile via elenco bucket</span></div></div>
</div>
<div class="section-heading" id="applications-section">Le tue applicazioni</div>
<div class="panel"><table><thead><tr><th>Applicazione</th><th>Worker</th><th>Database D1</th><th>Ultimo aggiornamento</th><th>Stato</th></tr></thead><tbody id="apps"><tr><td colspan="5" class="loading">Caricamento applicazioni...</td></tr></tbody></table></div>

<div class="section-heading" id="workers-section">Workers Cloudflare</div>
<div class="panel"><table><thead><tr><th>Worker</th><th>ID tecnico</th><th>Versione</th><th>Runtime</th><th>Creato il</th><th>Ultimo aggiornamento</th><th>Binding</th></tr></thead><tbody id="worker-list"><tr><td colspan="7" class="loading">Caricamento Workers...</td></tr></tbody></table></div>

<div class="section-heading" id="database-section">Database D1</div>
<div class="panel"><table><thead><tr><th>Database</th><th>Dimensione</th><th>Tabelle</th><th>Stato</th></tr></thead><tbody id="databases"><tr><td colspan="4" class="loading">Caricamento database...</td></tr></tbody></table></div>
<div class="section-heading" id="r2-section">Archiviazione R2</div>
<div class="panel"><table><thead><tr><th>Bucket</th><th>Creato il</th><th>Stato</th></tr></thead><tbody id="buckets"><tr><td colspan="3" class="loading">Caricamento bucket...</td></tr></tbody></table></div>
<div class="section-heading" id="alerts-section">Avvisi</div>
<div class="card">
  <div class="card-title">Centro avvisi</div>
  <p class="metric-sub">La sezione è pronta per ospitare le notifiche e le segnalazioni del monitoraggio Cloudflare.</p>
  <p class="metric-sub">Le notifiche automatiche non sono ancora configurate.</p>
</div>

<div class="section-heading" id="settings-section">Impostazioni</div>
<div class="card">
  <div class="card-title">Configurazione Control Center</div>
  <p class="metric-sub">Connessione API Cloudflare gestita in modo sicuro dal Worker.</p>
  <p class="metric-sub">Aggiornamento dei dati: manuale tramite il pulsante Aggiorna dati.</p>
  <p class="metric-sub">Token API: custodito nelle variabili segrete, non esposto nel browser.</p>
</div>


<div id="consumption-section" style="display:none">
  <div class="section-heading">Monitoraggio consumi Cloudflare</div>
  <div class="panel" style="padding:20px;margin-bottom:20px">
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
      <div>
        <strong>Consumi e capacità</strong>
        <p class="metric-sub">Statistiche D1 e Workers degli ultimi 7 giorni. Archiviazione R2 attuale.</p>
      </div>
      <button class="refresh" onclick="loadAnalytics()">↻ Aggiorna consumi</button>
    </div>
    <p class="metric-sub" id="consumption-status">In attesa del caricamento.</p>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px">
      <span id="cons-r2-state" class="pill">R2 · In attesa</span>
      <span id="cons-d1-state" class="pill">D1 · In attesa</span>
      <span id="cons-workers-state" class="pill">Workers · In attesa</span>
    </div>
    <p class="metric-sub" id="consumption-updated">Ultimo aggiornamento: —</p>
  </div>

  <div class="grid" style="margin-bottom:22px">
    <div class="card">
      <div class="card-title">R2 · SPAZIO UTILIZZATO</div>
      <div class="metric" id="cons-r2-size">—</div>
      <div class="metric-sub" id="cons-r2-objects">Oggetti: —</div>
    </div>
    <div class="card">
      <div class="card-title">D1 · QUERY</div>
      <div class="metric" id="cons-d1-queries">—</div>
      <div class="metric-sub" id="cons-d1-rows">Righe elaborate: —</div>
    </div>
    <div class="card">
      <div class="card-title">WORKERS · RICHIESTE</div>
      <div class="metric" id="cons-worker-requests">—</div>
      <div class="metric-sub" id="cons-worker-errors">Errori: —</div>
    </div>
  </div>

  <div class="section-heading">Archiviazione R2</div>
  <div class="panel" style="margin-bottom:22px">
    <table>
      <thead><tr><th>Classe</th><th>Oggetti</th><th>Spazio occupato</th></tr></thead>
      <tbody id="cons-r2-table"><tr><td colspan="3">In attesa dei dati</td></tr></tbody>
    </table>
  </div>

  <div class="section-heading">Database D1</div>
  <div class="panel" style="margin-bottom:22px">
    <table>
      <thead><tr><th>Database</th><th>Dimensione</th><th>Letture</th><th>Scritture</th><th>Righe lette</th><th>Righe scritte</th></tr></thead>
      <tbody id="cons-d1-table"><tr><td colspan="6">In attesa dei dati</td></tr></tbody>
    </table>
  </div>

  <div class="section-heading">Workers</div>
  <div class="panel" style="margin-bottom:22px">
    <table>
      <thead><tr><th>Worker</th><th>Richieste</th><th>Errori</th><th>CPU P50 (µs)</th><th>CPU P99 (µs)</th></tr></thead>
      <tbody id="cons-workers-table"><tr><td colspan="5">In attesa dei dati</td></tr></tbody>
    </table>
  </div>
  <p class="metric-sub">I dati non disponibili vengono indicati con —. Nessuna percentuale di utilizzo viene stimata.</p>
</div>

<div class="modal-overlay" id="details-modal" onclick="if(event.target===this)closeDetails()">
  <div class="detail-modal">
    <div class="modal-header">
      <h2 id="detail-title">Dettagli applicazione</h2>
      <button class="modal-close" onclick="closeDetails()" aria-label="Chiudi">×</button>
    </div>
    <div class="modal-body">
      <p class="detail-description" id="detail-description"></p>
      <div class="detail-grid" id="detail-grid"></div>
    </div>
    <div class="modal-footer">
      <button class="refresh" onclick="closeDetails()">Chiudi</button>
    </div>
  </div>
</div>
<div class="footer"><span>Cloudflare Control Center · Versione 0.2.0</span><span id="updated">In attesa dei dati</span></div>
</main></div>
<script>
function esc(v){return String(v==null?"—":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function size(bytes){if(!bytes)return "0 KB";var units=["B","KB","MB","GB","TB"],i=0,n=bytes;while(n>=1024&&i<4){n/=1024;i++}return n.toFixed(2)+" "+units[i]}
function date(v){if(!v)return "—";return new Date(v).toLocaleDateString("it-IT")}
window.appsData=[];
function closeDetails(){
  document.getElementById("details-modal").classList.remove("open");
}
function showDetails(id){
  var w=window.appsData.find(function(app){return app.id===id;});
  if(!w)return;
  document.getElementById("detail-title").textContent=w.name;
  document.getElementById("detail-description").textContent=w.description||"";
  var items=[
    ["Worker",w.id],
    ["Database D1",w.database_name||w.database_check||"—"],
    ["Versione Worker",w.version_number!=null?"Versione "+w.version_number:"Non disponibile"],
    ["Creato il",w.created_on?new Date(w.created_on).toLocaleDateString("it-IT"):"Non disponibile"],
    ["Ultimo aggiornamento",w.modified_on?new Date(w.modified_on).toLocaleString("it-IT"):"—"],
    ["Data compatibilità runtime",w.compatibility_date||"Non disponibile"],
    ["Modello di utilizzo",w.usage_model||"Non disponibile"],
    ["Limite CPU",w.cpu_limit?w.cpu_limit+" ms":"Non disponibile"],
    ["Flag runtime",(w.compatibility_flags||[]).join(", ")||"Nessuno"],
    ["Stato",w.database_check==="Collegato"?"Worker e database collegati":w.database_check==="Nessun D1 collegato"?"Worker attivo · Nessun D1 associato":"Worker rilevato · Verifica database"]
  ];
  var bindingGroups={
    "Database":[],
    "Archiviazione":[],
    "Segreti":[],
    "Variabili e configurazioni":[],
    "Altri servizi":[]
  };
  (w.bindings||[]).forEach(function(b){
    var type=(b.type||"").toLowerCase();
    if(type==="d1"||type==="r2_bucket"||type==="kv_namespace"||type==="durable_object_namespace"){
      bindingGroups[type==="d1"?"Database":"Archiviazione"].push(b.name+" ("+b.type+")");
    }else if(type.includes("secret")){
      bindingGroups["Segreti"].push("Segreto configurato (valore nascosto)");
    }else if(type==="plain_text"||type==="json"||type==="var"){
      bindingGroups["Variabili e configurazioni"].push(b.name+" ("+b.type+")");
    }else{
      bindingGroups["Altri servizi"].push(b.name+" ("+b.type+")");
    }
  });
  Object.keys(bindingGroups).forEach(function(label){
    if(bindingGroups[label].length){
      items.push([label,bindingGroups[label].join(", ")]);
    }
  });
  document.getElementById("detail-grid").innerHTML=items.map(function(item){
    return "<div class='detail-item'><div class='detail-label'>"+esc(item[0])+"</div><div class='detail-value'>"+esc(item[1])+"</div></div>";
  }).join("");
  document.getElementById("details-modal").classList.add("open");
}

async function loadData(){
var status=document.getElementById("status");
status.className="status-banner";
status.innerHTML="<span>↻</span><div><strong>Aggiornamento in corso</strong>Lettura delle risorse Cloudflare...</div>";
try{
var response=await fetch("/api/resources");
var data=await response.json();
if(!response.ok||!data.success)throw new Error(data.error||"Errore durante la lettura delle API");
document.getElementById("account").textContent="☁ Account Cloudflare · Collegato";
var db=data.databases||[],workers=data.workers||[],buckets=data.buckets||[];
var total=db.reduce(function(s,d){return s+(d.file_size||0)},0);
document.getElementById("d1count").textContent=db.length;
document.getElementById("d1size").textContent=size(total);
document.getElementById("d1badge").textContent="Collegato";
document.getElementById("wcount").textContent=workers.length;
document.getElementById("wtotal").textContent=workers.length+" attivi";
document.getElementById("wbadge").textContent="Collegato";
document.getElementById("r2count").textContent=buckets.length;
document.getElementById("r2badge").textContent="Collegato";
window.appsData=workers;
document.getElementById("apps").innerHTML=workers.map(function(w){
  return "<tr><td><div class='app-name'>"+esc(w.name)+"</div><div class='app-type'>"+esc(w.description)+"</div></td><td>"+esc(w.id)+"</td><td>"+esc(w.database_name||w.database_check)+"</td><td>"+esc(date(w.modified_on))+"</td><td><button class='detail-btn' onclick='showDetails("+JSON.stringify(w.id)+")'>Dettagli</button></td></tr>";
}).join("")||"<tr><td colspan='5'>Nessuna applicazione trovata</td></tr>";
document.getElementById("worker-list").innerHTML=workers.map(function(w){
  return "<tr><td><div class='app-name'>"+esc(w.name)+"</div><div class='app-type'>"+esc(w.description)+"</div></td><td>"+esc(w.id)+"</td><td>"+esc(w.version_number!=null?"v"+w.version_number:"—")+"</td><td>"+esc(w.compatibility_date||"—")+"</td><td>"+esc(date(w.created_on))+"</td><td>"+esc(date(w.modified_on))+"</td><td>"+esc((w.bindings||[]).length)+"</td></tr>";
}).join("")||"<tr><td colspan='7'>Nessun Worker trovato</td></tr>";
document.getElementById("databases").innerHTML=db.map(function(d){return "<tr><td><div class='app-name'>"+esc(d.name)+"</div></td><td>"+esc(size(d.file_size))+"</td><td>"+esc(d.num_tables)+"</td><td><span class='pill'>Disponibile</span></td></tr>"}).join("")||"<tr><td colspan='4'>Nessun database trovato</td></tr>";
document.getElementById("buckets").innerHTML=buckets.map(function(b){return "<tr><td><div class='app-name'>"+esc(b.name)+"</div></td><td>"+esc(date(b.creation_date))+"</td><td><span class='pill'>Disponibile</span></td></tr>"}).join("")||"<tr><td colspan='3'>Nessun bucket trovato</td></tr>";
status.innerHTML="<span style='font-size:21px'>✓</span><div><strong>Account collegato correttamente</strong>Dati aggiornati direttamente dalle API Cloudflare. Le statistiche di consumo non ancora disponibili sono lasciate non valorizzate.</div>";
document.getElementById("updated").textContent="Ultimo aggiornamento: "+new Date().toLocaleString("it-IT");
}catch(e){
status.className="status-banner error";
status.innerHTML="<span>!</span><div><strong>Errore di collegamento</strong>"+esc(e.message)+"</div>";
document.getElementById("account").textContent="☁ Account Cloudflare · Errore";
}
}


let analyticsLoading=false;

function consNumber(value){
  return Number(value||0).toLocaleString("it-IT");
}

function consBytes(value){
  if(value==null||!Number.isFinite(Number(value)))return "—";
  var n=Number(value),units=["B","KB","MB","GB","TB"],i=0;
  while(n>=1024&&i<units.length-1){n/=1024;i++;}
  return n.toLocaleString("it-IT",{maximumFractionDigits:2})+" "+units[i];
}

function consCpu(value){
  return value==null?"—":Number(value).toLocaleString("it-IT",{maximumFractionDigits:2})+" µs";
}

async function loadAnalytics(){
  if(analyticsLoading)return;
  analyticsLoading=true;
  var status=document.getElementById("consumption-status");
  status.textContent="Caricamento statistiche Cloudflare...";
  try{
    var responses=await Promise.all([
      fetch("/api/resources"),
      fetch("/api/analytics")
    ]);
    var resources=await responses[0].json();
    var analytics=await responses[1].json();

    if(!responses[0].ok||!resources.success)throw new Error(resources.error||"Errore risorse");
    if(!responses[1].ok||!analytics.success)throw new Error(analytics.error||"Errore analytics");

    var metric=resources.r2_metrics;
    var r2Rows=[],totalObjects=0,totalBytes=0;

    ["standard","infrequentAccess"].forEach(function(key){
      var item=metric&&metric[key];
      if(!item)return;
      var uploaded=item.uploaded||{},published=item.published||{};
      var objects=Number(uploaded.objects||0)+Number(published.objects||0);
      var bytes=Number(uploaded.payloadSize||0)+Number(uploaded.metadataSize||0)
        +Number(published.payloadSize||0)+Number(published.metadataSize||0);
      totalObjects+=objects;
      totalBytes+=bytes;
      r2Rows.push("<tr><td>"+(key==="standard"?"Standard":"Infrequent Access")+"</td><td>"+consNumber(objects)+"</td><td>"+consBytes(bytes)+"</td></tr>");
    });

    document.getElementById("cons-r2-state").textContent=resources.r2_metrics_error?"R2 · Errore":"R2 · "+(metric?"Operativo":"Non disponibile");
    document.getElementById("cons-r2-state").style.background=resources.r2_metrics_error?"#fee2e2":"#dcfce7";
    document.getElementById("cons-r2-size").textContent=metric?consBytes(totalBytes):"—";
    document.getElementById("cons-r2-objects").textContent="Oggetti: "+(metric?consNumber(totalObjects):"—");
    document.getElementById("cons-r2-table").innerHTML=r2Rows.join("")||"<tr><td colspan='3'>Metriche R2 non disponibili</td></tr>";

    var dbs=resources.databases||[];
    var d1=analytics.d1||[];
    var d1ById={};
    d1.forEach(function(d){d1ById[d.database_id]=d;});

    var d1Read=0,d1Write=0,d1Rows=0;
    d1.forEach(function(d){
      d1Read+=Number(d.read_queries||0);
      d1Write+=Number(d.write_queries||0);
      d1Rows+=Number(d.rows_read||0)+Number(d.rows_written||0);
    });

    var d1Failed=Boolean(analytics.d1_error);
    document.getElementById("cons-d1-state").textContent=d1Failed?"D1 · Errore":"D1 · Operativo";
    document.getElementById("cons-d1-state").style.background=d1Failed?"#fee2e2":"#dcfce7";
    document.getElementById("cons-d1-queries").textContent=d1Failed?"—":consNumber(d1Read+d1Write);
    document.getElementById("cons-d1-rows").textContent="Righe elaborate: "+(d1Failed?"—":consNumber(d1Rows));

    document.getElementById("cons-d1-table").innerHTML=dbs.map(function(db){
      var d=d1ById[db.uuid]||d1ById[db.id];
      var v=function(key){return d?consNumber(d[key]):(d1Failed?"—":"0");};
      return "<tr><td>"+esc(db.name)+"</td><td>"+consBytes(db.file_size)+"</td><td>"+v("read_queries")+"</td><td>"+v("write_queries")+"</td><td>"+v("rows_read")+"</td><td>"+v("rows_written")+"</td></tr>";
    }).join("")||"<tr><td colspan='6'>Nessun database disponibile</td></tr>";

    var workers=analytics.workers||[];
    var workerFailed=Boolean(analytics.workers_error);
    var requests=0,errors=0;

    workers.forEach(function(w){
      requests+=Number((w.sum||{}).requests||0);
      errors+=Number((w.sum||{}).errors||0);
    });

    document.getElementById("cons-workers-state").textContent=workerFailed?"Workers · Errore":"Workers · Operativo";
    document.getElementById("cons-workers-state").style.background=workerFailed?"#fee2e2":"#dcfce7";
    document.getElementById("cons-worker-requests").textContent=workerFailed?"—":consNumber(requests);
    document.getElementById("cons-worker-errors").textContent="Errori: "+(workerFailed?"—":consNumber(errors));

    document.getElementById("cons-workers-table").innerHTML=workers.map(function(w){
      var sums=w.sum||{},cpu=w.quantiles||{};
      return "<tr><td>"+esc((w.dimensions||{}).scriptName)+"</td><td>"+consNumber(sums.requests)+"</td><td>"+consNumber(sums.errors)+"</td><td>"+consCpu(cpu.cpuTimeP50)+"</td><td>"+consCpu(cpu.cpuTimeP99)+"</td></tr>";
    }).join("")||"<tr><td colspan='5'>"+(workerFailed?"Statistiche Workers non disponibili":"Nessuna richiesta nel periodo")+"</td></tr>";

    var warnings=[];
    if(resources.r2_metrics_error)warnings.push("R2: "+resources.r2_metrics_error);
    if(analytics.d1_error)warnings.push("D1: "+analytics.d1_error);
    if(analytics.workers_error)warnings.push("Workers: "+analytics.workers_error);

    var updatedAt=new Date().toLocaleString("it-IT");
    status.textContent=warnings.length
      ?"Dati parziali · "+warnings.join(" | ")
      :"Monitoraggio aggiornato correttamente";
    document.getElementById("consumption-updated").textContent="Ultimo aggiornamento: "+updatedAt;
    ["cons-r2-state","cons-d1-state","cons-workers-state"].forEach(function(id){
      var el=document.getElementById(id);
      el.style.color="#1f2937";
      el.style.padding="6px 10px";
      el.style.borderRadius="20px";
    });

  }catch(e){
    status.textContent="Errore caricamento: "+e.message;
  }finally{
    analyticsLoading=false;
  }
}

const main=document.querySelector(".main");
const sections=Array.from(main.children);
const views={
  "dashboard-top":{title:"Dashboard",subtitle:"Panoramica delle risorse del tuo account Cloudflare",items:[0,1,2,3,17,18]},
  "applications-section":{title:"Applicazioni",subtitle:"Elenco delle applicazioni monitorate",items:[0,1,4,5,17,18]},
  "workers-section":{title:"Workers",subtitle:"Dettaglio tecnico dei Workers Cloudflare",items:[0,1,6,7,17,18]},
  "database-section":{title:"Database D1",subtitle:"Database collegati al tuo account Cloudflare",items:[0,1,8,9,17,18]},
  "r2-section":{title:"Archiviazione R2",subtitle:"Gestione dei bucket di archiviazione",items:[0,1,10,11,17,18]},
  "consumption-section":{title:"Consumi e capacità",subtitle:"Monitoraggio Cloudflare degli ultimi 7 giorni",items:[0,1,16,17,18]},
  "alerts-section":{title:"Avvisi",subtitle:"Notifiche e segnalazioni del sistema",items:[0,1,12,13,17,18]},
  "settings-section":{title:"Impostazioni",subtitle:"Configurazione del Control Center",items:[0,1,14,15,17,18]}
};

function openPage(target){
  const view=views[target]||views["dashboard-top"];
  sections.forEach(function(section,index){
    section.style.display=view.items.includes(index)?"":"none";
  });
  main.querySelector("h1").textContent=view.title;
  main.querySelector(".subtitle").textContent=view.subtitle;
  main.querySelector(".breadcrumb strong").textContent=view.title;
  document.querySelectorAll(".nav[data-target]").forEach(function(item){
    item.classList.toggle("active",item.dataset.target===target);
  });
  if(target==="consumption-section")loadAnalytics();
}

document.querySelectorAll(".nav[data-target]").forEach(function(item){
  item.addEventListener("click",function(){
    openPage(item.dataset.target);
  });
});

openPage("dashboard-top");
loadData();
</script>
</body>
</html>`;

async function cloudflare<T>(
  path: string,
  env: Bindings
): Promise<T> {
  const response = await fetch(
    "https://api.cloudflare.com/client/v4" + path,
    {
      headers: {
        Authorization: "Bearer " + env.CLOUDFLARE_API_TOKEN,
        "Content-Type": "application/json"
      }
    }
  );

  const result = await response.json() as {
    success: boolean;
    result: T;
    errors?: Array<{message?: string}>;
  };

  if (!response.ok || !result.success) {
    throw new Error(
      result.errors?.[0]?.message || "Errore API Cloudflare"
    );
  }

  return result.result;
}


async function cloudflareGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  env: Bindings
): Promise<T> {
  const response = await fetch(
    "https://api.cloudflare.com/client/v4/graphql",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.CLOUDFLARE_API_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables })
    }
  );

  const result = await response.json() as {
    data?: T;
    errors?: Array<{message?: string}>;
  };

  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error(
      result.errors?.[0]?.message || "Errore Cloudflare GraphQL"
    );
  }

  return result.data;
}

export default {
  async fetch(request: Request, env: Bindings): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        application: "Cloudflare Control Center",
        version: "0.2.0"
      });
    }

    if (url.pathname === "/api/resources") {
      try {
        const account = env.CLOUDFLARE_ACCOUNT_ID;
        const base = "/accounts/" + account;

        const [workerResult, databaseResult, bucketResult] =
          await Promise.all([
            cloudflare<Array<{id: string; created_on?: string; modified_on?: string}>>(
              base + "/workers/scripts",
              env
            ),
            cloudflare<Array<{
              uuid: string;
              name: string;
              file_size: number;
              num_tables: number;
            }>>(base + "/d1/database", env),
            cloudflare<{buckets: Array<{
              name: string;
              creation_date: string;
            }> }>(base + "/r2/buckets", env)
          ]);

        let r2Metrics: unknown = null;
        let r2MetricsError: string | null = null;

        try {
          r2Metrics = await cloudflare<unknown>(base + "/r2/metrics", env);
        } catch (error) {
          r2MetricsError = error instanceof Error ? error.message : "Metriche R2 non disponibili";
        }

        const workers = await Promise.all(
          workerResult
            .filter(w => apps[w.id] !== undefined)
            .map(async w => {
              let databaseName: string | null = null;
              let databaseCheck = "Non verificabile";
              let latestVersion: number | null = null;
              let workerSettings: {
                bindings?: Array<{
                  type: string;
                  name: string;
                  id?: string;
                  database_id?: string;
                }>;
                compatibility_date?: string;
                compatibility_flags?: string[];
                usage_model?: string;
                limits?: { cpu_ms?: number };
              } | null = null;

              try {
                const settings = await cloudflare<{
                  bindings?: Array<{
                    type: string;
                    name: string;
                    id?: string;
                    database_id?: string;
                  }>;
                  compatibility_date?: string;
                  compatibility_flags?: string[];
                  usage_model?: string;
                  limits?: { cpu_ms?: number };
                }>(
                  base + "/workers/scripts/" + encodeURIComponent(w.id) + "/settings",
                  env
                );
                workerSettings = settings;

                const binding = (settings.bindings || []).find(
                  b => b.type.toLowerCase() === "d1"
                );

                if (binding) {
                  const databaseId = binding.id || binding.database_id;
                  const database = databaseResult.find(
                    d => d.uuid === databaseId
                  );

                  databaseName = database?.name || null;
                  databaseCheck = databaseName ? "Collegato" : "ID non riconosciuto";
                } else {
                  databaseCheck = "Nessun D1 collegato";
                }
              } catch {
                databaseCheck = "Non verificabile";
              }

              try {
                const versions = await cloudflare<{
                  items?: Array<{number?: number}>
                }>(
                  base + "/workers/scripts/" + encodeURIComponent(w.id) + "/versions?per_page=1",
                  env
                );
                latestVersion = versions.items?.[0]?.number ?? null;
              } catch {
                latestVersion = null;
              }

              return {
                id: w.id,
                name: apps[w.id].name,
                description: apps[w.id].description,
                modified_on: w.modified_on || null,
                database_name: databaseName,
                database_check: databaseCheck,
                version_number: latestVersion,
                created_on: w.created_on || null,
                compatibility_date: workerSettings?.compatibility_date || null,
                compatibility_flags: workerSettings?.compatibility_flags || [],
                usage_model: workerSettings?.usage_model || null,
                cpu_limit: workerSettings?.limits?.cpu_ms || null,
                bindings: (workerSettings?.bindings || []).map(b => ({
                  name: b.name,
                  type: b.type
                }))
              };
            })
        );

        const databases = databaseResult.filter(
          d => d.name !== "worktime-pro-db"
        );

        return Response.json({
          success: true,
          workers,
          databases,
          buckets: bucketResult.buckets || [],
            r2_metrics: r2Metrics,
            r2_metrics_error: r2MetricsError,
          updated_at: new Date().toISOString()
        });
      } catch {
        return Response.json({
          success: false,
          error: "Impossibile leggere le risorse Cloudflare. Controlla i permessi del token API."
        }, {status: 502});
      }
    }


    if (url.pathname === "/api/analytics") {
      const account = env.CLOUDFLARE_ACCOUNT_ID;
      const now = new Date();
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const dateStart = start.toISOString().slice(0, 10);
      const dateEnd = now.toISOString().slice(0, 10);

      const d1Query = `
        query D1Metrics($accountTag: string!, $start: Date!, $end: Date!) {
          viewer {
            accounts(filter: {accountTag: $accountTag}) {
              d1AnalyticsAdaptiveGroups(
                limit: 10000
                filter: {date_geq: $start, date_leq: $end}
              ) {
                dimensions {
                  databaseId
                  date
                }
                sum {
                  readQueries
                  writeQueries
                  rowsRead
                  rowsWritten
                }
              }
            }
          }
        }
      `;

      const workersQuery = `
        query WorkersMetrics(
          $accountTag: string!,
          $start: Time!,
          $end: Time!
        ) {
          viewer {
            accounts(filter: {accountTag: $accountTag}) {
              workersInvocationsAdaptive(
                limit: 10000
                filter: {
                  datetime_geq: $start,
                  datetime_leq: $end
                }
              ) {
                dimensions {
                  scriptName
                }
                sum {
                  requests
                  errors
                }
                quantiles {
                  cpuTimeP50
                  cpuTimeP99
                }
              }
            }
          }
        }
      `;

      const [d1Result, workersResult] = await Promise.allSettled([
        cloudflareGraphQL<{
          viewer: {
            accounts: Array<{
              d1AnalyticsAdaptiveGroups: Array<{
                dimensions: {databaseId: string; date: string};
                sum: {
                  readQueries: number;
                  writeQueries: number;
                  rowsRead: number;
                  rowsWritten: number;
                };
              }>;
            }>;
          };
        }>(d1Query, {
          accountTag: account,
          start: dateStart,
          end: dateEnd
        }, env),

        cloudflareGraphQL<{
          viewer: {
            accounts: Array<{
              workersInvocationsAdaptive: Array<{
                dimensions: {scriptName: string};
                sum: {requests: number; errors: number};
                quantiles: {
                  cpuTimeP50: number | null;
                  cpuTimeP99: number | null;
                };
              }>;
            }>;
          };
        }>(workersQuery, {
          accountTag: account,
          start: start.toISOString(),
          end: now.toISOString()
        }, env)
      ]);

      const d1Groups = d1Result.status === "fulfilled"
        ? d1Result.value.viewer.accounts[0]?.d1AnalyticsAdaptiveGroups || []
        : [];

      const workerGroups = workersResult.status === "fulfilled"
        ? workersResult.value.viewer.accounts[0]?.workersInvocationsAdaptive || []
        : [];

      const d1 = Object.values(
        d1Groups.reduce((acc, group) => {
          const id = group.dimensions.databaseId;
          if (!acc[id]) {
            acc[id] = {
              database_id: id,
              read_queries: 0,
              write_queries: 0,
              rows_read: 0,
              rows_written: 0
            };
          }
          acc[id].read_queries += group.sum.readQueries || 0;
          acc[id].write_queries += group.sum.writeQueries || 0;
          acc[id].rows_read += group.sum.rowsRead || 0;
          acc[id].rows_written += group.sum.rowsWritten || 0;
          return acc;
        }, {} as Record<string, {
          database_id: string;
          read_queries: number;
          write_queries: number;
          rows_read: number;
          rows_written: number;
        }>)
      );

      return Response.json({
        success: true,
        period: {
          start: start.toISOString(),
          end: now.toISOString(),
          days: 7
        },
        d1,
        d1_error: d1Result.status === "rejected"
          ? String(d1Result.reason)
          : null,
        workers: workerGroups,
        workers_error: workersResult.status === "rejected"
          ? String(workersResult.reason)
          : null,
        updated_at: now.toISOString()
      });
    }

    if (url.pathname === "/favicon.ico") {
      return new Response(null, {status: 204});
    }

    return new Response(html, {
      headers: {"Content-Type": "text/html; charset=UTF-8"}
    });
  }
} satisfies ExportedHandler<Bindings>;
