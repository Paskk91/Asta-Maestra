import * as Sync from './sync.js';

'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('it-IT').format(Math.round(n));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clone=o=>typeof structuredClone==='function'?structuredClone(o):JSON.parse(JSON.stringify(o));
const fold=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hhmm=t=>new Date(t).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
const colName=i=>{let s='',n=i+1;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=(n-m-1)/26}return s};
const BASE_TITLE='Asta Maestra — Tactical console per l\'asta del fantacalcio';
function initials(n){const p=String(n||'').split(/[\s.'\-]+/).filter(Boolean);
  if(!p.length)return '—';if(p.length===1)return p[0].slice(0,2).toUpperCase();return (p[0][0]+p[1][0]).toUpperCase()}
function download(name,text,mime){const b=new Blob([text],{type:mime||'text/plain;charset=utf-8'});const u=URL.createObjectURL(b);
  const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),900)}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}

const ICONS={
gavel:'<path d="m13 5 6 6M15.5 2.5l6 6-3 3-6-6zM11 7l6 6M3 21l8-8M2 21h10"/>',
coin:'<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.6c-.6-.9-1.6-1.4-2.8-1.4-1.9 0-3.2 1.6-3.2 3.8s1.3 3.8 3.2 3.8c1.2 0 2.2-.5 2.8-1.4"/>',
upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/>',download:'<path d="M12 4v12m-5-5 5 5 5-5M4 20h16"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
star:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',check:'<path d="m4 12.5 5.5 5.5L20 6.5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
up:'<path d="m6 14 6-6 6 6"/>',down:'<path d="m6 10 6 6 6-6"/>',
undo:'<path d="M4 10h9.5a5 5 0 1 1 0 10H10M4 10l4-4M4 10l4 4"/>',
redo:'<path d="M20 10h-9.5a5 5 0 1 0 0 10H14M20 10l-4-4M20 10l-4 4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.7-3.4 3.3-5 6.5-5s5.8 1.6 6.5 5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 15.4c1.7.7 2.8 2.1 3 4.6"/>',
chart:'<path d="M5 20v-8M11 20V5M17 20v-11M3 20h18"/>',
shield:'<path d="M12 3l7 3v5.5c0 4.8-3.4 7.8-7 9.5-3.6-1.7-7-4.7-7-9.5V6z"/>',
hand:'<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5v-1a1.5 1.5 0 0 1 3 0V11m0-5.5a1.5 1.5 0 0 1 3 0V13c0 4.5-2.5 7.5-6 7.5s-6-3-6-7v-2a1.5 1.5 0 0 1 3 0"/>',
hex:'<path d="M12 3l7 4v10l-7 4-7-4V7z"/><circle cx="12" cy="12" r="2"/>',
flame:'<path d="M12 3c1 3.2 5 5.4 5 9.3a5 5 0 0 1-10 0c0-2 .9-3.6 2-5.1.6 1.5 1.5 2.2 2.6 2.2C10.9 7 11 5 12 3z"/>',
soundOn:'<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
soundOff:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/>',
drag:'<circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
warn:'<path d="M12 3 2.5 20h19zM12 9.5v5M12 17.5v.5"/>',
file:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
sliders:'<path d="M4 8h9M17 8h3M13 5v6M4 16h3M11 16h9M7 13v6"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"/><path d="M12 8v4.5l3 1.8"/>',
crown:'<path d="M4 18h16M4 18l-1.5-9 5.5 3.5L12 5l4 7.5L21.5 9 20 18z"/>',
sparkles:'<path d="M12 3l1.8 4.4L18 9.2l-4.2 1.8L12 15.4l-1.8-4.4L6 9.2l4.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
radar:'<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7.5a4.5 4.5 0 1 0 4.5 4.5"/><path d="M12 12l7-7"/><circle cx="12" cy="12" r="1"/>',
scale:'<path d="M12 3v18M8 21h8M5 7h14M5 7l-3 6.5h6zM19 7l-3 6.5h6z"/><path d="M2 13.5a3 3 0 0 0 6 0M16 13.5a3 3 0 0 0 6 0"/>',
shirt:'<path d="M8 4 4 7l2 3.5 2-1V20h8v-10.5l2 1L20 7l-4-3a4 4 0 0 1-8 0z"/>',
edit:'<path d="M4 20l4.5-1L20 7.5l-3.5-3.5L5 15.5z"/>',
trend:'<path d="M3 17l6-6 4 4 8-8M21 7h-5M21 7v5"/>',
grid:'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
sheet:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/>',
verified:'<path d="m12 2 2.4 1.8 3-.2 1 2.8 2.5 1.6-1 2.8 1 2.8-2.5 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3.1 16l1-2.8-1-2.8 2.5-1.6 1-2.8 3 .2z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
wrench:'<path d="M14.5 6a4 4 0 1 0 4.6 4.6L21 12l-9 9-3-3 9-9z"/>',
cloud:'<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/><path d="M12 15V9m-3 3 3-3 3 3"/>'
};
const icon=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
document.querySelectorAll('[data-ico]').forEach(el=>{el.innerHTML=icon(el.dataset.ico,+el.dataset.icoSize||18)});

const ROLES=['P','D','C','A'],SLOTS={P:3,D:8,C:8,A:6},TOTAL_SLOTS=25;
const RMETA={P:{label:'Portieri',one:'Portiere',color:'var(--roleP)',hex:'#F59E0B',ico:'hand'},
 D:{label:'Difensori',one:'Difensore',color:'var(--roleD)',hex:'#3B82F6',ico:'shield'},
 C:{label:'Centrocampisti',one:'Centrocampista',color:'var(--roleC)',hex:'#10B981',ico:'hex'},
 A:{label:'Attaccanti',one:'Attaccante',color:'var(--roleA)',hex:'#EF4444',ico:'flame'}};
const FORMATIONS={'442':{label:'4-4-2',D:4,C:4,A:2},'433':{label:'4-3-3',D:4,C:3,A:3},'343':{label:'3-4-3',D:3,C:4,A:3},
 '352':{label:'3-5-2',D:3,C:5,A:2},'451':{label:'4-5-1',D:4,C:5,A:1},'532':{label:'5-3-2',D:5,C:3,A:2}};
const K={main:'astamaestra_v5',mirror:'astamaestra_v5_m',snaps:'astamaestra_v5_s'};
const LEGACY=['astamaestra_v4','astamaestra_v3','astamaestra_v2'];
const cleanName=v=>typeof v==='string'&&v.trim()?v.trim():'';
const dispName=v=>cleanName(v)||'\u2014';
const MANTRA_LABEL={Por:'Portiere',Dd:'Difensore destro',Ds:'Difensore sinistro',Dc:'Difensore centrale',E:'Esterno',B:'Braccetto',
 M:'Mediano',C:'Centrocampista centrale',T:'Trequartista',W:'Wing',A:'Attaccante',Pc:'Punta centrale'};
const MANTRA_SET=['Por','Dd','Ds','Dc','E','B','M','C','T','W','A','Pc'];
const WAKE_SUPPORTED=typeof navigator!=='undefined'&&'wakeLock' in navigator;
const VIBRATE_SUPPORTED=typeof navigator!=='undefined'&&typeof navigator.vibrate==='function';
const REC_DEFAULT={aggression:1,urgencyW:40,pressureW:30,valueW:30,borrow:50,borrowOn:true,runWindow:6,topThreshold:70,depthTarget:2};
const REC_PRESETS={
  prudente:{aggression:.85,urgencyW:30,pressureW:20,valueW:50,borrow:25,borrowOn:true,runWindow:8,topThreshold:75,depthTarget:2},
  equilibrata:{...REC_DEFAULT},
  aggressiva:{aggression:1.25,urgencyW:45,pressureW:35,valueW:20,borrow:75,borrowOn:true,runWindow:5,topThreshold:65,depthTarget:2},
  antiinflazione:{aggression:.9,urgencyW:25,pressureW:55,valueW:20,borrow:40,borrowOn:true,runWindow:4,topThreshold:70,depthTarget:1},
  chiusura:{aggression:1.1,urgencyW:65,pressureW:15,valueW:20,borrow:90,borrowOn:true,runWindow:10,topThreshold:55,depthTarget:3}};

function baseUI(){return{q:'',role:'ALL',team:'ALL',mantra:'ALL',market:'free',affari:false,sort:'value',dir:'desc',limit:60,view:null,hideSteps:false,hidePulse:false}}
function freshState(){
  return{v:5,settings:{budget:500,teams:8,reserve:1,split:{P:6,D:16,C:30,A:48},strategy:'eq',formation:'442',sound:true,trend:true,
      timerOn:true,timerSec:30,wakeLock:true,confirms:true,autoBackup:true,autoBackupEvery:12,rec:{...REC_DEFAULT}},
    leagueName:'',myName:'',source:null,
    players:[],teams:Array.from({length:8},(_,i)=>({id:i===0?'me':'t'+i,name:'',players:[]})),
    log:[{t:Date.now(),type:'sys',text:'Sessione creata · nessuna chiamata a tabellone'}],
    plan:[],recent:[],seq:0,sinceBackup:0,lastBackupAt:0,views:[],ui:baseUI()};
}
function migrate(old){
  try{const s=clone(old);
    if(!Array.isArray(s.players)||!Array.isArray(s.teams))return null;
    s.v=5;
    s.settings=Object.assign({timerOn:true,timerSec:30,reserve:1,strategy:'eq',formation:'442',sound:true,trend:true,wakeLock:true,
      confirms:true,autoBackup:true,autoBackupEvery:12,split:{P:6,D:16,C:30,A:48},budget:500,teams:8},s.settings||{});
    s.settings.rec=Object.assign({...REC_DEFAULT},s.settings.rec||{});delete s.settings.estimates;
    s.seq=s.seq||0;s.sinceBackup=s.sinceBackup||0;s.lastBackupAt=s.lastBackupAt||0;
    s.plan=Array.isArray(s.plan)?s.plan:[];s.recent=Array.isArray(s.recent)?s.recent:[];s.views=Array.isArray(s.views)?s.views:[];
    s.players.forEach(p=>{if(p.fvm==null)p.fvm=Math.max(1,Math.round((p.fm||6)*20));if(p.qti==null)p.qti=p.qt;if(p.diff==null)p.diff=0;
      if(!Array.isArray(p.mantra))p.mantra=[];delete p.spark;delete p.estimated});
    s.teams.forEach((t,i)=>{if(!t.id)t.id=i===0?'me':'t'+i;if(typeof t.name!=='string')t.name='';if(!Array.isArray(t.players))t.players=[];
      t.players.forEach(e=>{if(e.fair==null)e.fair=e.price;if(e.at==null)e.at=++s.seq;if(e.value==null)e.value=50})});
    // sessione vergine ereditata dalle versioni precedenti: rimuove i nomi auto-generati
    if(!s.players.length&&!s.teams.some(t=>t.players.length)){
      if(cleanName(s.leagueName)==='La Mia Lega')s.leagueName='';
      if(cleanName(s.myName)==='La Mia Squadra')s.myName='';
      s.teams.forEach((t,i)=>{if(t.name===(i===0?'La Mia Squadra':'Squadra '+(i+1)))t.name=''})}
    s.leagueName=cleanName(s.leagueName);s.myName=cleanName(s.myName);
    s.ui=Object.assign(baseUI(),s.ui||{});s.ui.limit=60;delete s.ui.status;
    s.log=Array.isArray(s.log)?s.log:[];
    return s;
  }catch(e){return null}
}

/* ---------- store hardened ---------- */
let storeOK=true,storeNote='',lastSaveAt=0,lastSum='';
function readRec(key){
  try{const raw=localStorage.getItem(key);if(!raw)return null;
    const o=JSON.parse(raw);if(!o||typeof o.json!=='string')return null;
    if(hashStr(o.json)!==o.sum)return null;
    const d=JSON.parse(o.json);if(!d||!Array.isArray(d.players)||!Array.isArray(d.teams))return null;
    return d;
  }catch(e){return null}
}
function loadState(){
  let s=readRec(K.main);
  if(s)return{state:migrate(s)||s,src:'main'};
  s=readRec(K.mirror);
  if(s)return{state:migrate(s)||s,src:'mirror'};
  const sn=readSnaps();
  if(sn.length){const rebuilt=rebuildFromSnap(sn[0]);if(rebuilt)return{state:rebuilt,src:'snapshot'}}
  for(const k of LEGACY){try{const raw=localStorage.getItem(k);if(raw){const p=JSON.parse(raw);const m=p&&p.v>=4?p:migrate(p);
    if(m)return{state:m,src:'legacy'}}}catch(e){}}
  return{state:freshState(),src:'fresh'};
}
function readSnaps(){try{const raw=localStorage.getItem(K.snaps);if(!raw)return[];const a=JSON.parse(raw);return Array.isArray(a)?a:[]}catch(e){return[]}}
function writeSnaps(a){try{localStorage.setItem(K.snaps,JSON.stringify(a));return true}catch(e){return false}}
function snapBody(s){const{players,source,ui,...rest}=s;return clone(rest)}
function rebuildFromSnap(sn){
  if(!sn||!sn.body)return null;
  try{const cur=readRec(K.main)||readRec(K.mirror);
    const players=cur?cur.players:[];const source=cur?cur.source:null;
    const s=Object.assign(clone(sn.body),{players:clone(players),source:source?clone(source):null,ui:baseUI()});
    return migrate(s);
  }catch(e){return null}
}
let snaps=[];
function pushSnap(label){
  const sig=state.seq+'|'+state.players.length+'|'+state.teams.map(t=>t.players.length).join(',');
  if(snaps[0]&&snaps[0].sig===sig)return;
  snaps.unshift({at:Date.now(),label,sig,body:snapBody(state),buys:state.teams.reduce((a,t)=>a+t.players.length,0)});
  if(snaps.length>14)snaps.length=14;
  if(!writeSnaps(snaps)){snaps.length=Math.max(3,Math.floor(snaps.length/2));writeSnaps(snaps)}
}
function persist(){
  const json=JSON.stringify(state);const sum=hashStr(json);
  const rec=JSON.stringify({v:5,at:Date.now(),sum,json});
  lastSum=sum;
  try{localStorage.setItem(K.main,rec);storeOK=true;storeNote=''}
  catch(e){
    snaps.length=Math.max(2,Math.floor(snaps.length/2));writeSnaps(snaps);
    try{localStorage.setItem(K.main,rec);storeOK=true;storeNote='Spazio liberato: snapshot ridotti.'}
    catch(e2){storeOK=false;storeNote='Memoria browser piena: scarica un backup su file.'}
  }
  try{localStorage.setItem(K.mirror,rec)}catch(e){}
  lastSaveAt=Date.now();
  if(bc)try{bc.postMessage({t:'save',id:TAB_ID,sum,at:lastSaveAt,buys:state.teams.reduce((a,t)=>a+t.players.length,0)})}catch(e){}
  if(syncAuto&&syncUser)scheduleSyncPush();
}
const save=debounce(persist,180);

/* ---------- multi-scheda ---------- */
const TAB_ID=Math.random().toString(36).slice(2,9);
let bc=null;try{bc=new BroadcastChannel('astamaestra_session')}catch(e){}
const peers=new Map();let remoteAhead=false,guardDismissed=false;
if(bc)bc.onmessage=ev=>{
  const d=ev.data;if(!d||d.id===TAB_ID)return;
  if(d.t==='ping'||d.t==='save'){peers.set(d.id,{at:Date.now(),buys:d.buys||0});
    if(d.t==='save'&&d.sum&&d.sum!==lastSum){remoteAhead=true;renderGuard()}}
  if(d.t==='bye'){peers.delete(d.id);renderGuard()}
  if(d.t==='ping')renderGuard();
};
setInterval(()=>{
  if(bc)try{bc.postMessage({t:'ping',id:TAB_ID,at:Date.now(),buys:state?state.teams.reduce((a,t)=>a+t.players.length,0):0})}catch(e){}
  const now=Date.now();for(const [id,p] of peers)if(now-p.at>7000)peers.delete(id);
  if(!bc){const r=readRec(K.main);if(r&&lastSum&&hashStr(JSON.stringify(r))!==lastSum){remoteAhead=true}}
  renderGuard();
},2600);
addEventListener('pagehide',()=>{if(bc)try{bc.postMessage({t:'bye',id:TAB_ID})}catch(e){}});
addEventListener('focus',()=>{const r=readRec(K.main);
  if(r&&lastSum&&hashStr(JSON.stringify(r))!==lastSum){remoteAhead=true;renderGuard()}});
function renderGuard(){
  const g=$('guardBanner');if(!g)return;
  let html='',crit=false;
  if(FRESH_MODE){crit=true;
    html=`${icon('warn',18)}<span class="g-t"><b>Avvio pulito attivo.</b> I dati vengono cancellati a ogni ricarica finché l'indirizzo contiene <code>?fresh=1</code>. Rimuovilo per tornare a salvare normalmente.</span>
      <button class="btn btn-gold btn-sm" data-action="exit-fresh">Apri senza avvio pulito</button>`;
  }else if(remoteAhead){crit=true;
    html=`${icon('warn',18)}<span class="g-t"><b>Sessione aggiornata da un'altra scheda.</b> Per non sovrascrivere quei dati, ricarica prima di continuare a chiamare.</span>
      <button class="btn btn-gold btn-sm" data-action="reload-store">Ricarica ora</button>
      <button class="btn btn-ghost btn-sm" data-action="guard-ignore">Continua qui</button>`;
  }else if(!storeOK){crit=true;
    html=`${icon('warn',18)}<span class="g-t"><b>Memoria del browser piena.</b> Il salvataggio automatico non è garantito: scarica subito un backup su file.</span>
      <button class="btn btn-gold btn-sm" data-action="backup-now">Backup ora</button>`;
  }else if(peers.size>0&&!guardDismissed){
    html=`${icon('users',18)}<span class="g-t"><b>Asta aperta in ${peers.size+1} schede.</b> Registra le chiamate da una sola scheda per evitare conflitti.</span>
      <button class="btn btn-ghost btn-sm" data-action="guard-dismiss">Ho capito</button>`;
  }
  g.innerHTML=html;g.classList.toggle('show',!!html);g.classList.toggle('crit',crit);
  document.body.classList.toggle('guarded',!!html);
}

/* ---------- presentazione ---------- */
let presentOn=false;
let presentTheme='dark';
try{presentTheme=localStorage.getItem('astamaestra_present_theme')==='light'?'light':'dark'}catch(e){}
function applyPresentTheme(){
  const p=$('presentMode'),b=$('presentThemeBtn');if(!p||!b)return;
  p.classList.toggle('light',presentTheme==='light');b.classList.toggle('on',presentTheme==='light');
  b.setAttribute('aria-label',presentTheme==='light'?'Attiva il tema scuro':'Attiva il tema chiaro')}
function togglePresent(force){
  const next=force==null?!presentOn:!!force;
  if(next===presentOn)return;
  presentOn=next;
  $('presentMode').hidden=!presentOn;
  document.body.classList.toggle('presenting',presentOn);
  $('presentBtn').classList.toggle('on',presentOn);
  syncLock();
  if(presentOn){renderPresent();if(!document.fullscreenElement)$('presentMode').requestFullscreen?.().catch(()=>{})}
  else if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{})
}
function renderPresent(){
  if(!presentOn)return;
  const league=dispName(state.leagueName);
  $('presentLeague').textContent=league==='\u2014'?'ASTA LIVE':league.toUpperCase();
  $('presentClock').textContent=new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
  const p=call.key?state.players.find(x=>x.key===call.key):null;
  if(p){
    const price=parseInt($('callPrice').value,10)||0;
    const secs=T.expired?0:Math.ceil(T.left||state.settings.timerSec);
    const cls=T.expired?'done':T.running&&secs<=5?'crit':'';
    $('presentCall').innerHTML=`<div class="pc-role">${esc(RMETA[p.role].label)} · ${esc(p.team)}</div>
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-meta"><span>FVM <b>${p.fvm}</b></span><span>Qt <b>${p.qt}</b></span><span>Equo <b>${fairOf(p.key)}</b></span><span>Indice <b>${p.value}</b></span></div>
      <div class="pc-bid"><small>OFFERTA</small><b>${price}</b><small>CR</small></div>
      <div class="pc-timer ${cls}"><span>${secs}</span><small>SECONDI</small></div>
      <div class="pc-team">${esc(dispName((teamById(call.teamId)||state.teams[0]).name))}</div>`;
  }else{
    $('presentCall').innerHTML=`<div class="pc-idle"><span data-ico="gavel" data-ico-size="54"></span>
      <h2>IN ATTESA DELLA CHIAMATA</h2><p>Cerca un giocatore nella console per proiettarlo qui.</p></div>`;
  }
  $('presentTeams').innerHTML=[...state.teams].map(t=>({t,s:teamStats(t)}))
    .sort((a,b)=>b.s.residuo-a.s.residuo).slice(0,12).map(({t,s},i)=>
      `<div class="pt-row ${t.id==='me'?'me':''}"><span class="pt-n">${i+1}</span><span class="pt-name">${esc(dispName(t.name))}</span><b>${fmt(s.residuo)}</b><small>CR</small></div>`).join('');
  let cands=[];if(REC)REC.roles.forEach(r=>r.cands.forEach(c=>cands.push({c,r})));
  cands=cands.filter(x=>x.c.affordable).sort((a,b)=>b.r.priority-a.r.priority||b.c.fit-a.c.fit).slice(0,7);
  $('presentRec').innerHTML=cands.length?cands.map(({c,r})=>
    `<div class="pr-row"><div><div class="pr-role">${RMETA[r.r].one.toUpperCase()}</div><div class="pr-name">${esc(c.p.name)}</div></div>
      <div><div class="pr-bid">${c.bid}</div><div class="pr-small">equo ${c.fair}</div></div></div>`).join('')
    :state.players.length?'<p class="csv-note">Nessun consiglio acquistabile con il budget residuo.</p>'
      :'<p class="csv-note">Importa il listone per vedere i consigli della regia.</p>';
}

/* ---------- boot ---------- */
const FRESH_MODE=new URLSearchParams(location.search).has('fresh');
if(FRESH_MODE){
  presentTheme='dark';
  try{Object.keys(localStorage).filter(k=>k.startsWith('astamaestra_')).forEach(k=>localStorage.removeItem(k))}catch(e){}
}
const boot=loadState();
let state=boot.state;const bootSrc=boot.src;
snaps=readSnaps();
if(!state.settings.rec)state.settings.rec={...REC_DEFAULT};
state.teams[0].name=cleanName(state.myName);
lastSum=hashStr(JSON.stringify(state));

let history=[clone(state)],hIndex=0;const HMAX=40;
function commit(label){
  history.length=hIndex+1;history.push(clone(state));hIndex++;
  if(history.length>HMAX){history.shift();hIndex--}
  if(label)pushSnap(label);
  persist();
}
function afterRestore(){sel.clear();editingKey=null;overrideEditKey=null;setupSig='';
  if(call.key&&!state.players.some(p=>p.key===call.key))clearCall();
  renderTeamFilter();renderMantraFilter();renderAll();if(drawerKey)renderDrawer();persist()}
function undo(){if(hIndex<=0){toast('Niente da annullare.',{type:'info',ico:'info',dur:2200});return}
  hIndex--;state=clone(history[hIndex]);afterRestore();play('pop');toast('Operazione annullata.',{type:'info',ico:'undo',dur:2600})}
function redo(){if(hIndex>=history.length-1){toast('Niente da ripristinare.',{type:'info',ico:'info',dur:2200});return}
  hIndex++;state=clone(history[hIndex]);afterRestore();play('pop');toast('Operazione ripristinata.',{type:'info',ico:'redo',dur:2600})}
function undoTo(idx){const t=idx-1;
  if(t<0||t>=history.length||t>=hIndex){toast('Già annullato.',{type:'info',ico:'info',dur:2200});return}
  hIndex=t;state=clone(history[hIndex]);afterRestore();play('pop');toast('Operazione annullata: stato ripristinato.',{type:'info',ico:'undo',dur:3000})}

/* ---------- modello ---------- */
function computeValues(players){
  const useTrend=state.settings.trend;
  for(const r of ROLES){
    const list=players.filter(p=>p.role===r);if(!list.length)continue;
    const logs=list.map(p=>Math.log(Math.max(1,p.fvm||1)+1));
    const minL=Math.min(...logs),spanL=Math.max(.001,Math.max(...logs)-minL);
    const qts=list.map(p=>p.qt),minQ=Math.min(...qts),spanQ=Math.max(1,Math.max(...qts)-minQ);
    const sortedQ=[...qts].sort((a,b)=>a-b);
    list.forEach((p,i)=>{
      const fN=(logs[i]-minL)/spanL,qN=(p.qt-minQ)/spanQ,tN=clamp(((p.diff||0)+12)/30,0,1);
      let v=useTrend?(.60*fN+.28*qN+.12*tN):(.68*fN+.32*qN);
      if(p.ceduto)v*=.75;
      if(p.override!=null)v=clamp(p.override/100,0,1);
      p.value=clamp(Math.round(v*100),1,100);
      p.tier=p.value>=85?'TOP':p.value>=65?'SEMI':p.value>=45?'SOLIDO':(p.qt<=6&&p.value>=38?'SCOMMESSA':'LOW');
      const qRank=sortedQ.filter(q=>q<=p.qt).length/sortedQ.length;
      p.deal=(p.value/100-qRank)>=.22&&p.qt<=14&&!p.ceduto;
    });
  }
}
function ownership(s=state){const m=new Map();
  for(const t of s.teams)for(const e of t.players)m.set(e.key,{teamId:t.id,teamName:t.name,price:e.price,entry:e});return m}
function teamById(id){return state.teams.find(t=>t.id===id)}
function teamStats(t,s=state){
  const budget=s.settings.budget,spent=t.players.reduce((a,p)=>a+p.price,0),filled=t.players.length;
  const byRole={};for(const r of ROLES){const es=t.players.filter(p=>p.role===r);
    byRole[r]={filled:es.length,spent:es.reduce((a,p)=>a+p.price,0),entries:es}}
  const empty=TOTAL_SLOTS-filled;
  const maxBid=empty>0?Math.max(0,budget-spent-(empty-1)*s.settings.reserve):0;
  const f=FORMATIONS[s.settings.formation]||FORMATIONS['442'],need={P:1,D:f.D,C:f.C,A:f.A},w={P:.9,D:1,C:1.1,A:1.15};
  let actual=0,ideal=0,titCount=0;const radar=[];
  for(const r of ['A','C','D','P']){
    const es=byRole[r].entries.slice(0,need[r]);ideal+=need[r]*w[r]*88;
    es.forEach(p=>{actual+=w[r]*(p.value||50)});titCount+=es.length;
    const av=es.length?es.reduce((a,p)=>a+(p.value||50),0)/es.length:0;
    radar.push(es.length?clamp(av,3,100):0)}
  const bench=t.players.filter(p=>byRole[p.role].entries.indexOf(p)>=need[p.role]);
  const benchAvg=bench.length?bench.reduce((a,p)=>a+(p.value||50),0)/bench.length:0;
  radar.push(clamp(filled/TOTAL_SLOTS*70+benchAvg*.3,0,100));
  const power=clamp(Math.round(actual/ideal*100+filled/TOTAL_SLOTS*5),0,100);
  const fairSum=t.players.reduce((a,p)=>a+(p.fair||p.price),0);
  return{spent,residuo:budget-spent,filled,empty,byRole,maxBid,power,radar,titCount,need,eff:fairSum>0?Math.round(spent/fairSum*100):100};
}
function computeModel(s=state){
  const own=ownership(s),budget=s.settings.budget;
  let totalRemaining=0;const raw={P:0,D:0,C:0,A:0},slotsLeft={P:0,D:0,C:0,A:0};
  const splitSum=Math.max(1,ROLES.reduce((a,r)=>a+s.settings.split[r],0));
  for(const t of s.teams){
    totalRemaining+=Math.max(0,budget-t.players.reduce((a,p)=>a+p.price,0));
    for(const r of ROLES){const es=t.players.filter(p=>p.role===r);
      raw[r]+=Math.max(0,budget*s.settings.split[r]/splitSum-es.reduce((a,p)=>a+p.price,0));
      slotsLeft[r]+=Math.max(0,SLOTS[r]-es.length)}}
  const rawSum=Math.max(1,ROLES.reduce((a,r)=>a+raw[r],0));
  const fair=new Map(),roleBudget={};
  for(const r of ROLES){
    roleBudget[r]=totalRemaining*raw[r]/rawSum;
    const pool=s.players.filter(p=>p.role===r&&!own.has(p.key)&&!p.ceduto).sort((a,b)=>b.value-a.value).slice(0,slotsLeft[r]);
    const weights=pool.map(p=>Math.pow(Math.max(4,p.value)/100,2.2));
    const wSum=Math.max(.0001,weights.reduce((a,b)=>a+b,0));
    pool.forEach((p,i)=>fair.set(p.key,Math.max(1,Math.round(roleBudget[r]*weights[i]/wSum))))}
  let paid=0,fairTot=0;
  for(const t of s.teams)for(const e of t.players){paid+=e.price;fairTot+=(e.fair||e.price)}
  return{fair,roleBudget,slotsLeft,totalRemaining,infl:fairTot>0?Math.round(paid/fairTot*100):100};
}
let MODEL={fair:new Map(),infl:100,roleBudget:{},slotsLeft:{},totalRemaining:0};
const fairOf=key=>MODEL.fair.get(key)||1;
function myBid(p,teamId='me'){
  const t=teamById(teamId);if(!t)return 0;const st=teamStats(t);
  if(st.byRole[p.role].filled>=SLOTS[p.role]||st.maxBid<1)return 0;
  const mult={pr:.85,eq:1,ag:1.15}[state.settings.strategy]||1;
  return clamp(Math.round(fairOf(p.key)*mult),1,st.maxBid);
}
function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
function allEntries(){const out=[];state.teams.forEach(t=>t.players.forEach(e=>out.push({...e,teamId:t.id,teamName:t.name})));return out}

