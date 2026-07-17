
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const state = {
  country: localStorage.getItem("lingogo_country") || null,
  screen: "home",
  data: null,
  cardIndex: 0,
  revealed: false,
  category: "all",
  saved: JSON.parse(localStorage.getItem("lingogo_saved") || "{}"),
  xp: Number(localStorage.getItem("lingogo_xp") || 0)
};

const countryFiles = { japan:"data/japan.json", korea:"data/korea.json" };

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1400);
}

async function loadCountry(country){
  const res = await fetch(countryFiles[country]);
  state.data = await res.json();
  state.country = country;
  localStorage.setItem("lingogo_country", country);
  state.screen = "home";
  state.cardIndex = 0;
  render();
}

function speak(text, lang){
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = .82;
  speechSynthesis.speak(utter);
}

function savedKey(p){ return `${state.country}:${p.id}` }
function isSaved(p){ return !!state.saved[savedKey(p)] }
function toggleSaved(p){
  const key=savedKey(p);
  state.saved[key]=!state.saved[key];
  localStorage.setItem("lingogo_saved", JSON.stringify(state.saved));
  showToast(state.saved[key] ? "Saved ✓" : "Removed");
  render();
}

function addXP(amount){
  state.xp += amount;
  localStorage.setItem("lingogo_xp", state.xp);
  showToast(`+${amount} XP`);
}

function shell(content, active="home"){
  const d=state.data;
  return `<main class="shell">
    <div class="topbar">
      <button class="icon-btn" data-action="destinations">←</button>
      <div class="country-title"><h1>${d.flag} ${d.name}</h1><p>${d.subtitle}</p></div>
    </div>
    ${content}
  </main>
  <nav class="bottom-nav"><div class="bottom-inner">
    ${navButton("home","⌂","Home",active)}
    ${navButton("learn","◫","Learn",active)}
    ${navButton("show","▣","Show",active)}
    ${navButton("saved","♥","Saved",active)}
  </div></nav>`;
}
function navButton(screen,icon,label,active){
  return `<button class="nav-btn ${active===screen?"active":""}" data-screen="${screen}"><strong>${icon}</strong>${label}</button>`
}

function renderDestinations(){
  app.innerHTML=`<main class="shell">
    <div class="brand"><div><div class="logo">LingoGo</div><div class="tag">Travel smarter. Speak local.</div></div><span>✦</span></div>
    <section class="hero"><h1>Where are you going?</h1><p>Pick a destination and get the right words, right when you need them.</p></section>
    <section class="grid destinations">
      ${destinationCard("korea","🇰🇷","South Korea","Korean essentials for real travel")}
      ${destinationCard("japan","🇯🇵","Japan","Japanese essentials for real travel")}
    </section>
  </main>`;
}
function destinationCard(id,flag,name,desc){
  return `<button class="destination" data-country="${id}"><div class="wash"></div><div class="content"><div class="flag">${flag}</div><h2>${name}</h2><p>${desc}</p></div></button>`
}

function renderHome(){
  const d=state.data;
  app.innerHTML=shell(`
    <section class="hero"><h1>Ready when you are.</h1><p>Learn before you go. Speak when it matters.</p></section>
    <section class="stats">
      <div class="stat"><b>${state.xp}</b><span>XP</span></div>
      <div class="stat"><b>${Object.values(state.saved).filter(Boolean).length}</b><span>Saved</span></div>
      <div class="stat"><b>${d.phrases.length}</b><span>Phrases</span></div>
    </section>
    <section class="trip-phases">
      <button class="trip-card before-trip" data-screen="before">
        <div class="trip-card-emoji">✈️</div>
        <h2>Before Your Trip</h2>
        <p>Learn the essentials in just 10 minutes a day.</p>
      </button>
      <button class="trip-card during-trip" data-screen="show">
        <div class="trip-card-emoji">🌏</div>
        <h2>During Your Trip</h2>
        <p>Show phrases instantly and communicate with confidence.</p>
      </button>
    </section>
    <section class="additional-options">
      <button class="situation-button" data-screen="situations"><div class="emoji">🧭</div><h3>Situation Mode</h3><p>Eat, travel, shop, stay.</p></button>
    </section>
  `,"home");
}

function renderLearn(){
  const p=state.data.phrases[state.cardIndex % state.data.phrases.length];
  const answer=state.revealed?`<div class="answer"><div class="local">${p.local}</div><div class="roman">${p.roman}</div></div>`:"";
  app.innerHTML=shell(`
    <div class="section-title"><h2>Must Know 50</h2><small>${state.cardIndex+1} / ${state.data.phrases.length}</small></div>
    <div class="card-stage"><article class="flashcard">
      <div class="label">${p.category}</div>
      <div><h2>${p.english}</h2>${answer}</div>
      <div>
        ${state.revealed?`<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="speak" data-text="${encodeURIComponent(p.local)}">🔊 Listen</button>
          <button class="btn ghost" data-action="save-current">${isSaved(p)?"♥ Saved":"♡ Save"}</button>
        </div>`:`<button class="btn" data-action="reveal">Reveal</button>`}
      </div>
    </article></div>
    ${state.revealed?`<div class="review-actions"><button class="btn secondary" data-action="again">Again</button><button class="btn" data-action="gotit">Got it</button></div>`:""}
  `,"learn");
}

