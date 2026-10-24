"use strict";
/* Repaso 3er grado — todo el avance vive en este dispositivo (localStorage). Sin servidor, sin cuentas. */

const COLORS = {com:"var(--c-com)",gua:"var(--c-gua)",mat:"var(--c-mat)",vst:"var(--c-vst)",la:"var(--c-la)",sci:"var(--c-sci)",ss:"var(--c-ss)"};
const ABBR = {com:"Aa",gua:"Gn",mat:"123",vst:"PY",la:"En",sci:"Sc",ss:"SS"};
const AVATARS = ["🐢","🦜","🐆","🐸","🦊","🐼","🦉","🐙","🦄","🐝","🐬","🦖"];
const TXT = {
  es:{play:"Jugar",playSub:"8 preguntas, de fácil a difícil. Primero las que todavía no sabés.",cards:"Tarjetas",cardsSub:"Mirá el concepto y dalo vuelta.",check:"Comprobar",next:"Siguiente",finish:"Ver resultado",again:"Jugar otra vez",back:"Volver",
      t:"Verdadero",f:"Falso",choose:"Elegí…",read:"Leer el texto",help:"Palabras de ayuda",of:"de",answer:"La respuesta correcta:",typeHere:"Escribí tu respuesta",
      ok:["¡Muy bien!","¡Excelente!","¡Genial!","¡Así se hace!","¡Bravo!"],bad:["¡Casi! Mirá la respuesta.","No pasa nada, se aprende probando.","¡Seguí intentando!"],
      end3:"¡Campeón! Te salió casi todo.",end2:"¡Muy bien! Repasá lo que falló y jugá de nuevo.",end1:"¡Buen comienzo! Mirá las tarjetas y volvé a intentar.",
      q:"Pregunta",lv:{f:"Fácil",m:"Medio",d:"Desafío"},up:"Subir",down:"Bajar",orderHint:"Usá las flechas para ordenar.",review:"Para repasar",flip:"Dar vuelta",prev:"Anterior",nxt:"Siguiente",tap:"Tocá la tarjeta para darla vuelta",streak:"seguidas",
      fix:"Repasar mis errores",fixSub:(n)=>`${n} ${n===1?"pregunta":"preguntas"} para volver a intentar.`,mastered:(a,b)=>`Dominás ${a} de ${b} preguntas`,newM:(n)=>`+${n} ${n===1?"pregunta nueva dominada":"preguntas nuevas dominadas"}`,home:"Inicio",cardsN:"tarjetas"},
  en:{play:"Play",playSub:"8 questions, from easy to hard. The ones you don't know yet come first.",cards:"Flashcards",cardsSub:"Read the word and flip the card.",check:"Check",next:"Next",finish:"See my score",again:"Play again",back:"Back",
      t:"True",f:"False",choose:"Choose…",read:"Read the text",help:"Help words",of:"of",answer:"The right answer:",typeHere:"Type your answer",
      ok:["Great job!","Awesome!","You got it!","Excellent!","Well done!"],bad:["Almost! Look at the answer.","Good try! Look at the answer.","Keep going, you are learning!"],
      end3:"Superstar! You got almost everything.",end2:"Well done! Review your mistakes and play again.",end1:"Good start! Look at the flashcards and try again.",
      q:"Question",lv:{f:"Easy",m:"Medium",d:"Challenge"},up:"Move up",down:"Move down",orderHint:"Use the arrows to put them in order.",review:"To review",flip:"Flip",prev:"Back",nxt:"Next",tap:"Tap the card to flip it",streak:"in a row",
      fix:"Fix my mistakes",fixSub:(n)=>`${n} ${n===1?"question":"questions"} to try again.`,mastered:(a,b)=>`You know ${a} of ${b} questions`,newM:(n)=>`+${n} new ${n===1?"question":"questions"} mastered`,home:"Home",cardsN:"cards"}
};
const MEDALS = [
  {id:"primera",  icon:"🎒", name:"Primera partida",   how:"Terminá tu primera partida."},
  {id:"estrellas",icon:"⭐", name:"Tres estrellas",     how:"Sacá 3 estrellas en una materia."},
  {id:"perfecta", icon:"💯", name:"Partida perfecta",   how:"Respondé todo bien en una partida."},
  {id:"fuego",    icon:"🔥", name:"En llamas",          how:"Acertá 5 seguidas."},
  {id:"corrector",icon:"🩹", name:"Aprendo de mis errores", how:"Corregí 5 preguntas que habías errado."},
  {id:"explorador",icon:"🧭",name:"Explorador",         how:"Jugá las 7 materias."},
  {id:"tarjetas", icon:"🃏", name:"Mazo completo",      how:"Mirá todas las tarjetas de una materia."},
  {id:"mitad",    icon:"🌗", name:"Mitad del camino",   how:"Dominá la mitad de una materia."},
  {id:"maestro",  icon:"🏆", name:"Maestro",            how:"Dominá todas las preguntas de una materia."},
  {id:"relampago",icon:"⚡", name:"Rayo",               how:"Sacá 3 estrellas en el desafío relámpago."},
  {id:"dictado",  icon:"✏️", name:"Buena letra",        how:"Sacá 3 estrellas en un dictado."},
  {id:"bilingue", icon:"🌎", name:"Bilingüe",           how:"3 estrellas en una materia en inglés y en una en español."},
  {id:"dias3",    icon:"📅", name:"Tres días seguidos", how:"Jugá 3 días seguidos."},
  {id:"dias7",    icon:"🗓️", name:"Semana completa",    how:"Jugá 7 días seguidos."}
];