/* ---------- motore raccomandazione ---------- */
function buildRec(){
  const R=state.settings.rec,me=state.teams[0],st=teamStats(me),own=ownership();
  const f=FORMATIONS[state.settings.formation],need={P:1,D:f.D,C:f.C,A:f.A};
  const rivals=state.teams.slice(1).map(t=>({t,st:teamStats(t)}));
  const entries=allEntries();
  const rivalEntries=entries.filter(e=>e.teamId!=='me');
  const recent=[...rivalEntries].sort((a,b)=>(b.at||0)-(a.at||0)).slice(0,Math.max(3,R.runWindow));
  const splitSum=Math.max(1,ROLES.reduce((a,r)=>a+state.settings.split[r],0));
  const wSum=Math.max(1,R.urgencyW+R.pressureW+R.valueW);
  const wu=R.urgencyW/wSum,wp=R.pressureW/wSum,wv=R.valueW/wSum;
  const leagueIdx={};
  ROLES.forEach(r=>{const vals=rivals.map(x=>{const es=x.st.byRole[r].entries.slice(0,need[r]);return es.length?avg(es.map(p=>p.value||50)):null}).filter(v=>v!=null);
    leagueIdx[r]=vals.length?avg(vals):55});
  const base={};
  ROLES.forEach(r=>{
    const es=st.byRole[r].entries,tits=es.slice(0,need[r]);
    const missingTit=Math.max(0,need[r]-tits.length);
    const slotsLeft=SLOTS[r]-es.length;
    const avgIdx=tits.length?avg(tits.map(p=>p.value||50)):0;
    const bench=es.slice(need[r]);
    const goodBench=bench.filter(p=>(p.value||50)>=Math.max(40,R.topThreshold-20)).length;
    const depthGap=clamp((R.depthTarget-goodBench)/Math.max(1,R.depthTarget),0,1);
    const qualityGap=tits.length?clamp((leagueIdx[r]-avgIdx)/40,0,1):1;
    let structure=0,structureNote='';
    if(r==='P'&&es.length){const by={};es.forEach(p=>by[p.team]=(by[p.team]||0)+1);
      if(Math.max(...Object.values(by))<3&&es.length<3){structure=8;structureNote='Griglia portieri da completare'}}
    if(r==='D'&&es.length>=2){const by={};es.forEach(p=>by[p.team]=(by[p.team]||0)+1);
      if(!Object.values(by).some(v=>v>=2)){structure=6;structureNote='Nessuna coppia difensiva'}}
    const urgency=slotsLeft===0?clamp(qualityGap*28+depthGap*8,0,100)
      :clamp((missingTit/Math.max(1,need[r]))*55+(slotsLeft/SLOTS[r])*18+qualityGap*19+depthGap*8+structure,0,100);
    const planTarget=state.settings.budget*state.settings.split[r]/splitSum;
    const planSpent=st.byRole[r].spent;
    base[r]={r,es,tits,missingTit,slotsLeft,avgIdx,bench:bench.length,goodBench,depthGap,qualityGap,structure,structureNote,urgency,
      planTarget,planSpent,planLeft:Math.max(0,planTarget-planSpent)};
  });
  const lenderPool={};
  ROLES.forEach(r=>{lenderPool[r]=ROLES.filter(x=>x!==r&&base[x].missingTit===0).reduce((a,x)=>a+base[x].planLeft,0)});
  const pressure={};
  ROLES.forEach(r=>{
    const free=state.players.filter(p=>p.role===r&&!own.has(p.key)&&!p.ceduto).sort((a,b)=>b.value-a.value);
    const tops=free.filter(p=>p.value>=R.topThreshold);
    const leagueSlotsLeft=rivals.reduce((a,x)=>a+Math.max(0,SLOTS[r]-x.st.byRole[r].filled),0)+base[r].slotsLeft;
    const scarcity=clamp(tops.length/Math.max(1,leagueSlotsLeft),0,1);
    const fairTop=tops.length?fairOf(tops[0].key):(free.length?fairOf(free[0].key):0);
    const contenders=rivals.filter(x=>x.st.byRole[r].filled<SLOTS[r]&&x.st.maxBid>=Math.max(1,fairTop*.85));
    const runCount=recent.filter(e=>e.role===r).length;
    const run=recent.length?runCount/recent.length:0;
    const roleBuys=entries.filter(e=>e.role===r&&(e.fair||0)>0);
    const infl=roleBuys.length?clamp(avg(roleBuys.map(e=>e.price/(e.fair||e.price))),.7,1.6):1;
    pressure[r]={free,tops:tops.length,scarcity,fairTop,contenders,runCount,run,infl,
      score:clamp((contenders.length/Math.max(1,rivals.length))*45+(1-scarcity)*30+run*25,0,100),leagueSlotsLeft};
  });
  const roles=ROLES.map(r=>{
    const b=base[r],pr=pressure[r];
    const borrowed=R.borrowOn?Math.round(lenderPool[r]*(R.borrow/100)):0;
    const purse=Math.max(0,Math.min(st.maxBid,b.planLeft+borrowed));
    const maxBid=b.slotsLeft>0?Math.max(0,Math.min(purse,st.maxBid)-(b.slotsLeft-1)*state.settings.reserve):0;
    const heat=clamp(pr.contenders.length/Math.max(1,rivals.length),0,1);
    const cands=pr.free.slice(0,40).map(p=>{
      const fair=fairOf(p.key),valueN=p.value/100,upgrade=p.value-(b.avgIdx||45);
      const upN=clamp(upgrade/40,0,1),dealN=clamp(1-fair/Math.max(1,maxBid||purse||1),0,1);
      const trendN=clamp(((p.diff||0)+12)/30,0,1);
      const fit=clamp(100*(wv*(.6*valueN+.4*dealN)+wu*upN+wp*(.5*trendN+.5*heat*valueN)),0,100);
      const pMult=1+(pr.score/100)*.25*(wp*2),uMult=1+(b.urgency/100)*.15*(wu*2);
      const iMult=clamp(pr.infl,.9,1.25),strat={pr:.9,eq:1,ag:1.1}[state.settings.strategy]||1;
      const raw=fair*R.aggression*pMult*uMult*iMult*strat;
      const bid=maxBid>=1?clamp(Math.round(raw),1,maxBid):0;
      const ceiling=bid?clamp(Math.round(bid*1.22),bid,maxBid):0;
      const opening=bid?clamp(Math.round(bid*.72),1,bid):0;
      const reasons=[];
      if(b.missingTit>0&&b.tits.length<need[r])reasons.push({t:'Chiude un titolare',k:'up',i:'check'});
      if(upgrade>=6)reasons.push({t:`Upgrade +${Math.round(upgrade)} idx`,k:'up',i:'trend'});
      else if(upgrade<=-8)reasons.push({t:'Solo profondità',k:'',i:'grid'});
      if(fair<=maxBid*.6&&maxBid>0)reasons.push({t:`Affare: ${Math.round(maxBid-fair)} cr sotto il tetto`,k:'up',i:'coin'});
      if(p.deal)reasons.push({t:'Sotto quotazione',k:'up',i:'bolt'});
      if(pr.contenders.length>=2&&p.value>=R.topThreshold)reasons.push({t:`${pr.contenders.length} rivali possono rilanciare`,k:'hot',i:'users'});
      if(pr.runCount>=2&&pr.run>=.34)reasons.push({t:`Run: ${pr.runCount} nelle ultime ${recent.length}`,k:'hot',i:'flame'});
      if((p.diff||0)>=6)reasons.push({t:`Trend +${p.diff}`,k:'info',i:'trend'});
      if((p.diff||0)<=-6)reasons.push({t:`Trend ${p.diff}`,k:'info',i:'down'});
      if(b.structure>0&&(r==='P'||r==='D')&&b.es.some(x=>x.team===p.team))reasons.push({t:r==='P'?'Completa la griglia':'Coppia difensiva',k:'up',i:'shield'});
      if(bid&&bid>=maxBid)reasons.push({t:'Arriva al tetto del reparto',k:'warn',i:'lock'});
      return{p,fair,fit,upgrade,bid,ceiling,opening,affordable:bid>=1,reasons:reasons.slice(0,3)};
    }).sort((a,b)=>(b.affordable-a.affordable)||b.fit-a.fit).slice(0,3);
    const topFit=cands.length?cands[0].fit:0;
    const priority=b.urgency*wu+pr.score*wp+topFit*wv;
    let status,label,cls;
    if(b.slotsLeft===0&&b.missingTit===0&&b.qualityGap<.35){status='done';label='Reparto chiuso';cls='urg-done'}
    else if(b.missingTit>0&&b.urgency>=62){status='crit';label='Critico';cls='urg-crit'}
    else if(b.urgency>=52){status='high';label='Alta';cls='urg-high'}
    else if(b.urgency>=30){status='mid';label='Media';cls='urg-mid'}
    else{status='low';label='Bassa';cls='urg-low'}
    return{...b,...pr,purse,borrowed,maxBid,cands,priority,status,label,cls,heat,leagueIdx:leagueIdx[r],
      contenderList:pr.contenders.map(x=>({name:x.t.name,max:x.st.maxBid}))};
  });
  const order=[...roles].sort((a,b)=>b.priority-a.priority);
  let best=null;
  order.forEach(r=>{if(best||!r.cands.length)return;const c=r.cands.find(x=>x.affordable);if(c)best={role:r,cand:c}});
  const runRole=[...roles].sort((a,b)=>b.runCount-a.runCount)[0];
  const leagueRun=runRole&&runRole.runCount>=2&&runRole.run>=.34?{r:runRole.r,count:runRole.runCount,window:recent.length,infl:runRole.infl}:null;
  return{roles,order,best,leagueRun,recent:recent.length,w:{wu,wp,wv},lenderPool};
}
let REC=null;

/* ---------- audit ---------- */
function runAudit(){
  const out=[];const me=state.teams[0],st=teamStats(me);
  const keys=new Set(state.players.map(p=>p.key));
  const seen=new Map();
  state.teams.forEach(t=>t.players.forEach((e,i)=>{
    if(seen.has(e.key)){const prev=seen.get(e.key);
      out.push({sev:'err',ico:'warn',title:'Giocatore assegnato due volte',
        detail:`${e.name} risulta sia a ${prev.teamName} sia a ${t.name}. Una delle due chiamate è di troppo.`,
        fix:{label:`Rimuovi da ${t.name}`,act:'dup',key:e.key,team:t.id}});
    }else seen.set(e.key,{teamName:t.name,teamId:t.id});
    if(state.players.length&&!keys.has(e.key))
      out.push({sev:'err',ico:'warn',title:'Acquisto fuori listone',
        detail:`${e.name} (${t.name}, ${e.price} cr) non esiste nel listone caricato: probabile cambio file o nome diverso.`,
        fix:{label:`Rimuovi e rimborsa ${e.price} cr`,act:'orphan',key:e.key,team:t.id}});
    if(!Number.isInteger(e.price)||e.price<1)
      out.push({sev:'err',ico:'coin',title:'Prezzo non valido',
        detail:`${e.name} (${t.name}) ha prezzo ${e.price}. Il minimo d'asta è 1 credito.`,
        fix:{label:'Imposta a 1 cr',act:'price',key:e.key,team:t.id}});
  }));
  state.teams.forEach(t=>{
    const ts=teamStats(t);
    ROLES.forEach(r=>{if(ts.byRole[r].filled>SLOTS[r]){
      const last=ts.byRole[r].entries[ts.byRole[r].entries.length-1];
      out.push({sev:'err',ico:'shirt',title:`${t.name}: troppi ${RMETA[r].label.toLowerCase()}`,
        detail:`${ts.byRole[r].filled} su ${SLOTS[r]} consentiti. L'ultimo della lista è ${last.name}.`,
        fix:{label:`Svincola ${last.name}`,act:'dup',key:last.key,team:t.id}});
    }});
    if(ts.residuo<0)out.push({sev:'err',ico:'coin',title:`${t.name}: budget in rosso`,
      detail:`Speso ${fmt(ts.spent)} su ${fmt(state.settings.budget)} crediti (${fmt(-ts.residuo)} oltre). Correggi un prezzo o svincola.`,
      goto:t.id==='me'?'rosa':'lega',gotoLabel:t.id==='me'?'Vai alla rosa':'Vai alla lega'});
  });
  if(state.players.length){
    const f=FORMATIONS[state.settings.formation],need={P:1,D:f.D,C:f.C,A:f.A};
    const miss=ROLES.filter(r=>st.byRole[r].entries.length<need[r]);
    if(st.filled>=TOTAL_SLOTS&&miss.length)
      out.push({sev:'warn',ico:'shirt',title:'Rosa piena ma titolari scoperti',
        detail:`Con il ${f.label} mancano titolari in ${miss.map(r=>RMETA[r].label.toLowerCase()).join(', ')}: hai filled tutti gli slot ma non nella distribuzione giusta.`,
        goto:'rosa',gotoLabel:'Riordina la rosa'});
    if(st.empty>0){
      const buys=allEntries().filter(e=>e.price>0);
      const perSlot=buys.length?avg(buys.map(e=>e.price)):state.settings.budget/TOTAL_SLOTS;
      const cheapNeed=st.empty*Math.max(1,state.settings.reserve);
      if(st.residuo<cheapNeed)
        out.push({sev:'err',ico:'lock',title:'Non puoi completare la rosa',
          detail:`Servono almeno ${cheapNeed} cr per ${st.empty} slot (riserva ${state.settings.reserve}), ne hai ${st.residuo}. Svincola qualcuno o abbassa la riserva.`,
          goto:'analisi',gotoLabel:'Regole del tavolo'});
      else{
        const minReal=st.empty*3;
        if(st.residuo<minReal)out.push({sev:'warn',ico:'coin',title:'Chiusura rosa a rischio',
          detail:`Con ${st.residuo} cr per ${st.empty} slot hai ~${Math.floor(st.residuo/st.empty)} cr a giocatore: potrai prendere solo profili da 1-3 crediti. La spesa media di lega è ${Math.round(perSlot)} cr.`,
          goto:'regia',gotoLabel:'Vedi low cost'});
      }
    }
    const own=ownership();
    ROLES.forEach(r=>{
      const freeTop=state.players.filter(p=>p.role===r&&!own.has(p.key)&&!p.ceduto&&p.value>=state.settings.rec.topThreshold).length;
      const leagueNeed=state.teams.reduce((a,t)=>a+Math.max(0,SLOTS[r]-teamStats(t).byRole[r].filled),0);
      if(freeTop===0&&leagueNeed>0)out.push({sev:'info',ico:'radar',title:`${RMETA[r].label}: top esauriti`,
        detail:`Nessun profilo sopra indice ${state.settings.rec.topThreshold} ancora libero, ma la lega deve riempire ${leagueNeed} slot. Punta su valore e scommesse.`});
    });
  }
  const free=state.plan.filter(x=>!ownership().has(x.key)),alloc=free.reduce((a,x)=>a+x.max,0);
  if(free.length&&alloc>st.residuo)out.push({sev:'warn',ico:'star',title:'Radar obiettivi sovrallocato',
    detail:`Hai promesso ${alloc} cr su ${st.residuo} disponibili. Abbassa i tetti per non restare scoperto.`,goto:'mercato',gotoLabel:'Rivedi radar'});
  const splitSum=ROLES.reduce((a,r)=>a+state.settings.split[r],0);
  if(splitSum!==100)out.push({sev:'warn',ico:'chart',title:'Ripartizione budget non al 100%',
    detail:`Il piano somma ${splitSum}%: i prezzi equi vengono normalizzati ma il confronto con il piano perde precisione.`,
    fix:{label:'Bilancia al 100%',act:'balance'}});
  if(state.sinceBackup>=state.settings.autoBackupEvery&&!state.settings.autoBackup)
    out.push({sev:'warn',ico:'download',title:'Backup non aggiornato',
      detail:`${state.sinceBackup} acquisti dall'ultimo backup su file. Se il browser perde i dati, li perdi anche tu.`,
      fix:{label:'Scarica backup',act:'backup'}});
  if(!storeOK)out.push({sev:'err',ico:'warn',title:'Salvataggio locale non riuscito',
    detail:'La memoria del browser è piena: da questo momento l\'asta vive solo in questa scheda. Scarica un backup e libera gli snapshot.',
    fix:{label:'Backup ora',act:'backup'}});
  if(remoteAhead)out.push({sev:'err',ico:'users',title:'Conflitto fra schede',
    detail:'Un\'altra scheda ha scritto dati più recenti. Ricarica per allinearti prima di registrare altre chiamate.',
    fix:{label:'Ricarica da memoria',act:'reload'}});
  const ord={err:0,warn:1,info:2};
  return out.sort((a,b)=>ord[a.sev]-ord[b.sev]);
}
let AUDIT=[];
function applyFix(act,key,team){
  switch(act){
    case 'dup':case 'orphan':releasePlayer(team,key);break;
    case 'price':{const t=teamById(team),e=t&&t.players.find(x=>x.key===key);if(!e)break;
      e.price=1;state.log.unshift({t:Date.now(),type:'sys',text:`Prezzo di <b>${esc(e.name)}</b> corretto a 1 cr dall'audit`});
      commit('Audit: prezzo corretto');renderAll();play('tick');toast('Prezzo corretto a 1 cr.',{type:'ok',ico:'check',undoIdx:hIndex});break}
    case 'balance':{const sum=ROLES.reduce((a,r)=>a+state.settings.split[r],0);
      if(sum===0)state.settings.split={P:6,D:16,C:30,A:48};
      else{let acc=0;ROLES.slice(0,3).forEach(r=>{state.settings.split[r]=Math.round(state.settings.split[r]/sum*100);acc+=state.settings.split[r]});state.settings.split.A=100-acc}
      commit('Audit: piano bilanciato');renderAll();play('pop');toast('Ripartizione bilanciata al 100%.',{type:'ok',ico:'check',undoIdx:hIndex});break}
    case 'backup':doBackup(false);break;
    case 'reload':reloadFromStore();break;
  }
}

/* ---------- audio / fx / toast ---------- */
let AC=null;
function ensureAC(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type,v,delay=0,slide=null){const c=ensureAC();if(!c)return;const t0=c.currentTime+delay;
  const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);
  if(slide)o.frequency.exponentialRampToValueAtTime(slide,t0+d);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+.008);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
  o.connect(g).connect(c.destination);o.start(t0);o.stop(t0+d+.02)}
function knock(delay,v){const c=ensureAC();if(!c)return;const t0=c.currentTime+delay;
  const len=Math.floor(c.sampleRate*.06),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=900;
  const g=c.createGain();g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+.07);
  s.connect(f).connect(g).connect(c.destination);s.start(t0);tone(95,.09,'sine',v*.9,delay)}
function play(k){if(!state.settings.sound)return;
  switch(k){case 'gavel':knock(0,.5);knock(.13,.35);tone(660,.1,'triangle',.12,.16);break;
    case 'tick':tone(1200,.04,'square',.08);break;case 'cash':tone(660,.08,'triangle',.2);tone(990,.13,'triangle',.18,.07);break;
    case 'thud':tone(120,.13,'sine',.3);knock(0,.18);break;case 'error':tone(170,.16,'sawtooth',.13);tone(120,.18,'sawtooth',.11,.03);break;
    case 'pop':tone(500,.07,'sine',.15,0,820);break;case 'timer':tone(1500,.05,'square',.1);break;
    case 'buzzer':tone(220,.35,'sawtooth',.18);tone(165,.4,'sawtooth',.15,.04);break}}
function vibrate(p){if(!VIBRATE_SUPPORTED)return;try{navigator.vibrate(p)}catch(e){}}
function burst(x,y,color){if(REDUCED)return;const fx=$('fx'),cols=[color||'#00FF87','#38BDF8','#F8FAFC','#00e478'];
  for(let i=0;i<16;i++){const s=document.createElement('span');s.className='fx-p';const sz=4+Math.random()*5;
    s.style.cssText=`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${cols[i%cols.length]};--dx:${(Math.random()-.5)*180}px;--dy:${-(30+Math.random()*130)}px;--rot:${(Math.random()-.5)*540}deg;animation-duration:${620+Math.random()*300}ms;${Math.random()>.5?'border-radius:50%':''}`;
    s.addEventListener('animationend',()=>s.remove());fx.appendChild(s)}}
function announce(t){$('liveRegion').textContent=t}
function toast(msg,{type='info',ico='info',undoIdx=null,dur=6500}={}){
  const box=$('toasts');while(box.children.length>=4)box.firstChild.remove();
  const el=document.createElement('div');el.className='toast t-'+type;
  el.innerHTML=`<span class="t-ico">${icon(ico,19)}</span><span class="t-msg">${msg}</span>${undoIdx!=null?'<button class="t-undo">Annulla</button>':''}<button class="t-x" aria-label="Chiudi notifica">${icon('x',14)}</button><span class="t-prog" style="animation-duration:${dur}ms"></span>`;
  let timer=setTimeout(kill,dur);
  function kill(){clearTimeout(timer);el.classList.add('out');setTimeout(()=>el.remove(),300)}
  el.addEventListener('mouseenter',()=>{clearTimeout(timer);el.querySelector('.t-prog').style.animationPlayState='paused'});
  el.addEventListener('mouseleave',()=>{timer=setTimeout(kill,2500);el.querySelector('.t-prog').style.animationPlayState='running'});
  el.querySelector('.t-x').addEventListener('click',kill);
  if(undoIdx!=null)el.querySelector('.t-undo').addEventListener('click',()=>{kill();undoTo(undoIdx)});
  box.appendChild(el)}
function syncLock(){const open=presentOn||$('modalWrap').classList.contains('open')||$('drawer').classList.contains('open');
  document.body.classList.toggle('locked',open)}
let modalOk=null;
function openModal({title,body,okLabel='Conferma',danger=false,onOk,hideOk=false,wide=false,okDisabled=false}){
  const wasOpen=$('modalWrap').classList.contains('open');modalOk=onOk;
  $('modalCard').className='card modal-card'+(wide?' wide':'');
  $('modalCard').innerHTML=`<button class="btn-icon modal-x" data-action="modal-cancel" aria-label="Chiudi la finestra">${icon('x',15)}</button>
    <h3>${icon(danger?'warn':'info',20)} ${esc(title)}</h3>${body}
    <div class="modal-actions"><button class="btn btn-ghost" data-action="modal-cancel">${hideOk?'Chiudi':'Annulla'}</button>
    ${hideOk?'':`<button class="btn ${danger?'btn-flare':'btn-gold'}" data-action="modal-ok" id="modalOkBtn" ${okDisabled?'disabled':''}>${esc(okLabel)}</button>`}</div>`;
  $('modalWrap').classList.add('open');syncLock();
  if(!wasOpen)setTimeout(()=>{const b=$('modalOkBtn');if(b&&!b.disabled)b.focus();else $('modalCard').querySelector('.modal-x')?.focus()},50)}
function closeModal(){$('modalWrap').classList.remove('open');modalOk=null;syncLock()}
function cancelModal(){closeModal();wiz=null}

/* ---------- mutazioni ---------- */
function validateBuy(teamId,p,price){
  const t=teamById(teamId);if(!t)return'Squadra non valida.';
  if(ownership().has(p.key))return'Giocatore già acquistato.';
  if(!Number.isInteger(price)||price<1)return'Prezzo intero ≥ 1.';
  const st=teamStats(t);
  if(st.byRole[p.role].filled>=SLOTS[p.role])return teamId==='me'?`Hai già ${SLOTS[p.role]} ${RMETA[p.role].label.toLowerCase()}: libera uno slot.`:`${t.name} ha già ${SLOTS[p.role]} ${RMETA[p.role].label.toLowerCase()}.`;
  if(price>st.maxBid)return`Tetto superato: max ${st.maxBid} cr (${st.empty} slot, riserva ${state.settings.reserve}).`;
  return null}
function guardReasons(teamId,p,price){
  if(!state.settings.confirms||teamId!=='me')return null;
  const t=teamById(teamId),st=teamStats(t),rr=REC?REC.roles.find(x=>x.r===p.role):null;
  const out=[];const fair=fairOf(p.key);
  if(rr&&rr.maxBid>0&&price>rr.maxBid)out.push(`Supera la borsa ${RMETA[p.role].label.toLowerCase()} (${rr.maxBid} cr) di ${price-rr.maxBid} cr: stai prendendo crediti da altri reparti.`);
  if(fair>0&&price>fair*1.35)out.push(`Paghi ${Math.round((price/fair-1)*100)}% sopra il prezzo equo del modello (${fair} cr).`);
  const after=st.residuo-price,slotsAfter=st.empty-1;
  if(slotsAfter>0&&after<slotsAfter*state.settings.reserve+2)
    out.push(`Dopo l'acquisto restano ${after} cr per ${slotsAfter} slot: potresti non riuscire a completare la rosa.`);
  if(st.empty>3&&price>=st.residuo*.6)
    out.push(`Impegni il ${Math.round(price/st.residuo*100)}% del budget residuo con ancora ${st.empty} slot da riempire.`);
  return out.length?out:null;
}
function entryFrom(p,price){return{key:p.key,fid:p.fid,name:p.name,team:p.team,role:p.role,price,fair:fairOf(p.key),
  value:p.value,fvm:p.fvm,qt:p.qt,qti:p.qti,diff:p.diff,mantra:p.mantra,at:++state.seq}}
function buyPlayer(teamId,key,price){
  const p=state.players.find(x=>x.key===key);if(!p)return{err:'Giocatore non nel listone.'};
  const err=validateBuy(teamId,p,price);if(err)return{err};
  const t=teamById(teamId),fair=fairOf(p.key);
  t.players.push(entryFrom(p,price));
  state.recent.unshift({key,teamId,price,at:Date.now()});if(state.recent.length>8)state.recent.length=8;
  state.sinceBackup++;
  state.log.unshift({t:Date.now(),type:teamId==='me'?'me':'rival',
    text:`<b>${teamId==='me'?'Tu':esc(t.name)}</b> aggiudic${teamId==='me'?'hi':'a'} <b>${esc(p.name)}</b> (${p.role}) a <span class="l-cr">${price}</span>`});
  commit(`${p.name} → ${t.name} · ${price} cr`);renderAll();
  play(teamId==='me'?'gavel':'thud');vibrate(18);
  const ratio=fair>0?price/fair:1;
  const judge=ratio<.85?' <span class="deal-chip">AFFARE</span>':ratio>1.18?' <span class="over-chip">SOPRA MERCATO</span>':'';
  toast(`<b>AGGIUDICATO!</b> ${esc(p.name)} ${teamId==='me'?'è tuo':'→ '+esc(t.name)} per <b>${price} cr</b>${judge} · rosa ${teamStats(t).filled}/25.`,
    {type:teamId==='me'?'gold':'info',ico:'gavel',undoIdx:hIndex});
  announce(`${p.name} aggiudicato a ${t.name} per ${price} crediti`);
  maybeAutoBackup();
  return{ok:true}}
function maybeAutoBackup(){
  if(!state.settings.autoBackup)return;
  if(state.sinceBackup>=state.settings.autoBackupEvery)doBackup(true);
}
function doBackup(auto){
  const stamp=new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
  download(`asta-maestra-${stamp}.json`,JSON.stringify(state,null,2),'application/json');
  state.sinceBackup=0;state.lastBackupAt=Date.now();persist();renderSystem();
  play('cash');
  toast(auto?`<b>Backup automatico scaricato.</b> ${state.teams.reduce((a,t)=>a+t.players.length,0)} acquisti registrati al sicuro su file.`
    :'<b>Backup scaricato.</b> Conserva il file: ripristina l\'asta identica su qualsiasi dispositivo.',{type:'ok',ico:'download',dur:5000});
}
function releasePlayer(teamId,key){
  const t=teamById(teamId),i=t.players.findIndex(e=>e.key===key);if(i<0)return;
  const e=t.players.splice(i,1)[0];
  state.log.unshift({t:Date.now(),type:'sys',text:`Svincolato <b>${esc(e.name)}</b> da ${teamId==='me'?'te':esc(t.name)}: <span class="l-cr">+${e.price}</span> al budget`});
  commit(`Svincolo ${e.name}`);renderAll();if(drawerKey===key)renderDrawer();play('cash');
  toast(`<b>${esc(e.name)}</b> svincolato: <b>+${e.price} cr</b> a ${teamId==='me'?'la tua squadra':esc(t.name)}.`,{type:'ok',ico:'coin',undoIdx:hIndex})}
function editPrice(teamId,key,np){
  const t=teamById(teamId),e=t.players.find(x=>x.key===key);if(!e)return;
  const max=e.price+teamStats(t).residuo;
  if(!Number.isInteger(np)||np<1){play('error');toast('Prezzo non valido: intero ≥ 1.',{type:'danger',ico:'warn'});editingKey=null;renderRosa();return}
  if(np>max){play('error');toast(`Max ${max} cr senza sforare il budget.`,{type:'danger',ico:'warn'});editingKey=null;renderRosa();return}
  if(np===e.price){editingKey=null;renderRosa();return}
  const old=e.price;e.price=np;
  state.log.unshift({t:Date.now(),type:'sys',text:`Prezzo di <b>${esc(e.name)}</b> corretto: ${old} → <span class="l-cr">${np}</span>`});
  editingKey=null;commit(`Prezzo ${e.name}: ${np} cr`);renderAll();play('tick');
  toast(`Prezzo di <b>${esc(e.name)}</b>: <b>${np} cr</b>.`,{type:'ok',ico:'check',undoIdx:hIndex,dur:4000})}
function reorderRosa(key,targetKey){
  const arr=state.teams[0].players,from=arr.findIndex(e=>e.key===key);if(from<0)return;
  const entry=arr.splice(from,1)[0];
  if(targetKey){const to=arr.findIndex(e=>e.key===targetKey);arr.splice(to<0?arr.length:to,0,entry)}
  else{let last=-1;arr.forEach((e,i)=>{if(e.role===entry.role)last=i});arr.splice(last+1,0,entry)}
  commit();renderAll();play('tick')}
function moveInRole(key,dir){
  const arr=state.teams[0].players,e=arr.find(x=>x.key===key);if(!e)return;
  const same=arr.filter(x=>x.role===e.role),pos=same.indexOf(e),swap=same[pos+dir];if(!swap)return;
  const i=arr.indexOf(e),j=arr.indexOf(swap);[arr[i],arr[j]]=[arr[j],arr[i]];commit();renderAll();play('tick')}
function planToggle(key){
  const i=state.plan.findIndex(x=>x.key===key);
  if(i>=0){state.plan.splice(i,1);play('pop')}else{state.plan.push({key,max:Math.max(1,fairOf(key))});play('tick')}
  commit();renderAll()}
function planAdd(key,max){
  const it=state.plan.find(x=>x.key===key);
  if(it)it.max=Math.max(1,max);else state.plan.push({key,max:Math.max(1,max)});
  commit();renderAll();play('tick')}
function planSetMax(key,v){const it=state.plan.find(x=>x.key===key);if(!it)return;
  const nv=clamp(Math.round(v)||1,1,999);if(nv===it.max)return;it.max=nv;commit();renderAll()}
function planReorder(key,targetKey){
  const from=state.plan.findIndex(x=>x.key===key);if(from<0)return;
  const it=state.plan.splice(from,1)[0];const to=state.plan.findIndex(x=>x.key===targetKey);
  state.plan.splice(to<0?state.plan.length:to,0,it);commit();renderAll();play('tick')}
function assignBulk(teamId){
  const keys=[...sel];if(!keys.length)return;const t=teamById(teamId);if(!t)return;
  let ok=0,skip=0;
  const items=keys.map(k=>state.players.find(p=>p.key===k)).filter(Boolean).sort((a,b)=>b.qt-a.qt);
  for(const p of items){const price=Math.max(1,Math.round(p.qt));
    if(validateBuy(teamId,p,price)){skip++;continue}
    t.players.push(entryFrom(p,price));state.sinceBackup++;
    state.recent.unshift({key:p.key,teamId,price,at:Date.now()});
    state.log.unshift({t:Date.now(),type:teamId==='me'?'me':'rival',text:`<b>${teamId==='me'?'Tu':esc(t.name)}</b> aggiudic${teamId==='me'?'hi':'a'} <b>${esc(p.name)}</b> (${p.role}) a <span class="l-cr">${price}</span>`});
    ok++}
  if(state.recent.length>8)state.recent.length=8;
  sel.clear();
  if(ok){commit(`Assegnazione multipla · ${ok}`);renderAll();play(teamId==='me'?'gavel':'thud');
    toast(`<b>${ok}</b> assegnat${ok===1?'o':'i'} a <b>${esc(t.name)}</b> a quotazione${skip?` · ${skip} saltat${skip===1?'o':'i'}`:''}.`,{type:'gold',ico:'gavel',undoIdx:hIndex});
    maybeAutoBackup()}
  else{renderAll();play('error');toast(`Nessuna assegnazione: ${esc(t.name)} non ha slot o budget.`,{type:'danger',ico:'warn'})}}