function categories(){
  return [...new Set(state.data.phrases.map(p=>p.category))];
}
function renderShow(){
  const filtered=state.category==="all"?state.data.phrases:state.data.phrases.filter(p=>p.category===state.category);
  app.innerHTML=shell(`
    <div class="section-title"><h2>Show to Local</h2><small>Tap to speak</small></div>
    <div class="quick"><button class="chip" data-category="all">All</button>${categories().map(c=>`<button class="chip" data-category="${c}">${c}</button>`).join("")}</div>
    <div class="list" style="margin-top:14px">${filtered.map(p=>`<article class="phrase">
      <div class="en">${p.english}</div><div class="local">${p.local}</div><div class="roman">${p.roman}</div>
      <div class="row"><button class="btn" data-speak="${encodeURIComponent(p.local)}">🔊 Play</button><button class="btn secondary" data-save="${p.id}">${isSaved(p)?"♥ Saved":"♡ Save"}</button></div>
    </article>`).join("")}</div>
  `,"show");
}
function renderSituations(){
  const icons={General:"💬",Food:"🍜",Transport:"🚆",Hotel:"🏨",Shopping:"🛍️",Emergency:"🆘",Cafe:"☕"};
  app.innerHTML=shell(`<div class="section-title"><h2>What are you about to do?</h2></div>
  <div class="categories">${categories().map(c=>`<button class="category" data-situation="${c}"><span>${icons[c]||"✦"}</span><b>${c}</b></button>`).join("")}</div>`,"home");
}
function renderSaved(){
  const phrases=state.data.phrases.filter(isSaved);
  app.innerHTML=shell(`<div class="section-title"><h2>Saved phrases</h2><small>${phrases.length}</small></div>
  ${phrases.length?`<div class="list">${phrases.map(p=>`<article class="phrase"><div class="en">${p.english}</div><div class="local">${p.local}</div><div class="roman">${p.roman}</div><div class="row"><button class="btn" data-speak="${encodeURIComponent(p.local)}">🔊 Play</button><button class="btn secondary" data-save="${p.id}">Remove</button></div></article>`).join("")}</div>`:`<div class="empty">Your saved travel phrases will appear here.</div>`}`,"saved");
}function renderBefore(){
  const d=state.data;
  const savedCount=Object.values(state.saved).filter(Boolean).length;
  app.innerHTML=shell(`
    <div class="section-title"><h2>Before Your Trip</h2><p>Prepare with our curated learning experience.</p></div>
    <section class="progress-summary">
      <div class="progress-stat"><b>${state.xp}</b><span>XP Earned</span></div>
      <div class="progress-stat"><b>${d.phrases.length}</b><span>Phrases Available</span></div>
      <div class="progress-stat"><b>${savedCount}</b><span>Saved</span></div>
    </section>
    <section class="before-hub-cards">
      <button class="hub-card" data-screen="learn">
        <div class="hub-emoji">🧠</div>
        <h3>Must Know 50</h3>
        <p>Fast active-recall cards to build fluency.</p>
      </button>
      <button class="hub-card coming-soon">
        <div class="hub-emoji">✓</div>
        <h3>Quiz</h3>
        <p>Quick challenges are coming soon.</p>
      </button>
      <button class="hub-card" data-screen="saved">
        <div class="hub-emoji">♥</div>
        <h3>Saved Phrases</h3>
        <p>Review your personal phrase collection.</p>
      </button>
    </section>
  `,"before");
}function render(){
  if(!state.country||!state.data) return renderDestinations();
  ({home:renderHome,before:renderBefore,learn:renderLearn,show:renderShow,situations:renderSituations,saved:renderSaved}[state.screen]||renderHome)();
}

document.addEventListener("click",e=>{
  const country=e.target.closest("[data-country]")?.dataset.country;
  if(country) return loadCountry(country);
  const screen=e.target.closest("[data-screen]")?.dataset.screen;
  if(screen){state.screen=screen;return render()}
  const action=e.target.closest("[data-action]")?.dataset.action;
  if(action==="destinations"){state.country=null;state.data=null;localStorage.removeItem("lingogo_country");return render()}
  if(action==="reveal"){state.revealed=true;render();const p=state.data.phrases[state.cardIndex%state.data.phrases.length];setTimeout(()=>speak(p.local,state.data.lang),100)}
  if(action==="again"){state.revealed=false;state.cardIndex=(state.cardIndex+1)%state.data.phrases.length;render()}
  if(action==="gotit"){addXP(10);state.revealed=false;state.cardIndex=(state.cardIndex+1)%state.data.phrases.length;render()}
  if(action==="save-current"){toggleSaved(state.data.phrases[state.cardIndex%state.data.phrases.length])}
  if(action==="speak"){speak(decodeURIComponent(e.target.closest("[data-text]").dataset.text),state.data.lang)}
  const speech=e.target.closest("[data-speak]")?.dataset.speak;
  if(speech)speak(decodeURIComponent(speech),state.data.lang);
  const save=e.target.closest("[data-save]")?.dataset.save;
  if(save)toggleSaved(state.data.phrases.find(p=>p.id===save));
  const cat=e.target.closest("[data-category]")?.dataset.category;
  if(cat){state.category=cat;render()}
  const sit=e.target.closest("[data-situation]")?.dataset.situation;
  if(sit){state.category=sit;state.screen="show";render()}
});

if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
if(state.country) loadCountry(state.country); else render();