let BANK, S, QBYID = {};
const app = document.getElementById("app");
const $ = (h)=>{ const t=document.createElement("template"); t.innerHTML=h.trim(); return t.content.firstElementChild; };
const esc = (s)=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = (a)=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const pick = (a)=>a[Math.floor(Math.random()*a.length)];
const deacc = (s)=>s.normalize("NFD").replace(/[̀-ͯ]/g,"");
const norm = (s)=>String(s).toLowerCase().replace(/[’‘`´]/g,"'").replace(/[.!¡¿?,]/g,"").replace(/\s+/g," ").trim();
const subj = (id)=>S.find(s=>s.id===id);
const starsHtml = (n)=>`<span class="stars" role="img" aria-label="${n} de 3 estrellas">${[0,1,2].map(i=>i<n?"<b>★</b>":"★").join("")}</span>`;
const today = ()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const reduced = ()=>window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Perfiles y avance (solo en este dispositivo) ---------- */
const KEY = "repaso3-v2";
let db = {v:2, active:null, profiles:[]};
function newProfile(name, avatar){
  return {id:Math.random().toString(36).slice(2,10), name, avatar, best:{}, q:{}, days:[], medals:{}, cards:{}, played:{}, fixed:0, sound:true, mission:null};
}
function load(){
  try{ const raw = localStorage.getItem(KEY); if(raw){ db = Object.assign(db, JSON.parse(raw)); return; } }catch(e){}
  try{ /* Migración desde la versión de una sola página: nombre + mejores estrellas. */
    const old = JSON.parse(localStorage.getItem("repaso3-v1")||"null");
    if(old && old.name){ const p = newProfile(old.name, AVATARS[0]); p.best = old.best||{}; db.profiles.push(p); db.active = p.id; save(); }
  }catch(e){}
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){} }
const me = ()=> db.profiles.find(p=>p.id===db.active);

function stat(p, qid){ return p.q[qid] || [0,0,null]; }            // [intentos, aciertos, último (1/0)]
const isMastered = (p,qid)=> stat(p,qid)[2]===1;
const isMissed = (p,qid)=> stat(p,qid)[2]===0;
function mastery(p, s){ const tot=s.questions.length, ok=s.questions.filter(q=>isMastered(p,q.id)).length; return {ok, tot, pct: tot?ok/tot:0}; }
const missed = (p, s)=> s.questions.filter(q=>isMissed(p,q.id));
function dayStreak(p){
  const set = new Set(p.days); let n=0; const d=new Date();
  if(!set.has(today())) d.setDate(d.getDate()-1);                  // la racha sigue viva hasta que termine el día
  for(;;){ const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; if(!set.has(k)) break; n++; d.setDate(d.getDate()-1); }
  return n;
}
function markDay(p){ const t=today(); if(!p.days.includes(t)){ p.days.push(t); if(p.days.length>400) p.days=p.days.slice(-400); } }
function record(q, ok){
  const p = me(), r = stat(p,q.id).slice(), before = r[2];
  r[0]++; if(ok) r[1]++;
  if(ok && before===0) p.fixed = (p.fixed||0)+1;
  if(ok && before!==1) st.newM = (st.newM||0)+1;
  r[2] = ok?1:0; p.q[q.id] = r; markDay(p); save();
}
function award(p, id){ if(p.medals[id]) return false; p.medals[id]=today(); (st.newMedals = st.newMedals||[]).push(id); return true; }
function checkMedals(p, ctx){
  ctx = ctx||{};
  if(ctx.finished) award(p,"primera");
  if(ctx.stars===3 && ctx.sid && S.some(s=>s.id===ctx.sid)) award(p,"estrellas");
  if(ctx.perfect) award(p,"perfecta");
  if(ctx.maxStreak>=5) award(p,"fuego");
  if((p.fixed||0)>=5) award(p,"corrector");
  if(S.every(s=>p.played[s.id])) award(p,"explorador");
  if(S.some(s=>(p.cards[s.id]||[]).length>=s.cards.length)) award(p,"tarjetas");
  if(S.some(s=>mastery(p,s).pct>=0.5)) award(p,"mitad");
  if(S.some(s=>mastery(p,s).pct>=1)) award(p,"maestro");
  if((p.best.mix||0)>=3) award(p,"relampago");
  if((p.best.dict||0)>=3) award(p,"dictado");
  if(S.some(s=>s.lang==="en"&&(p.best[s.id]||0)>=3) && S.some(s=>s.lang==="es"&&(p.best[s.id]||0)>=3)) award(p,"bilingue");
  const ds = dayStreak(p); if(ds>=3) award(p,"dias3"); if(ds>=7) award(p,"dias7");
  save();
}
/* Misión del día: corregir errores si hay, si no la materia menos dominada. */
function mission(p){
  if(p.mission && p.mission.day===today()) return p.mission;
  const withErr = S.filter(s=>missed(p,s).length).sort((a,b)=>missed(p,b).length-missed(p,a).length)[0];
  const low = S.slice().sort((a,b)=>mastery(p,a).pct-mastery(p,b).pct || (p.played[a.id]?1:0)-(p.played[b.id]?1:0))[0];
  p.mission = withErr && Math.random()<0.6 ? {day:today(), kind:"fix", sid:withErr.id, done:false} : {day:today(), kind:"play", sid:low.id, done:false};
  save(); return p.mission;
}

/* ---------- Sonido y festejos ---------- */
let actx;
function tone(notes){
  const p = me(); if(!p || !p.sound) return;
  try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); let t = actx.currentTime;
    notes.forEach(([f,d])=>{ const o=actx.createOscillator(), g=actx.createGain(); o.type="triangle"; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.18,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t+d+0.02); t+=d*0.8; });
  }catch(e){}
}
const sfx = { ok:()=>tone([[660,.12],[880,.18]]), bad:()=>tone([[300,.22]]), win:()=>tone([[523,.12],[659,.12],[784,.12],[1047,.3]]), medal:()=>tone([[784,.1],[988,.1],[1319,.35]]) };
function confetti(){
  if(reduced()) return;
  const c = document.createElement("canvas"); c.className="confetti"; c.setAttribute("aria-hidden","true"); document.body.append(c);
  const W = c.width = innerWidth, H = c.height = innerHeight, x = c.getContext("2d");
  const cols = ["#D4552E","#23864F","#2B64C8","#F0AE1C","#704DC0","#10808C","#B83C70"];
  const ps = Array.from({length:110},()=>({x:Math.random()*W, y:-20-Math.random()*H*0.4, r:4+Math.random()*5, vy:2+Math.random()*3, vx:-1.5+Math.random()*3, a:Math.random()*6, c:pick(cols)}));
  let f=0; (function step(){ x.clearRect(0,0,W,H); ps.forEach(p=>{ p.y+=p.vy; p.x+=p.vx; p.a+=0.1; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle=p.c; x.fillRect(-p.r,-p.r/2,p.r*2,p.r); x.restore(); });
    if(++f<120) requestAnimationFrame(step); else c.remove(); })();
}
function toast(html){
  const t = $(`<div class="toast" role="status">${html}</div>`); document.body.append(t);
  setTimeout(()=>t.classList.add("out"), 2600); setTimeout(()=>t.remove(), 3100);
}

/* Karumbé, la tortuga que acompaña (karumbe = tortuga en guaraní). */
function mascot(msg, mood){
  return `<div class="mascot ${mood||""}"><svg viewBox="0 0 120 90" width="84" height="63" aria-hidden="true">
    <ellipse cx="60" cy="82" rx="40" ry="5" fill="var(--grid)"/>
    <g class="legs" fill="#7FB36A"><rect x="30" y="62" width="12" height="16" rx="6"/><rect x="74" y="62" width="12" height="16" rx="6"/></g>
    <g class="head"><circle cx="98" cy="48" r="14" fill="#8CC276"/><circle cx="103" cy="44" r="3.2" fill="#1B2539"/><circle cx="104" cy="43" r="1" fill="#fff"/><path d="M96 54 q6 5 12 0" stroke="#1B2539" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
    <path d="M18 66 Q20 22 58 20 Q96 22 98 66 Z" fill="#23864F"/>
    <path d="M18 66 Q20 22 58 20 Q96 22 98 66 Z" fill="none" stroke="#165C36" stroke-width="3"/>
    <g fill="#F0AE1C" opacity=".9"><polygon points="58,30 68,36 68,48 58,54 48,48 48,36"/><polygon points="34,44 42,49 42,59 34,63 27,58 27,49"/><polygon points="82,44 89,49 89,58 82,63 74,59 74,49"/></g>
    <rect x="14" y="62" width="88" height="8" rx="4" fill="#165C36"/></svg>
    <p class="bubble">${msg}</p></div>`;
}

/* ---------- Navegación ---------- */
let st = {};
function go(view, extra){ st = Object.assign({view}, extra||{}); render(); window.scrollTo({top:0}); }
function render(){
  app.innerHTML = ""; app.style.removeProperty("--sc");
  if(!me() && !["who","newp","import"].includes(st.view)) return db.profiles.length ? renderWho() : renderNew();
  ({who:renderWho, newp:renderNew, import:renderImport, subject:renderSubject, quiz:renderQuiz, cards:renderCards, dict:renderDict, medals:renderMedals, report:renderReport, share:renderShare}[st.view] || renderHome)();
}
function topBar(label, fn){
  const p = me();
  const t=$(`<div class="top"><button class="back">← ${esc(label)}</button>${p?`<span class="me-chip"><span aria-hidden="true">${p.avatar}</span> ${esc(p.name)}</span>`:""}</div>`);
  t.querySelector("button").onclick=fn; return t;
}

/* ---------- ¿Quién juega? (solo nombres y dibujitos, nunca puntajes) ---------- */
function renderWho(){
  const c = $(`<section class="card"><span class="label">Repaso 3er grado</span><h1>¿Quién juega?</h1><p>Cada uno tiene su avance guardado en este equipo.</p><div class="who-grid"></div>
    <div class="actions"><button class="ghost" id="imp">Tengo un código de avance</button></div></section>`);
  const g = c.querySelector(".who-grid");
  db.profiles.forEach(p=>{ const b=$(`<button class="who-btn"><span class="ava" aria-hidden="true">${p.avatar}</span><span>${esc(p.name)}</span></button>`); b.onclick=()=>{ db.active=p.id; save(); go("home"); }; g.append(b); });
  const n=$(`<button class="who-btn add"><span class="ava" aria-hidden="true">＋</span><span>Soy nuevo/a</span></button>`); n.onclick=()=>go("newp"); g.append(n);
  c.querySelector("#imp").onclick=()=>go("import");
  app.append(c);
}
function renderNew(){
  let ava = AVATARS[db.profiles.length % AVATARS.length];
  const c = $(`<section class="card"><span class="label">Repaso 3er grado</span><h1>¡Hola! ¿Cómo te llamás?</h1><p>Escribí tu nombre o tu apodo. Solo se guarda en este dispositivo.</p>
    <label class="sr" for="name">Tu nombre o apodo</label><input class="fill" id="name" maxlength="20" autocomplete="off" placeholder="Tu nombre">
    <p class="label" id="ava-l">Elegí tu compañero</p><div class="ava-grid" role="radiogroup" aria-labelledby="ava-l"></div>
    <div class="actions"><button class="primary" id="go">¡Empezar!</button>${db.profiles.length?`<button class="ghost" id="cancel">Volver</button>`:`<button class="ghost" id="imp">Tengo un código de avance</button>`}</div></section>`);
  const grid = c.querySelector(".ava-grid");
  const paint = ()=> grid.querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked", b.dataset.a===ava));
  AVATARS.forEach(a=>{ const b=$(`<button class="ava-btn" role="radio" data-a="${a}" aria-label="${a}">${a}</button>`); b.onclick=()=>{ ava=a; paint(); }; grid.append(b); }); paint();
  const inp = c.querySelector("input");
  const ok = ()=>{ const v = inp.value.trim().slice(0,20); if(!v){ inp.focus(); return; } const p=newProfile(v, ava); db.profiles.push(p); db.active=p.id; save(); go("home"); };
  c.querySelector("#go").onclick = ok; inp.onkeydown = (e)=>{ if(e.key==="Enter") ok(); };
  const cn=c.querySelector("#cancel"); if(cn) cn.onclick=()=>go("who");
  const im=c.querySelector("#imp"); if(im) im.onclick=()=>go("import");
  app.append(c); setTimeout(()=>inp.focus(),50);
}

/* ---------- Inicio ---------- */
function ring(pct, inner){ return `<span class="ring" style="--p:${Math.round(pct*100)}" role="img" aria-label="Dominado ${Math.round(pct*100)} %">${inner}</span>`; }
function renderHome(){
  const p = me(), ds = dayStreak(p), nMed = Object.keys(p.medals).length, m = mission(p), ms = subj(m.sid);
  const h = $(`<header class="hero"><div class="top"><span class="label">Repaso 3er grado</span><button class="who">Cambiar de jugador</button></div>
    <div class="hello"><span class="big-ava" aria-hidden="true">${p.avatar}</span><h1>¡Hola, ${esc(p.name)}!</h1></div>
    <div class="chips"><span class="chip" title="Días seguidos jugando">🔥 ${ds} ${ds===1?"día":"días"}</span><button class="chip" id="med">🏅 ${nMed} de ${MEDALS.length} medallas</button><button class="chip" id="snd" aria-pressed="${p.sound}">${p.sound?"🔊 Sonido":"🔇 Sin sonido"}</button></div></header>`);
  h.querySelector(".who").onclick = ()=>{ db.active=null; save(); go("who"); };
  h.querySelector("#med").onclick = ()=>go("medals");
  h.querySelector("#snd").onclick = ()=>{ p.sound=!p.sound; save(); render(); };
  app.append(h);
  const tip = m.done ? `¡Misión de hoy cumplida! Mañana te espera otra. 🎉`
    : m.kind==="fix" ? `Misión de hoy: corregí tus errores de <strong>${esc(ms.name)}</strong>. ¡Vos podés!`
    : `Misión de hoy: jugá <strong>${esc(ms.name)}</strong> y sumá preguntas dominadas.`;
  const mb = $(`<button class="mission ${m.done?"done":""}" style="--sc:${COLORS[ms.color]}">${mascot(tip, m.done?"happy":"")}</button>`);
  mb.onclick = ()=>{ if(m.done) return go("medals"); m.kind==="fix" && missed(p,ms).length ? startQuiz(ms.id,"fix") : go("subject",{sid:ms.id}); };
  app.append(mb);
  const fl = $(`<button class="flash"><span class="bolt" aria-hidden="true">⚡</span><div><strong>Desafío relámpago</strong><span>10 preguntas mezcladas de todas las materias · ${starsHtml(p.best.mix||0)}</span></div></button>`);
  fl.onclick = ()=>startQuiz("mix"); app.append(fl);
  app.append($(`<h2 class="sec">Mi mapa de materias</h2>`));
  const g = $(`<section class="grid" aria-label="Materias"></section>`);
  S.forEach(s=>{
    const mm = mastery(p,s), err = missed(p,s).length;
    const b = $(`<button class="subj" style="--sc:${COLORS[s.color]}">${ring(mm.pct, `<span class="sticker">${ABBR[s.id]}</span>`)}<span class="meta"><h3>${esc(s.name)}</h3><small>${esc(s.tag)} · ${mm.ok}/${mm.tot}</small>${starsHtml(p.best[s.id]||0)}${err?`<small class="err">${err} para repasar</small>`:""}</span>${mm.pct>=1?`<span class="crown" aria-label="Materia dominada">👑</span>`:""}</button>`);
    b.onclick = ()=>go("subject",{sid:s.id}); g.append(b);
  });
  app.append(g);
  const more = $(`<section class="more"><button class="ghost" id="rep">📋 Mi informe</button><button class="ghost" id="shr">📲 Llevar mi avance a otro equipo</button></section>`);
  more.querySelector("#rep").onclick=()=>go("report"); more.querySelector("#shr").onclick=()=>go("share");
  app.append(more);
  app.append($(`<p class="foot">Hecho para repasar en casa. No pide cuenta: el avance queda guardado solo en este dispositivo. Sigue el temario, no reemplaza el libro. <a href="padres.html">Guía para padres</a></p>`));
}

/* ---------- Materia ---------- */
function renderSubject(){
  const p = me(), s = subj(st.sid), T = TXT[s.lang], mm = mastery(p,s), err = missed(p,s);
  app.style.setProperty("--sc", COLORS[s.color]);
  app.append(topBar(T.home, ()=>go("home")));
  app.append($(`<section class="band"><span class="label" style="color:var(--on-sc);opacity:.9">${esc(s.tag)}</span><h1>${esc(s.name)}</h1>
    <p>${T.mastered(mm.ok, mm.tot)}</p><div class="prog light" role="progressbar" aria-valuemin="0" aria-valuemax="${mm.tot}" aria-valuenow="${mm.ok}" aria-label="${T.mastered(mm.ok, mm.tot)}"><div style="width:${mm.pct*100}%"></div></div></section>`));
  const m = $(`<section class="modes"></section>`);
  const pl = $(`<button class="mode"><strong>${T.play}</strong><small>${T.playSub}</small>${starsHtml(p.best[s.id]||0)}</button>`); pl.onclick=()=>startQuiz(s.id);
  m.append(pl);
  if(err.length){ const f=$(`<button class="mode fixm"><strong>🩹 ${T.fix}</strong><small>${T.fixSub(err.length)}</small></button>`); f.onclick=()=>startQuiz(s.id,"fix"); m.append(f); }
  const seen = (p.cards[s.id]||[]).length;
  const c = $(`<button class="mode"><strong>${T.cards}</strong><small>${T.cardsSub}</small><small>${seen}/${s.cards.length} ${T.cardsN}</small></button>`); c.onclick=()=>go("cards",{sid:s.id,i:0,flip:false,order:shuffle(s.cards.map((_,i)=>i))});
  m.append(c);
  if(s.dictation){ const d=$(`<button class="mode"><strong>Dictado</strong><small>Escuchá la palabra y escribila.</small>${starsHtml(p.best.dict||0)}</button>`); d.onclick=()=>go("dict",{sid:s.id}); m.append(d); }
  app.append(m);
}

/* 3 fáciles, 3 medias, 2 desafíos, siempre de fácil a difícil. Dentro de cada nivel van primero las nunca vistas, después las erradas. */
function draw(pool, n){
  const p = me(), by = {f:[],m:[],d:[]}; pool.forEach(q=>by[q.lv].push(q));
  const want = n===10 ? {f:4,m:3,d:3} : {f:3,m:3,d:2};
  const tier = (q)=>{ const r=stat(p,q.id); return r[2]===null?0 : r[2]===0?1 : 2; };
  let out = [];
  ["f","m","d"].forEach(k=>{ const sorted = shuffle(by[k]).sort((a,b)=>tier(a)-tier(b)); out = out.concat(sorted.slice(0,want[k])); });
  return out;
}
function startQuiz(sid, mode){
  const p = me(); let qs;
  if(mode==="fix"){
    const order = {f:0,m:1,d:2};
    qs = shuffle(missed(p, subj(sid)).map(q=>Object.assign({sid},q))).slice(0,8).sort((a,b)=>order[a.lv]-order[b.lv]);
  } else if(sid==="mix"){
    const all = S.flatMap(s=>s.questions.filter(q=>!q.p).map(q=>Object.assign({sid:s.id},q)));
    qs = draw(all,10);
  } else {
    const s = subj(sid); qs = draw(s.questions.map(q=>Object.assign({sid:s.id},q)),8);
  }
  go("quiz",{sid,mode,qs,i:0,score:0,streak:0,maxStreak:0,miss:[],newM:0,newMedals:[]});
}

function renderQuiz(){
  const isMix = st.sid==="mix", home = isMix ? null : subj(st.sid);
  if(st.i >= st.qs.length) return renderEnd();
  const q = st.qs[st.i], s = subj(q.sid), T = TXT[s.lang];
  app.style.setProperty("--sc", isMix ? "var(--c-mix)" : COLORS[s.color]);
  app.append(topBar(isMix?"Inicio":home.name, ()=> isMix ? go("home") : go("subject",{sid:home.id})));
  const dots = st.qs.map((_,j)=>`<span class="dot ${j<st.i?(st.res&&st.res[j]?"ok":"bad"):j===st.i?"now":""}"></span>`).join("");
  app.append($(`<div class="qhead"><div class="qmeta"><span class="pill ${q.lv}">${T.lv[q.lv]}</span>${isMix?`<span>${esc(s.name)}</span>`:""}${st.mode==="fix"?`<span>🩹 ${T.fix}</span>`:""}<span>${st.streak>=2?`<span class="streak">🔥 ${st.streak} ${T.streak}</span> · `:""}${T.q} ${st.i+1} ${T.of} ${st.qs.length}</span></div><div class="dots" aria-hidden="true">${dots}</div></div>`));
  const card = $(`<section class="card"></section>`);
  if(q.p){
    const P = s.passages[q.p], prev = st.qs[st.i-1];
    card.append($(`<details class="passage" ${!prev||prev.p!==q.p?"open":""}><summary>${T.read}: ${esc(P.title)}</summary><p>${esc(P.text)}</p>${P.gloss?`<p class="gloss"><strong>${T.help}:</strong> ${esc(P.gloss)}</p>`:""}</details>`));
  }
  card.append($(`<p class="q">${esc(q.q)}</p>`));
  if(q.html) card.append($(q.html));
  const fbBox = $(`<div></div>`), act = $(`<div class="actions"></div>`);
  let answered = false;
  const finish = (ok, ansText)=>{
    if(answered) return; answered = true;
    (st.res = st.res||[])[st.i] = ok;
    if(ok){ st.score++; st.streak++; st.maxStreak=Math.max(st.maxStreak,st.streak); sfx.ok(); } else { st.streak=0; st.miss.push({q:q.q, a:ansText}); sfx.bad(); }
    record(q, ok);
    fbBox.replaceChildren($(`<div class="fb ${ok?"ok":"bad"} pop" role="status">${ok?pick(T.ok):pick(T.bad)}${ok?"":`<span class="ans">${T.answer} <strong>${esc(ansText)}</strong></span>`}</div>`));
    if(ok) card.classList.add("cheer");
    const nx = $(`<button class="primary">${st.i+1>=st.qs.length?T.finish:T.next}</button>`);
    nx.onclick = ()=>{ st.i++; render(); window.scrollTo({top:0}); };
    act.replaceChildren(nx); nx.focus();
  };
  if(q.t==="mc"||q.t==="tf"){
    const labels = q.t==="tf" ? (q.labels||[T.t,T.f]) : shuffle(q.o);
    const isA = (j)=> q.t==="mc" ? labels[j]===q.a : (j===0)===q.a;
    const box = $(`<div class="${q.t==="tf"?"tf":"opts"}"></div>`);
    labels.forEach((lab,idx)=>{
      const b = $(`<button class="opt">${esc(lab)}</button>`);
      b.onclick = ()=>{ if(answered) return; const ok=isA(idx); b.classList.add(ok?"ok":"bad");
        box.querySelectorAll(".opt").forEach((o,j)=>{ o.disabled=true; if(isA(j)) o.classList.add("ok"); });
        finish(ok, q.t==="mc"?q.a:labels[q.a?0:1]); };
      box.append(b);
    });
    card.append(box);
  } else if(q.t==="fill"){
    const inp = $(`<input class="fill" id="fill-${st.i}" aria-label="${T.typeHere}" autocomplete="off" autocapitalize="off" spellcheck="false" ${q.num?'inputmode="numeric"':""} placeholder="${T.typeHere}">`);
    card.append(inp);
    const run = ()=>{ if(answered||!inp.value.trim()) return; let ok;
      if(q.num) ok = q.a.includes(inp.value.replace(/[^\d]/g,""));
      else { const v=norm(inp.value); ok = q.a.some(a=>norm(a)===v||deacc(norm(a))===deacc(v)); }
      inp.disabled=true; inp.style.borderColor=ok?"var(--ok)":"var(--bad)";
      finish(ok, q.num?Number(q.a[0]).toLocaleString("es-PY"):q.a.join(" / ")); };
    const chk = $(`<button class="primary">${T.check}</button>`); chk.onclick=run; inp.onkeydown=(e)=>{ if(e.key==="Enter") run(); };
    act.append(chk); setTimeout(()=>inp.focus(),50);
  } else if(q.t==="match"){
    const rights = shuffle([...new Set(q.pairs.map(p=>p[1]))]); const sels=[];
    q.pairs.forEach(([l],idx)=>{ const row=$(`<div class="mrow"><span>${esc(l)}</span><select id="m-${st.i}-${idx}" aria-label="${esc(l)}"><option value="">${T.choose}</option>${rights.map(r=>`<option>${esc(r)}</option>`).join("")}</select></div>`); sels.push(row.querySelector("select")); card.append(row); });
    const chk = $(`<button class="primary">${T.check}</button>`);
    chk.onclick = ()=>{ if(answered||sels.some(x=>!x.value)) return; let all=true;
      sels.forEach((x,idx)=>{ const ok=x.value===q.pairs[idx][1]; x.classList.add(ok?"ok":"bad"); x.disabled=true; if(!ok) all=false; });
      finish(all, q.pairs.map(p=>p[0]+" → "+p[1]).join(" · ")); };
    act.append(chk);
  } else if(q.t==="order"){
    let cur = shuffle(q.items), g=0; while(cur.join()===q.items.join() && g++<10) cur=shuffle(q.items);
    card.append($(`<p class="note">${T.orderHint}</p>`));
    const list = $(`<div class="olist"></div>`);
    const drawL = (lock)=>{ list.replaceChildren(); cur.forEach((it,idx)=>{
      const row=$(`<div class="oitem"><span class="num">${idx+1}</span><span>${esc(it)}</span><button aria-label="${T.up}: ${esc(it)}" ${idx===0||lock?"disabled":""}>▲</button><button aria-label="${T.down}: ${esc(it)}" ${idx===cur.length-1||lock?"disabled":""}>▼</button></div>`);
      const [u,d]=row.querySelectorAll("button");
      u.onclick=()=>{[cur[idx-1],cur[idx]]=[cur[idx],cur[idx-1]];drawL();}; d.onclick=()=>{[cur[idx+1],cur[idx]]=[cur[idx],cur[idx+1]];drawL();};
      if(lock) row.classList.add(it===q.items[idx]?"ok":"bad"); list.append(row); }); };
    drawL(); card.append(list);
    const chk = $(`<button class="primary">${T.check}</button>`);
    chk.onclick=()=>{ if(answered) return; drawL(true); finish(cur.join("|")===q.items.join("|"), q.items.map((x,i)=>(i+1)+". "+x).join("  ")); };
    act.append(chk);
  }
  card.append(fbBox, act); app.append(card);
}

function medalsHtml(ids){ return ids.length ? `<div class="newmedals">${ids.map(id=>{ const M=MEDALS.find(m=>m.id===id); return `<div class="medal got pop"><span class="micon" aria-hidden="true">${M.icon}</span><strong>¡Medalla nueva!</strong><span>${esc(M.name)}</span></div>`; }).join("")}</div>` : ""; }

function renderEnd(){
  const p = me(), isMix = st.sid==="mix", s = isMix?null:subj(st.sid), T = TXT[isMix?"es":s.lang], total = st.qs.length;
  app.style.setProperty("--sc", isMix?"var(--c-mix)":COLORS[s.color]);
  app.append(topBar(isMix?"Inicio":s.name, ()=> isMix?go("home"):go("subject",{sid:s.id})));
  const pct = st.score/total, stars = pct>=0.9?3:pct>=0.7?2:1;
  if(!st.closed){
    st.closed = true;
    if(st.mode!=="fix" && stars > (p.best[st.sid]||0)) p.best[st.sid]=stars;
    if(!isMix) p.played[st.sid] = (p.played[st.sid]||0)+1;
    const m = p.mission; if(m && m.day===today() && !m.done && m.sid===st.sid && (m.kind==="play" || st.mode==="fix")){ m.done=true; st.missionDone=true; }
    checkMedals(p, {finished:true, stars: st.mode==="fix"?0:stars, sid:st.sid, perfect: st.score===total && total>=8, maxStreak:st.maxStreak});
    save();
    if(stars===3 || st.newMedals.length) { confetti(); } stars===3 ? sfx.win() : st.newMedals.length && sfx.medal();
  }
  const c = $(`<section class="card end"><div class="bigstars">${[0,1,2].map(i=>i<stars?"<b>★</b>":"★").join("")}</div><h2>${st.score} / ${total}</h2><p>${stars===3?T.end3:stars===2?T.end2:T.end1}</p>
    ${st.newM?`<p class="gain">🌱 ${T.newM(st.newM)}</p>`:""}${st.missionDone?`<p class="gain">🎯 ¡Cumpliste la misión de hoy!</p>`:""}
    ${medalsHtml(st.newMedals)}<div class="actions"></div></section>`);
  const a=$(`<button class="primary">${T.again}</button>`); a.onclick=()=>startQuiz(st.sid, st.mode==="fix" && !isMix && missed(p,s).length ? "fix" : undefined);
  const b=$(`<button class="ghost">${T.back}</button>`); b.onclick=()=> isMix?go("home"):go("subject",{sid:s.id});
  c.querySelector(".actions").append(a,b);
  if(st.miss.length){ const r=$(`<div class="review"><h3>${T.review}</h3><ul>${st.miss.map(m=>`<li>${esc(m.q)} → <strong>${esc(m.a)}</strong></li>`).join("")}</ul></div>`); c.append(r); }
  app.append(c);
}

function renderCards(){
  const p = me(), s = subj(st.sid), T = TXT[s.lang];
  app.style.setProperty("--sc", COLORS[s.color]);
  app.append(topBar(s.name, ()=>go("subject",{sid:s.id})));
  const idx = st.order[st.i], [front, back] = s.cards[idx];
  if(st.flip){ const seen = p.cards[s.id] = p.cards[s.id]||[]; if(!seen.includes(idx)){ seen.push(idx); markDay(p); st.newMedals=[]; checkMedals(p); if(st.newMedals.length){ sfx.medal(); toast(`🃏 ¡Medalla nueva! <strong>Mazo completo</strong>`); } save(); } }
  const c = $(`<section class="card" style="align-items:center"><div class="qmeta" style="width:100%"><span>${T.cards}</span><span>${st.i+1} ${T.of} ${s.cards.length}</span></div>
    <button class="fcard ${st.flip?"flipped":""}" aria-live="polite">${st.flip?`<span class="backside">${esc(back)}</span><small>${esc(front)}</small>`:`<span class="front">${esc(front)}</span><small>${T.tap}</small>`}</button>
    <div class="actions"><button class="ghost" ${st.i===0?"disabled":""}>← ${T.prev}</button><button class="primary">${T.flip}</button><button class="ghost" ${st.i===s.cards.length-1?"disabled":""}>${T.nxt} →</button></div></section>`);
  const flip = ()=>{ st.flip=!st.flip; render(); };
  c.querySelector(".fcard").onclick = flip;
  const [pv,fl,nx] = c.querySelectorAll(".actions button");
  fl.onclick = flip; pv.onclick=()=>{ st.i--; st.flip=false; render(); }; nx.onclick=()=>{ st.i++; st.flip=false; render(); };
  app.append(c);
}

function speak(w){ try{ if(!("speechSynthesis" in window)) return; const u=new SpeechSynthesisUtterance(w); const v=speechSynthesis.getVoices().find(v=>/^es/i.test(v.lang)); u.lang=v?v.lang:"es-ES"; if(v) u.voice=v; u.rate=0.75; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
try{ if("speechSynthesis" in window) speechSynthesis.getVoices(); }catch(e){}

function renderDict(){
  const p = me(), s = subj("com"), T = TXT.es, D = BANK.dictation;
  app.style.setProperty("--sc", COLORS[s.color]);
  app.append(topBar("Comunicación", ()=>go("subject",{sid:"com"})));
  if(!st.list){
    const c=$(`<section class="card"><span class="label">Ortografía</span><h2>Dictado</h2><p>Elegí qué letras practicar. Vas a escuchar 10 palabras.</p><div class="dchips"></div><p class="note">Si el audio no suena, un adulto puede tocar “Ver la palabra” y dictarla.</p></section>`);
    [...Object.keys(D),"Mezcla"].forEach(k=>{ const b=$(`<button class="dchip">${k==="Mezcla"?"Mezcla":"Con "+k}</button>`);
      b.onclick=()=>{ st.list = k==="Mezcla"?shuffle(Object.values(D).flat()).slice(0,10):shuffle(D[k]); st.k=k; st.i=0; st.score=0; st.newMedals=[]; render(); };
      c.querySelector(".dchips").append(b); });
    app.append(c); return;
  }
  const w = st.list;
  if(st.i>=w.length){
    const pct=st.score/w.length, stars=pct>=0.9?3:pct>=0.7?2:1;
    if(!st.closed){ st.closed=true; if(stars>(p.best.dict||0)) p.best.dict=stars; markDay(p); checkMedals(p,{finished:true}); save(); if(stars===3||st.newMedals.length) confetti(); stars===3 ? sfx.win() : st.newMedals.length && sfx.medal(); }
    const c=$(`<section class="card end"><div class="bigstars">${[0,1,2].map(i=>i<stars?"<b>★</b>":"★").join("")}</div><h2>${st.score} / ${w.length}</h2><p>${stars===3?T.end3:stars===2?T.end2:"¡Buen comienzo! Probá otra vez."}</p>${medalsHtml(st.newMedals)}<div class="actions"></div></section>`);
    const a=$(`<button class="primary">Otro dictado</button>`); a.onclick=()=>go("dict",{sid:"com"}); c.querySelector(".actions").append(a); app.append(c); return;
  }
  const word = w[st.i];
  app.append($(`<div class="qhead"><div class="qmeta"><span>Dictado · ${st.k==="Mezcla"?"Mezcla":"Con "+st.k}</span><span>Palabra ${st.i+1} de ${w.length}</span></div><div class="prog"><div style="width:${(st.i/w.length)*100}%"></div></div></div>`));
  const c=$(`<section class="card"></section>`);
  const sp=$(`<button class="speak">▶ Escuchar la palabra</button>`); sp.onclick=()=>speak(word);
  const rv=$(`<button class="reveal">Ver la palabra (para el adulto que dicta)</button>`), shown=$(`<p class="word" hidden>${esc(word)}</p>`); rv.onclick=()=>{ shown.hidden=!shown.hidden; };
  const inp=$(`<input class="fill" id="dict-${st.i}" aria-label="Escribí la palabra" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribí la palabra">`);
  const fb=$(`<div></div>`), act=$(`<div class="actions"></div>`), chk=$(`<button class="primary">Comprobar</button>`); let done=false;
  const run=()=>{ if(done||!inp.value.trim()) return; done=true; const v=inp.value.trim().toLowerCase(); let cls,txt;
    if(v===word){ st.score++; cls="ok"; txt=pick(T.ok); sfx.ok(); } else if(deacc(v)===deacc(word)){ st.score+=0.5; cls="bad"; txt=`¡Casi! Revisá la tilde: <strong>${esc(word)}</strong>`; sfx.bad(); } else { cls="bad"; txt=`${pick(T.bad)} <span class="ans">Se escribe: <strong>${esc(word)}</strong></span>`; sfx.bad(); }
    inp.disabled=true; inp.style.borderColor=cls==="ok"?"var(--ok)":"var(--bad)";
    fb.replaceChildren($(`<div class="fb ${cls} pop" role="status">${txt}</div>`));
    const nx=$(`<button class="primary">${st.i+1>=w.length?"Ver resultado":"Siguiente palabra"}</button>`); nx.onclick=()=>{ st.i++; render(); }; act.replaceChildren(nx); nx.focus(); };
  chk.onclick=run; inp.onkeydown=(e)=>{ if(e.key==="Enter") run(); }; act.append(chk);
  c.append(sp,rv,shown,inp,fb,act); app.append(c); setTimeout(()=>inp.focus(),50);
}

/* ---------- Medallas ---------- */
function renderMedals(){
  const p = me();
  app.append(topBar("Inicio", ()=>go("home")));
  app.append($(`<header class="hero"><h1>Mis medallas</h1><p>Tenés ${Object.keys(p.medals).length} de ${MEDALS.length}. Las grises todavía te esperan.</p></header>`));
  const g = $(`<section class="medal-grid"></section>`);
  MEDALS.forEach(M=>{ const got = p.medals[M.id];
    g.append($(`<div class="medal ${got?"got":"locked"}"><span class="micon" aria-hidden="true">${got?M.icon:"🔒"}</span><strong>${esc(M.name)}</strong><span>${esc(M.how)}</span></div>`)); });
  app.append(g);
}

/* ---------- Informe para mostrar en casa o a la maestra (solo este chico) ---------- */
function renderReport(){
  const p = me();
  app.append(topBar("Inicio", ()=>go("home")));
  const total = S.reduce((a,s)=>a+mastery(p,s).ok,0), tot = S.reduce((a,s)=>a+s.questions.length,0);
  const c = $(`<section class="card report"><span class="label">Informe de avance · ${new Date().toLocaleDateString("es-PY")}</span><h1><span aria-hidden="true">${p.avatar}</span> ${esc(p.name)}</h1>
    <p>Domina <strong>${total} de ${tot}</strong> preguntas · jugó <strong>${p.days.length}</strong> ${p.days.length===1?"día":"días"} · <strong>${Object.keys(p.medals).length}</strong> medallas.</p>
    <div class="rows"></div><p class="note">“Dominada” = la última vez que le tocó, la respondió bien. Este informe se arma solo con lo que hay en este equipo.</p>
    <div class="actions"><button class="ghost" id="pr">🖨️ Imprimir o guardar PDF</button></div></section>`);
  const rows = c.querySelector(".rows");
  S.forEach(s=>{ const mm = mastery(p,s), err = missed(p,s);
    const r = $(`<details class="rrow" style="--sc:${COLORS[s.color]}"><summary><span class="rname">${esc(s.name)}</span><span class="rbar"><span class="prog"><span style="width:${mm.pct*100}%"></span></span></span><span class="rnum">${mm.ok}/${mm.tot}</span>${starsHtml(p.best[s.id]||0)}</summary>
      ${err.length?`<p class="label">Para repasar</p><ul>${err.map(q=>`<li>${esc(q.q)}</li>`).join("")}</ul>`:`<p class="note">${p.played[s.id]?"Sin errores pendientes. ¡Bien!":"Todavía no jugó esta materia."}</p>`}</details>`);
    rows.append(r); });
  c.querySelector("#pr").onclick=()=>{ c.querySelectorAll("details").forEach(d=>d.open=true); window.print(); };
  app.append(c);
}

/* ---------- Código de avance: copiar a mano, nunca se envía solo ---------- */
const b64u = (bytes)=>{ let s=""; bytes.forEach(b=>s+=String.fromCharCode(b)); return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); };
const unb64u = (str)=>{ const s=atob(str.replace(/-/g,"+").replace(/_/g,"/")); return Uint8Array.from(s,c=>c.charCodeAt(0)); };
async function pipe(bytes, Stream, fmt){ return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream(fmt))).arrayBuffer()); }
async function exportCode(p){
  const keep = {id:p.id,name:p.name,avatar:p.avatar,best:p.best,q:p.q,days:p.days,medals:p.medals,cards:p.cards,played:p.played,fixed:p.fixed};
  let bytes = new TextEncoder().encode(JSON.stringify(keep)), tag = "J";
  if("CompressionStream" in window){ try{ bytes = await pipe(bytes, CompressionStream, "deflate-raw"); tag = "Z"; }catch(e){} }
  return `R3${tag}-${b64u(bytes)}`;
}
async function importCode(code){
  const m = String(code).replace(/\s+/g,"").match(/^R3([JZ])-([A-Za-z0-9_-]+)$/); if(!m) throw new Error("formato");
  let bytes = unb64u(m[2]); if(m[1]==="Z") bytes = await pipe(bytes, DecompressionStream, "deflate-raw");
  const d = JSON.parse(new TextDecoder().decode(bytes));
  if(!d || typeof d.name!=="string" || typeof d.q!=="object") throw new Error("datos");
  const p = Object.assign(newProfile(d.name.slice(0,20), AVATARS.includes(d.avatar)?d.avatar:AVATARS[0]), d, {sound:true, mission:null});
  return p;
}
function renderShare(){
  const p = me();
  app.append(topBar("Inicio", ()=>go("home")));
  const c = $(`<section class="card"><span class="label">Llevar mi avance</span><h1>Tu código de avance</h1>
    <p>Sirve para seguir en otro celular o tablet. Copialo y pegalo allá en <strong>“Tengo un código de avance”</strong>. Nadie lo recibe si no lo mandás vos.</p>
    <label class="sr" for="code">Código de avance</label><textarea id="code" class="fill code" readonly rows="4">Preparando…</textarea>
    <div class="actions"><button class="primary" id="cp">Copiar</button>${navigator.share?`<button class="ghost" id="sh">Compartir…</button>`:""}</div>
    <p class="note">Consejo para iPhone: si no agregás el juego a la pantalla de inicio, Safari puede borrar el avance después de una semana sin entrar. Guardar este código es la copia de seguridad.</p></section>`);
  app.append(c);
  const ta = c.querySelector("#code");
  exportCode(p).then(code=>{ ta.value = code; });
  c.querySelector("#cp").onclick = async ()=>{ try{ await navigator.clipboard.writeText(ta.value); toast("📋 Código copiado"); }catch(e){ ta.select(); document.execCommand && document.execCommand("copy"); toast("📋 Código copiado"); } };
  const sh = c.querySelector("#sh"); if(sh) sh.onclick = ()=>navigator.share({title:"Repaso 3er grado", text: ta.value}).catch(()=>{});
}
function renderImport(){
  const c = $(`<section class="card"><span class="label">Repaso 3er grado</span><h1>Pegá tu código de avance</h1><p>Lo sacás desde el otro equipo, en “Llevar mi avance a otro equipo”.</p>
    <label class="sr" for="code">Código de avance</label><textarea id="code" class="fill code" rows="4" placeholder="R3Z-…" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="fbslot"></div><div class="actions"><button class="primary" id="ok">Recuperar mi avance</button><button class="ghost" id="back">Volver</button></div></section>`);
  const ta = c.querySelector("textarea"), slot = c.querySelector(".fbslot");
  c.querySelector("#back").onclick = ()=>go(db.profiles.length?"who":"newp");
  c.querySelector("#ok").onclick = async ()=>{
    try{
      const p = await importCode(ta.value), i = db.profiles.findIndex(x=>x.id===p.id);
      if(i>=0){ if(!confirm(`Ya hay un jugador ${db.profiles[i].name} en este equipo. ¿Reemplazar su avance por el del código?`)) return; db.profiles[i]=p; } else db.profiles.push(p);
      db.active = p.id; save(); go("home"); toast(`¡Hola de nuevo, ${esc(p.name)}! Tu avance está acá.`);
    }catch(e){ slot.replaceChildren($(`<div class="fb bad" role="status">Ese código no funciona. Revisá que esté completo.</div>`)); }
  };
  app.append(c); setTimeout(()=>ta.focus(),50);
}

/* ---------- Arranque ---------- */
load();
fetch("banco.json").then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); }).then(b=>{
  BANK = b; S = b.subjects; S.forEach(s=>s.questions.forEach(q=>QBYID[q.id]=q));
  render();
}).catch(()=>{ app.replaceChildren($(`<section class="card"><h1>No pudimos cargar las preguntas</h1><p>Revisá la conexión y volvé a abrir la página.</p></section>`)); });

if("serviceWorker" in navigator && location.protocol!=="file:"){ addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