function setTeamCount(n){
  n=clamp(n,6,12);const cur=state.teams.length;if(n===cur)return;
  if(n<cur){
    const rem=state.teams.slice(n),wp=rem.filter(t=>t.players.length>0);
    openModal({title:`Riduci la lega a ${n} squadre?`,danger:true,okLabel:'Riduci',
      body:`<p>Rimuovi ${cur-n} squadre${wp.length?` (<b>${wp.map(t=>esc(t.name)).join(', ')}</b> con acquisti)`:''}: i loro giocatori tornano liberi. Annullabile.</p>`,
      onOk:()=>{state.teams=state.teams.slice(0,n);state.settings.teams=n;setupSig='';
        state.log.unshift({t:Date.now(),type:'sys',text:`Lega ridotta a ${n} squadre`});commit(`Lega a ${n} squadre`);renderAll();play('thud');
        toast(`Lega a ${n} squadre.`,{type:'info',ico:'users',undoIdx:hIndex})}});
  }else{
    for(let i=cur;i<n;i++)state.teams.push({id:'t'+i+'_'+Date.now(),name:'',players:[]});
    state.settings.teams=n;setupSig='';
    state.log.unshift({t:Date.now(),type:'sys',text:`Lega ampliata a ${n} squadre`});
    commit(`Lega a ${n} squadre`);renderAll();play('pop');toast(`Lega a ${n} squadre.`,{type:'ok',ico:'users',undoIdx:hIndex})}}
function reloadFromStore(){
  const s=readRec(K.main)||readRec(K.mirror);
  if(!s){toast('Nessun dato valido in memoria: resti sulla sessione corrente.',{type:'danger',ico:'warn'});return}
  state=migrate(s)||s;remoteAhead=false;lastSum=hashStr(JSON.stringify(state));
  history=[clone(state)];hIndex=0;sel.clear();setupSig='';clearCall();closeDrawer();
  renderTeamFilter();renderMantraFilter();renderAll();renderGuard();play('cash');
  toast('Sessione ricaricata dalla memoria: sei allineato.',{type:'ok',ico:'check',dur:4000});
}

/* ---------- lettura file ---------- */
function parseCSVText(text){
  text=text.replace(/^\uFEFF/,'');
  const nl=text.indexOf('\n'),first=nl===-1?text:text.slice(0,nl);
  let best=',',bc2=0;for(const d of [',',';','\t']){const c=first.split(d).length;if(c>bc2){bc2=c;best=d}}
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}
    else if(ch==='"')q=true;
    else if(ch===best){row.push(f);f=''}
    else if(ch==='\n'){row.push(f);f='';rows.push(row);row=[]}
    else if(ch!=='\r')f+=ch}
  if(f.length||row.length){row.push(f);rows.push(row)}
  return rows.filter(r=>r.some(c=>String(c).trim()!==''))}
const xmlParse=s=>new DOMParser().parseFromString(s,'application/xml');
const txtOf=el=>{if(!el)return'';return [...el.getElementsByTagName('t')].filter(t=>!(t.closest&&t.closest('rPh'))).map(t=>t.textContent).join('')};
async function readXlsxNative(file){
  if(typeof DecompressionStream==='undefined')throw new Error('noinflate');
  const buf=new Uint8Array(await file.arrayBuffer()),dv=new DataView(buf.buffer);
  let eocd=-1;const min=Math.max(0,buf.length-65557);
  for(let i=buf.length-22;i>=min;i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break}}
  if(eocd<0)throw new Error('zip');
  const count=dv.getUint16(eocd+10,true);let off=dv.getUint32(eocd+16,true);
  const entries=new Map(),dec=new TextDecoder('utf-8');
  for(let i=0;i<count;i++){
    if(off+46>buf.length||dv.getUint32(off,true)!==0x02014b50)break;
    const method=dv.getUint16(off+10,true),csize=dv.getUint32(off+20,true);
    const fnLen=dv.getUint16(off+28,true),exLen=dv.getUint16(off+30,true),cmLen=dv.getUint16(off+32,true),lho=dv.getUint32(off+42,true);
    entries.set(dec.decode(buf.subarray(off+46,off+46+fnLen)),{method,csize,lho});
    off+=46+fnLen+exLen+cmLen}
  async function read(name){
    const e=entries.get(name);if(!e)return null;
    const fnLen=dv.getUint16(e.lho+26,true),exLen=dv.getUint16(e.lho+28,true),start=e.lho+30+fnLen+exLen;
    const data=buf.subarray(start,start+e.csize);
    if(e.method===0)return dec.decode(data);
    if(e.method!==8)throw new Error('metodo');
    const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return await new Response(stream).text()}
  const wbXml=await read('xl/workbook.xml');if(!wbXml)throw new Error('workbook');
  const relsXml=await read('xl/_rels/workbook.xml.rels')||'';
  const ssXml=await read('xl/sharedStrings.xml');
  const shared=[];
  if(ssXml){const d=xmlParse(ssXml);for(const si of d.getElementsByTagName('si'))shared.push(txtOf(si))}
  const rels=new Map();
  if(relsXml){const d=xmlParse(relsXml);for(const r of d.getElementsByTagName('Relationship')){
    let t=r.getAttribute('Target')||'';t=t.replace(/^\/+/,'');
    if(!/^xl\//.test(t))t='xl/'+t.replace(/^\.\//,'');
    rels.set(r.getAttribute('Id'),t)}}
  const wb=xmlParse(wbXml),sheets=[];
  for(const sh of wb.getElementsByTagName('sheet')){
    const name=sh.getAttribute('name')||('Foglio'+(sheets.length+1));
    const rid=sh.getAttribute('r:id')||sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
    let target=rels.get(rid);
    if(!target)target='xl/worksheets/sheet'+(sheets.length+1)+'.xml';
    const xml=await read(target);if(!xml)continue;
    const doc=xmlParse(xml),rows=[];let auto=0;
    for(const row of doc.getElementsByTagName('row')){
      const ri=(parseInt(row.getAttribute('r'),10)||++auto)-1;auto=ri+1;
      const cells=[];let ci=0;
      for(const c of row.getElementsByTagName('c')){
        const ref=c.getAttribute('r')||'';const m=ref.match(/^([A-Z]+)/);
        let idx=ci;
        if(m){idx=0;for(const ch of m[1])idx=idx*26+(ch.charCodeAt(0)-64);idx--}
        ci=idx+1;
        const t=c.getAttribute('t');let val='';
        if(t==='inlineStr'){val=txtOf(c.getElementsByTagName('is')[0])}
        else{const v=c.getElementsByTagName('v')[0];const raw=v?v.textContent:'';
          if(t==='s')val=shared[parseInt(raw,10)]??'';
          else if(t==='b')val=raw==='1'?'TRUE':'FALSE';
          else val=raw}
        cells[idx]=String(val??'')}
      for(let k=0;k<cells.length;k++)if(cells[k]==null)cells[k]='';
      rows[ri]=cells;if(rows.length>5000)break}
    for(let i=0;i<rows.length;i++)if(!rows[i])rows[i]=[];
    sheets.push({name,rows})}
  if(!sheets.length)throw new Error('fogli');
  return sheets}
async function loadSheetJS(){
  if(window.XLSX)return window.XLSX;
  await new Promise((res,rej)=>{const s=document.createElement('script');
    s.src=new URL('vendor/xlsx.full.min.js',document.baseURI).href;
    s.onload=res;s.onerror=()=>rej(new Error('cdn'));document.head.appendChild(s);
    setTimeout(()=>rej(new Error('timeout')),12000)});
  if(!window.XLSX)throw new Error('cdn');return window.XLSX}
async function readWorkbook(file){
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  if(ext==='csv'||ext==='txt'||file.type==='text/csv'){
    const text=await file.text();return[{name:file.name.replace(/\.[^.]+$/,''),rows:parseCSVText(text)}]}
  if(ext==='xls')throw new Error('Il formato .xls non è supportato: salvalo come .xlsx o .csv.');
  try{return await readXlsxNative(file)}
  catch(e1){
    try{const X=await loadSheetJS();const wb=X.read(await file.arrayBuffer(),{type:'array'});
      return wb.SheetNames.map(n=>({name:n,rows:X.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:false,defval:''}).map(r=>r.map(c=>String(c??'')))}))}
    catch(e2){throw new Error('Impossibile leggere l\u2019XLSX in questo browser. Esportalo in CSV da Excel o Fogli Google e importa quello.')}}}

/* ---------- wizard ---------- */
const ALIAS={
  name:['nome','name','calciatore','giocatore','player','calciatori'],
  role:['r','ruolo','role','ruoli','pos','posizione'],
  team:['squadra','team','club','societa'],
  qt:['qta','quotazioneattuale','qtattuale','quotazione','quot','qt'],
  fvm:['fvm','fvmclassic','valoremercato','valuemarket','vm'],
  fid:['id','idcalciatore','codice','cod'],
  mantra:['rm','ruolomantra','mantra','rmclassic'],
  qti:['qti','quotazioneiniziale','qtiniziale','qtin'],
  diff:['diff','diffm','differenza','delta','variazione'],
  fm:['fantamedia','fm','media','fantavoto','fantavotomedio'],
  apps:['presenze','pres','pv','partite','apps'],
  goals:['gol','gf','goal','g','retti'],
  assists:['assist','as','ast','assists','ass']};
const FIELDS_ESS=[['name','Nome',true],['role','Ruolo',true],['team','Squadra',false],['qt','Qt.A',false],['fvm','FVM',false]];
const FIELDS_OPT=[['fid','Id',false],['mantra','Ruolo Mantra',false],['qti','Qt.I',false],['diff','Diff.',false],
  ['fm','Fantamedia',false],['apps','Presenze',false],['goals','Gol',false],['assists','Assist',false]];
const FIELDS=[...FIELDS_ESS,...FIELDS_OPT];
const normH=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
function detectHeader(rows){
  let best={row:-1,map:{},score:0};
  const lim=Math.min(rows.length,30);
  for(let i=0;i<lim;i++){
    const cells=(rows[i]||[]).map(normH);if(cells.filter(Boolean).length<3)continue;
    const map={};let score=0;
    for(const [f] of FIELDS){for(const a of ALIAS[f]){const idx=cells.indexOf(a);
      if(idx>=0&&map[f]==null&&!Object.values(map).includes(idx)){map[f]=idx;score++;break}}}
    if(map.name!=null&&map.role!=null&&score>best.score)best={row:i,map,score}}
  return best}
const TITLE_RX=/quotazioni|fantacalcio|stagione|calciatori ceduti|^id$|^nome$|^ruolo$|^squadra$/i;
function isStructural(row,map){
  const nm=String(row[map.name]??'').trim(),rl=String(row[map.role]??'').trim();
  if(!nm&&!rl)return true;
  if(TITLE_RX.test(nm)&&!/^[PDCA]$/i.test(rl))return true;
  if(/^(nome|calciatore|giocatore)$/i.test(nm))return true;
  if(/^(r|ruolo|rm)$/i.test(rl))return true;
  const uniq=new Set(row.map(c=>String(c??'').trim()).filter(Boolean));
  if(uniq.size===1&&TITLE_RX.test([...uniq][0]))return true;
  return false}
function roleFromCell(v){
  const tk=String(v||'').split(/[;,\s\/\-]+/).filter(Boolean);
  const map=t=>{const c=t[0].toUpperCase();if('PDCA'.includes(c))return c;const n=parseInt(t,10);return n>=1&&n<=4?'PDCA'[n-1]:null};
  const r=tk.length?map(tk[0]):null,r2=tk.length>1?map(tk[1]):null;
  return{role:r,role2:r2&&r2!==r?r2:null}}
function parseMantra(v){
  return String(v||'').split(/[;,\s\/]+/).map(s=>s.trim()).filter(Boolean)
    .map(s=>MANTRA_SET.find(x=>x.toLowerCase()===s.toLowerCase())||null).filter(Boolean)}
const num=s=>{const n=parseFloat(String(s??'').replace(/\s/g,'').replace(',','.'));return isFinite(n)?n:null};
function extractPlayers(sheet,headerRow,map,idStart,ceduto){
  const out=[];let skipped=0,structural=0,id=idStart||1;
  const get=(row,f)=>map[f]!=null&&map[f]>=0?row[map[f]]:'';
  for(let i=headerRow+1;i<sheet.rows.length;i++){
    const row=sheet.rows[i]||[];
    if(!row.some(c=>String(c??'').trim()!==''))continue;
    if(isStructural(row,map)){structural++;continue}
    const name=String(get(row,'name')||'').trim();
    const {role,role2}=roleFromCell(get(row,'role'));
    if(!name||!role){skipped++;continue}
    const team=String(get(row,'team')||'').trim()||'—';
    const fidRaw=String(get(row,'fid')||'').trim();
    const fid=/^\d+$/.test(fidRaw)?fidRaw:null;
    let qt=num(get(row,'qt')),qti=num(get(row,'qti')),fvm=num(get(row,'fvm')),diff=num(get(row,'diff'));
    if(qt==null)qt=qti!=null?qti:(fvm!=null?clamp(Math.round(fvm/12),1,40):1);
    qt=clamp(Math.round(qt),1,99);
    if(qti==null)qti=qt;qti=clamp(Math.round(qti),1,99);
    if(diff==null)diff=qt-qti;diff=Math.round(diff);
    if(fvm==null)fvm=Math.max(1,Math.round(qt*8));
    fvm=Math.max(1,Math.round(fvm));
    const fm=map.fm!=null?num(get(row,'fm')):null;
    const apps=map.apps!=null?num(get(row,'apps')):null;
    const goals=map.goals!=null?num(get(row,'goals')):null;
    const assists=map.assists!=null?num(get(row,'assists')):null;
    const key=fid?'f'+fid:(fold(name)+'|'+fold(team));
    out.push({id:id++,key,fid,name,team,role,role2,mantra:parseMantra(get(row,'mantra')),qt,qti,diff,fvm,
      fm:fm!=null&&fm<=10?+fm.toFixed(2):null,apps:apps!=null?Math.round(apps):null,
      goals:goals!=null?Math.round(goals):null,assists:assists!=null?Math.round(assists):null,
      ceduto:!!ceduto,notes:'',value:50,tier:'SOLIDO',deal:false});
  }
  return{players:out,skipped,structural}}
const isCedutiSheet=s=>/cedut|transfer|out/i.test(s.name);
let wiz=null;
function wizCurrent(){
  const s=wiz.sheets[wiz.sheetIdx],collect=[];
  if(wiz.allSheets){
    wiz.sheets.forEach((sh,i)=>{
      if(isCedutiSheet(sh)&&!wiz.ceduti)return;
      const det=i===wiz.sheetIdx?{row:wiz.headerRow,map:wiz.map}:detectHeader(sh.rows);
      if(det.row<0)return;collect.push({sh,det,ced:isCedutiSheet(sh)})});
  }else{
    if(isCedutiSheet(s)&&!wiz.ceduti)return{players:[],skipped:0,structural:0,sheetsUsed:0,counts:{P:0,D:0,C:0,A:0},cedCount:0};
    collect.push({sh:s,det:{row:wiz.headerRow,map:wiz.map},ced:isCedutiSheet(s)})}
  let id=1,all=[],skipped=0,structural=0;
  collect.forEach(({sh,det,ced})=>{const r=extractPlayers(sh,det.row,det.map,id,ced);
    id+=r.players.length;all=all.concat(r.players);skipped+=r.skipped;structural+=r.structural});
  const seen=new Map();
  all.forEach(p=>{const prev=seen.get(p.key);if(!prev||(!prev.ceduto&&p.ceduto))seen.set(p.key,p)});
  const players=[...seen.values()];players.forEach((p,i)=>p.id=i+1);
  const counts={};ROLES.forEach(r=>counts[r]=players.filter(p=>p.role===r).length);
  return{players,skipped,structural,sheetsUsed:collect.length,counts,cedCount:players.filter(p=>p.ceduto).length}}
function openWizard(sheets,fileName,size){
  const infos=sheets.map(s=>{const d=detectHeader(s.rows);
    return{ok:d.row>=0,count:d.row>=0?extractPlayers(s,d.row,d.map,1,isCedutiSheet(s)).players.length:0,ced:isCedutiSheet(s)}});
  let idx=sheets.findIndex((s,i)=>infos[i].ok&&!infos[i].ced&&/^tutti$|^all$|^completo$/i.test(s.name));
  if(idx<0){idx=0;infos.forEach((x,i)=>{if(!x.ced&&x.count>infos[idx].count)idx=i});
    if(infos[idx].ced){const alt=infos.findIndex(x=>!x.ced&&x.ok);if(alt>=0)idx=alt}}
  const det=detectHeader(sheets[idx].rows);
  wiz={fileName,size,sheets,infos,sheetIdx:idx,headerRow:Math.max(0,det.row),map:{...det.map},
    allSheets:false,ceduti:false,cedDetected:sheets.some(isCedutiSheet),mode:'replace'};
  renderWizard()}
function renderWizard(){
  if(!wiz)return;
  const cur=wizCurrent(),s=wiz.sheets[wiz.sheetIdx];
  const header=(s.rows[wiz.headerRow]||[]).map(c=>String(c??''));
  const maxCols=Math.max(header.length,...s.rows.slice(0,40).map(r=>r.length),4);
  const opt=sel2=>`<option value="-1">— non usare —</option>`+Array.from({length:Math.min(maxCols,60)},(_,i)=>
    `<option value="${i}" ${sel2===i?'selected':''}>${colName(i)}${header[i]?' · '+esc(String(header[i]).slice(0,20)):' · (vuota)'}</option>`).join('');
  const rowsOpt=Array.from({length:Math.min(s.rows.length,30)},(_,i)=>{
    const pv=(s.rows[i]||[]).slice(0,6).map(c=>String(c??'').slice(0,10)).filter(Boolean).join(' | ');
    return `<option value="${i}" ${i===wiz.headerRow?'selected':''}>Riga ${i+1}${pv?' — '+esc(pv):''}</option>`}).join('');
  const mapGroup=fields=>fields.map(([f,label,req])=>`<div class="field"><label>${label}${req?' <span class="req">*</span>':''}</label>
    <select class="inp" data-wiz="map" data-field="${f}" aria-label="Colonna ${label}">${opt(wiz.map[f]==null?-1:wiz.map[f])}</select></div>`).join('');
  const body=`
    <div class="wiz-file">${icon('file',18)}<span><b>${esc(wiz.fileName)}</b>${wiz.size?` · ${(wiz.size/1024).toFixed(0)} KB`:''} · ${wiz.sheets.length} fogli</span>
      ${cur.structural?`<span style="margin-left:auto;font-size:11px;color:var(--faint)">${cur.structural} righe di titolo ignorate</span>`:''}</div>
    <div class="wiz-sheets">${wiz.sheets.map((sh,i)=>`<button class="sheet-chip ${i===wiz.sheetIdx?'on':''} ${wiz.infos[i].ced?'ced':''} ${wiz.infos[i].ok?'':'bad'}" data-action="wiz-sheet" data-i="${i}">
      ${icon('sheet',13)} ${esc(sh.name.slice(0,22))} <small>${wiz.infos[i].ok?wiz.infos[i].count+(wiz.infos[i].ced?' ceduti':''):'—'}</small></button>`).join('')}</div>
    <div class="field" style="margin-bottom:14px"><label for="wizHeader">Riga d'intestazione</label>
      <select class="inp" id="wizHeader" data-wiz="header">${rowsOpt}</select></div>
    <p class="wiz-group-title">Colonne essenziali</p><div class="wiz-map">${mapGroup(FIELDS_ESS)}</div>
    <p class="wiz-group-title">Colonne aggiuntive</p><div class="wiz-map">${mapGroup(FIELDS_OPT)}</div>
    <div class="wiz-opts">
      <label class="toggle-inline"><span class="switch"><input type="checkbox" data-wiz="all" ${wiz.allSheets?'checked':''} aria-label="Unisci tutti i fogli"><span class="track"></span></span>Unisci tutti i fogli</label>
      ${wiz.cedDetected?`<label class="toggle-inline"><span class="switch"><input type="checkbox" data-wiz="ced" ${wiz.ceduti?'checked':''} aria-label="Includi ceduti"><span class="track"></span></span>Includi ceduti</label>`:''}
      ${state.players.length?`<div class="field" style="min-width:200px"><label>Modalità</label><select class="inp" data-wiz="mode" aria-label="Modalità import">
        <option value="replace" ${wiz.mode==='replace'?'selected':''}>Sostituisci il listone</option>
        <option value="merge" ${wiz.mode==='merge'?'selected':''}>Unisci (per Id/nome)</option></select></div>`:''}
    </div>
    <div class="wiz-stats"><span class="wstat ${cur.players.length?'ok':'warn'}"><b>${cur.players.length}</b> giocatori</span>
      ${ROLES.map(r=>`<span class="wstat" style="border-color:${RMETA[r].hex}55;color:${RMETA[r].hex}">${r} <b>${cur.counts[r]}</b></span>`).join('')}
      ${cur.cedCount?`<span class="wstat warn">${cur.cedCount} ceduti</span>`:''}
      ${cur.skipped?`<span class="wstat warn">${cur.skipped} righe non valide</span>`:''}</div>
    ${cur.players.length?`<div class="wiz-preview"><table class="wp"><thead><tr><th>R</th><th>Mantra</th><th>Nome</th><th>Squadra</th><th>Qt.A</th><th>Qt.I</th><th>Δ</th><th>FVM</th></tr></thead>
      <tbody>${cur.players.slice(0,8).map(p=>`<tr><td>${roleBadge(p.role)}</td>
        <td><span class="mantra">${p.mantra.map(m=>`<i>${esc(m)}</i>`).join('')||'—'}</span></td>
        <td><b>${esc(p.name)}</b></td><td>${esc(p.team)}</td>
        <td class="num">${p.qt}</td><td class="num">${p.qti}</td>${deltaCell(p.diff)}<td class="num gold">${p.fvm}</td></tr>`).join('')}</tbody></table></div>`
      :`<p style="color:var(--warn);font-size:12.5px">Nessun giocatore riconosciuto. Servono <b>Nome</b> e <b>Ruolo</b>.</p>`}`;
  openModal({title:'Importa listone',wide:true,body,okLabel:`Importa ${cur.players.length} giocatori`,okDisabled:!cur.players.length,onOk:applyImport})}
function relinkRoster(newPlayers){
  const byKey=new Map(newPlayers.map(p=>[p.key,p]));
  const byNT=new Map(newPlayers.map(p=>[fold(p.name)+'|'+fold(p.team),p]));
  const byN=new Map();newPlayers.forEach(p=>{const n=fold(p.name);byN.set(n,byN.has(n)?null:p)});
  const resolve=e=>byKey.get(e.key)||byNT.get(fold(e.name)+'|'+fold(e.team))||byN.get(fold(e.name))||null;
  let n=0;
  state.teams.forEach(t=>t.players.forEach(e=>{const p=resolve(e);
    if(p){if(e.key!==p.key)n++;e.key=p.key;e.fid=p.fid;e.name=p.name;e.team=p.team;e.role=p.role;
      e.value=p.value;e.fvm=p.fvm;e.qt=p.qt;e.qti=p.qti;e.diff=p.diff;e.mantra=p.mantra}}));
  state.plan.forEach(it=>{const p=resolve(it);if(p)it.key=p.key});
  state.recent.forEach(it=>{const p=resolve(it);if(p)it.key=p.key});
  return n}
function applyImport(){
  if(!wiz){closeModal();toast('Sessione di importazione scaduta: riapri il file.',{type:'danger',ico:'warn',dur:6000});return}
  try{
    const cur=wizCurrent();
    if(!cur.players.length){play('error');toast('Nessun giocatore valido con questa mappatura.',{type:'danger',ico:'warn'});return}
    const wasEmpty=!state.players.length;
    const notes=new Map(state.players.map(p=>[p.key,p.notes]));
    let players;
    if(wiz.mode==='merge'&&state.players.length){
      const map=new Map(state.players.map(p=>[p.key,p]));
      cur.players.forEach(p=>{const old=map.get(p.key);if(old)p.notes=old.notes;map.set(p.key,p)});
      players=[...map.values()];
    }else players=cur.players;
    players.forEach(p=>{if(!p.notes&&notes.get(p.key))p.notes=notes.get(p.key)});
    players.forEach((p,i)=>p.id=i+1);
    const srcName=wiz.fileName,srcSheet=wiz.allSheets?'tutti i fogli':wiz.sheets[wiz.sheetIdx].name;
    state.players=players;computeValues(state.players);
    const relinked=relinkRoster(state.players);
    state.source={name:srcName,sheets:cur.sheetsUsed,count:players.length,ceduti:cur.cedCount,sheet:srcSheet,at:Date.now()};
    const counts=ROLES.map(r=>`${r} ${players.filter(p=>p.role===r).length}`).join(' · ');
    state.log.unshift({t:Date.now(),type:'sys',text:`Listone importato: <b>${players.length}</b> giocatori (${counts})`});
    sel.clear();state.ui.limit=60;state.ui.team='ALL';state.ui.mantra='ALL';importError='';
    wiz=null;closeModal();
    commit(`Import listone · ${players.length}`);renderTeamFilter();renderMantraFilter();renderAll();play('cash');vibrate(20);
    toast(`<b>Listone importato:</b> ${players.length} giocatori (${counts})${relinked?` · ${relinked} acquisti riagganciati`:''}.`,{type:'ok',ico:'check',undoIdx:hIndex,dur:8000});
    if(wasEmpty)setTimeout(()=>{$('regia').scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'});
      setTimeout(()=>{try{$('callSearch').focus({preventScroll:true})}catch(e){}},REDUCED?0:520)},120);
  }catch(err){wiz=null;closeModal();syncLock();play('error');
    importError='Import non riuscito: '+(err&&err.message?err.message:'errore inatteso');
    renderImportError();toast(esc(importError),{type:'danger',ico:'warn',dur:9000})}}
const TEMPLATE_CSV='Id,R,RM,Nome,Squadra,Qt.A,Qt.I,Diff.,Qt.A M,Qt.I M,Diff.M,FVM,FVM M\n1,P,Por,Esempio Portiere,Squadra A,17,9,8,17,9,8,64,64\n2,D,"Ds;E",Esempio Difensore,Squadra A,22,32,-10,21,30,-9,135,135\n3,C,"T;A",Esempio Centrocampista,Squadra B,29,30,-1,27,28,-1,220,220\n4,A,Pc,Esempio Attaccante,Squadra B,37,34,3,37,34,3,425,425\n';
let busy=false,importError='';
function setBusy(on,label){
  busy=on;const dz=$('dropzone');dz.classList.toggle('busy',on);
  $('dzInner').innerHTML=on?`<div class="spinner"></div><h4>${esc(label||'Lettura del file…')}</h4><p>estrazione fogli e intestazioni</p>`
    :`<div class="dz-ico">${icon('upload',30)}</div><h4>Trascina qui il listone</h4><p>Quotazioni_Fantacalcio_Stagione_2026_27.xlsx · oppure clicca</p>
      <div class="fmt-badges"><span class="fmt">XLSX</span><span class="fmt csv">CSV</span></div>`;
  const cb=$('compactBusy');if(cb)cb.style.display=on?'inline-flex':'none';
  const rb=$('replaceBtn');if(rb)rb.disabled=on}
function renderImportError(){
  const html=importError?`<div class="import-error">${icon('warn',16)}<span>${esc(importError)}</span>
    <button data-action="clear-import-error" aria-label="Nascondi errore">${icon('x',14)}</button></div>`:'';
  $('importErrorFull').innerHTML=html;
  const c=$('importErrorCompact');if(c)c.innerHTML=html}
function importPastedCSV(){
  const ta=$('pasteCsv'),text=ta?ta.value.trim():'';
  if(!text){importError='Incolla prima il testo del CSV.';renderImportError();play('error');ta?.focus();return}
  importError='';renderImportError();
  try{const rows=parseCSVText(text);
    if(!rows||!rows.length)throw new Error('Nessuna riga trovata nel testo incollato.');
    play('pop');openWizard([{name:'CSV incollato',rows}],'listone-incollato.csv',text.length)}
  catch(err){play('error');vibrate([40,60,40]);
    importError=err&&err.message?err.message:'Testo CSV non leggibile.';renderImportError();
    toast(esc(importError),{type:'danger',ico:'warn',dur:8000})}}
async function handleFile(file){
  if(!file||busy)return;
  importError='';renderImportError();
  setBusy(true,'Lettura di '+file.name.slice(0,24)+'…');
  try{const sheets=await readWorkbook(file);setBusy(false);play('pop');openWizard(sheets,file.name,file.size)}
  catch(err){setBusy(false);play('error');vibrate([40,60,40]);
    importError=err&&err.message?err.message:'File non leggibile.';renderImportError();
    toast(esc(importError),{type:'danger',ico:'warn',dur:9000})}}

/* ---------- ricerca fuzzy ---------- */
function fuzzyScore(q,name){
  const n=fold(name);if(!q)return 0;
  if(n===q)return 1000;
  if(n.startsWith(q))return 900-n.length*.5;
  const i=n.indexOf(q);if(i>=0)return 800-i*3-n.length*.3;
  const words=n.split(/[\s.']+/).filter(Boolean);
  const ini=words.map(w=>w[0]).join('');
  if(ini.startsWith(q))return 720;
  let si=0,gaps=0;
  for(const ch of q){const j=n.indexOf(ch,si);if(j<0)return -1;gaps+=j-si;si=j+1}
  if(q.length<3)return -1;
  return 520-gaps*4-n.length*.4;
}

/* ---------- render helpers ---------- */
function tick(el,to){const from=+el.dataset.v||0;
  if(REDUCED||from===to){el.textContent=fmt(to);el.dataset.v=to;return}
  if(el._raf)cancelAnimationFrame(el._raf);
  const start=performance.now();
  const step=t=>{const k=Math.min(1,(t-start)/420),e=1-Math.pow(1-k,3);
    el.textContent=fmt(Math.round(from+(to-from)*e));
    if(k<1)el._raf=requestAnimationFrame(step);else{el.dataset.v=to;el._raf=null}};
  el._raf=requestAnimationFrame(step)}
const roleBadge=r=>`<span class="role-badge rb-${r}" title="${RMETA[r].one}">${r}</span>`;
const tierTag=p=>`<span class="tag-tier tier-${p.tier}">${p.tier}</span>`;
const avatar=(p,cls='avatar')=>`<span class="${cls} av-${p.role}">${esc(initials(p.name))}</span>`;
const mantraHTML=p=>p.mantra&&p.mantra.length?`<span class="mantra">${p.mantra.map(m=>`<i title="${MANTRA_LABEL[m]||m}">${esc(m)}</i>`).join('')}</span>`:'';
const deltaSpan=d=>{const v=d||0,c=v>0?'up':v<0?'down':'flat';return `<span class="delta ${c}">${v>0?'+':''}${v}</span>`};
const deltaCell=d=>{const v=d||0,c=v>0?'up':v<0?'down':'flat';return `<td class="num"><span class="delta ${c}">${v>0?'+':''}${v}</span></td>`};
const reasonHTML=rs=>rs.map(x=>`<span class="reason ${x.k}">${icon(x.i,11)}${esc(x.t)}</span>`).join('');
function quoteTrackSVG(p){
  const W=390,H=72,pad=16,y=44,max=Math.max(p.qti||p.qt,p.qt,1)*1.18;
  const X=v=>pad+(v/max)*(W-pad*2);
  const a=X(p.qti||p.qt),b=X(p.qt),up=(p.diff||0)>0,dn=(p.diff||0)<0;
  const col=up?'#00FF87':dn?'#EF4444':'#64748B';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="72" role="img" aria-label="Quotazione da ${p.qti} a ${p.qt}">
    <line x1="${pad}" y1="${y}" x2="${W-pad}" y2="${y}" stroke="#243049" stroke-width="2"/>
    <line x1="${a.toFixed(1)}" y1="${y}" x2="${b.toFixed(1)}" y2="${y}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${a.toFixed(1)}" cy="${y}" r="6" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
    <circle cx="${b.toFixed(1)}" cy="${y}" r="7" fill="${col}"/>
    <text x="${a.toFixed(1)}" y="${y-14}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="11" fill="#94A3B8">${p.qti}</text>
    <text x="${b.toFixed(1)}" y="${y-14}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="${col}">${p.qt}</text>
    <text x="${pad}" y="${H-6}" font-size="9.5" fill="#64748B">Qt.I inizio stagione</text>
    <text x="${W-pad}" y="${H-6}" text-anchor="end" font-size="9.5" fill="#64748B">Qt.A attuale ${p.diff>0?'▲':p.diff<0?'▼':'▬'} ${p.diff>0?'+':''}${p.diff}</text></svg>`}
function fvmBarSVG(p){
  const list=state.players.filter(x=>x.role===p.role);
  const max=Math.max(...list.map(x=>x.fvm||1),1),pct=clamp((p.fvm||1)/max*100,1,100);
  const av=avg(list.map(x=>x.fvm||1)),apct=clamp(av/max*100,1,100);
  return `<div style="font-size:11px;color:var(--muted);margin-bottom:6px">FVM <b class="num" style="color:var(--neon)">${p.fvm}</b> · max ruolo ${max} · media ${Math.round(av)}</div>
    <div style="height:11px;border-radius:4px;background:var(--s3);border:1px solid var(--line);position:relative">
      <i style="position:absolute;left:0;top:0;bottom:0;width:${pct.toFixed(1)}%;border-radius:4px;background:linear-gradient(90deg,${RMETA[p.role].hex},#00FF87);animation:growW .8s both"></i>
      <span style="position:absolute;left:${apct.toFixed(1)}%;top:-4px;bottom:-4px;width:2px;background:var(--cyan)"></span></div>
    <div style="font-size:10px;color:var(--faint);margin-top:6px">Barra cyan = media del ruolo. FVM è l'indice di mercato Fantacalcio, non una fantamedia.</div>`}
function radarSVG(mine,av){
  const W=380,H=306,cx=W/2,cy=H/2+8,R=106,labels=['ATT','CEN','DIF','POR','PROF'];
  const pt=(i,v)=>{const a=(-90+i*72)*Math.PI/180;return[cx+Math.cos(a)*R*v/100,cy+Math.sin(a)*R*v/100]};
  let grid='';for(const l of [33,66,100])grid+=`<polygon points="${labels.map((_,i)=>pt(i,l).map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,.08)"/>`;
  let axes='',labs='';labels.forEach((l,i)=>{const [x,y]=pt(i,100);axes+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.08)"/>`;
    const [lx,ly]=pt(i,125);
    labs+=`<text x="${lx.toFixed(1)}" y="${(ly-3).toFixed(1)}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="10" font-weight="700" letter-spacing="1.2" fill="#94A3B8">${l}</text>
    <text x="${(lx-8).toFixed(1)}" y="${(ly+11).toFixed(1)}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="10" fill="#00FF87">${Math.round(mine[i]||0)}</text>
    <text x="${(lx+12).toFixed(1)}" y="${(ly+11).toFixed(1)}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="9" fill="#38BDF8">/${Math.round(av[i]||0)}</text>`});
  const poly=(v,s,f,d)=>`<polygon points="${v.map((x,i)=>pt(i,clamp(x,0,100)).map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="${f}" stroke="${s}" stroke-width="2" ${d?'stroke-dasharray="5 4"':''} stroke-linejoin="round"/>`;
  const dots=mine.map((v,i)=>{const [x,y]=pt(i,clamp(v,0,100));return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00FF87"/>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:310px" role="img" aria-label="Radar confronto">${grid}${axes}${poly(av,'#38BDF8','rgba(56,189,248,.10)',true)}${poly(mine,'#00FF87','rgba(0,255,135,.14)',false)}${dots}${labs}</svg>`}
function gaugeSVG(score){
  const a=(score/100)*180-90,col=score>=75?'#00FF87':score>=50?'#F59E0B':'#EF4444';
  const arc=(f,t,c)=>{const r=86,cx=100,cy=100,p=x=>{const rad=(x-180)*Math.PI/180;return[cx+Math.cos(rad)*r,cy+Math.sin(rad)*r]};
    const [x1,y1]=p(f),[x2,y2]=p(t);return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`};
  return `<svg width="200" height="118" viewBox="0 0 200 118" role="img" aria-label="Equilibrio ${score}">
    ${arc(0,60,'rgba(239,68,68,.3)')}${arc(62,120,'rgba(245,158,11,.3)')}${arc(122,180,'rgba(0,255,135,.3)')}
    <g style="transform-origin:100px 100px;transform:rotate(${a}deg);transition:transform .8s cubic-bezier(.2,.7,.2,1)">
      <line x1="100" y1="100" x2="100" y2="26" stroke="${col}" stroke-width="4" stroke-linecap="round"/></g>
    <circle cx="100" cy="100" r="8" fill="${col}"/>
    <text x="100" y="88" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="24" font-weight="700" fill="${col}">${score}</text></svg>`}
function burndownSVG(){
  const me=state.teams[0],budget=state.settings.budget;
  const mine=me.players.slice().sort((a,b)=>(a.at||0)-(b.at||0));
  const pts=[[0,budget]];let acc=budget;
  mine.forEach((p,i)=>{acc-=p.price;pts.push([i+1,Math.max(0,acc)])});
  const n=mine.length,remaining=TOTAL_SLOTS-n,avgLeft=remaining>0?Math.max(0,acc)/remaining:0;
  const projEnd=Math.max(0,acc-remaining*Math.max(1,avgLeft));
  const W=420,H=210,pl=42,pr=14,ptp=14,pb=28,xMax=TOTAL_SLOTS,yMax=Math.max(budget,1);
  const X=v=>pl+(v/xMax)*(W-pl-pr),Y=v=>H-pb-(v/yMax)*(H-ptp-pb);
  let grid='';for(let i=0;i<=4;i++){const v=yMax*i/4,y=Y(v);
    grid+=`<line x1="${pl}" y1="${y.toFixed(1)}" x2="${W-pr}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-dasharray="3 4"/>
    <text x="${pl-6}" y="${(y+3.5).toFixed(1)}" text-anchor="end" font-family="Space Grotesk,sans-serif" font-size="9" fill="#64748B">${Math.round(v)}</text>`}
  for(let i=0;i<=xMax;i+=5)grid+=`<text x="${X(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="9" fill="#64748B">${i}</text>`;
  const line=pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ');
  const area=line+` L ${X(pts[pts.length-1][0]).toFixed(1)} ${Y(0)} L ${X(0).toFixed(1)} ${Y(0)} Z`;
  const rivals=state.teams.slice(1).map(t=>teamStats(t).residuo);
  const avgR=rivals.length?avg(rivals):0,last=pts[pts.length-1];const gid='bd'+Math.random().toString(36).slice(2,7);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Consumo budget">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00FF87" stop-opacity=".28"/><stop offset="1" stop-color="#00FF87" stop-opacity="0"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#${gid})"/>
    <line x1="${pl}" y1="${Y(avgR).toFixed(1)}" x2="${W-pr}" y2="${Y(avgR).toFixed(1)}" stroke="#38BDF8" stroke-width="1.6" stroke-dasharray="6 4"/>
    <text x="${W-pr}" y="${(Y(avgR)-5).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#38BDF8" font-family="Space Grotesk,sans-serif">media lega ${Math.round(avgR)}</text>
    ${remaining>0?`<path d="M ${X(last[0]).toFixed(1)} ${Y(last[1]).toFixed(1)} L ${X(TOTAL_SLOTS).toFixed(1)} ${Y(projEnd).toFixed(1)}" fill="none" stroke="#00FF87" stroke-width="1.6" stroke-dasharray="4 4" opacity=".6"/>
    <circle cx="${X(TOTAL_SLOTS).toFixed(1)}" cy="${Y(projEnd).toFixed(1)}" r="3" fill="none" stroke="#00FF87" opacity=".8"/>
    <text x="${X(TOTAL_SLOTS).toFixed(1)}" y="${(Y(projEnd)-8).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#00FF87" font-family="Space Grotesk,sans-serif">proiezione ${Math.round(projEnd)}</text>`:''}
    <path d="${line}" fill="none" stroke="#00FF87" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="2.6" fill="#00FF87"/>`).join('')}
    <text x="${pl}" y="${H-8}" font-size="9.5" fill="#64748B">chiamate mie →</text></svg>`}
function scatterSVG(){
  const all=[];state.teams.forEach(t=>t.players.forEach(e=>all.push({...e,mine:t.id==='me'})));
  if(!all.length)return `<p class="empty-mini">Nessun acquisto a tabellone. Qui confronterai prezzo pagato e prezzo equo.</p>`;
  const maxV=Math.max(20,...all.map(e=>Math.max(e.price,e.fair||e.price)))*1.08;
  const W=400,H=250,pl=40,pb=32,ptp=12,pr=12;
  const X=v=>pl+(v/maxV)*(W-pl-pr),Y=v=>H-pb-(v/maxV)*(H-ptp-pb);
  let grid='';for(let i=0;i<=4;i++){const v=maxV*i/4;
    grid+=`<line x1="${pl}" y1="${Y(v).toFixed(1)}" x2="${W-pr}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-dasharray="3 4"/>
    <text x="${pl-6}" y="${(Y(v)+3.5).toFixed(1)}" text-anchor="end" font-size="9" font-family="Space Grotesk,sans-serif" fill="#64748B">${Math.round(v)}</text>
    <text x="${X(v).toFixed(1)}" y="${H-10}" text-anchor="middle" font-size="9" font-family="Space Grotesk,sans-serif" fill="#64748B">${Math.round(v)}</text>`}
  const dots=all.map(e=>{const f=e.fair||e.price;
    return `<circle cx="${X(f).toFixed(1)}" cy="${Y(e.price).toFixed(1)}" r="${e.mine?5:3.6}" fill="${RMETA[e.role].hex}" fill-opacity="${e.mine?.95:.55}" stroke="${e.mine?'#F8FAFC':'none'}" stroke-width="${e.mine?1.4:0}"><title>${esc(e.name)}: pagato ${e.price} · equo ${f}</title></circle>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Efficienza acquisti">
    ${grid}<line x1="${X(0)}" y1="${Y(0)}" x2="${X(maxV)}" y2="${Y(maxV)}" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="5 4" opacity=".6"/>
    <text x="${X(maxV*.6).toFixed(1)}" y="${Y(maxV*.86).toFixed(1)}" font-size="9.5" fill="#EF4444">sopra mercato ↑</text>
    <text x="${X(maxV*.55).toFixed(1)}" y="${Y(maxV*.28).toFixed(1)}" font-size="9.5" fill="#00FF87">affari ↓</text>
    ${dots}<text x="${W/2}" y="${H-1}" text-anchor="middle" font-size="9.5" fill="#64748B">prezzo equo →</text></svg>
    <div class="scatter-legend">${ROLES.map(r=>`<span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${RMETA[r].hex};margin-right:4px"></i>${RMETA[r].label}</span>`).join('')}</div>`}
const emptyBlock=(title,msg)=>`<div class="empty-state"><div class="es-ico">${icon('sheet',28)}</div><h4>${esc(title)}</h4><p>${msg}</p></div>`;

/* ---------- render sistema ---------- */
function renderSystem(){
  const errs=AUDIT.filter(a=>a.sev==='err').length,warns=AUDIT.filter(a=>a.sev==='warn').length,infos=AUDIT.filter(a=>a.sev==='info').length;
  const hc=$('healthChip');
  hc.className='health-chip '+(errs?'bad':warns?'warn':'ok');
  $('healthTxt').textContent=errs?`${errs} error${errs===1?'e':'i'}`:warns?`${warns} avvis${warns===1?'o':'i'}`:'Asta OK';
  $('auditSummary').innerHTML=`<div class="e"><b>${errs}</b><span>Errori</span></div><div class="w"><b>${warns}</b><span>Avvisi</span></div><div class="o"><b>${infos}</b><span>Note</span></div>`;
  $('auditList').innerHTML=AUDIT.length?AUDIT.map(a=>`<div class="audit-item ${a.sev}">
      <span class="a-ico">${icon(a.ico,18)}</span>
      <div class="a-b"><h4>${esc(a.title)}</h4><p>${esc(a.detail)}</p>
        <div class="a-a">${a.fix?`<button class="btn ${a.sev==='err'?'btn-gold':'btn-ghost'} btn-sm" data-action="audit-fix" data-fix="${a.fix.act}" data-key="${esc(a.fix.key||'')}" data-team="${esc(a.fix.team||'')}">${icon('wrench',13)}${esc(a.fix.label)}</button>`:''}
        ${a.goto?`<a class="btn btn-ghost btn-sm" href="#${a.goto}">${esc(a.gotoLabel||'Vai')}</a>`:''}</div></div></div>`).join('')
    :`<div class="audit-clean"><span class="ac-i">${icon('check',22)}</span>
      <div><h4>Tabellone coerente</h4><p>Nessun duplicato, nessuno slot di troppo, budget e prezzi in ordine. Puoi continuare a chiamare.</p></div></div>`;
  $('snapCount').textContent=snaps.length;
  $('snapList').innerHTML=snaps.length?snaps.map((s,i)=>`<div class="snap ${i===0?'first':''}">
      <span class="s-n">${i===0?'ORA':i}</span>
      <div class="s-i"><div class="s-t">${esc(s.label||'Snapshot')}</div>
        <div class="s-m">${hhmm(s.at)} · ${s.buys} acquisti in lega</div></div>
      <button class="btn btn-ghost btn-sm" data-action="snap-restore" data-i="${i}">Ripristina</button></div>`).join('')
    :'<p class="empty-mini">Nessuno snapshot: si crea automaticamente al primo acquisto o import.</p>';
  $('lastBackup').textContent=state.lastBackupAt?`${new Date(state.lastBackupAt).toLocaleDateString('it-IT')} ${hhmm(state.lastBackupAt)}`:'mai';
  $('sinceBackup').textContent=state.sinceBackup;
  $('setAutoBackup').checked=!!state.settings.autoBackup;
  $('setAutoEvery').value=String(state.settings.autoBackupEvery);
  $('backupBtn').classList.toggle('alert',state.sinceBackup>=state.settings.autoBackupEvery);
  $('peerCount').textContent=peers.size+1;
  $('lastSave').textContent=lastSaveAt?hhmm(lastSaveAt):'—';
  $('storeMode').textContent=storeOK?'doppio + verifica':'NON disponibile';
  let used=0;try{for(const k of [K.main,K.mirror,K.snaps]){const v=localStorage.getItem(k);if(v)used+=v.length*2}}catch(e){}
  const quota=5*1024*1024,pct=clamp(used/quota*100,0,100);
  $('storageBar').classList.toggle('hot',pct>75);
  $('storageBar').firstElementChild.style.width=pct.toFixed(1)+'%';
  $('storageTxt').textContent=`${(used/1024).toFixed(0)} KB su ~5 MB stimati`;
  $('storagePct').textContent=Math.round(pct)+'%';
  /* checklist */
  const named=state.teams.slice(1).every(t=>!/^Squadra \d+$/.test(t.name));
  const splitSum=ROLES.reduce((a,r)=>a+state.settings.split[r],0);
  const st=teamStats(state.teams[0]);
  const checks=[
    {ok:state.players.length>0,t:'Listone caricato',s:state.players.length?`${state.players.length} giocatori in memoria`:'Importa il file XLSX ufficiale',goto:'listone'},
    {ok:named,t:'Squadre della lega rinominate',s:named?state.teams.map(t=>t.name).slice(0,3).join(', ')+'…':'Dai un nome vero alle rivali per leggere il tabellone',goto:'lega'},
    {ok:splitSum===100,t:'Piano di ripartizione al 100%',s:`Somma attuale ${splitSum}%`,goto:'analisi'},
    {ok:state.settings.timerOn,t:'Timer chiamata attivo',s:`${state.settings.timerSec} secondi per chiamata`,goto:'analisi'},
    {ok:state.settings.confirms,t:'Conferme di sicurezza attive',s:'Blocca gli acquisti anomali prima che partano',goto:'analisi'},
    {ok:state.lastBackupAt>0||snaps.length>0,t:'Rete di salvataggio pronta',s:snaps.length?`${snaps.length} snapshot locali${state.lastBackupAt?' + backup su file':''}`:'Nessuno snapshot né backup',goto:'sistema'},
    {ok:errs===0,t:'Nessun errore di coerenza',s:errs?`${errs} da risolvere nell'audit`:'Tabellone verificato',goto:'sistema'}
  ];
  $('checkCount').textContent=`${checks.filter(c=>c.ok).length}/${checks.length}`;
  $('checkCount').className='chip '+(checks.every(c=>c.ok)?'st-0':'st-1');
  $('checkList').innerHTML=checks.map(c=>`<div class="check ${c.ok?'done':''}">
    <span class="c-i">${icon(c.ok?'check':'minus',13)}</span>
    <div class="c-b"><div class="c-t">${esc(c.t)}</div><div class="c-s">${esc(c.s)}</div></div>
    ${c.ok?'':`<a class="btn btn-ghost btn-sm" href="#${c.goto}">Sistema</a>`}</div>`).join('');
}

/* ---------- render regia ---------- */
function renderRecControls(){
  const R=state.settings.rec;
  const set=(id,v)=>{const el=$(id);if(!el)return;el.value=v;el.style.setProperty('--fill',((v-el.min)/(el.max-el.min)*100)+'%')};
  set('recAggr',R.aggression);set('recUrg',R.urgencyW);set('recPress',R.pressureW);set('recVal',R.valueW);
  set('recBorrow',R.borrow);set('recRun',R.runWindow);set('recTop',R.topThreshold);set('recDepth',R.depthTarget);
  $('outAggr').textContent=R.aggression.toFixed(2)+'×';
  $('outUrg').textContent=R.urgencyW+'%';$('outPress').textContent=R.pressureW+'%';$('outVal').textContent=R.valueW+'%';
  $('outBorrow').textContent=R.borrow+'%';$('outRun').textContent=R.runWindow+' chiamate';
  $('outTop').textContent=R.topThreshold;$('outDepth').textContent=R.depthTarget+(R.depthTarget===1?' riserva':' riserve');
  $('recBorrowOn').checked=!!R.borrowOn;$('recBorrow').disabled=!R.borrowOn;
}
function renderMethod(){
  const R=state.settings.rec,w=REC?REC.w:{wu:.4,wp:.3,wv:.3};
  const steps=[
    {n:'01',t:'Fabbisogno di reparto',d:'Titolari del modulo, slot liberi, gap di qualità contro la media avversari e strutture mancanti (griglia portieri, coppie difensive).',
     f:`urgenza = 55·(titolari mancanti / need) + 18·(slot liberi / slot) + 19·gap qualità + 8·panchina + struttura`},
    {n:'02',t:'Borsa di spesa',d:'Il piano definisce il budget del reparto. I reparti già coperti nei titolari prestano il residuo nella percentuale scelta.',
     f:`borsa = min(tetto globale, piano residuo + ${R.borrowOn?R.borrow+'%':'0%'} prestito) · bid max = borsa − (slot−1)·${state.settings.reserve}`},
    {n:'03',t:'Pressione dei rivali',d:'Chi ha slot e crediti per contenderti i top, quanto sono scarsi, e se c\u2019è un run di acquisti sul reparto.',
     f:`pressione = 45·(contendenti / rivali) + 30·(1 − top liberi / slot lega) + 25·run(${R.runWindow})`},
    {n:'04',t:'Fit del candidato',d:'Valore assoluto, upgrade sui tuoi titolari, convenienza rispetto alla borsa e appetibilità per i rivali.',
     f:`fit = ${w.wv.toFixed(2)}·(0.6·indice + 0.4·convenienza) + ${w.wu.toFixed(2)}·upgrade + ${w.wp.toFixed(2)}·(0.5·trend + 0.5·heat)`},
    {n:'05',t:'Prezzo consigliato',d:'Il prezzo equo viene corretto da pressione, urgenza e inflazione reale del reparto, poi contenuto nel tetto.',
     f:`bid = equo × ${R.aggression.toFixed(2)} × (1+0.25·pressione) × (1+0.15·urgenza) × inflazione · tetto = bid×1.22`},
    {n:'06',t:'Ranking e mossa',d:'I reparti si ordinano per priorità pesata; la mossa consigliata è il miglior candidato accessibile del reparto più urgente.',
     f:`priorità = urgenza·${w.wu.toFixed(2)} + pressione·${w.wp.toFixed(2)} + fit migliore·${w.wv.toFixed(2)}`}
  ];
  $('recMethod').innerHTML=steps.map(s=>`<div class="method-step"><div class="ms-h"><span class="ms-n">${s.n}</span><h4>${esc(s.t)}</h4></div>
    <p>${esc(s.d)}</p><code>${esc(s.f)}</code></div>`).join('');
}
function renderRec(){
  renderRecControls();
  const has=state.players.length>0;
  $('recRunBanner').innerHTML=REC&&REC.leagueRun?`<div class="rec-run">${icon('flame',18)}
    <span><b>Run in corso su ${RMETA[REC.leagueRun.r].label.toLowerCase()}:</b> ${REC.leagueRun.count} acquisti dei rivali nelle ultime ${REC.leagueRun.window} chiamate
    · inflazione ${Math.round(REC.leagueRun.infl*100)}%. ${REC.leagueRun.infl>1.05?'I prezzi salgono: o anticipi ora o punti sul valore.':'Finché i prezzi tengono puoi aggredire il reparto.'}</span></div>`:'';
  const best=REC&&REC.best;
  if(!has){
    $('recBest').innerHTML=`<span class="rb-av av-C">${icon('radar',22)}</span>
      <div class="rb-i"><div class="rb-tag">${icon('info',12)}Motore in standby</div>
        <div class="rb-n">La regia si attiva con il listone</div>
        <div class="rb-m">Importa il file e il motore calcolerà fabbisogno, borsa e pressione per tutti e quattro i reparti. Intanto puoi tarare pesi e ripartizione.</div></div>
      <div class="rb-price"><div class="p-l">Reparti monitorati</div><div class="p-v">4</div><div class="p-c">P · D · C · A</div></div>`;
  }else if(!best){
    const closed=REC.roles.every(r=>r.slotsLeft===0);
    $('recBest').innerHTML=`<span class="rb-av av-P">${icon(closed?'check':'lock',22)}</span>
      <div class="rb-i"><div class="rb-tag">${icon('info',12)}Nessuna chiamata consigliata</div>
        <div class="rb-n">${closed?'Rosa completa: valuta gli svincoli':'Budget insufficiente per i candidati'}</div>
        <div class="rb-m">${closed?'Tutti i 25 slot sono occupati. Svincola un giocatore per migliorare un titolare e la regia ricalcola le priorità.':'Il tetto per reparto è troppo basso: alza il prestito tra reparti o riduci la riserva per slot.'}</div></div>
      <div class="rb-price"><div class="p-l">Tetto globale</div><div class="p-v">${teamStats(state.teams[0]).maxBid}</div><div class="p-c">crediti</div></div>
      <div class="rb-act"><a class="btn btn-ghost" href="#rosa">${icon('shirt',15)}Vai alla rosa</a><a class="btn btn-ghost" href="#analisi">${icon('sliders',15)}Regole del tavolo</a></div>`;
  }else{
    const r=best.role,c=best.cand,p=c.p;
    $('recBest').innerHTML=`${avatar(p,'rb-av')}
      <div class="rb-i"><div class="rb-tag"><span class="ping"></span>Mossa consigliata · ${RMETA[r.r].label} · priorità ${Math.round(r.priority)}</div>
        <div class="rb-n">${esc(p.name)} ${tierTag(p)} ${p.deal?'<span class="deal-chip">AFFARE</span>':''}</div>
        <div class="rb-m">${esc(p.team)} · Qt ${p.qt} · FVM ${p.fvm} · indice ${p.value} · fit ${Math.round(c.fit)}/100 · equo ${c.fair} cr</div>
        <div class="reason-row">${reasonHTML(c.reasons)}</div></div>
      <div class="rb-price"><div class="p-l">Bid consigliato</div><div class="p-v">${c.bid}</div>
        <div class="p-c">apertura ${c.opening} · tetto ${c.ceiling}</div></div>
      <div class="rb-act">
        <button class="btn btn-gold" data-action="rec-call" data-key="${esc(p.key)}" data-bid="${c.bid}">${icon('gavel',16)}Chiama a ${c.bid} cr</button>
        <button class="btn btn-ghost" data-action="rec-radar" data-key="${esc(p.key)}" data-max="${c.ceiling}">${icon('star',15)}Al radar (tetto ${c.ceiling})</button>
        <button class="btn btn-ghost" data-action="open" data-key="${esc(p.key)}">${icon('edit',15)}Scheda</button></div>`;
  }
  $('recOrder').innerHTML=`<span class="lbl">Ordine di intervento</span>`+
    (REC?REC.order.map((r,i)=>`<a class="ord-chip ${i===0&&r.status!=='done'?'first':''}" href="#regia">
      <span class="on">${i+1}</span>${roleBadge(r.r)}<span>${RMETA[r.r].label}</span><span class="ov">${Math.round(r.priority)}</span></a>`).join(''):'');
  $('recGrid').innerHTML=REC?REC.roles.map(r=>{
    const meta=RMETA[r.r],budgetScale=Math.max(r.planTarget,r.planSpent+r.purse,1);
    const spW=clamp(r.planSpent/budgetScale*100,0,100),boW=clamp(r.purse/budgetScale*100,0,100-spW),markW=clamp(r.planTarget/budgetScale*100,0,100);
    const dots=r.contenderList.length?r.contenderList.slice(0,8).map(c=>`<i class="hot" title="${esc(c.name)}: tetto ${c.max} cr"></i>`).join(''):'<i></i>';
    const cands=r.cands.length?r.cands.map(c=>{
      const p=c.p,up=Math.round(c.upgrade);
      return `<div class="rec-cand">${avatar(p)}
        <div class="rc-i"><div class="rc-n">${esc(p.name)} ${p.deal?'<span class="deal-chip">AFFARE</span>':''}
          <span class="upg ${up>=0?'pos':'neg'}">${up>=0?'+':''}${up} idx</span></div>
          <div class="rc-m"><span>${esc(p.team)}</span><span>Qt ${p.qt}</span><span>FVM ${p.fvm}</span><span>idx ${p.value}</span>${deltaSpan(p.diff)}</div>
          <div class="reason-row">${reasonHTML(c.reasons.slice(0,2))}</div></div>
        <div class="rc-p"><div class="bp">${c.affordable?c.bid:'—'}</div><div class="bc">${c.affordable?'tetto '+c.ceiling:'fuori borsa'}</div></div>
        <div class="rc-a">
          <button class="btn-icon" data-action="rec-radar" data-key="${esc(p.key)}" data-max="${c.ceiling||c.fair}" aria-label="Aggiungi ${esc(p.name)} al radar">${icon('star',13)}</button>
          <button class="btn-icon" data-action="rec-call" data-key="${esc(p.key)}" data-bid="${c.bid||c.fair}" aria-label="Chiama ${esc(p.name)}" style="color:var(--neon);border-color:rgba(0,255,135,.4)" ${c.affordable?'':'disabled'}>${icon('gavel',13)}</button>
        </div></div>`}).join('')
      :`<p class="empty-mini">${has?(r.slotsLeft===0?'Reparto al completo: nessun acquisto possibile finché non svincoli.':'Nessun candidato libero in questo reparto.'):'Importa il listone per vedere i candidati.'}</p>`;
    return `<div class="rec-card ${r.status==='crit'||r.status==='high'?'urgent':''}" style="--rc:${meta.color}">
      <div class="rc-head">${roleBadge(r.r)}<h3>${meta.label}</h3><span class="rc-urg ${r.cls}">${r.label} · ${Math.round(r.urgency)}</span></div>
      <div class="rc-meter"><i style="width:${clamp(r.urgency,0,100)}%"></i></div>
      <div class="rc-stats">
        <div class="rc-stat"><b>${r.es.length}/${SLOTS[r.r]}</b><span>Slot</span></div>
        <div class="rc-stat"><b class="${r.missingTit?'':'neon'}">${r.tits.length}/${r.r==='P'?1:FORMATIONS[state.settings.formation][r.r]}</b><span>Titolari</span></div>
        <div class="rc-stat"><b>${r.avgIdx?Math.round(r.avgIdx):'—'}</b><span>Idx medio</span></div>
        <div class="rc-stat"><b class="neon">${r.maxBid}</b><span>Bid max</span></div></div>
      <div class="rc-sec"><div class="rs-t">${icon('coin',12)}Borsa del reparto</div>
        <div class="rc-budget"><i class="sp" style="width:${spW}%"></i><i class="bo" style="left:${spW}%;width:${boW}%"></i><span class="mark" style="left:${markW}%"></span></div>
        <div class="rc-legend"><span><i style="background:color-mix(in srgb,${meta.color} 75%,#000)"></i>Speso ${fmt(r.planSpent)}</span>
          <span><i style="background:rgba(0,255,135,.5)"></i>Disponibile ${fmt(r.purse)}</span>
          <span><i style="background:var(--ink)"></i>Piano ${fmt(r.planTarget)}</span>
          ${r.borrowed>0?`<span style="color:var(--neon)">+${fmt(r.borrowed)} prestito</span>`:''}</div></div>
      <div class="rc-sec"><div class="rs-t">${icon('users',12)}Pressione competitiva</div>
        <div class="rc-press"><div class="rc-dots">${dots}</div>
          <div class="pt"><b>${r.contenderList.length}</b> rivali possono rilanciare · <b>${r.tops}</b> top liberi su ${r.leagueSlotsLeft} slot di lega
            · run <b>${r.runCount}/${REC.recent}</b> · inflazione <b>${Math.round(r.infl*100)}%</b>
            ${r.structureNote?`<br><span style="color:var(--warn)">${esc(r.structureNote)}</span>`:''}</div></div></div>
      <div class="rc-sec"><div class="rs-t">${icon('target',12)}Candidati e prezzo</div>${cands}</div></div>`}).join(''):'';
  renderMethod();
}

/* ---------- render resto ---------- */
function renderManager(){
  const me=state.teams[0],st=teamStats(me);
  const rank=[...state.teams].map(t=>({t,s:teamStats(t)})).sort((a,b)=>b.s.power-a.s.power).findIndex(x=>x.t.id==='me')+1;
  const f=FORMATIONS[state.settings.formation],anyBuy=state.teams.some(t=>t.players.length>0);
  $('managerCard').innerHTML=`<div class="mgr-top"><span class="mgr-av">${esc(initials(me.name))}</span>
      <div class="mgr-id"><div class="mgr-rank">${icon('crown',12)} ${anyBuy?rank+'° posto':'Tavolo aperto'}</div>
        <div class="mgr-name">${esc(dispName(me.name))}</div><div class="mgr-role">Team manager · ${esc(dispName(state.leagueName))}</div></div></div>
    <div class="mgr-stats">
      <div class="mgr-stat neon"><div class="ms-l">Crediti residui</div><div class="ms-v">${fmt(st.residuo)} <small>cr</small></div></div>
      <div class="mgr-stat cyan"><div class="ms-l">Potenza</div><div class="ms-v">${st.power} <small>pt</small></div></div>
      <div class="mgr-stat"><div class="ms-l">Rosa</div><div class="ms-v">${st.filled}<small>/25</small></div></div>
      <div class="mgr-stat"><div class="ms-l">Tetto chiamata</div><div class="ms-v">${st.maxBid} <small>cr</small></div></div></div>
    <div class="mgr-foot"><span>Modulo <b>${f.label}</b></span><span>Titolari <b>${st.titCount}/11</b></span><span>Speso <b>${fmt(st.spent)}</b></span></div>`}
function renderCheatSheet(){
  const box=$('cheatSheet');if(!box)return;
  if(!state.players.length){box.innerHTML='';return}
  const lg=dispName(state.leagueName);
  let html=`<div class="ch-head"><h1>LISTONE D'ASTA · ${esc(lg==='\u2014'?'ASTA':lg.toUpperCase())}</h1>
    <p>${new Date().toLocaleDateString('it-IT')} · budget ${fmt(state.settings.budget)} cr a squadra · ${state.players.length} giocatori · prezzi equi calcolati dal modello</p></div>`;
  ROLES.forEach(r=>{
    const ps=[...state.players].filter(p=>p.role===r).sort((a,b)=>(b.value||0)-(a.value||0));
    if(!ps.length)return;
    html+=`<h2>${RMETA[r].label.toUpperCase()} <small>${ps.length} giocatori</small></h2>
      <table class="ch-tab"><thead><tr><th>Nome</th><th>Squadra</th><th>FVM</th><th>Indice</th><th>Equo</th><th>Offerta</th><th>Aggiudicato a</th></tr></thead><tbody>
      ${ps.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.team)}</td><td>${p.fvm??''}</td><td>${p.value??''}</td><td><b>${fairOf(p.key)}</b></td><td></td><td></td></tr>`).join('')}
      </tbody></table>`;
  });
  html+='<p class="ch-note">Prezzo equo = valore atteso del giocatore nel modulo scelto. Segna qui offerte e aggiudicazioni durante l\'asta.</p>';
  box.innerHTML=html;
}
function renderLeagueReport(){
  const box=$('leagueReport');if(!box)return false;
  if(!state.teams.some(t=>t.players.length)){box.innerHTML='';return false}
  const lg=dispName(state.leagueName),all=[];
  state.teams.forEach((t,i)=>t.players.forEach(e=>{
    const p=state.players.find(x=>x.key===e.key);
    all.push({team:dispName(t.name),me:i===0,name:e.name||p?.name||'—',role:e.role||p?.role||'',
      price:e.price,fair:e.fair||fairOf(e.key),value:e.value||p?.value||0});
  }));
  const ranked=[...all].sort((a,b)=>(b.fair-b.price)-(a.fair-a.price));
  let html=`<div class="ch-head"><h1>REPORT FINALE DI LEGA · ${esc(lg==='—'?'ASTA':lg.toUpperCase())}</h1>
    <p>${new Date().toLocaleDateString('it-IT')} · budget ${fmt(state.settings.budget)} cr · ${state.teams.length} squadre · ${all.length} giocatori aggiudicati · modulo ${state.settings.formation}</p></div>`;
  html+='<h2>CLASSIFICA FINALE</h2><table class="ch-tab"><thead><tr><th>#</th><th>Squadra</th><th>Rosa</th><th>Speso</th><th>Residuo</th><th>Power</th><th>Eff.</th></tr></thead><tbody>';
  state.teams.map((t,i)=>({t,i,s:teamStats(t)})).sort((a,b)=>b.s.power-a.s.power).forEach(({t,s},i)=>{
    html+=`<tr><td>${i+1}</td><td>${esc(dispName(t.name))}${t.id==='me'?' (tu)':''}</td><td>${s.filled}/${TOTAL_SLOTS}</td>
      <td>${fmt(s.spent)}</td><td>${fmt(s.residuo)}</td><td><b>${s.power}</b></td><td>${s.eff}%</td></tr>`});
  html+='</tbody></table>';
  const good=ranked.filter(x=>x.fair-x.price>0).slice(0,12);
  if(good.length){
    html+='<h2>MIGLIORI ACQUISTI <small>risparmio sul prezzo equo</small></h2><table class="ch-tab"><thead><tr><th>Giocatore</th><th>Ruolo</th><th>Squadra</th><th>Prezzo</th><th>Equo</th><th>Risparmio</th></tr></thead><tbody>';
    good.forEach(x=>{html+=`<tr><td>${esc(x.name)}</td><td>${x.role}</td><td>${esc(x.team)}</td><td>${x.price}</td><td>${x.fair}</td><td><b>-${x.fair-x.price}</b></td></tr>`});
    html+='</tbody></table>'}
  const bad=ranked.filter(x=>x.price-x.fair>0).slice(-6).reverse();
  if(bad.length){
    html+='<h2>ACQUISTI SOPRA MERCATO <small>sovrapprezzo sul prezzo equo</small></h2><table class="ch-tab"><thead><tr><th>Giocatore</th><th>Ruolo</th><th>Squadra</th><th>Prezzo</th><th>Equo</th><th>Sovrapprezzo</th></tr></thead><tbody>';
    bad.forEach(x=>{html+=`<tr><td>${esc(x.name)}</td><td>${x.role}</td><td>${esc(x.team)}</td><td>${x.price}</td><td>${x.fair}</td><td><b>+${x.price-x.fair}</b></td></tr>`});
    html+='</tbody></table>'}
  state.teams.forEach(t=>{
    if(!t.players.length)return;
    html+=`<h2>ROSA · ${esc(dispName(t.name))} <small>speso ${fmt(teamStats(t).spent)} cr · residuo ${fmt(teamStats(t).residuo)} cr</small></h2>
      <table class="ch-tab"><thead><tr><th>Ruolo</th><th>Giocatore</th><th>Squadra</th><th>Prezzo</th><th>Equo</th><th>Indice</th></tr></thead><tbody>`;
    t.players.slice().sort((a,b)=>ROLES.indexOf(a.role)-ROLES.indexOf(b.role)||b.value-a.value).forEach(e=>{
      const p=state.players.find(x=>x.key===e.key);
      html+=`<tr><td>${e.role||p?.role||''}</td><td>${esc(e.name||p?.name||'—')}</td><td>${esc(p?.team||'')}</td><td>${e.price}</td><td>${e.fair||fairOf(e.key)}</td><td>${e.value||p?.value||''}</td></tr>`});
    html+='</tbody></table>'});
  box.innerHTML=html;return true;
}
function renderFirstSteps(){
  const card=$('firstStepsCard');if(!card)return;
  const show=(!state.players.length||!cleanName(state.leagueName)||!cleanName(state.myName))&&!state.ui.hideSteps;
  card.classList.toggle('hidden',!show);if(!show)return;
  const named=!!(cleanName(state.leagueName)&&cleanName(state.myName)),loaded=state.players.length>0;
  $('firstStepsCount').textContent=((named?1:0)+(loaded?1:0))+'/2';
  $('stepNames').classList.toggle('done',named);
  $('stepImport').classList.toggle('done',loaded);
  $('stepNames').querySelector('.step-n').textContent=named?'✓':'1';
  $('stepImport').querySelector('.step-n').textContent=loaded?'✓':'2';
}
function renderPulse(){
  const card=$('pulseCard');if(!card)return;
  const set=$('setPulse');if(set)set.checked=!state.ui.hidePulse;
  if(!state.players.length||state.ui.hidePulse){
    card.classList.add('hidden');const cb0=$('cPulse');if(cb0)cb0.textContent='';return}
  card.classList.remove('hidden');
  const st=teamStats(state.teams[0]),rivals=state.teams.slice(1).map(t=>teamStats(t));
  const spent=state.settings.budget>0?clamp(st.spent/state.settings.budget,0,1):0;
  const filled=clamp(st.filled/TOTAL_SLOTS,0,1),pace=spent-filled;
  const avgP=rivals.length?avg(rivals.map(x=>x.power)):0,gap=st.power-avgP;
  let label,cls,advice;
  if(!st.filled){label='In partenza';cls='';advice='Nessun acquisto registrato: la console e la regia sono pronte per la prima chiamata.'}
  else if(pace>.18){label='Spendi troppo';cls='bad';
    advice=`Hai usato il ${Math.round(spent*100)}% del budget per il ${Math.round(filled*100)}% della rosa. Rallenta e punta ai titolari che mancano.`}
  else if(pace<-.18&&st.empty>0){label='Ritmo lento';cls='warn';
    advice=`Rosa al ${Math.round(filled*100)}% con ancora ${fmt(st.residuo)} cr disponibili: puoi alzare l'offerta sui giocatori chiave.`}
  else if(gap>=5){label='In vantaggio';cls='good';
    advice=`Potenza ${st.power} contro media lega ${avgP}. Completa i reparti scoperti senza forzare il budget.`}
  else if(gap<=-5&&rivals.length){label='Sotto la media';cls='bad';
    advice=`Potenza ${st.power} contro media lega ${avgP}. Cerca un titolare nei reparti piu deboli.`}
  else{label='In linea';cls='good';advice=st.empty
    ?`Ritmo regolare: ${st.empty} slot da colmare e ${fmt(st.residuo)} cr ancora disponibili.`
    :'Rosa completa: ora ottimizza panchina e riserva nelle Analisi.'}
  const badge=$('pulseBadge');badge.textContent=label;badge.className='pulse-badge '+cls;
  const cb=$('cPulse');if(cb){cb.textContent=label;cb.className='c-pulse '+cls}
  $('pulseAdvice').textContent=advice;
  $('pulseBudgetBar').style.width=Math.round(spent*100)+'%';$('pulseRosaBar').style.width=Math.round(filled*100)+'%';
  $('pulseBudgetTxt').textContent=Math.round(spent*100)+'%';$('pulseRosaTxt').textContent=Math.round(filled*100)+'%';
  const form=FORMATIONS[state.settings.formation]||FORMATIONS['442'],need={P:1,D:form.D,C:form.C,A:form.A};
  const own=ownership(),free=state.players.filter(p=>!own.has(p.key));
  $('pulseRoles').innerHTML=ROLES.map(r=>{
    const mine=st.byRole[r].entries.slice(0,need[r]);
    const mineAvg=mine.length?avg(mine.map(e=>e.value||50)):0;
    const ra=rivals.map(x=>{const es=x.byRole[r].entries.slice(0,need[r]);return es.length?avg(es.map(e=>e.value||50)):null}).filter(v=>v!=null);
    const la=ra.length?avg(ra):0,missing=Math.max(0,need[r]-mine.length);
    let rc='good',rt='Completato';
    if(missing>0){rc=missing>=2?'bad':'warn';rt=`Mancano ${missing} titolar${missing===1?'e':'i'}`}
    else if(la>0&&mineAvg<la-6){rc='warn';rt='Sotto media lega'}
    const valid=free.filter(p=>p.role===r&&p.value>=(la||70)).length;
    return `<div class="pulse-role ${rc}"><div class="pr-h"><span>${RMETA[r].label.toUpperCase()}</span><span>${mine.length}/${need[r]}</span></div>
      <div class="pr-v">${missing?'\u2212'+missing:'OK'}</div><small>${rt}${valid?` · ${valid} liberi validi`:''}</small></div>`}).join('');
  const perSlot=st.empty>0?Math.round(st.residuo/st.empty):0,top=free.filter(p=>p.value>=75).length;
  $('pulseFoot').textContent=st.empty
    ?`${st.empty} slot libere · media ${perSlot} cr a giocatore · ${top} giocatori liberi con indice \u2265 75.`
    :'Rosa al completo: verifica panchina e riserva nelle Analisi.';
}
function renderKPIs(){
  const me=state.teams[0],st=teamStats(me);
  tick($('navBudget'),st.residuo);tick($('kpiBudget'),st.residuo);tick($('kpiSpent'),st.spent);
  $('kpiBudgetTot').textContent=fmt(state.settings.budget);
  $('kpiBudget').closest('.kpi').classList.toggle('neg',st.residuo<0);
  $('budgetPill').classList.toggle('neg',st.residuo<0);
  $('budgetPill').classList.remove('flash');void $('budgetPill').offsetWidth;$('budgetPill').classList.add('flash');
  $('kpiRing').style.strokeDashoffset=(144.5*(1-st.filled/TOTAL_SLOTS)).toFixed(2);
  $('kpiSlots').textContent=st.filled+'/25';
  $('rolePips').innerHTML=ROLES.map(r=>{const n=SLOTS[r],f=st.byRole[r].filled;
    return `<span class="pip-group" title="${RMETA[r].label} ${f}/${n}"><span class="pl" style="color:${RMETA[r].color}">${r}</span>${Array.from({length:n},(_,i)=>`<span class="pip ${i<f?'on-'+r:''}"></span>`).join('')}</span>`}).join('');
  const rivals=state.teams.slice(1).map(t=>teamStats(t));
  const avgP=rivals.length?Math.round(avg(rivals.map(x=>x.power))):0;
  $('kpiPower').textContent=st.power;
  const d=st.power-avgP;
  $('kpiPowerSub').innerHTML=`media ${avgP} · <span style="color:${d>=0?'var(--neon)':'var(--roleA)'}">${d>=0?'+':''}${d}</span>`;
  $('kpiMax').textContent=st.maxBid;
  $('kpiMaxSub').textContent=st.empty>0?`${st.empty} slot · riserva ${state.settings.reserve}`:'rosa completa';
  const anyBuy=state.teams.some(t=>t.players.length>0);
  $('kpiInfl').textContent=MODEL.infl;
  $('kpiInflSub').textContent=!anyBuy?'in attesa di chiamate':MODEL.infl>108?'lega calda':MODEL.infl<94?'lega fredda':'in linea col valore';
  $('heroLeague').textContent=dispName(state.leagueName).toUpperCase();
  $('leagueChipName').textContent=dispName(state.leagueName);
  $('heroState').textContent=!state.players.length?'TAVOLO IN PREPARAZIONE':anyBuy?'ASTA IN CORSO':'LISTONE PRONTO';
  const src=state.source;
  $('heroCta').innerHTML=state.players.length
    ?`<a class="btn btn-gold" href="#regia">${icon('radar',15)}Apri la regia</a><a class="btn btn-ghost" href="#sistema">${icon('shield',14)}Stato sistema</a>`
    :`<a class="btn btn-gold" href="#listone">${icon('upload',15)}Carica il listone XLSX</a><a class="btn btn-ghost" href="#sistema">Checklist pre-asta</a>`;
  $('heroStatus').innerHTML=state.players.length&&src
    ?`${icon('check',14)}<b>${state.players.length} giocatori</b> · ${esc(src.sheet||'foglio')} · ${src.at?hhmm(src.at):''}`
    :`${icon('info',14)}Nessun file caricato — bastano 10 secondi.`;
  renderManager()}
function renderListone(){
  const has=state.players.length>0,src=state.source;
  $('listoneTitle').innerHTML=has?'LISTONE <span>PRONTO</span>':'IMPORTA IL <span>LISTONE</span>';
  $('listoneSub').textContent=has?'Il file è in memoria e salvato in doppia copia con verifica. Sostituendolo, rosa e acquisti restano agganciati per Id.'
    :'Carica il file XLSX delle quotazioni: l\u2019app riconosce fogli, intestazione e colonne, poi ti mostra l\u2019anteprima prima di confermare.';
  $('importFull').classList.toggle('hide',has);
  const chip=$('importState');chip.className='chip '+(has?'st-0':'st-2');chip.textContent=has?`${state.players.length} giocatori`:'vuoto';
  const cl=$('compactListone');cl.classList.toggle('show',has);
  cl.innerHTML=has&&src?`<div class="cl-main">
      <div class="cl-file">${icon('check',16)}<b>${esc(src.name)}</b><span class="chip st-0">${state.players.length} giocatori</span>
        <span class="spinner sm" id="compactBusy" style="display:none"></span></div>
      <div class="cl-counts">${ROLES.map(r=>`<span class="cl-count" style="color:${RMETA[r].hex};border-color:${RMETA[r].hex}55">${r} ${state.players.filter(p=>p.role===r).length}</span>`).join('')}
        ${src.ceduti?`<span class="cl-count" style="color:var(--warn)">${src.ceduti} ceduti</span>`:''}</div>
      <div class="cl-meta">Foglio ${esc(src.sheet||'—')} · importato ${src.at?`il ${new Date(src.at).toLocaleDateString('it-IT')} alle ${hhmm(src.at)}`:''} · chiave Id Fantacalcio</div>
      <div id="importErrorCompact"></div></div>
    <div class="cl-actions"><a class="btn btn-gold" href="#regia">${icon('radar',15)}Apri la regia</a>
      <button class="btn btn-ghost" data-action="choose" id="replaceBtn">${icon('upload',14)}Sostituisci file</button></div>`:'';
  renderImportError();if(!busy)setBusy(false)}
function renderTeamFilter(){
  const teams=[...new Set(state.players.map(p=>p.team))].sort((a,b)=>a.localeCompare(b,'it'));
  $('teamFilter').innerHTML=`<option value="ALL">Tutti (${teams.length})</option>`+teams.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('');
  $('teamFilter').value=state.ui.team;
  if($('teamFilter').value!==state.ui.team){state.ui.team='ALL';$('teamFilter').value='ALL'}}
function renderMantraFilter(){
  const set=new Set();state.players.forEach(p=>(p.mantra||[]).forEach(m=>set.add(m)));
  const order=MANTRA_SET.filter(m=>set.has(m));
  $('mantraFilter').innerHTML=`<option value="ALL">Tutti</option>`+order.map(m=>`<option value="${m}">${m} — ${MANTRA_LABEL[m]||m}</option>`).join('');
  $('mantraFilter').value=state.ui.mantra;
  if($('mantraFilter').value!==state.ui.mantra){state.ui.mantra='ALL';$('mantraFilter').value='ALL'}
  $('mantraFilter').disabled=!order.length}
function filteredPlayers(){
  const own=ownership(),ui=state.ui,q=fold(ui.q);
  let list=state.players.filter(p=>{
    const o=own.get(p.key);
    if(p.ceduto&&ui.market!=='all')return false;
    if(ui.market==='free'&&o)return false;
    if(ui.market==='sold'&&!o)return false;
    if(ui.role!=='ALL'&&p.role!==ui.role)return false;
    if(ui.team!=='ALL'&&p.team!==ui.team)return false;
    if(ui.mantra!=='ALL'&&!(p.mantra||[]).includes(ui.mantra))return false;
    if(ui.affari&&!p.deal)return false;
    return true});
  if(q){
    const direct=list.filter(p=>fold(p.name).includes(q)||fold(p.team).includes(q));
    if(direct.length)list=direct;
    else list=list.map(p=>({p,s:fuzzyScore(q,p.name)})).filter(x=>x.s>320).sort((a,b)=>b.s-a.s).map(x=>x.p);
  }
  const dir=ui.dir==='asc'?1:-1;
  const kf={value:p=>p.value,fair:p=>fairOf(p.key),bid:p=>myBid(p),qt:p=>p.qt,fvm:p=>p.fvm,diff:p=>p.diff,name:p=>fold(p.name)}[ui.sort]||(p=>p.value);
  if(!(q&&list.length&&!list.some(p=>fold(p.name).includes(q))))
    list=[...list].sort((a,b)=>{const va=kf(a),vb=kf(b);
      if(typeof va==='string')return va.localeCompare(vb,'it')*dir;
      return (va-vb)*dir||b.value-a.value});
  return{list,own}}
function marketVMs(){
  const{list,own}=filteredPlayers();
  const pk=new Set(state.plan.map(x=>x.key));
  const shown=list.slice(0,state.ui.limit).map(p=>{const o=own.get(p.key)||null;
    return{p,o,mine:!!o&&o.teamId==='me',fair:fairOf(p.key),bid:o?0:myBid(p),planned:pk.has(p.key),checked:sel.has(p.key)}});
  return{list,shown}}
const vmBadges=v=>`${v.p.deal&&!v.o?'<span class="deal-chip">AFFARE</span>':''}${v.p.ceduto?'<span class="ced-chip">CEDUTO</span>':''}${v.planned&&!v.o?'<span class="plan-dot"></span>':''}`;
const vmOwner=v=>v.o?`<span class="owner-chip ${v.mine?'mine':''}">${v.mine?'TUA · '+v.o.price:esc(v.o.teamName)+' · '+v.o.price}</span>`:'';
function vmActions(v,compact){
  const k=esc(v.p.key),star=`<button class="btn-icon ${v.planned?'starred':''}" data-action="plan-toggle" data-key="${k}" aria-label="Radar obiettivi">${icon('star',compact?16:14)}</button>`;
  if(v.o)return star+`<button class="${compact?'btn btn-ghost btn-sm':'btn-icon'}" data-action="open" data-key="${k}" aria-label="Scheda di ${esc(v.p.name)}">${icon('edit',compact?15:14)}${compact?'Scheda':''}</button>`;
  if(compact)return star+
    `<button class="btn btn-gold btn-sm" data-action="call-open" data-key="${k}">${icon('gavel',15)}Chiama</button>
     <button class="btn btn-ghost btn-sm" data-action="call-assign" data-key="${k}">${icon('users',15)}Assegna</button>`;
  return star+
    `<button class="btn-icon" data-action="call-open" data-key="${k}" aria-label="Chiama per me" style="color:var(--neon);border-color:rgba(0,255,135,.4)">${icon('gavel',14)}</button>
     <button class="btn-icon" data-action="call-assign" data-key="${k}" aria-label="Assegna a un rivale">${icon('users',14)}</button>`}
function rowHTML(v){
  const p=v.p,k=esc(p.key);
  return `<tr data-action="open" data-key="${k}" class="${v.o?'sold':''} ${v.mine?'mine':''}" tabindex="0">
    <td><input type="checkbox" data-action="sel" data-change="sel" data-key="${k}" ${v.checked?'checked':''} aria-label="Seleziona ${esc(p.name)}"></td>
    <td>${roleBadge(p.role)}</td>
    <td><div class="p-id">${avatar(p)}<div class="p-idc"><div class="p-name">${esc(p.name)}${vmBadges(v)}${vmOwner(v)}</div>
      <div class="p-team"><span>${esc(p.team)}</span>${mantraHTML(p)}</div></div></div></td>
    <td class="num">${p.qt}</td><td class="num col-diff">${deltaSpan(p.diff)}</td>
    <td class="num ${p.fvm>=100?'gold':''}">${p.fvm}</td>
    <td class="num col-idx"><span class="idx-wrap"><span class="idx-bar"><i style="width:${p.value}%"></i></span><span>${p.value}</span></span></td>
    <td class="num">${v.o?'—':v.fair}</td><td class="num gold">${v.o?'—':(v.bid||'—')}</td>
    <td><div class="row-actions">${vmActions(v,false)}</div></td></tr>`}
function cardHTML(v){
  const p=v.p,k=esc(p.key);
  const cell=(val,label,gold)=>`<div class="mc-stat"><b class="${gold?'gold':''}">${val}</b><span>${label}</span></div>`;
  return `<article class="m-card ${v.o?'sold':''} ${v.mine?'mine':''} ${v.planned&&!v.o?'in-plan':''}" data-action="open" data-key="${k}" tabindex="0" aria-label="${esc(p.name)}, ${RMETA[p.role].one}">
    <div class="mc-top"><input type="checkbox" data-action="sel" data-change="sel" data-key="${k}" ${v.checked?'checked':''} aria-label="Seleziona ${esc(p.name)}">
      ${avatar(p)}<div class="mc-id"><div class="mc-name">${esc(p.name)}${vmBadges(v)}</div>
        <div class="mc-sub">${roleBadge(p.role)}<span>${esc(p.team)}</span>${mantraHTML(p)}</div></div>
      ${v.o?vmOwner(v):tierTag(p)}</div>
    <div class="mc-stats">${cell(p.qt,'Qt.A')}${cell(p.fvm,'FVM',p.fvm>=100)}
      ${cell(v.o?(v.o.price):v.fair,v.o?'Pagato':'Equo',!v.o)}${cell(v.o?'—':(v.bid||'—'),'Bid',true)}</div>
    <div class="mc-actions">${vmActions(v,true)}</div></article>`}
function renderMarket(){
  const ui=state.ui,own=ownership();
  const freeCount=r=>state.players.filter(p=>p.role===r&&!own.has(p.key)&&!p.ceduto).length;
  $('roleSeg').innerHTML=`<button data-action="f-role" data-role="ALL" class="${ui.role==='ALL'?'on':''}">Tutti</button>`+
    ROLES.map(r=>`<button data-action="f-role" data-role="${r}" class="${ui.role===r?'on r'+r:''}" title="${RMETA[r].label}">${r}<small>${freeCount(r)}</small></button>`).join('');
  const{list,shown}=marketVMs();
  if(!state.players.length){
    const eb=emptyBlock('Listone non ancora importato','I giocatori e gli indici compariranno qui dopo l\u2019importazione del file.');
    $('marketBody').innerHTML=`<tr><td colspan="10">${eb}</td></tr>`;$('marketCards').innerHTML=eb;
    $('marketCount').textContent='Listone vuoto';$('moreBtn').style.display='none';
    $('selectAll').checked=false;$('selectAll').indeterminate=false;$('bulkBar').classList.remove('show');
    document.querySelectorAll('th.sortable').forEach(th=>{th.classList.remove('sorted');th.querySelector('.arr').textContent=''});
    $('sortDirBtn').innerHTML=icon('down',15);renderViews();return}
  if(shown.length){$('marketBody').innerHTML=shown.map(rowHTML).join('');$('marketCards').innerHTML=shown.map(cardHTML).join('')}
  else{const eb=emptyBlock('Nessun giocatore con questi filtri','Allarga la ricerca o azzera i filtri.')+
      `<div style="text-align:center;padding-bottom:20px"><button class="btn btn-ghost btn-sm" data-action="clear-filters">Azzera filtri</button></div>`;
    $('marketBody').innerHTML=`<tr><td colspan="10">${eb}</td></tr>`;$('marketCards').innerHTML=eb}
  $('marketCount').textContent=`${shown.length} di ${list.length} · listone ${state.players.length}`;
  $('moreBtn').style.display=list.length>ui.limit?'':'none';
  document.querySelectorAll('th.sortable').forEach(th=>{const on=th.dataset.sort===ui.sort;
    th.classList.toggle('sorted',on);th.querySelector('.arr').textContent=on?(ui.dir==='asc'?'▲':'▼'):''});
  $('sortDirBtn').innerHTML=icon(ui.dir==='asc'?'up':'down',15);
  const all=shown.length>0&&shown.every(v=>v.checked),some=shown.some(v=>v.checked);
  $('selectAll').checked=all;$('selectAll').indeterminate=!all&&some;
  $('bulkBar').classList.toggle('show',sel.size>0);$('bulkCount').textContent=sel.size;
  $('bulkTeam').innerHTML=state.teams.map(t=>`<option value="${t.id}">${esc(t.name)} (${teamStats(t).residuo} cr)</option>`).join('');
  renderViews()}
function renderViews(){
  const ui=state.ui,form=$('saveViewForm');
  $('viewsRow').innerHTML=`<span class="lbl">Viste</span>
    <button class="view-chip ${!ui.view?'active':''}" data-action="view-reset">Tutti i liberi</button>`+
    state.views.map(v=>`<span class="view-chip ${ui.view===v.name?'active':''}" data-action="view-apply" data-view="${esc(v.name)}" role="button" tabindex="0">${esc(v.name)}<span class="vx" data-action="view-del" data-view="${esc(v.name)}">×</span></span>`).join('')+
    `<button class="view-chip" data-action="view-save-open" style="border-style:dashed">${icon('plus',12)} Salva vista</button>`;
  $('viewsRow').appendChild(form)}
function syncFilterInputs(){const ui=state.ui;
  $('searchInput').value=ui.q;$('teamFilter').value=ui.team;$('mantraFilter').value=ui.mantra;
  $('marketFilter').value=ui.market;$('sortSelect').value=ui.sort;$('affariToggle').checked=ui.affari}
function renderAdvisor(){
  const best=REC&&REC.best,tips=computeTips();
  $('advisorCard').innerHTML=(best?`<div class="regista-pick">${avatar(best.cand.p)}
    <div class="rp-info"><div class="rp-name">${esc(best.cand.p.name)}${best.cand.p.deal?'<span class="deal-chip">AFFARE</span>':''}</div>
    <div class="rp-meta">${RMETA[best.role.r].label} · idx ${best.cand.p.value} · bid <b style="color:var(--neon)">${best.cand.bid}</b> · tetto ${best.cand.ceiling}</div></div>
    <button class="btn btn-gold btn-sm" data-action="rec-call" data-key="${esc(best.cand.p.key)}" data-bid="${best.cand.bid}" aria-label="Chiama">${icon('gavel',14)}</button></div>`
    :`<div class="regista-pick"><div class="rp-info"><div class="rp-name">${state.players.length?'Nessuna chiamata possibile':'Regista in standby'}</div>
      <div class="rp-meta">${state.players.length?'Rosa completa o budget esaurito.':'I suggerimenti si attivano con il listone.'}</div></div></div>`)
    +tips.slice(0,2).map(t=>`<div class="mini-tip"><span style="color:${{danger:'var(--roleA)',warn:'var(--warn)',ok:'var(--neon)',info:'var(--cyan)',gold:'var(--neon)'}[t.sev]}">${icon(t.ico,15)}</span><span><b style="color:var(--ink)">${esc(t.title)}.</b> ${esc(t.text)}</span></div>`).join('')}
function renderRecent(){
  const items=state.recent.slice(0,6);
  $('recentCard').innerHTML=items.length?items.map(r=>{
    const p=state.players.find(x=>x.key===r.key),t=teamById(r.teamId);
    if(!p||!t)return'';
    return `<div class="recall">${roleBadge(p.role)}
      <div class="rc-i"><div class="rc-n">${esc(p.name)}</div>
        <div class="rc-m">${esc(t.name)} · ${r.price} cr · ${hhmm(r.at)}</div></div>
      <button class="btn-icon" data-action="recall" data-key="${esc(p.key)}" data-team="${r.teamId}" data-price="${r.price}" aria-label="Ricarica la chiamata di ${esc(p.name)}" title="Ricarica in console">${icon('redo',13)}</button>
    </div>`}).join('')
    :'<p class="empty-mini">Nessuna chiamata registrata. Qui trovi le ultime 6 per ricaricarle al volo se correggi un prezzo.</p>'}
function renderPlan(){
  const own=ownership(),st=teamStats(state.teams[0]);
  $('planCount').textContent=state.plan.length;
  const free=state.plan.filter(x=>!own.has(x.key)),alloc=free.reduce((a,x)=>a+x.max,0),over=alloc>st.residuo;
  let html=`<div class="plan-summary"><span>Allocati <b style="color:${over?'var(--roleA)':'var(--neon)'}">${alloc}</b> / ${st.residuo} cr</span>
    <span>${over?'<span style="color:var(--roleA)">sovrallocato</span>':`margine ${st.residuo-alloc}`}</span></div>`;
  html+=state.plan.length?state.plan.map(it=>{
    const p=state.players.find(x=>x.key===it.key);if(!p)return'';
    const o=own.get(it.key);
    return `<div class="plan-item" draggable="true" data-key="${esc(it.key)}">
      <span class="plan-grip">${icon('drag',12)}</span>${roleBadge(p.role)}
      <div class="plan-info"><div class="plan-name">${esc(p.name)}</div>
        <div class="plan-meta">${o?(o.teamId==='me'?'PRESO a '+o.price:esc(o.teamName)):`equo ${fairOf(p.key)} · qt ${p.qt} · FVM ${p.fvm}`}</div></div>
      ${o?'':`<input class="plan-max" value="${it.max}" data-change="plan-max" data-key="${esc(it.key)}" inputmode="numeric" aria-label="Tetto per ${esc(p.name)}">`}
      ${o?'':`<button class="btn-icon" data-action="plan-call" data-key="${esc(it.key)}" aria-label="Chiama al tetto" style="color:var(--neon)">${icon('gavel',12)}</button>`}
      <button class="btn-icon" data-action="plan-toggle" data-key="${esc(it.key)}" aria-label="Rimuovi dal radar">${icon('x',12)}</button></div>`}).join('')
    :`<p class="empty-mini">Nessun obiettivo. Usa la ★ dalla regia o dal mercato per fissare un tetto di spesa.</p>`;
  $('planCard').innerHTML=html}
function renderLog(){
  $('logList').innerHTML=state.log.slice(0,40).map(l=>{
    const ic=l.type==='me'?['gavel','var(--neon)']:l.type==='rival'?['users','var(--cyan)']:['file','var(--faint)'];
    return `<div class="log-item"><span class="l-time">${hhmm(l.t)}</span><span class="l-ico" style="color:${ic[1]}">${icon(ic[0],14)}</span><span>${l.text}</span></div>`}).join('')
    ||'<p class="empty-mini">Tabellone vuoto.</p>'}
function renderPitch(){
  const me=state.teams[0],f=FORMATIONS[state.settings.formation],st=teamStats(me);
  const bands=[['A',f.A],['C',f.C],['D',f.D],['P',1]];
  const tits=[];bands.forEach(([r,n])=>st.byRole[r].entries.slice(0,n).forEach(p=>tits.push(p)));
  const cap=tits.length?tits.reduce((a,b)=>(b.value||0)>(a.value||0)?b:a):null;
  const lines=`<svg class="lines" viewBox="0 0 300 400" preserveAspectRatio="none" fill="none" stroke="rgba(0,255,135,.2)" stroke-width="1.2">
    <rect x="8" y="8" width="284" height="384" rx="4"/><line x1="8" y1="200" x2="292" y2="200"/>
    <circle cx="150" cy="200" r="46"/><circle cx="150" cy="200" r="2.5" fill="rgba(0,255,135,.35)" stroke="none"/>
    <rect x="70" y="8" width="160" height="52"/><rect x="112" y="8" width="76" height="22"/>
    <rect x="70" y="340" width="160" height="52"/><rect x="112" y="370" width="76" height="22"/>
    <path d="M112 60a40 40 0 0 0 76 0"/><path d="M112 340a40 40 0 0 1 76 0"/></svg>`;
  const bandsHTML=bands.map(([r,n])=>{
    const es=st.byRole[r].entries.slice(0,n);
    let nodes=es.map(p=>`<button class="pitch-node" data-action="open" data-key="${esc(p.key)}" aria-label="${esc(p.name)}, indice ${p.value||50}">
      ${cap&&cap.key===p.key?'<span class="pn-cap">C</span>':''}
      <span class="pn-av av-${r}">${esc(initials(p.name))}</span>
      <span class="pn-name">${esc(p.name)}</span><span class="pn-metric">${p.value||50}</span></button>`).join('');
    for(let i=es.length;i<n;i++)nodes+=`<div class="pitch-node empty"><span class="pn-av">${r}</span><span class="pn-name">Slot</span></div>`;
    return `<div class="pitch-band">${nodes}</div>`}).join('');
  $('pitchBoard').innerHTML=lines+`<div class="pitch-bands">${bandsHTML}</div>`;
  const av=tits.length?Math.round(avg(tits.map(p=>p.value||50))):0;
  const bench=me.players.length-tits.length;
  const top=[...tits].sort((a,b)=>(b.value||0)-(a.value||0)).slice(0,3);
  $('pitchInfo').innerHTML=`<div class="board-hero"><span class="board-mod">${f.label}</span>
      <div class="board-cov"><div class="bc-t">Copertura titolari</div>
        <div class="bc-bar"><i style="width:${(st.titCount/11*100).toFixed(1)}%"></i></div>
        <div class="bc-s">${st.titCount}/11 in campo · indice medio ${av||'—'} · panchina ${bench}</div></div></div>
    ${cap?`<div class="board-row"><span class="avatar av-${cap.role}">${esc(initials(cap.name))}</span>
      <div class="br-i"><div class="br-n">${esc(cap.name)} <span class="chip st-1" style="font-size:8px">Capitano</span></div>
        <div class="br-m">${esc(cap.team)} · ${RMETA[cap.role].one} · pagato ${cap.price} cr</div></div>
      <span class="br-v">${cap.value||50}</span></div>`:''}
    <div class="board-rows">${top.length?top.map(p=>`<div class="board-row">${roleBadge(p.role)}
      <div class="br-i"><div class="br-n">${esc(p.name)}</div><div class="br-m">${esc(p.team)} · Qt ${p.qt} · FVM ${p.fvm}</div></div>
      <span class="br-v">${p.value||50}</span></div>`).join('')
      :'<p class="empty-mini">Il pitch si popola con i titolari: chiama i primi giocatori e le gerarchie compaiono qui.</p>'}</div>
    <div class="pitch-legend" style="margin-top:2px">${ROLES.map(r=>{const n=st.byRole[r].filled,needN=r==='P'?1:f[r];
      return `<span style="color:${RMETA[r].color}">${r} ${Math.min(n,needN)}/${needN}</span>`}).join('')}</div>`}
function renderRosa(){
  const me=state.teams[0],st=teamStats(me),f=FORMATIONS[state.settings.formation]||FORMATIONS['442'];
  const need={P:1,D:f.D,C:f.C,A:f.A};
  $('rosaTotals').innerHTML=`Speso <b>${fmt(st.spent)}</b> · Residuo <b>${fmt(st.residuo)}</b> · <b>${st.filled}/25</b>`;
  $('formationSelect').innerHTML=Object.entries(FORMATIONS).map(([k,v])=>`<option value="${k}" ${k===state.settings.formation?'selected':''}>${v.label}</option>`).join('');
  $('rosaGrid').innerHTML=ROLES.map(r=>{
    const es=st.byRole[r].entries,meta=RMETA[r],target=state.settings.budget*state.settings.split[r]/100,spent=st.byRole[r].spent;
    const pct=target>0?clamp(spent/target*100,0,130):(spent>0?130:0);
    const cards=es.map((p,i)=>{
      const tit=i<need[r],ratio=(p.fair||p.price)>0?p.price/(p.fair||p.price):1;
      const badge=ratio<.85?'<span class="deal-chip">AFFARE</span>':ratio>1.18?'<span class="over-chip">+</span>':'';
      const priceEl=editingKey===p.key?`<input class="pc-price-input" data-change="price-commit" data-key="${esc(p.key)}" value="${p.price}" inputmode="numeric" aria-label="Nuovo prezzo per ${esc(p.name)}">`
        :`<button class="pc-price" data-action="rosa-edit" data-key="${esc(p.key)}" aria-label="Correggi prezzo di ${esc(p.name)}">${p.price}</button>`;
      return `<div class="p-card ${tit?'titolare':''}" draggable="${editingKey===p.key?'false':'true'}" data-key="${esc(p.key)}" data-role="${r}" style="--rc:${meta.color}">
        <span class="drag-handle">${icon('drag',13)}</span><span class="pos-badge">${i+1}</span>
        <div class="pc-info"><div class="pc-name">${tit?`<span style="color:var(--rc)">${icon('star',10)}</span>`:''}${esc(p.name)}</div>
          <div class="pc-meta"><span>${esc(p.team)}</span><span>idx ${p.value||50}</span>${badge}</div></div>
        ${priceEl}<div class="pc-tools">
          <button data-action="rosa-up" data-key="${esc(p.key)}" aria-label="Sali">${icon('up',11)}</button>
          <button data-action="rosa-down" data-key="${esc(p.key)}" aria-label="Scendi">${icon('down',11)}</button>
          <button class="del" data-action="rosa-del" data-key="${esc(p.key)}" aria-label="Svincola">${icon('trash',11)}</button></div></div>`}).join('');
    const empties=Array.from({length:Math.max(0,SLOTS[r]-es.length)},()=>`<div class="slot-empty" style="--rc:${meta.color}">${icon(meta.ico,16)}<span>Slot libero</span><span class="se-max">max ${st.maxBid}</span></div>`).join('');
    return `<div class="role-col" data-role="${r}" style="--rc:${meta.color}">
      <div class="role-col-h"><span class="role-badge rb-${r}">${r}</span><h3>${meta.label}</h3><span class="cnt">${es.length}/${SLOTS[r]}</span></div>
      <div class="role-col-budget"><b style="color:var(--ink)">${fmt(spent)}</b> / ${fmt(target)} cr · titolari ${Math.min(es.length,need[r])}/${need[r]}
        <div class="bar"><i style="width:${clamp(pct,0,100)}%;${pct>100?'background:var(--roleA)':''}"></i><span class="target-mark" style="left:${pct>0?clamp(100/(pct/100),0,100):100}%"></span></div></div>
      <div class="role-col-list" data-role="${r}">${cards}${empties}</div></div>`}).join('');
  if(editingKey){const i=$('rosaGrid').querySelector('.pc-price-input');if(i){i.focus();i.select()}}
  renderPitch();renderBlocks()}
function renderBlocks(){
  const me=state.teams[0],own=ownership();
  const keep=me.players.filter(p=>p.role==='P'),defs=me.players.filter(p=>p.role==='D');
  const kBy={},dBy={};keep.forEach(p=>kBy[p.team]=(kBy[p.team]||0)+1);defs.forEach(p=>dBy[p.team]=(dBy[p.team]||0)+1);
  const kBest=Object.entries(kBy).sort((a,b)=>b[1]-a[1])[0],cards=[];
  if(!keep.length)cards.push({cls:'',ico:'hand',t:'Griglia portieri',p:'Nessun portiere in rosa. Il blocco da 3 dello stesso club copre ogni turno.'});
  else if(kBest&&kBest[1]>=3)cards.push({cls:'good',ico:'check',t:`Griglia completa — ${kBest[0]}`,p:`Tutti e 3 i portieri del ${esc(kBest[0])}: copertura totale.`});
  else if(kBest&&kBest[1]===2){
    const third=state.players.filter(p=>p.role==='P'&&p.team===kBest[0]&&!own.has(p.key)&&!p.ceduto).sort((a,b)=>b.value-a.value)[0];
    cards.push({cls:'warn',ico:'hand',t:`Blocco ${kBest[0]} 2/3`,p:third?`Manca il terzo: <b>${esc(third.name)}</b> (equo ${fairOf(third.key)} cr).`:'Il terzo è già di un rivale: valuta una seconda griglia.'})}
  else cards.push({cls:'warn',ico:'warn',t:'Portieri spaiati',p:'Portieri di club diversi: con i recuperi rischi di schierare chi non gioca.'});
  const pairs=Object.entries(dBy).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]);
  cards.push({cls:pairs.length?'good':'',ico:'shield',t:'Coppie difensive',
    p:pairs.length?pairs.map(([t,n])=>`<b>${esc(t)}</b> ×${n}`).join(' · ')+' — utile per il modificatore.':'Nessuna coppia dello stesso club: il modificatore premia i blocchi da 2+.'});
  const f=FORMATIONS[state.settings.formation],need={P:1,D:f.D,C:f.C,A:f.A};
  const missing=ROLES.filter(r=>me.players.filter(p=>p.role===r).length<need[r]);
  cards.push({cls:missing.length?'warn':'good',ico:'shirt',t:`Copertura ${f.label}`,
    p:missing.length?`Titolari mancanti in: ${missing.map(r=>RMETA[r].label).join(', ')}.`:'Hai almeno i titolari per il modulo scelto.'});
  const full=ROLES.filter(r=>me.players.filter(p=>p.role===r).length>=SLOTS[r]);
  cards.push({cls:full.length?'good':'',ico:'grid',t:'Reparti completi',
    p:full.length?full.map(r=>RMETA[r].label).join(', ')+' al gran completo.':'Nessun reparto completo: 3P · 8D · 8C · 6A è l\u2019obiettivo.'});
  $('blocksCard').innerHTML=cards.map(c=>`<div class="block-card ${c.cls}"><h4>${icon(c.ico,15)} ${esc(c.t)}</h4><p>${c.p}</p></div>`).join('')}
let setupSig='';
function renderLeagueSetup(){
  const sig=state.teams.map(t=>t.id).join('|');
  if(sig!==setupSig){setupSig=sig;
    $('setupGrid').innerHTML=state.teams.map((t,i)=>`<div class="ls-row ${t.id==='me'?'me':''}">
      <span class="ls-key">${i+1}</span>
      <span class="ls-info"><input id="lsName_${t.id}" value="${esc(t.name)}" data-change="teamname" data-team="${t.id}" maxlength="30" placeholder="Nome squadra ${i+1}" aria-label="Nome squadra ${i+1}"></span>
      <span class="ls-res" id="lsRes_${t.id}"></span></div>`).join('')}
  state.teams.forEach(t=>{
    const inp=$('lsName_'+t.id);if(inp&&document.activeElement!==inp)inp.value=t.name;
    const st=teamStats(t),res=$('lsRes_'+t.id);
    if(res)res.innerHTML=`<b>${fmt(st.residuo)} cr</b>${st.filled}/25`});
  const sl=$('setupLeague');if(document.activeElement!==sl)sl.value=state.leagueName;
  const sb=$('setupBudget');if(document.activeElement!==sb)sb.value=state.settings.budget;
  $('setupCount').textContent=state.teams.length}
function renderLeague(){
  const stats=state.teams.map(t=>({t,st:teamStats(t)})),budget=state.settings.budget;
  $('legaSub').textContent=`${dispName(state.leagueName)} · ${state.teams.length} squadre · ${fmt(budget)} cr ciascuna. Registra le chiamate avversarie dalla console: la regia aggiorna la pressione su ogni reparto.`;
  renderLeagueSetup();
  $('raceChart').innerHTML=[...stats].sort((a,b)=>b.st.residuo-a.st.residuo).map(({t,st})=>{
    const segs=ROLES.map(r=>{const w=st.byRole[r].spent/budget*100;return w>0?`<i style="width:${w.toFixed(1)}%;background:${RMETA[r].hex}" title="${RMETA[r].label}: ${st.byRole[r].spent}"></i>`:''}).join('');
    return `<div class="race-row"><span class="race-name ${t.id==='me'?'me':''}">${t.id==='me'?icon('crown',13):''}<span>${esc(t.name)}</span></span>
      <div class="race-bar">${segs}</div><span class="race-nums"><b>${fmt(st.residuo)}</b> / ${fmt(budget)}</span></div>`}).join('')+
    `<div class="legend">${ROLES.map(r=>`<span><i style="background:${RMETA[r].hex}"></i>${RMETA[r].label}</span>`).join('')}<span><i style="background:var(--s3);border:1px solid var(--line)"></i>Residuo</span></div>`;
  $('teamsGrid').innerHTML=stats.map(({t,st})=>{
    const me=t.id==='me';
    const segs=ROLES.map(r=>{const w=st.byRole[r].spent/budget*100;return w>0?`<i style="width:${w.toFixed(1)}%;background:${RMETA[r].hex}"></i>`:''}).join('');
    const chips=t.players.slice(0,9).map(p=>`<span class="roster-chip"><span class="rd" style="background:${RMETA[p.role].hex}"></span><span class="rn">${esc(p.name)}</span><span class="rp">${p.price}</span>${me?'':`<button data-action="rival-del" data-team="${t.id}" data-key="${esc(p.key)}" aria-label="Svincola ${esc(p.name)}">×</button>`}</span>`).join('');
    return `<div class="card team-card ${me?'me-card':''}">
      <div class="tc-head">${me?`<span style="color:var(--neon)">${icon('crown',17)}</span>`:`<span style="color:var(--faint)">${icon('users',16)}</span>`}
        <input value="${esc(t.name)}" data-change="teamname" data-team="${t.id}" maxlength="30" placeholder="Nome squadra" aria-label="Nome squadra"></div>
      <div class="tc-power"><span class="pw">${st.power}</span><span class="pl">potenza</span><span class="slots">${st.filled}/25</span></div>
      <div class="tc-budget-bar">${segs}</div>
      <div class="tc-budget-line"><span>Speso <b>${fmt(st.spent)}</b></span><span>Residuo <b style="color:${st.residuo<0?'var(--roleA)':'var(--neon)'}">${fmt(st.residuo)}</b></span></div>
      <div class="tc-roster">${chips}${t.players.length>9?`<span class="roster-chip"><span class="rn">+${t.players.length-9}</span></span>`:''}${t.players.length===0?'<span style="font-size:10.5px;color:var(--faint)">Nessun acquisto</span>':''}</div>
      <div class="tc-foot"><span>Tetto</span><b>${st.maxBid} cr</b><span>Efficienza</span><b style="color:${st.eff>112?'var(--roleA)':st.eff<95?'var(--neon)':'var(--cyan)'}">${st.eff}%</b></div></div>`}).join('');
  const rivals=stats.filter(x=>x.t.id!=='me');
  const av=rivals.length?[0,1,2,3,4].map(i=>avg(rivals.map(x=>x.st.radar[i]))):[0,0,0,0,0];
  $('radarCard').innerHTML=radarSVG(stats[0].st.radar,av);
  if(!state.players.length||!REC){
    $('pressureCard').innerHTML='<p class="empty-mini">Il confronto per ruolo si attiva con il listone in memoria.</p>';
    $('matrixCard').innerHTML='<p class="empty-mini">La matrice mostra, per ogni top libero, quali squadre hanno slot e budget.</p>';
  }else{
    const own=ownership();
    $('pressureCard').innerHTML=REC.roles.map(r=>`<div class="pressure-row">${roleBadge(r.r)}<div class="pressure-info">
      <div class="pr-t">${r.tops>0?`${r.tops} profili forti liberi`:'Ruolo quasi svuotato'}</div>
      <div class="pr-s">${r.contenderList.length?`${r.contenderList.length} rivali possono contendere (equo ${r.fairTop} cr)`:'Nessun rivale può rilanciare forte'}</div></div>
      <div class="threat-dots">${rivals.map(x=>{const hot=x.st.byRole[r.r].filled<SLOTS[r.r]&&x.st.maxBid>=Math.max(r.fairTop*.85,15);
        const warm=!hot&&x.st.byRole[r.r].filled<SLOTS[r.r];return `<i class="${hot?'hot':warm?'warm':''}" title="${esc(x.t.name)}: max ${x.st.maxBid}"></i>`}).join('')}</div></div>`).join('');
    const tops=state.players.filter(p=>!own.has(p.key)&&!p.ceduto).sort((a,b)=>fairOf(b.key)-fairOf(a.key)).slice(0,7);
    $('matrixCard').innerHTML=tops.length?`<table class="matrix"><thead><tr><th>Giocatore libero</th>
      ${stats.map(({t})=>`<th class="${t.id==='me'?'me-col':''}" title="${esc(t.name)}">${esc(t.name.slice(0,9))}</th>`).join('')}</tr></thead><tbody>
      ${tops.map(p=>{const f=fairOf(p.key);
        return `<tr><td><span class="mx-name">${roleBadge(p.role)}${esc(p.name)}<small>${f}cr</small></span></td>
        ${stats.map(({t,st})=>{const slot=st.byRole[p.role].filled<SLOTS[p.role];
          if(!slot)return `<td><span class="mx-slot">—</span></td>`;
          return st.maxBid>=f?`<td><span class="mx-yes">${icon('check',14)}</span></td>`:`<td><span class="mx-no">${icon('x',12)}</span></td>`}).join('')}</tr>`}).join('')}
      </tbody></table><p style="font-size:10.5px;color:var(--faint);margin-top:9px">✓ = slot libero e budget ≥ prezzo equo · — = reparto completo</p>`
      :'<p class="empty-mini">Tutti i giocatori sono stati assegnati.</p>'}
  $('scatterCard').innerHTML=scatterSVG();
  $('powerRank').innerHTML=[...stats].sort((a,b)=>b.st.power-a.st.power).map(({t,st},i)=>{
    const col=i===0?'var(--neon)':i===1?'var(--cyan)':i===2?'var(--warn)':'var(--faint)';
    return `<div class="race-row" style="grid-template-columns:28px 1fr 92px"><span class="num" style="color:${col};font-weight:700">${i+1}°</span>
      <span class="race-name ${t.id==='me'?'me':''}"><span>${esc(t.name)}</span>${t.id==='me'?'<span class="chip st-0" style="font-size:8px">TU</span>':''}</span>
      <span class="race-nums"><b style="color:${t.id==='me'?'var(--neon)':'var(--cyan)'}">${st.power}</b> pts</span></div>`}).join('')}
function computeTips(){
  const tips=[],me=state.teams[0],st=teamStats(me),own=ownership();
  if(!state.players.length){
    tips.push({sev:'info',ico:'users',title:'Definisci il tavolo',text:`${state.teams.length} squadre con ${fmt(state.settings.budget)} crediti. Rinomina le rivali per leggere il tabellone a colpo d'occhio.`,goto:'lega',gotoLabel:'Configura lega'});
    tips.push({sev:'info',ico:'shield',title:'Prepara la rete di sicurezza',text:'Checklist pre-asta, snapshot e backup automatico sono nella sezione Sistema: sistemali prima di iniziare.',goto:'sistema',gotoLabel:'Apri Sistema'});
    return tips}
  const errs=AUDIT.filter(a=>a.sev==='err');
  if(errs.length)tips.push({sev:'danger',ico:'warn',title:`${errs.length} errore${errs.length===1?'':'i'} di coerenza`,
    text:errs[0].title+'. Risolvi nell\'audit prima di continuare a chiamare.',goto:'sistema',gotoLabel:'Apri audit'});
  if(REC){
    REC.roles.filter(r=>r.status==='crit').forEach(r=>tips.push({sev:'danger',ico:'warn',title:`${RMETA[r.r].label}: reparto critico`,
      text:`Mancano ${r.missingTit} titolari, bid massimo ${r.maxBid} cr. ${r.contenderList.length?`${r.contenderList.length} rivali possono contenderti i top.`:'Nessun rivale può rilanciare forte.'}`,goto:'regia',gotoLabel:'Vedi candidati'}));
    if(REC.leagueRun)tips.push({sev:'warn',ico:'flame',title:`Run su ${RMETA[REC.leagueRun.r].label.toLowerCase()}`,
      text:`${REC.leagueRun.count} acquisti rivali nelle ultime ${REC.leagueRun.window} chiamate, inflazione ${Math.round(REC.leagueRun.infl*100)}%. I bid consigliati sono già corretti.`,goto:'regia',gotoLabel:'Regia'});
    const cheap=REC.roles.flatMap(r=>r.cands.filter(c=>c.affordable&&c.p.deal).map(c=>({r,c})));
    if(cheap.length)tips.push({sev:'ok',ico:'bolt',title:`${cheap.length} affari dentro la tua borsa`,
      text:`Il migliore è ${cheap[0].c.p.name} a ${cheap[0].c.bid} cr con tetto ${cheap[0].c.ceiling}.`,goto:'regia',gotoLabel:'Chiama'});
  }
  if(st.empty===0)tips.push({sev:'ok',ico:'check',title:'Rosa completa (25/25)',text:'Valuta gli svincoli per migliorare i titolari: la regia ricalcola le priorità.',goto:'rosa',gotoLabel:'Vai alla rosa'});
  if(MODEL.infl>112)tips.push({sev:'warn',ico:'trend',title:`Lega surriscaldata (${MODEL.infl}%)`,text:'I prezzi superano il modello: lascia spendere gli altri.'});
  const ord={danger:0,warn:1,gold:2,info:3,ok:4};
  return tips.sort((a,b)=>ord[a.sev]-ord[b.sev]).slice(0,6)}
function renderAnalysis(){
  const s=state.settings,st=teamStats(state.teams[0]);
  const setR=(id,v)=>{const el=$(id);el.value=v;el.style.setProperty('--fill',((v-el.min)/(el.max-el.min)*100)+'%')};
  setR('setBudget',s.budget);setR('setTeams',s.teams);setR('setReserve',s.reserve);
  ROLES.forEach(r=>setR('setSplit'+r,s.split[r]));
  $('outBudget').textContent=fmt(s.budget)+' cr';$('outTeams').textContent=s.teams;$('outReserve').textContent=s.reserve+' cr';
  ROLES.forEach(r=>$('outSplit'+r).textContent=s.split[r]+'%');
  const sum=ROLES.reduce((a,r)=>a+s.split[r],0);
  $('splitSum').className='split-sum '+(sum===100?'good':'bad');
  $('splitSum').innerHTML=`Totale <b>${sum}%</b>${sum!==100?'<span style="color:var(--warn)">— dovrebbe fare 100%</span>':''}<button class="link-btn" data-action="balance-split">Bilancia al 100%</button>`;
  $('setStrategy').value=s.strategy;$('setTrend').checked=s.trend;$('setTimerOn').checked=s.timerOn;$('setTimerSec').value=String(s.timerSec);
  $('wakeRow').style.display=WAKE_SUPPORTED?'':'none';$('setWake').checked=!!s.wakeLock;$('setConfirms').checked=!!s.confirms;
  let score=100;const missing=11-st.titCount;
  for(const r of ROLES){const share=st.spent>0?st.byRole[r].spent/s.budget*100:0;score-=Math.abs(share-s.split[r])*.9}
  score-=missing*3.5;score=st.filled===0?0:clamp(Math.round(score),5,100);
  $('gaugeCard').innerHTML=gaugeSVG(score)+`<div class="gauge-info"><h4 style="color:${score>=75?'var(--neon)':score>=50?'var(--warn)':'var(--roleA)'}">${st.filled===0?'In attesa':score>=75?'Equilibrio ottimo':score>=50?'Equilibrio discreto':'Da correggere'}</h4>
    <p>${st.filled===0?'L\u2019indice misura aderenza al piano e copertura dei titolari.':`Aderenza al piano, ${st.titCount}/11 titolari del ${FORMATIONS[s.formation].label}.`}</p></div>`;
  const f=FORMATIONS[s.formation],need={P:1,D:f.D,C:f.C,A:f.A};
  $('balancePanel').innerHTML=ROLES.map(r=>{
    const target=s.budget*s.split[r]/100,spent=st.byRole[r].spent,scale=Math.max(target,spent,1);
    const es=st.byRole[r].entries,tits=es.slice(0,need[r]);
    const av=tits.length?avg(tits.map(p=>p.value||50)):0,over=spent>target*1.12;
    return `<div class="balance-row"><div class="br-head">${roleBadge(r)}<span class="br-name">${RMETA[r].label}</span>
      <span class="br-nums"><b>${fmt(spent)}</b> / ${fmt(target)} cr (${target>0?Math.round(spent/target*100):0}%)</span></div>
      <div class="br-bar"><i style="width:${(spent/scale*100).toFixed(1)}%;background:${over?'var(--roleA)':RMETA[r].hex}"></i><span class="mark" style="left:${(target/scale*100).toFixed(1)}%"></span></div>
      <div class="br-chips"><span class="br-chip ${tits.length>=need[r]?'ok':'warn'}">Titolari ${tits.length}/${need[r]}</span>
      <span class="br-chip ${av>=70?'ok':av>=50?'':'warn'}">Indice ${av?Math.round(av):'—'}</span>
      <span class="br-chip ${over?'bad':''}">${over?'Oltre piano':'In linea'}</span>
      <span class="br-chip">Slot ${es.length}/${SLOTS[r]}</span></div></div>`}).join('');
  $('burndownCard').innerHTML=burndownSVG()+`<p style="font-size:10.5px;color:var(--faint);margin-top:8px">Linea neon: credito residuo dopo ogni chiamata. Tratteggio: proiezione a rosa completa. Cyan: media avversari.</p>`;
  const tips=computeTips();
  $('tipsList').innerHTML=tips.map(t=>`<div class="tip-card sev-${t.sev}"><span class="t-ico">${icon(t.ico,19)}</span>
    <div><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p>${t.goto?`<a class="btn btn-ghost btn-sm" href="#${t.goto}">${esc(t.gotoLabel||'Vai')}</a>`:''}</div></div>`).join('')
    ||'<p class="empty-mini">Nessuna criticità.</p>';
  const counts=ROLES.map(r=>`${r} ${state.players.filter(p=>p.role===r).length}`).join(' · ');
  $('dataNote').innerHTML=state.source?`Sorgente: <b style="color:var(--neon)">${esc(state.source.name)}</b> (${counts}). Salvataggio in doppia copia con verifica e ${snaps.length} snapshot locali.`
    :'Nessun listone in memoria. Backup e ripristino disponibili in qualsiasi momento.'}
function renderSoundBtn(){const on=state.settings.sound;
  $('soundBtn').innerHTML=icon(on?'soundOn':'soundOff',17);$('soundBtn').classList.toggle('on',on);
  $('soundBtn').title=on?'Audio attivo — silenzia tutto':'Audio silenziato — attiva'}
function renderAll(){
  computeValues(state.players);MODEL=computeModel(state);REC=buildRec();AUDIT=runAudit();
  state.teams[0].name=cleanName(state.myName);
  $('leagueNameInput').value=state.leagueName;$('myNameInput').value=state.myName;
  renderFirstSteps();renderPulse();renderKPIs();renderListone();renderConsole();renderMarket();renderRec();renderAdvisor();renderRecent();renderPlan();renderLog();
  renderRosa();renderLeague();renderAnalysis();renderSystem();renderSyncUI();renderSoundBtn();renderGuard();
  const noUndo=hIndex<=0,noRedo=hIndex>=history.length-1;
  $('undoBtn').disabled=noUndo;$('undoBtn2').disabled=noUndo;$('redoBtn').disabled=noRedo;
  $('printTitle').textContent=(cleanName(state.myName)||cleanName(state.leagueName))?`${dispName(state.myName)} — ${dispName(state.leagueName)}`:'Report asta';
  $('printMeta').textContent=`Report asta · ${new Date().toLocaleDateString('it-IT')} · budget ${state.settings.budget} cr · ${state.teams.length} squadre · ${state.players.length} giocatori`;
  renderCheatSheet();renderPresent();syncLock();updateTitle();save()}
addEventListener('afterprint',()=>document.body.classList.remove('printing-cheat','printing-league'));

/* ---------- console ---------- */
const call={key:null,teamId:'me'};
let sugItems=[],sugIndex=-1;
const guardSkip=new Set();
function loadCall(key,teamId,price){
  const p=state.players.find(x=>x.key===key);if(!p)return;
  call.key=key;call.teamId=teamId||'me';
  const st=teamStats(teamById(call.teamId));
  const preset=price!=null?price:(call.teamId==='me'?(myBid(p,'me')||Math.max(1,Math.round(p.qt))):Math.max(1,Math.round(p.qt)));
  $('callPrice').value=Math.min(Math.max(1,preset),Math.max(1,st.maxBid||preset));
  $('callSearch').value='';closeSuggest();clearExpired();renderConsole();play('tick');
  $('consoleEl').classList.remove('hot');void $('consoleEl').offsetWidth;$('consoleEl').classList.add('hot');
  if(state.settings.timerOn)startTimer();
  if(window.innerWidth>=640)$('callBuy').focus();else updateTitle()}
function clearCall(){call.key=null;$('callPrice').value=0;stopTimer();resetTimer();clearExpired();renderConsole();updateTitle()}
function scrollActiveChip(){const c=$('callTeams'),el=c.querySelector('.tchip.on');
  if(el)c.scrollLeft=Math.max(0,el.offsetLeft-(c.clientWidth-el.offsetWidth)/2)}
function renderConsole(){
  const has=state.players.length>0;
  $('callSearch').disabled=!has;
  $('callSearch').placeholder=has?'Chiama un giocatore…  ( / )':'In attesa del listone…';
  const p=call.key?state.players.find(x=>x.key===call.key):null;
  const wrap=$('callSearchWrap'),sb=$('callSelected');
  $('consoleEl').classList.toggle('live',!!p);
  if(p){
    wrap.hidden=true;sb.hidden=false;
    const o=ownership().get(p.key);
    sb.innerHTML=`${avatar(p)}<div class="cs-info"><div class="cs-name">${esc(p.name)}<span class="in-asta"><span class="ping"></span>In asta</span></div>
      <div class="cs-meta"><span>${esc(p.team)}</span><span>Qt ${p.qt}</span><span class="m-delta">${deltaSpan(p.diff)}</span><span class="m-fvm">FVM ${p.fvm}</span><span class="m-idx">idx ${p.value}</span><span style="color:var(--neon)">equo ${fairOf(p.key)}</span>${o?`<span style="color:var(--roleA)">già ${o.teamId==='me'?'tuo':'di '+esc(o.teamName)}</span>`:''}</div></div>
      <button class="btn-icon" data-action="call-clear" aria-label="Annulla la chiamata">${icon('x',14)}</button>`;
  }else{wrap.hidden=false;sb.hidden=true;sb.innerHTML=''}
  const t=teamById(call.teamId)||state.teams[0];
  $('callTeams').innerHTML=state.teams.map((x,i)=>{
    const st=teamStats(x),blocked=p?(st.byRole[p.role].filled>=SLOTS[p.role]||st.maxBid<1):false;
    return `<button class="tchip ${x.id==='me'?'me':''} ${x.id===call.teamId?'on':''} ${blocked?'blocked':''}" data-action="call-team" data-team="${x.id}" aria-pressed="${x.id===call.teamId}" aria-label="Aggiudica a ${esc(x.name)}">
      ${i<9?`<span class="tk">${i+1}</span>`:''}<span>${esc(x.id==='me'?'TU':x.name)}</span><span class="tc">${st.residuo}</span></button>`}).join('');
  scrollActiveChip();
  const st=teamStats(t);
  const recCand=p&&REC?(REC.roles.find(r=>r.r===p.role)||{cands:[]}).cands.find(c=>c.p.key===p.key):null;
  $('callQuick').innerHTML=p?[
    `<button class="quick-chip" data-action="call-quick" data-v="${Math.max(1,Math.round(p.qt))}">Qt <b>${Math.max(1,Math.round(p.qt))}</b></button>`,
    recCand&&recCand.bid?`<button class="quick-chip" data-action="call-quick" data-v="${recCand.bid}">Regia <b>${recCand.bid}</b></button>`
      :`<button class="quick-chip" data-action="call-quick" data-v="${fairOf(p.key)}">Equo <b>${fairOf(p.key)}</b></button>`,
    st.maxBid>=1?`<button class="quick-chip" data-action="call-quick" data-v="${st.maxBid}">Max <b>${st.maxBid}</b></button>`:''].join(''):'';
  $('callBuyLabel').textContent=call.teamId==='me'?'AGGIUDICA':'ASSEGNA';
  updateCallHint();renderPresent()}
function updateCallHint(){
  const hint=$('callHint'),btn=$('callBuy'),inp=$('callPrice');
  const p=call.key?state.players.find(x=>x.key===call.key):null;
  btn.classList.remove('caution');inp.classList.remove('risky');
  if(!p){hint.className='c-hint';
    hint.innerHTML=state.players.length?`<kbd>/</kbd> cerca · <kbd>1-9</kbd> squadra · <kbd>←→</kbd> prezzo · <kbd>Invio</kbd> aggiudica`:'Nessun giocatore in memoria';
    btn.disabled=true;return}
  const price=parseInt(inp.value,10),err=validateBuy(call.teamId,p,price);
  if(err){hint.className='c-hint err';hint.textContent=err;btn.disabled=true;return}
  const reasons=guardReasons(call.teamId,p,price);
  const st=teamStats(teamById(call.teamId)),left=st.residuo-price;
  const rr=REC?REC.roles.find(x=>x.r===p.role):null;
  if(reasons&&!guardSkip.has(call.key+':'+price)){
    hint.className='c-hint risk';hint.textContent=reasons[0];btn.classList.add('caution');inp.classList.add('risky');btn.disabled=false;return}
  hint.className='c-hint ok';
  hint.innerHTML=`Tetto rosa <b>${st.maxBid}</b>${rr?` · borsa ${RMETA[rr.r].label.toLowerCase()} <b>${rr.maxBid}</b>`:''} · restano <b>${left}</b>`;
  btn.disabled=false}
function renderSuggest(){
  const q=fold($('callSearch').value.trim());
  if(!state.players.length||!q){closeSuggest();return}
  const own=ownership();
  const scored=state.players.map(p=>{
    const s=fuzzyScore(q,p.name),tc=fold(p.team).includes(q)?600:0;
    return{p,s:Math.max(s,tc),exact:fold(p.name).includes(q)};
  }).filter(x=>x.s>320);
  scored.sort((a,b)=>{
    const oa=own.has(a.p.key)?1:0,ob=own.has(b.p.key)?1:0;
    if(oa!==ob)return oa-ob;
    const ca=a.p.ceduto?1:0,cb=b.p.ceduto?1:0;
    if(ca!==cb)return ca-cb;
    return b.s-a.s||b.p.value-a.p.value});
  sugItems=scored.slice(0,8).map(x=>x.p);
  sugIndex=sugItems.length?0:-1;
  $('callSuggest').innerHTML=sugItems.length?scored.slice(0,8).map((x,i)=>{
    const p=x.p,o=own.get(p.key);
    return `<div class="sg-item ${i===sugIndex?'active':''} ${o?'owned':''}" data-action="suggest-pick" data-key="${esc(p.key)}" role="option" aria-selected="${i===sugIndex}">
      ${avatar(p)}<span class="sg-name">${esc(p.name)}<div class="sg-meta">${esc(p.team)} · Qt ${p.qt} · FVM ${p.fvm}${p.ceduto?' · ceduto':''}</div></span>
      ${!x.exact&&!o?'<span class="sg-fuzzy">≈</span>':''}
      ${o?`<span class="owner-chip ${o.teamId==='me'?'mine':''}">${o.teamId==='me'?'TUA':esc(o.teamName)}</span>`:`<span class="sg-num">equo ${fairOf(p.key)}</span>`}</div>`}).join('')
    :`<div class="sg-item" style="cursor:default;color:var(--faint)">Nessun giocatore trovato</div>`;
  $('callSuggest').classList.add('open')}
function closeSuggest(){$('callSuggest').classList.remove('open');sugItems=[];sugIndex=-1}
function moveSug(d){if(!sugItems.length)return;
  sugIndex=(sugIndex+d+sugItems.length)%sugItems.length;
  [...$('callSuggest').children].forEach((el,i)=>el.classList.toggle('active',i===sugIndex));
  $('callSuggest').children[sugIndex]?.scrollIntoView({block:'nearest'})}
function callStep(d){const inp=$('callPrice');inp.value=Math.max(0,(parseInt(inp.value,10)||0)+d);updateCallHint();play('tick')}
function executeBuy(teamId,key,price){
  const res=buyPlayer(teamId,key,price);
  if(res.err){play('error');vibrate([30,40,30]);toast(esc(res.err),{type:'danger',ico:'warn'});updateCallHint();return false}
  guardSkip.clear();
  return true}
function guardedBuy(teamId,key,price,onOk){
  const p=state.players.find(x=>x.key===key);if(!p)return;
  const reasons=guardReasons(teamId,p,price);
  if(!reasons||guardSkip.has(key+':'+price)){onOk();return}
  play('error');vibrate([25,50,25]);
  openModal({title:'Controllo di sicurezza',danger:true,okLabel:`Aggiudica a ${price} cr`,
    body:`<p><b style="color:var(--ink)">${esc(p.name)}</b> (${RMETA[p.role].one}, ${esc(p.team)}) a <b style="color:var(--warn)">${price} cr</b>. Il modello ha rilevato ${reasons.length} anomali${reasons.length===1?'a':'e'}:</p>
      <div class="guard-reasons">${reasons.map(r=>`<div class="guard-reason">${icon('warn',16)}<span>${esc(r)}</span></div>`).join('')}</div>
      <p style="font-size:12px">Puoi procedere comunque: le conferme si disattivano dalle Regole del tavolo.</p>`,
    onOk:()=>{guardSkip.add(key+':'+price);onOk()}});
}
function doCallBuy(){
  if(!call.key)return;
  const price=parseInt($('callPrice').value,10);
  const err=validateBuy(call.teamId,state.players.find(x=>x.key===call.key),price);
  if(err){play('error');toast(esc(err),{type:'danger',ico:'warn'});updateCallHint();return}
  guardedBuy(call.teamId,call.key,price,()=>{
    if(!executeBuy(call.teamId,call.key,price))return;
    const r=$('callBuy').getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,'#00FF87');
    clearCall();if(window.innerWidth>=640)$('callSearch').focus()});
}

/* ---------- timer ---------- */
const T={running:false,deadline:0,left:0,int:null,lastWhole:null,expired:false};
let wakeLock=null;
async function acquireWake(){
  if(!WAKE_SUPPORTED||!state.settings.wakeLock||!T.running)return;
  if(document.visibilityState!=='visible'||wakeLock)return;
  try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null})}catch(e){wakeLock=null}}
function releaseWake(){if(!wakeLock)return;try{wakeLock.release()}catch(e){}wakeLock=null}
function updateTitle(){
  if(T.expired){document.title='⏱ Tempo scaduto — Asta Maestra';return}
  if(T.running&&call.key){const p=state.players.find(x=>x.key===call.key);
    const s=Math.max(0,Math.ceil(T.left)),m=Math.floor(s/60),ss=String(s%60).padStart(2,'0');
    document.title=`⏱ ${m}:${ss} · ${p?p.name:'Chiamata'} — Asta Maestra`;return}
  document.title=BASE_TITLE}
function paintTimer(){
  const total=Math.max(1,state.settings.timerSec),left=T.expired?0:T.left,frac=clamp(left/total,0,1);
  $('timerRing').style.strokeDashoffset=(125.6*(1-frac)).toFixed(1);
  $('timerTxt').textContent=T.expired?'0':Math.ceil(left);
  const b=$('timerBtn');
  b.classList.toggle('warn',left<=10&&left>5&&T.running);
  b.classList.toggle('crit',left<=5&&T.running);
  b.classList.toggle('done',T.expired);
  renderPresent()}
function resetTimer(){T.left=state.settings.timerSec;T.expired=false;paintTimer()}
function clearExpired(){T.expired=false;$('consoleEl').classList.remove('expired');$('timerBtn').classList.remove('done')}
function timerTick(){
  if(!T.running)return;
  T.left=Math.max(0,(T.deadline-performance.now())/1000);
  const w=Math.ceil(T.left);
  if(w!==T.lastWhole){T.lastWhole=w;if(w===5){play('timer');vibrate(70)}else if(w>0&&w<5)play('timer');updateTitle()}
  paintTimer();if(T.left<=0)expireTimer()}
function startTimer(){
  stopTimer();clearExpired();
  T.running=true;T.left=state.settings.timerSec;
  T.deadline=performance.now()+state.settings.timerSec*1000;
  T.lastWhole=Math.ceil(T.left);paintTimer();updateTitle();acquireWake();
  T.int=setInterval(timerTick,200)}
function stopTimer(){if(T.int){clearInterval(T.int);T.int=null}T.running=false;$('timerBtn').classList.remove('crit');releaseWake()}
function expireTimer(){
  stopTimer();T.left=0;T.expired=true;paintTimer();
  $('consoleEl').classList.add('expired');
  play('buzzer');vibrate([140,90,140,90,240]);updateTitle();
  toast('<b>TEMPO SCADUTO</b> sulla chiamata: decidi o passa la mano.',{type:'danger',ico:'clock',dur:10000});
  announce('Tempo scaduto sulla chiamata')}
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){if(T.running){timerTick();acquireWake()}
    const r=readRec(K.main);if(r&&lastSum&&hashStr(JSON.stringify(r))!==lastSum){remoteAhead=true;renderGuard()}}
  else{releaseWake();persist()}});
addEventListener('pagehide',()=>{stopTimer();persist()});
addEventListener('beforeunload',()=>{stopTimer();persist()});

/* ---------- drawer ---------- */
let drawerKey=null,drawerTeam='me',drawerPrice=null;
function openDrawer(key){drawerKey=key;drawerTeam='me';drawerPrice=null;renderDrawer();
  $('drawer').classList.add('open');$('drawerScrim').classList.add('open');syncLock()}
function closeDrawer(){drawerKey=null;overrideEditKey=null;$('drawer').classList.remove('open');$('drawerScrim').classList.remove('open');syncLock()}
function renderDrawer(){
  if(!drawerKey)return;
  const p=state.players.find(x=>x.key===drawerKey);if(!p){closeDrawer();return}
  const o=ownership().get(p.key),planned=state.plan.some(x=>x.key===p.key);
  const rr=REC?REC.roles.find(x=>x.r===p.role):null;
  const rc=rr?rr.cands.find(c=>c.p.key===p.key):null;
  $('drawerHead').innerHTML=`${avatar(p)}<div class="dh-info"><h3>${esc(p.name)} ${tierTag(p)}</h3>
    <div class="dh-team">${roleBadge(p.role)}<span>${esc(p.team)}</span>${mantraHTML(p)}${p.deal?'<span class="deal-chip">AFFARE</span>':''}${p.ceduto?'<span class="ced-chip">CEDUTO</span>':''}${p.fid?`<span class="chip st-2">Id ${esc(p.fid)}</span>`:''}</div></div>
    <button class="btn-icon ${planned?'starred':''}" data-action="plan-toggle" data-key="${esc(p.key)}" aria-label="Radar obiettivi">${icon('star',15)}</button>
    <button class="btn-icon" data-action="drawer-close" aria-label="Chiudi la scheda">${icon('x',16)}</button>`;
  const dc=(p.diff||0)>0?'up':(p.diff||0)<0?'down':'';
  let b=`<div class="stat-grid">
    <div class="stat-cell"><div class="sv gold">${p.qt}</div><div class="sl">Qt.A</div></div>
    <div class="stat-cell"><div class="sv">${p.qti}</div><div class="sl">Qt.I</div></div>
    <div class="stat-cell"><div class="sv ${dc}">${p.diff>0?'+':''}${p.diff}</div><div class="sl">Trend</div></div>
    <div class="stat-cell"><div class="sv gold">${p.fvm}</div><div class="sl">FVM</div></div></div>
    <div class="d-section"><div class="ds-title">${icon('trend',13)} Quotazione: inizio → attuale</div>${quoteTrackSVG(p)}</div>
    <div class="d-section"><div class="ds-title">${icon('chart',13)} Valore di mercato nel ruolo</div>${fvmBarSVG(p)}</div>`;
  if(rr&&!o){
    b+=`<div class="d-section"><div class="ds-title">${icon('radar',13)} Lettura della regia · ${RMETA[rr.r].label}</div>
      <div class="bid-box"><div class="bid-meta"><span>Borsa <b>${rr.purse} cr</b></span><span>Bid max <b>${rr.maxBid} cr</b></span><span>Contendenti <b>${rr.contenderList.length}</b></span></div>
      ${rc?`<div class="value-line" style="margin-bottom:8px"><b class="num" style="color:var(--neon);font-size:18px">${rc.bid} cr</b>
        <span>consigliato · apertura ${rc.opening} · tetto ${rc.ceiling} · fit ${Math.round(rc.fit)}/100</span></div>
        <div class="reason-row">${reasonHTML(rc.reasons)}</div>`
        :`<p class="d-note" style="font-style:normal">${rr.cands.length?'Il motore preferisce '+esc(rr.cands[0].p.name)+' a '+rr.cands[0].bid+' cr.':'Nessun candidato migliore disponibile.'}</p>`}
      </div></div>`}
  if(p.fm!=null||p.apps!=null||p.goals!=null){
    b+=`<div class="d-section"><div class="ds-title">${icon('shirt',13)} Statistiche dal file</div><div class="stat-grid">
      ${p.fm!=null?`<div class="stat-cell"><div class="sv">${p.fm.toFixed(2)}</div><div class="sl">Fantamedia</div></div>`:''}
      ${p.apps!=null?`<div class="stat-cell"><div class="sv">${p.apps}</div><div class="sl">Presenze</div></div>`:''}
      ${p.goals!=null?`<div class="stat-cell"><div class="sv">${p.goals}</div><div class="sl">Gol</div></div>`:''}
      ${p.assists!=null?`<div class="stat-cell"><div class="sv">${p.assists}</div><div class="sl">Assist</div></div>`:''}</div></div>`}
  b+=`<div class="d-section"><div class="ds-title">${icon('target',13)} Valutazione
      <button class="link-btn ds-act" data-action="override-${p.override!=null?'reset':'edit'}" data-key="${esc(p.key)}">${p.override!=null?'Ripristina modello':'Forza valore'}</button></div>
      ${overrideEditKey===p.key?`<div class="override-row"><label for="overrideVal">Indice 1–100</label>
        <input class="inp" id="overrideVal" type="number" min="1" max="100" step="1" value="${p.override!=null?p.override:p.value}" aria-label="Indice forzato per ${esc(p.name)}">
        <button class="btn btn-gold btn-sm" data-action="override-save" data-key="${esc(p.key)}">Salva</button>
        <button class="btn btn-ghost btn-sm" data-action="override-cancel">Annulla</button></div>`:''}
      <div class="value-line"><span class="idx-bar"><i style="width:${p.value}%"></i></span><b class="num" style="color:var(--ink)">${p.value}/100</b>
      <span>· prezzo equo <b class="num" style="color:var(--neon)">${fairOf(p.key)} cr</b></span>${p.override!=null?'<span class="chip st-2">FORZATO</span>':''}</div>
      ${p.mantra&&p.mantra.length?`<p class="d-note">Mantra: ${p.mantra.map(m=>esc(m)+' ('+(MANTRA_LABEL[m]||m)+')').join(' · ')}</p>`:''}</div>`;
  if(o){
    const t=teamById(o.teamId),ratio=(o.entry.fair||o.price)>0?o.price/(o.entry.fair||o.price):1;
    b+=`<div class="owned-panel ${o.teamId==='me'?'mine':''}"><div class="op-t">${o.teamId==='me'?'Nella tua rosa':'Acquistato da'} <b style="color:var(--ink)">${esc(t.name)}</b></div>
      <div class="op-price">${o.price} cr</div>
      <p style="font-size:11.5px;color:var(--muted);margin-bottom:10px">Equo all'acquisto: ${o.entry.fair||o.price} cr · ${ratio<.85?'<span class="deal-chip">AFFARE</span>':ratio>1.18?'<span class="over-chip">SOPRA MERCATO</span>':'in linea'}</p>
      <button class="btn btn-flare btn-sm" data-action="drawer-release" data-team="${o.teamId}" data-key="${esc(p.key)}">${icon('undo',14)} Svincola (+${o.price} cr)</button></div>`;
  }else{
    const t=teamById(drawerTeam)||state.teams[0],st=teamStats(t),sug=(rc&&rc.bid)||myBid(p,t.id)||Math.max(1,Math.round(p.qt));
    if(drawerPrice==null)drawerPrice=Math.min(sug,Math.max(1,st.maxBid||sug));
    b+=`<div class="d-section"><div class="ds-title">${icon('gavel',13)} Aggiudicazione</div><div class="bid-box">
      <div class="bid-meta"><span>Tetto: <b>${st.maxBid} cr</b></span><span>Consigliato: <b>${sug||'—'}</b></span></div>
      <div class="field" style="margin-bottom:9px"><label for="drawerTeamSel">Aggiudica a</label>
        <select class="inp" id="drawerTeamSel" data-change="drawer-team">${state.teams.map(x=>{const xs=teamStats(x);
          return `<option value="${x.id}" ${x.id===t.id?'selected':''}>${esc(x.name)} · ${xs.residuo} cr · ${xs.byRole[p.role].filled}/${SLOTS[p.role]} ${p.role}</option>`}).join('')}</select></div>
      <div class="price-stepper"><button class="btn-icon" data-action="price-step" data-d="-1" aria-label="Riduci">${icon('minus',16)}</button>
        <input id="drawerPrice" inputmode="numeric" value="${drawerPrice}" data-change="drawer-price" aria-label="Prezzo">
        <button class="btn-icon" data-action="price-step" data-d="1" aria-label="Aumenta">${icon('plus',16)}</button></div>
      <div class="quick-chips"><button class="quick-chip" data-action="price-set" data-v="${Math.max(1,Math.round(p.qt))}">Qt ${Math.max(1,Math.round(p.qt))}</button>
        ${rc&&rc.bid?`<button class="quick-chip" data-action="price-set" data-v="${rc.bid}">Regia ${rc.bid}</button>`:''}
        <button class="quick-chip" data-action="price-set" data-v="${fairOf(p.key)}">Equo ${fairOf(p.key)}</button>
        ${st.maxBid>=1?`<button class="quick-chip" data-action="price-set" data-v="${st.maxBid}">Max ${st.maxBid}</button>`:''}</div>
      <div class="bid-hint" id="bidHint"></div>
      <button class="btn btn-gold" id="drawerBuyBtn" data-action="drawer-buy" style="width:100%">${icon('gavel',15)} Aggiudica</button>
      <button class="btn btn-ghost btn-sm" data-action="drawer-call" data-key="${esc(p.key)}" style="width:100%;margin-top:8px">${icon('keyboard',14)} Usa la console rapida</button>
    </div></div>`}
  b+=`<div class="d-section notes-area"><div class="ds-title">${icon('edit',13)} Note personali</div>
    <textarea class="inp" data-notes="${esc(p.key)}" placeholder="Appunti d'asta…" aria-label="Note su ${esc(p.name)}">${esc(p.notes||'')}</textarea></div>`;
  $('drawerBody').innerHTML=b;updateBidHint()}
function updateBidHint(){
  const h=$('bidHint'),btn=$('drawerBuyBtn');if(!h||!btn||!drawerKey)return;
  const p=state.players.find(x=>x.key===drawerKey);if(!p)return;
  const price=parseInt($('drawerPrice').value,10),err=validateBuy(drawerTeam,p,price);
  if(err){h.className='bid-hint err';h.textContent=err;btn.disabled=true;return}
  const reasons=guardReasons(drawerTeam,p,price);
  if(reasons){h.className='bid-hint err';h.textContent='Controllo: '+reasons[0];btn.disabled=false;return}
  const st=teamStats(teamById(drawerTeam));h.className='bid-hint ok';
  h.textContent=`Resterebbero ${st.residuo-price} cr e ${st.empty-1} slot.`;btn.disabled=false}

/* ---------- eventi ---------- */
const sel=new Set();let editingKey=null,dragInfo=null,planDrag=null,overrideEditKey=null;
const debMarket=debounce(()=>{state.ui.limit=60;renderMarket();save()},120);
const debHeavy=debounce(()=>{renderAll()},110);
const debRec=debounce(()=>{REC=buildRec();renderRec();renderAdvisor();renderAnalysis();renderConsole();save()},70);
const debNames=debounce(()=>{renderAll()},220);
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');if(!el)return;
  const a=el.dataset.action,key=el.dataset.key;
  switch(a){
    case 'sound':state.settings.sound=!state.settings.sound;renderSoundBtn();save();if(state.settings.sound)play('tick');
      toast(state.settings.sound?'Audio attivo.':'Audio silenziato.',{type:'info',ico:state.settings.sound?'soundOn':'soundOff',dur:2200});break;
    case 'choose':if(!busy)$('fileInput').click();break;
    case 'clear-import-error':importError='';renderImportError();break;
    case 'toggle-paste':{$('pasteBox').classList.toggle('hidden');
      if(!$('pasteBox').classList.contains('hidden'))$('pasteCsv').focus();play('tick');break}
    case 'paste-clear':$('pasteCsv').value='';importError='';renderImportError();$('pasteCsv').focus();play('tick');break;
    case 'paste-import':importPastedCSV();break;
    case 'template':download('template-listone-fantacalcio.csv',TEMPLATE_CSV,'text/csv;charset=utf-8');play('pop');
      toast('Template CSV scaricato.',{type:'info',ico:'download',dur:3500});break;
    case 'print':window.print();break;
    case 'backup-now':case 'backup-before-reset':doBackup(false);break;
    case 'sync-signin':doSync('signin');break;
    case 'sync-signup':doSync('signup');break;
    case 'sync-signout':doSync('signout');break;
    case 'sync-push':doSync('push');break;
    case 'sync-pull':doSync('pull');break;
    case 'install-app':if(!deferredInstall)break;
      deferredInstall.prompt();deferredInstall.userChoice.then(({outcome})=>{
        if(outcome==='accepted')toast('App installata sul dispositivo.',{type:'ok',ico:'check'});
        deferredInstall=null;renderInstallBtn()});break;
    case 'import-json':$('importFile').click();break;
    case 'reload-store':reloadFromStore();break;
    case 'guard-dismiss':guardDismissed=true;renderGuard();break;
    case 'exit-fresh':location.href=location.href.split('?')[0]+location.hash;break;
    case 'present-toggle':togglePresent();break;
    case 'present-theme':presentTheme=presentTheme==='light'?'dark':'light';
      try{localStorage.setItem('astamaestra_present_theme',presentTheme)}catch(e){}
      applyPresentTheme();play('tick');break;
    case 'cheat-print':{
      if(!state.players.length){play('error');toast('Importa prima il listone.',{type:'info',ico:'info',dur:3000});break}
      renderCheatSheet();document.body.classList.add('printing-cheat');
      setTimeout(()=>window.print(),60);play('pop');break}
    case 'league-report':{
      if(!renderLeagueReport()){play('error');toast('Registra prima qualche acquisto per generare il report.',{type:'info',ico:'info',dur:3000});break}
      document.body.classList.add('printing-league');setTimeout(()=>window.print(),60);play('pop');break}
    case 'firststeps-names':$('leagueNameInput').scrollIntoView({block:'center'});$('leagueNameInput').focus();play('tick');break;
    case 'firststeps-import':{const t=$('listone');if(t)t.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>$('fileInput').click(),320);play('tick');break}
    case 'firststeps-hide':state.ui.hideSteps=true;setupSig='';commit();renderFirstSteps();play('tick');break;
    case 'pulse-hide':state.ui.hidePulse=true;commit();renderPulse();play('tick');
      toast('Stato asta nascosto. Lo riattivi in Sistema → Impostazioni.',{type:'info',ico:'info',dur:3200});break;
    case 'guard-ignore':remoteAhead=false;renderGuard();toast('Continui da questa scheda: i dati dell\'altra verranno sovrascritti al prossimo salvataggio.',{type:'info',ico:'warn',dur:5000});break;
    case 'prune-snaps':{const n=snaps.length;snaps=snaps.slice(0,3);writeSnaps(snaps);renderSystem();play('pop');
      toast(`${Math.max(0,n-3)} snapshot rimossi, memoria liberata.`,{type:'ok',ico:'trash',dur:3500});break}
    case 'audit-run':AUDIT=runAudit();renderSystem();play('tick');
      toast(AUDIT.length?`Audit completato: ${AUDIT.length} segnalazioni.`:'Audit completato: tutto coerente.',{type:AUDIT.some(x=>x.sev==='err')?'danger':'ok',ico:'shield',dur:3500});break;
    case 'audit-fix':applyFix(el.dataset.fix,el.dataset.key,el.dataset.team);break;
    case 'snap-restore':{const i=+el.dataset.i,sn=snaps[i];if(!sn)break;
      openModal({title:'Ripristinare questo punto?',okLabel:'Ripristina',
        body:`<p>Torni a <b>${esc(sn.label||'snapshot')}</b> delle ${hhmm(sn.at)} (${sn.buys} acquisti in lega). Il listone attuale resta invariato. L'operazione è annullabile e crea a sua volta uno snapshot.</p>`,
        onOk:()=>{const rebuilt=rebuildFromSnap(sn);
          if(!rebuilt){play('error');toast('Snapshot non ripristinabile.',{type:'danger',ico:'warn'});return}
          pushSnap('Prima del ripristino');
          state=rebuilt;computeValues(state.players);relinkRoster(state.players);
          commit('Ripristino snapshot');sel.clear();setupSig='';clearCall();closeDrawer();
          renderTeamFilter();renderMantraFilter();renderAll();play('cash');
          toast('Punto d\'asta ripristinato.',{type:'ok',ico:'history',undoIdx:hIndex,dur:6000})}});break}
    case 'open':openDrawer(key);break;
    case 'call-open':loadCall(key,'me');break;
    case 'call-assign':loadCall(key,state.teams[1]?state.teams[1].id:'me');break;
    case 'recall':loadCall(key,el.dataset.team,+el.dataset.price);break;
    case 'rec-call':{const bid=parseInt(el.dataset.bid,10)||null;loadCall(key,'me',bid);
      const p=state.players.find(x=>x.key===key);
      if(p)toast(`Chiamata caricata: <b>${esc(p.name)}</b> a <b>${bid||''}</b> cr.`,{type:'info',ico:'gavel',dur:3200});break}
    case 'rec-radar':{const max=parseInt(el.dataset.max,10)||fairOf(key);planAdd(key,max);
      const p=state.players.find(x=>x.key===key);
      if(p)toast(`<b>${esc(p.name)}</b> nel radar con tetto <b>${max} cr</b>.`,{type:'ok',ico:'star',undoIdx:hIndex,dur:3200});break}
    case 'plan-call':{const it=state.plan.find(x=>x.key===key);loadCall(key,'me',it?it.max:null);break}
    case 'plan-toggle':planToggle(key);if(drawerKey===key)renderDrawer();break;
    case 'sel':break;
    case 'f-role':state.ui.role=el.dataset.role;state.ui.limit=60;state.ui.view=null;renderMarket();save();play('tick');break;
    case 'sort':{const s=el.dataset.sort;
      if(state.ui.sort===s)state.ui.dir=state.ui.dir==='asc'?'desc':'asc';else{state.ui.sort=s;state.ui.dir=s==='name'?'asc':'desc'}
      $('sortSelect').value=state.ui.sort;renderMarket();save();break}
    case 'sort-dir':state.ui.dir=state.ui.dir==='asc'?'desc':'asc';renderMarket();save();break;
    case 'more':state.ui.limit+=60;renderMarket();break;
    case 'clear-filters':Object.assign(state.ui,baseUI());syncFilterInputs();renderMarket();save();break;
    case 'view-apply':{const v=state.views.find(x=>x.name===el.dataset.view);if(!v)break;
      Object.assign(state.ui,clone(v.f),{limit:60,view:v.name});syncFilterInputs();renderMarket();save();play('tick');break}
    case 'view-reset':Object.assign(state.ui,baseUI());syncFilterInputs();renderMarket();save();break;
    case 'view-del':{const n=el.dataset.view;state.views=state.views.filter(v=>v.name!==n);
      if(state.ui.view===n)state.ui.view=null;commit();renderViews();toast(`Vista "${esc(n)}" eliminata.`,{type:'info',ico:'trash',undoIdx:hIndex,dur:3500});break}
    case 'view-save-open':$('saveViewForm').classList.add('open');$('saveViewName').focus();break;
    case 'view-save-close':$('saveViewForm').classList.remove('open');break;
    case 'view-save-ok':{const n=$('saveViewName').value.trim();
      if(!n){play('error');break}
      if(state.views.some(v=>v.name===n)){play('error');toast('Nome vista già usato.',{type:'danger',ico:'warn',dur:3000});break}
      const{q,role,team,mantra,market,affari,sort,dir}=state.ui;
      state.views.push({name:n,f:{q,role,team,mantra,market,affari,sort,dir}});state.ui.view=n;
      $('saveViewName').value='';$('saveViewForm').classList.remove('open');commit();renderViews();play('pop');
      toast(`Vista "<b>${esc(n)}</b>" salvata.`,{type:'ok',ico:'check',dur:3000});break}
    case 'bulk-assign':assignBulk($('bulkTeam').value);break;
    case 'bulk-plan':{[...sel].forEach(k=>{if(!state.plan.some(x=>x.key===k))state.plan.push({key:k,max:Math.max(1,fairOf(k))})});
      sel.clear();commit();renderAll();play('tick');toast('Selezionati aggiunti al radar.',{type:'ok',ico:'star',undoIdx:hIndex,dur:3200});break}
    case 'bulk-clear':sel.clear();renderMarket();break;
    case 'rosa-edit':editingKey=key;renderRosa();break;
    case 'rosa-del':releasePlayer('me',key);break;
    case 'rosa-up':moveInRole(key,-1);break;
    case 'rosa-down':moveInRole(key,1);break;
    case 'rival-del':releasePlayer(el.dataset.team,key);break;
    case 'teams-step':setTeamCount(state.teams.length+(+el.dataset.d));break;
    case 'rec-preset':{const pr=REC_PRESETS[el.dataset.p];if(!pr)break;
      state.settings.rec={...pr};commit();renderAll();play('pop');
      toast(`Preset <b>${esc(el.dataset.p)}</b> applicato.`,{type:'ok',ico:'sliders',undoIdx:hIndex,dur:3500});break}
    case 'rec-reset':state.settings.rec={...REC_DEFAULT};commit();renderAll();play('pop');
      toast('Pesi del motore ripristinati.',{type:'info',ico:'undo',undoIdx:hIndex,dur:3000});break;
    case 'reset-names':openModal({title:'Svuotare i nomi?',okLabel:'Svuota',
      body:'<p>Nome della lega e delle squadre vengono cancellati. Acquisti e budget restano intatti. Annullabile.</p>',
      onOk:()=>{state.teams.forEach(t=>t.name='');state.myName='';state.leagueName='';setupSig='';
        commit('Nomi svuotati');renderAll();play('pop');toast('Nomi svuotati.',{type:'info',ico:'users',undoIdx:hIndex})}});break;
    case 'drawer-close':closeDrawer();break;
    case 'override-edit':overrideEditKey=el.dataset.key;renderDrawer();$('overrideVal')?.focus();break;
    case 'override-cancel':overrideEditKey=null;renderDrawer();break;
    case 'override-save':{
      const p=state.players.find(x=>x.key===el.dataset.key);if(!p)break;
      const v=Math.round(Number($('overrideVal')?.value));
      if(!Number.isFinite(v)||v<1||v>100){play('error');toast('Inserisci un indice tra 1 e 100.',{type:'danger',ico:'warn'});break}
      p.override=v;overrideEditKey=null;commit(`Valore forzato: ${p.name} = ${v}`);
      renderAll();if(drawerKey)renderDrawer();play('tick');
      toast(`${p.name}: indice forzato a ${v}. Regia aggiornata.`,{type:'ok',ico:'target',undoIdx:hIndex});break}
    case 'override-reset':{
      const p=state.players.find(x=>x.key===el.dataset.key);if(!p)break;
      delete p.override;overrideEditKey=null;commit(`Ripristino valore: ${p.name}`);
      renderAll();if(drawerKey)renderDrawer();play('pop');
      toast(`${p.name}: tornato al calcolo del modello.`,{type:'info',ico:'undo',undoIdx:hIndex});break}
    case 'drawer-call':closeDrawer();loadCall(key,'me');break;
    case 'price-step':{const i=$('drawerPrice');if(!i)break;i.value=Math.max(1,(parseInt(i.value,10)||0)+(+el.dataset.d));drawerPrice=i.value;updateBidHint();play('tick');break}
    case 'price-set':{const i=$('drawerPrice');if(!i)break;i.value=el.dataset.v;drawerPrice=i.value;updateBidHint();play('tick');break}
    case 'drawer-buy':{const p=state.players.find(x=>x.key===drawerKey);if(!p)break;
      const price=parseInt($('drawerPrice').value,10);
      const err=validateBuy(drawerTeam,p,price);
      if(err){play('error');toast(esc(err),{type:'danger',ico:'warn'});updateBidHint();break}
      guardedBuy(drawerTeam,p.key,price,()=>{
        if(!executeBuy(drawerTeam,p.key,price))return;
        const r=$('drawerBuyBtn')?.getBoundingClientRect();
        if(r)burst(r.left+r.width/2,r.top+r.height/2,RMETA[p.role].hex);
        drawerPrice=null;renderDrawer()});break}
    case 'drawer-release':releasePlayer(el.dataset.team,key);break;
    case 'call-step':callStep(+el.dataset.d);break;
    case 'call-quick':$('callPrice').value=el.dataset.v;updateCallHint();play('tick');break;
    case 'call-team':call.teamId=el.dataset.team;clearExpired();renderConsole();play('tick');break;
    case 'call-clear':clearCall();if(!$('callSearch').disabled&&window.innerWidth>=640)$('callSearch').focus();break;
    case 'call-buy':doCallBuy();break;
    case 'suggest-pick':{const p=state.players.find(x=>x.key===key);
      if(p&&!ownership().has(p.key))loadCall(key,call.teamId);else play('error');break}
    case 'timer-toggle':if(T.running){stopTimer();paintTimer();updateTitle()}else startTimer();break;
    case 'undo':undo();break;
    case 'redo':redo();break;
    case 'shortcuts':openModal({title:'Scorciatoie da tastiera',hideOk:true,body:`<div class="keys-grid">
      ${[['/','Cerca e chiama'],['1…9','Scegli la squadra (1 = tu)'],['← →','Prezzo −1 / +1'],['Shift+← →','Prezzo −5 / +5'],
        ['Q','Prezzo = quotazione'],['F','Prezzo = equo'],['M','Prezzo = tetto'],['Invio','Aggiudica'],
        ['Esc','Annulla / chiudi'],['Ctrl+Z','Annulla'],['Ctrl+Y','Ripristina'],['Ctrl+S','Backup su file'],['T','Timer avvia/pausa'],['P','Presentazione a schermo intero'],['Ctrl+K','Nuova chiamata']]
        .map(([k,d])=>`<div class="key-row"><kbd>${esc(k)}</kbd><span>${esc(d)}</span></div>`).join('')}</div>
      <p style="margin:0">La ricerca tollera refusi e abbreviazioni: <b>mctom</b>, <b>thuram</b>, <b>paz</b> trovano subito il giocatore giusto.</p>`});break;
    case 'wiz-sheet':{if(!wiz)break;const i=+el.dataset.i;wiz.sheetIdx=i;
      const d=detectHeader(wiz.sheets[i].rows);wiz.headerRow=Math.max(0,d.row);wiz.map={...d.map};renderWizard();play('tick');break}
    case 'balance-split':applyFix('balance');break;
    case 'export-rosa':{const me=state.teams[0];
      if(!me.players.length){play('error');toast('Rosa vuota: niente da esportare.',{type:'info',ico:'info',dur:3000});break}
      const rows=['Ruolo,Nome,Squadra,Prezzo,Qt.A,Qt.I,Diff,FVM,Indice,Equo'];
      ROLES.forEach(r=>me.players.filter(p=>p.role===r).forEach(p=>rows.push(`${r},"${p.name.replace(/"/g,'""')}",${p.team},${p.price},${p.qt},${p.qti??''},${p.diff??''},${p.fvm??''},${p.value??''},${p.fair??''}`)));
      download('rosa-asta.csv','\uFEFF'+rows.join('\n'),'text/csv;charset=utf-8');play('pop');
      toast(`Rosa esportata (${me.players.length} giocatori).`,{type:'ok',ico:'download',dur:3000});break}
    case 'reset-asta':openModal({title:'Azzerare l\u2019asta?',danger:true,okLabel:'Azzera asta',
      body:'<p>Rose, acquisti, radar e tabellone tornano vuoti. <b>Listone e nomi restano.</b> Viene creato uno snapshot del punto attuale.</p>',
      onOk:()=>{pushSnap('Prima dell\'azzeramento');
        state.teams.forEach(t=>t.players=[]);state.plan=[];state.recent=[];state.seq=0;state.sinceBackup=0;
        state.log=[{t:Date.now(),type:'sys',text:'Asta azzerata · listone conservato'}];
        sel.clear();clearCall();closeDrawer();commit('Asta azzerata');renderAll();play('gavel');
        toast('Asta azzerata: budget pieni, listone pronto.',{type:'gold',ico:'gavel',undoIdx:hIndex,dur:7000})}});break;
    case 'reset-all':openModal({title:'Cancellare tutto?',danger:true,okLabel:'Cancella tutto',
      body:'<p>Rimuove <b>anche il listone</b>, nomi, viste e impostazioni. Uno snapshot del punto attuale viene comunque conservato.</p>'+
        '<div class="data-actions mt10"><button type="button" class="btn btn-gold btn-sm" data-action="backup-before-reset"><span data-ico="download" data-ico-size="14"></span>Scarica un backup prima di cancellare</button></div>',
      onOk:()=>{pushSnap('Prima della cancellazione');
        state=freshState();sel.clear();setupSig='';importError='';clearCall();closeDrawer();
        commit('Sessione azzerata');renderTeamFilter();renderMantraFilter();syncFilterInputs();renderAll();play('thud');
        toast('Sessione azzerata.',{type:'info',ico:'trash',undoIdx:hIndex,dur:7000})}});break;
    case 'modal-ok':{const fn=modalOk;closeModal();if(fn)fn();else syncLock();break}
    case 'modal-cancel':cancelModal();break}});
document.addEventListener('change',e=>{
  const el=e.target,c=el.dataset.change;
  if(el.dataset.wiz&&wiz){
    const w=el.dataset.wiz;
    if(w==='header'){wiz.headerRow=+el.value;const d=detectHeader(wiz.sheets[wiz.sheetIdx].rows);
      if(d.row===wiz.headerRow)wiz.map={...d.map}}
    else if(w==='map'){const v=+el.value;if(v<0)delete wiz.map[el.dataset.field];else wiz.map[el.dataset.field]=v}
    else if(w==='all')wiz.allSheets=el.checked;
    else if(w==='ced')wiz.ceduti=el.checked;
    else if(w==='mode')wiz.mode=el.value;
    renderWizard();return}
  if(el.dataset.rec){const k=el.dataset.rec;
    state.settings.rec[k]=el.type==='checkbox'?el.checked:+el.value;
    commit();REC=buildRec();renderRec();renderAdvisor();renderAnalysis();renderConsole();return}
  if(el.dataset.set==='teams'){setTeamCount(+el.value);
    el.value=state.teams.length;el.style.setProperty('--fill',((state.teams.length-6)/6*100)+'%');$('outTeams').textContent=state.teams.length;return}
  if(el.dataset.set||el.dataset.split){save();return}
  switch(c){
    case 'f-team':state.ui.team=el.value;state.ui.limit=60;state.ui.view=null;renderMarket();save();break;
    case 'f-mantra':state.ui.mantra=el.value;state.ui.limit=60;state.ui.view=null;renderMarket();save();break;
    case 'f-market':state.ui.market=el.value;state.ui.limit=60;state.ui.view=null;renderMarket();save();break;
    case 'f-sort':state.ui.sort=el.value;renderMarket();save();break;
    case 'f-affari':state.ui.affari=el.checked;state.ui.limit=60;state.ui.view=null;renderMarket();save();break;
    case 'sel':{const k=el.dataset.key;if(el.checked)sel.add(k);else sel.delete(k);renderMarket();break}
    case 'sel-all':{const{shown}=marketVMs();
      if(el.checked)shown.forEach(v=>sel.add(v.p.key));else shown.forEach(v=>sel.delete(v.p.key));renderMarket();break}
    case 'formation':state.settings.formation=el.value;commit();renderAll();play('tick');
      toast(`Modulo ${FORMATIONS[el.value].label}: pitch e priorità ricalcolati.`,{type:'info',ico:'shirt',dur:3000});break;
    case 'strategy':state.settings.strategy=el.value;commit();renderAll();play('tick');break;
    case 'trend':state.settings.trend=el.checked;commit();renderAll();play('tick');break;
    case 'hidePulse':state.ui.hidePulse=!el.checked;commit();renderPulse();play('tick');break;
    case 'syncAuto':syncAuto=el.checked;
      try{localStorage.setItem('astamaestra_sync_auto',syncAuto?'1':'0')}catch(e){}
      if(syncAuto)scheduleSyncPush();break;
    case 'confirms':state.settings.confirms=el.checked;commit();renderAll();
      toast(el.checked?'Conferme di sicurezza attive sui prezzi anomali.':'Conferme disattivate: gli acquisti partono immediati.',{type:el.checked?'ok':'info',ico:'shield',dur:3500});break;
    case 'autoBackup':state.settings.autoBackup=el.checked;commit();renderSystem();break;
    case 'autoBackupEvery':state.settings.autoBackupEvery=+el.value;commit();renderSystem();break;
    case 'timerOn':state.settings.timerOn=el.checked;if(!el.checked){stopTimer();resetTimer();updateTitle()}commit();renderSystem();break;
    case 'timerSec':state.settings.timerSec=+el.value;if(!T.running)resetTimer();commit();renderSystem();break;
    case 'wakeLock':state.settings.wakeLock=el.checked;if(el.checked)acquireWake();else releaseWake();save();break;
    case 'leagueName':state.leagueName=cleanName(el.value);commit();renderAll();break;
    case 'myName':state.myName=cleanName(el.value);state.teams[0].name=state.myName;setupSig='';commit();renderAll();break;
    case 'budgetNum':{const v=clamp(parseInt(el.value,10)||500,50,5000);state.settings.budget=v;commit();renderAll();play('tick');break}
    case 'teamname':{const t=teamById(el.dataset.team);if(t){const v=cleanName(el.value);
      if(t.id==='me')state.myName=v;else t.name=v;commit();renderAll()}break}
    case 'price-commit':if(editingKey){const k=editingKey;editingKey=null;editPrice('me',k,parseInt(el.value,10))}break;
    case 'plan-max':planSetMax(el.dataset.key,parseInt(el.value,10));break;
    case 'drawer-team':drawerTeam=el.value;drawerPrice=null;renderDrawer();break;
    case 'drawer-price':drawerPrice=el.value;updateBidHint();break}});
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.id==='callSearch'){renderSuggest();return}
  if(el.id==='callPrice'){updateCallHint();return}
  if(el.id==='searchInput'){state.ui.q=el.value;state.ui.view=null;debMarket();return}
  if(el.id==='drawerPrice'){drawerPrice=el.value;updateBidHint();return}
  if(el.dataset.change==='teamname'){const t=teamById(el.dataset.team);
    if(t){const v=el.value;if(t.id==='me')state.myName=v;else t.name=v;
      state.teams[0].name=state.myName;debNames()}return}
  if(el.dataset.change==='leagueName'){state.leagueName=el.value;debNames();return}
  if(el.dataset.rec){const k=el.dataset.rec,v=+el.value;state.settings.rec[k]=v;
    el.style.setProperty('--fill',((v-el.min)/(el.max-el.min)*100)+'%');
    const R=state.settings.rec;
    $('outAggr').textContent=R.aggression.toFixed(2)+'×';$('outUrg').textContent=R.urgencyW+'%';
    $('outPress').textContent=R.pressureW+'%';$('outVal').textContent=R.valueW+'%';
    $('outBorrow').textContent=R.borrow+'%';$('outRun').textContent=R.runWindow+' chiamate';
    $('outTop').textContent=R.topThreshold;$('outDepth').textContent=R.depthTarget+(R.depthTarget===1?' riserva':' riserve');
    debRec();return}
  if(el.dataset.set){const k=el.dataset.set,v=+el.value;
    el.style.setProperty('--fill',((v-el.min)/(el.max-el.min)*100)+'%');
    if(k==='teams'){$('outTeams').textContent=v;return}
    state.settings[k]=v;
    if(k==='budget')$('outBudget').textContent=fmt(v)+' cr';
    if(k==='reserve')$('outReserve').textContent=v+' cr';
    debHeavy();return}
  if(el.dataset.split){const r=el.dataset.split;state.settings.split[r]=+el.value;
    el.style.setProperty('--fill',((el.value-el.min)/(el.max-el.min)*100)+'%');
    $('outSplit'+r).textContent=el.value+'%';debHeavy();return}});
document.addEventListener('focusout',e=>{
  const d=e.target.dataset||{};
  if(d.notes){const p=state.players.find(x=>x.key===d.notes);if(p){p.notes=e.target.value;save()}}
  if(d.change==='price-commit'&&editingKey){const k=editingKey;editingKey=null;editPrice('me',k,parseInt(e.target.value,10))}
  if(d.change==='teamname'&&!e.target.value.trim()){
    const t=teamById(d.team);
    if(t){if(t.id==='me')state.myName='';else t.name='';renderAll()}}
  if(e.target.id==='callSearch')setTimeout(()=>{if(!document.activeElement?.closest?.('#callSuggest'))closeSuggest()},160)});
$('callSearch').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();moveSug(1)}
  else if(e.key==='ArrowUp'){e.preventDefault();moveSug(-1)}
  else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();
    const p=sugItems[sugIndex];if(p&&!ownership().has(p.key))loadCall(p.key,call.teamId);else play('error')}
  else if(e.key==='Escape'){e.stopPropagation();closeSuggest();e.target.blur()}});
document.addEventListener('keydown',e=>{
  const ae=document.activeElement,tag=ae?.tagName,typing=['INPUT','TEXTAREA','SELECT'].includes(tag);
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();doBackup(false);return}
  if(e.key==='Escape'){
    if(presentOn){togglePresent(false);return}
    if($('modalWrap').classList.contains('open'))cancelModal();
    else if(drawerKey)closeDrawer();
    else if(editingKey){editingKey=null;renderRosa()}
    else if(call.key){clearCall();if(!$('callSearch').disabled&&window.innerWidth>=640)$('callSearch').focus()}
    syncLock();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){if(typing&&ae.id!=='callPrice')return;e.preventDefault();undo();return}
  if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.shiftKey&&e.key.toLowerCase()==='z'))){e.preventDefault();redo();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();clearCall();if(!$('callSearch').disabled)$('callSearch').focus();return}
  if(typing){
    if(e.key==='Enter'&&ae.id==='callPrice'){e.preventDefault();doCallBuy()}
    if(e.key==='Enter'&&ae.id==='drawerPrice'){e.preventDefault();$('drawerBuyBtn')?.click()}
    if(e.key==='Enter'&&ae.id==='saveViewName'){e.preventDefault();document.querySelector('[data-action="view-save-ok"]')?.click()}
    return}
  if(e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();togglePresent();return}
  if(e.key==='/'){e.preventDefault();if(!$('callSearch').disabled){clearCall();$('callSearch').focus()}return}
  if(e.key==='Enter'){
    if(tag==='BUTTON'||tag==='A')return;
    const card=ae?.closest?.('.m-card[data-key],tr[data-key]');
    if(card){e.preventDefault();openDrawer(card.dataset.key);return}
    if(call.key){e.preventDefault();doCallBuy()}
    return}
  if(/^[1-9]$/.test(e.key)){const i=+e.key-1;if(state.teams[i]){call.teamId=state.teams[i].id;clearExpired();renderConsole();play('tick')}return}
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){if(!call.key)return;e.preventDefault();
    callStep((e.key==='ArrowRight'?1:-1)*(e.shiftKey?5:1));return}
  if(call.key){
    const p=state.players.find(x=>x.key===call.key);if(!p)return;
    const k=e.key.toLowerCase();
    if(k==='q'){$('callPrice').value=Math.max(1,Math.round(p.qt));updateCallHint();play('tick')}
    else if(k==='f'){$('callPrice').value=fairOf(p.key);updateCallHint();play('tick')}
    else if(k==='m'){$('callPrice').value=Math.max(1,teamStats(teamById(call.teamId)).maxBid);updateCallHint();play('tick')}
    else if(k==='t'){if(T.running){stopTimer();paintTimer();updateTitle()}else startTimer()}}});
const rg=$('rosaGrid');
rg.addEventListener('dragstart',e=>{const c=e.target.closest('.p-card');if(!c||editingKey){e.preventDefault();return}
  dragInfo={key:c.dataset.key,role:c.dataset.role};e.dataTransfer.setData('text/plain',c.dataset.key);e.dataTransfer.effectAllowed='move';
  requestAnimationFrame(()=>c.classList.add('dragging'))});
rg.addEventListener('dragover',e=>{if(!dragInfo)return;const col=e.target.closest('.role-col');
  if(!col||col.dataset.role!==dragInfo.role)return;e.preventDefault();
  rg.querySelectorAll('.drop-over').forEach(x=>x.classList.remove('drop-over'));
  const c=e.target.closest('.p-card');if(c&&c.dataset.key!==dragInfo.key)c.classList.add('drop-over')});
rg.addEventListener('drop',e=>{if(!dragInfo)return;e.preventDefault();
  const col=e.target.closest('.role-col');if(!col||col.dataset.role!==dragInfo.role){dragInfo=null;return}
  const c=e.target.closest('.p-card');reorderRosa(dragInfo.key,c&&c.dataset.key!==dragInfo.key?c.dataset.key:null);dragInfo=null});
rg.addEventListener('dragend',()=>{dragInfo=null;rg.querySelectorAll('.dragging,.drop-over').forEach(x=>x.classList.remove('dragging','drop-over'))});
const pc=$('planCard');
pc.addEventListener('dragstart',e=>{const it=e.target.closest('.plan-item');if(!it)return;
  planDrag=it.dataset.key;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',planDrag);
  requestAnimationFrame(()=>it.classList.add('dragging'))});
pc.addEventListener('dragover',e=>{if(!planDrag)return;e.preventDefault();
  pc.querySelectorAll('.drop-over').forEach(x=>x.classList.remove('drop-over'));
  const it=e.target.closest('.plan-item');if(it&&it.dataset.key!==planDrag)it.classList.add('drop-over')});
pc.addEventListener('drop',e=>{if(!planDrag)return;e.preventDefault();
  const it=e.target.closest('.plan-item');if(it&&it.dataset.key!==planDrag)planReorder(planDrag,it.dataset.key);planDrag=null});
pc.addEventListener('dragend',()=>{planDrag=null;pc.querySelectorAll('.dragging,.drop-over').forEach(x=>x.classList.remove('dragging','drop-over'))});
$('fileInput').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f)handleFile(f)});
$('importFile').addEventListener('change',e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const s=JSON.parse(String(r.result));const m=s&&s.v>=4?migrate(s):migrate(s);
      if(!m)throw 0;
      pushSnap('Prima dell\'import backup');
      state=m;remoteAhead=false;sel.clear();setupSig='';clearCall();closeDrawer();
      commit('Backup importato');renderTeamFilter();renderMantraFilter();syncFilterInputs();renderAll();play('cash');
      toast('Backup importato: asta ripristinata.',{type:'ok',ico:'check',undoIdx:hIndex});
    }catch(err){play('error');toast('Backup non valido: serve un JSON esportato da Asta Maestra.',{type:'danger',ico:'warn'})}};
  r.readAsText(f,'UTF-8')});
const dz=$('dropzone');
['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();if(!busy)dz.classList.add('drag')}));
['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));
dz.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)handleFile(f)});
dz.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!busy)$('fileInput').click()}});
document.addEventListener('dragover',e=>e.preventDefault());
document.addEventListener('drop',e=>e.preventDefault());
addEventListener('scroll',()=>{$('navEl').classList.toggle('scrolled',scrollY>10)},{passive:true});
const spy=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting)
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('current',a.dataset.spyLink===en.target.id))})},
  {rootMargin:'-35% 0px -55% 0px'});
document.querySelectorAll('[data-spy]').forEach(s=>spy.observe(s));
const rio=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');rio.unobserve(en.target)}})},{threshold:.06});
document.querySelectorAll('.reveal').forEach(el=>rio.observe(el));
if(!REDUCED){let pt=false;addEventListener('scroll',()=>{if(pt)return;pt=true;
  requestAnimationFrame(()=>{const y=scrollY;$('glowA').style.transform=`translate3d(0,${y*.05}px,0)`;
    $('glowB').style.transform=`translate3d(0,${y*-.04}px,0)`;pt=false})},{passive:true})}
let resizeT=null;addEventListener('resize',()=>{clearTimeout(resizeT);resizeT=setTimeout(scrollActiveChip,150)});
setInterval(()=>{if(document.body.classList.contains('locked')&&
  !$('modalWrap').classList.contains('open')&&!$('drawer').classList.contains('open'))document.body.classList.remove('locked');
  renderSystem()},4000);

/* ---------- sincronizzazione cloud ---------- */
let syncUser=null,syncBusy=false,syncPushT=null;
let syncAuto=localStorage.getItem('astamaestra_sync_auto')==='1';
function syncChip(txt,cls){
  const c=$('syncStateChip');if(!c)return;
  c.textContent=txt;c.className='chip '+(cls||'st-2')}
function renderSyncUI(){
  const body=$('syncBody');if(!body)return;
  if(!Sync.configured){
    syncChip('non configurata','');
    body.innerHTML='<p class="d-note">Per attivare il cloud configura <b>VITE_SUPABASE_URL</b> e <b>VITE_SUPABASE_ANON_KEY</b> nel file <b>.env</b>, poi ricompila.</p>';
    return}
  if(!syncUser){
    syncChip('non connesso','');
    body.innerHTML=`<div class="field mb10"><label for="syncEmail">Email</label><input class="inp" id="syncEmail" type="email" autocomplete="username" placeholder="tu@email.it" aria-label="Email per il sync"></div>
      <div class="field mb10"><label for="syncPassword">Password</label><input class="inp" id="syncPassword" type="password" autocomplete="current-password" placeholder="almeno 6 caratteri" aria-label="Password per il sync"></div>
      <div class="data-actions"><button class="btn btn-gold btn-sm" data-action="sync-signin">Accedi</button>
        <button class="btn btn-ghost btn-sm" data-action="sync-signup">Crea account</button></div>
      <p class="d-note mt10">I dati viaggiano su HTTPS e sono protetti da RLS: solo il tuo account puo' leggerli.</p>`;
    return}
  syncChip(syncUser.email||'connesso','st-2');
  body.innerHTML=`<p class="d-note" style="margin-bottom:10px">Connesso come <b>${esc(syncUser.email||'utente')}</b> · revisione locale <b>${Sync.localRevision()}</b> · ultimo invio: <span id="syncLast">—</span></p>
    <div class="data-actions"><button class="btn btn-gold btn-sm" data-action="sync-push">Carica sul cloud</button>
      <button class="btn btn-ghost btn-sm" data-action="sync-pull">Scarica dal cloud</button>
      <button class="btn btn-ghost btn-sm" data-action="sync-signout">Esci</button></div>
    <label class="toggle-inline mt12"><span class="switch"><input type="checkbox" id="syncAuto" data-change="syncAuto" ${syncAuto?'checked':''} aria-label="Sincronizzazione automatica"><span class="track"></span></span>Sincronizza automaticamente dopo ogni modifica</label>`;
}
async function doSync(kind){
  if(!Sync.configured||syncBusy)return;
  syncBusy=true;syncChip('in corso…','');
  try{
    if(kind==='signin'||kind==='signup'){
      const email=$('syncEmail')?.value.trim(),password=$('syncPassword')?.value||'';
      if(!email||password.length<6)throw new Error('Inserisci email e password di almeno 6 caratteri.');
      const u=kind==='signin'?await Sync.signIn(email,password):await Sync.signUp(email,password);
      if(!u)throw new Error('Controlla la tua email per confermare l\'account.');
      syncUser=u;toast(kind==='signin'?'Accesso effettuato.':'Account creato.',{type:'ok',ico:'cloud'})}
    else if(kind==='signout'){await Sync.signOut();syncUser=null;toast('Disconnesso dal cloud.',{type:'info',ico:'cloud'})}
    else if(kind==='push'){
      const r=await Sync.push(state,navigator.userAgent?.slice(0,80));
      if(r.accepted){toast('Sessione caricata sul cloud.',{type:'ok',ico:'cloud'});
        const l=$('syncLast');if(l)l.textContent=new Date().toLocaleString('it-IT')}
      else{toast('Il cloud ha una versione piu recente (rev. '+r.revision+'). Scaricala per decidere come procedere.',{type:'warn',ico:'warn',dur:7000})}}
    else if(kind==='pull'){
      const r=await Sync.pull();
      if(!r){toast('Nessuna sessione salvata nel cloud.',{type:'info',ico:'cloud'});return}
      openModal({title:'Scaricare la sessione dal cloud?',danger:true,okLabel:'Scarica e sostituisci',
        body:`<p>La versione cloud (revisione <b>${esc(r.revision)}</b>, ${esc(new Date(r.updated_at).toLocaleString('it-IT'))}) sostituirà i dati locali di questo dispositivo. L'operazione è annullabile con Ctrl+Z.</p>`,
        onOk:()=>{state=clone(r.data);Sync.setLocalRevision(Number(r.revision));afterRestore();
          toast('Sessione cloud caricata.',{type:'ok',ico:'cloud'})}})}
  }catch(err){toast('Sync: '+(err.message||'errore sconosciuto'),{type:'danger',ico:'warn',dur:6000})}
  finally{syncBusy=false;renderSyncUI()}
}
function scheduleSyncPush(){
  clearTimeout(syncPushT);
  syncPushT=setTimeout(()=>{if(!syncAuto||!syncUser)return;
    Sync.push(state,navigator.userAgent?.slice(0,80)).then(r=>{
      if(!r.accepted)toast('Cloud piu recente: apri Sistema → Sincronizzazione cloud.',{type:'warn',ico:'cloud',dur:6000});
      const l=$('syncLast');if(l)l.textContent=new Date().toLocaleString('it-IT')})
      .catch(()=>{})},1800)}
Sync.onAuthChange(u=>{syncUser=u;renderSyncUI()});
Sync.currentUser().then(u=>{syncUser=u;renderSyncUI()}).catch(()=>{});

/* ---------- avvio ---------- */
renderTeamFilter();renderMantraFilter();syncFilterInputs();resetTimer();renderAll();applyPresentTheme();persist();
if(bootSrc==='mirror'||bootSrc==='snapshot'){
  setTimeout(()=>toast(`<b>Dati recuperati dal ${bootSrc==='mirror'?'mirror di sicurezza':'time machine'}.</b> La copia principale era danneggiata: la sessione è stata ricostruita.`,{type:'ok',ico:'shield',dur:8000}),500);
}else if(bootSrc==='legacy'){
  setTimeout(()=>toast('Sessione precedente migrata al nuovo formato di salvataggio.',{type:'info',ico:'shield',dur:4000}),500);
}else if(state.players.length){
  setTimeout(()=>toast(`Sessione ripristinata: <b>${state.players.length}</b> giocatori · ${snaps.length} snapshot pronti.`,{type:'info',ico:'clock',dur:3400}),500);
}

/* ---------- PWA ---------- */
let deferredInstall=null;
function renderInstallBtn(){
  const b=$('installBtn');if(!b)return;
  const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  b.classList.toggle('hidden',!deferredInstall||standalone)}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;renderInstallBtn()});
addEventListener('appinstalled',()=>{deferredInstall=null;renderInstallBtn();toast('App installata.',{type:'ok',ico:'check'})});
renderInstallBtn();
if('serviceWorker' in navigator&&location.protocol!=='file:'&&location.protocol!=='http:'){
  addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{scope:'./'}).catch(()=>{}))}
