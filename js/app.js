
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
  xp: Number(localStorage.getItem("lingogo_xp") || 0),
  backTarget: "home",
  quizActive: false,
  quizIndex: 0,
  quizScore: 0,
  quizQuestions: [],
  quizAnswered: false,
  quizAnswerCorrect: null,
  quizSelectedAnswer: null,
  activeLessonId: null,
  lessonCardIndex: 0,
  lessonRevealed: false,
  lessonCompleted: false,
  lessonXpEarned: 0,
  lessonAnswering: false
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
  resetQuizState();
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

function generateQuizQuestions(phrases, count=10){
  if(phrases.length<4) return [];
  const questions=[];
  const usedIds=new Set();
  while(questions.length<Math.min(count,phrases.length)){
    const correct=phrases[Math.floor(Math.random()*phrases.length)];
    if(usedIds.has(correct.id)) continue;
    usedIds.add(correct.id);
    const wrong=[...phrases].filter(p=>p.id!==correct.id).sort(()=>Math.random()-0.5).slice(0,3);
    const answers=[correct,...wrong].sort(()=>Math.random()-0.5);
    questions.push({phraseId:correct.id,english:correct.english,correctId:correct.id,answers:answers.map(a=>({id:a.id,local:a.local,roman:a.roman}))});
  }
  return questions;
}

function navigate(to,backTarget="home"){
  state.backTarget=backTarget;
  state.screen=to;
  render();
}

function resetQuizState(){
  state.quizActive=false;
  state.quizIndex=0;
  state.quizScore=0;
  state.quizQuestions=[];
  state.quizAnswered=false;
  state.quizAnswerCorrect=null;
  state.quizSelectedAnswer=null;
}

function getLessons(){
  return Array.isArray(state.data?.lessons) ? state.data.lessons : [];
}

function getLessonById(lessonId){
  return getLessons().find(lesson=>lesson.id===lessonId) || null;
}

function getPhraseById(phraseId){
  return state.data?.phrases?.find(phrase=>phrase.id===phraseId) || null;
}

function getLessonPhrases(lesson){
  if(!lesson) return [];
  const phrases=(lesson.phraseIds || []).map(getPhraseById).filter(Boolean);
  if(lesson.phraseIds && phrases.length!==lesson.phraseIds.length){
    console.warn(`Missing phrase IDs for lesson ${lesson.id}`);
  }
  return phrases;
}

function resetLessonState(){
  state.activeLessonId=null;
  state.lessonCardIndex=0;
  state.lessonRevealed=false;
  state.lessonCompleted=false;
  state.lessonXpEarned=0;
  state.lessonAnswering=false;
}

function getCurrentLesson(){
  return getLessonById(state.activeLessonId);
}

function getCurrentLessonPhrases(){
  return getLessonPhrases(getCurrentLesson());
}

function getCurrentLessonPhrase(){
  return getCurrentLessonPhrases()[state.lessonCardIndex] || null;
}

function returnToBeforeWithLessonUnavailable(){
  resetLessonState();
  state.backTarget="home";
  state.screen="before";
  render();
  showToast("Lesson unavailable.");
}

function startLesson(lessonId){
  const lesson=getLessonById(lessonId);
  if(!lesson){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const phrases=getLessonPhrases(lesson);
  if(phrases.length!==5){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  resetLessonState();
  state.activeLessonId=lessonId;
  state.backTarget="before";
  state.screen="lesson";
  render();
}

function advanceLesson(xpAmount){
  if(state.lessonCompleted || state.lessonAnswering || !state.lessonRevealed) return;
  const phrases=getCurrentLessonPhrases();
  if(phrases.length!==5){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  state.lessonAnswering=true;
  if(xpAmount){
    addXP(xpAmount);
    state.lessonXpEarned += xpAmount;
  }
  const nextIndex=state.lessonCardIndex+1;
  if(nextIndex>=phrases.length){
    completeLesson();
    return;
  }
  state.lessonCardIndex=nextIndex;
  state.lessonRevealed=false;
  state.lessonAnswering=false;
  render();
}

function completeLesson(){
  state.lessonCompleted=true;
  state.lessonAnswering=false;
  state.lessonRevealed=false;
  state.screen="lesson-complete";
  render();
}

function shell(content, active="home"){
  const d=state.data;
  return `<main class="shell">
    <div class="topbar">
      <button class="icon-btn" data-action="back">←</button>
      <div class="country-title"><h1>${d.flag} ${d.name}</h1><p>${d.subtitle}</p></div>
    </div>
    ${content}
  </main>
  <nav class="bottom-nav"><div class="bottom-inner">
    ${navButton("home","⌂","Home",active,true)}
    ${navButton("learn","◫","Learn",active,true)}
    ${navButton("show","▣","Show",active,true)}
    ${navButton("saved","♥","Saved",active,true)}
  </div></nav>`;
}
function navButton(screen,icon,label,active,isNav=false){
  return `<button class="nav-btn ${active===screen?"active":""}" data-screen="${screen}" ${isNav?'data-nav="bottom"':''}><strong>${icon}</strong>${label}</button>`
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
      <button class="trip-card during-trip" data-screen="during">
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

function renderLesson(){
  const lesson=getCurrentLesson();
  if(!lesson){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const phrases=getCurrentLessonPhrases();
  if(phrases.length!==5){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const phrase=phrases[state.lessonCardIndex];
  if(!phrase){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const answer=state.lessonRevealed?`<div class="answer"><div class="local">${phrase.local}</div><div class="roman">${phrase.roman}</div></div>`:"";
  app.innerHTML=shell(`
    <div class="section-title lesson-title"><h2>${lesson.title}</h2><small>${state.lessonCardIndex+1} / ${phrases.length}</small></div>
    <p class="lesson-progress">${state.lessonCardIndex+1} of ${phrases.length}</p>
    <div class="card-stage lesson-screen"><article class="flashcard">
      <div class="label">Lesson ${lesson.order}</div>
      <div><h2>${phrase.english}</h2>${answer}</div>
      <div>
        ${state.lessonRevealed?`<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="lesson-speak" data-text="${encodeURIComponent(phrase.local)}" aria-label="Listen to this phrase">🔊 Listen</button>
          <button class="btn ghost" data-action="lesson-save-current">${isSaved(phrase)?"♥ Saved":"♡ Save"}</button>
        </div>`:`<button class="btn" data-action="lesson-reveal">Reveal</button>`}
      </div>
    </article></div>
    ${state.lessonRevealed?`<div class="review-actions"><button class="btn secondary" data-action="lesson-again">Again</button><button class="btn" data-action="lesson-gotit">Got it</button></div>`:""}
  `,"learn");
}

function renderLessonComplete(){
  const lesson=getCurrentLesson();
  if(!lesson){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  app.innerHTML=shell(`
    <div class="lesson-complete">
      <div class="lesson-complete-kicker">Lesson ${lesson.order}</div>
      <h2>${lesson.title}</h2>
      <p>5 phrases reviewed</p>
      ${state.lessonXpEarned?`<div class="lesson-complete-xp">+${state.lessonXpEarned} XP earned</div>`:""}
      <div class="lesson-complete-actions">
        <button class="btn" data-action="lesson-replay">Replay Lesson</button>
        <button class="btn secondary" data-action="lesson-back-to-list">Back to Lessons</button>
      </div>
    </div>
  `,"learn");
}

function renderQuiz(){
  if(!state.quizActive||state.quizQuestions.length===0) return state.screen="before",render();
  const q=state.quizQuestions[state.quizIndex];
  const correctAnswer=q.answers.find(a=>a.id===q.correctId);
  const incorrectFeedback=state.quizAnswerCorrect?"":`<div class="quiz-feedback incorrect">Not quite — the correct answer is:<div class="quiz-correct-answer"><div class="quiz-correct-local">${correctAnswer.local}</div><div class="quiz-correct-roman">${correctAnswer.roman}</div></div></div>`;
  const correctFeedback=state.quizAnswerCorrect?`<div class="quiz-feedback correct">✓ Correct!</div>`:"";
  const feedback=state.quizAnswered?`${correctFeedback}${incorrectFeedback}`:"";
  app.innerHTML=shell(`<div class="section-title"><h2>Quiz</h2><small>${state.quizIndex+1} / ${state.quizQuestions.length}</small></div><div class="quiz-container"><div class="quiz-question"><h2>${q.english}</h2></div><div class="quiz-answers">${q.answers.map(a=>`<div class="answer-choice ${state.quizAnswered?(a.id===q.correctId?"correct":a.id===state.quizSelectedAnswer?"incorrect":"muted"):(a.id===state.quizSelectedAnswer?"selected":"")}"><button class="answer-select" data-answer-id="${a.id}" ${state.quizAnswered?'aria-disabled="true"':""}><div class="answer-local">${a.local}</div><div class="answer-roman">${a.roman}</div></button><button class="quiz-option-audio" data-action="speak-quiz-option" data-answer-id="${a.id}" aria-label="Hear this answer">🔊</button></div>`).join("")}</div>${feedback}${state.quizAnswered?`<div class="quiz-actions"><button class="btn" data-action="quiz-next">${state.quizIndex+1>=state.quizQuestions.length?"See Results":"Next Question"}</button><button class="btn secondary" data-action="end-quiz">End Quiz</button></div>`:""}</div>`,"quiz");
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
    <div class="quick"><button class="chip${state.category==="all"?" active":""}" data-category="all" ${state.category==="all"?'aria-current="true"':""}>All</button>${categories().map(c=>`<button class="chip${state.category===c?" active":""}" data-category="${c}" ${state.category===c?'aria-current="true"':""} >${c}</button>`).join("")}</div>
    <div class="list" style="margin-top:14px">${filtered.map(p=>`<article class="phrase">
      <div class="en">${p.english}</div><div class="local">${p.local}</div><div class="roman">${p.roman}</div>
      <div class="row"><button class="btn" data-speak="${encodeURIComponent(p.local)}">🔊 Play</button><button class="btn secondary" data-save="${p.id}">${isSaved(p)?"♥ Saved":"♡ Save"}</button></div>
    </article>`).join("")}</div>
  `,"show");
  requestAnimationFrame(()=>{
    const activeChip=app.querySelector('.quick [aria-current="true"]');
    if(activeChip){
      const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      activeChip.scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"nearest",inline:"center"});
    }
  });
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
  const lessons=getLessons();
  app.innerHTML=shell(`
    <div class="before-header">
      <h2>Before Your Trip</h2>
      <p>Build confidence before you arrive.</p>
    </div>
    <div class="before-progress">
      <p class="before-progress-main">You have ${d.phrases.length} phrases ready to practice.</p>
      <p class="before-progress-meta">${state.xp} XP earned · ${savedCount} phrase${savedCount!==1?'s':''} saved</p>
    </div>
    <section class="before-learning">
      <button class="learning-featured" data-screen="learn">
        <div class="learning-label">CONTINUE LEARNING</div>
        <h3>Must Know 50</h3>
        <p>Build your essential travel vocabulary.</p>
        <div class="learning-meta">
          <span>${d.phrases.length} phrases</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
    </section>
    <section class="before-actions">
      <button class="before-action-card before-action-quiz" data-action="start-quiz">
        <div class="action-content">
          <h4>Quiz</h4>
          <p>Test what you remember.</p>
          <div class="before-action-meta">10 quick questions</div>
        </div>
        <span class="action-arrow">→</span>
      </button>
      <button class="before-action-card before-action-saved" data-screen="saved">
        <div class="action-content">
          <h4>Saved Phrases</h4>
          <p>Review your personal collection.</p>
          <div class="before-action-meta">${savedCount} saved phrase${savedCount!==1?'s':''}</div>
        </div>
        <span class="action-arrow">→</span>
      </button>
    </section>
    <section class="before-lessons">
      <div class="section-title lesson-section-title"><h2>Your 10 Lessons</h2><small>5 phrases · 3 min each</small></div>
      ${lessons.length?`<div class="lesson-list">
        ${lessons.map(lesson=>`<button class="lesson-item" data-action="open-lesson" data-lesson-id="${lesson.id}" aria-label="Open Lesson ${lesson.order}, ${lesson.title}">
          <div class="lesson-item-top">
            <span class="lesson-number">Lesson ${lesson.order}</span>
            <span class="lesson-time">${lesson.estimatedMinutes} min</span>
          </div>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
          <small>5 phrases · ${lesson.estimatedMinutes} min</small>
        </button>`).join("")}
      </div>`:`<div class="empty">Lessons are not available yet.</div>`}
    </section>
  `,"before");
}
function renderDuring(){
  const savedCount=Object.values(state.saved).filter(Boolean).length;
  app.innerHTML=shell(`
    <div class="during-header">
      <h2>During Your Trip</h2>
      <p>Find the right phrase, fast.</p>
    </div>
    <section class="during-featured">
      <button class="during-show-card" data-situation="all">
        <div class="during-show-content">
          <div class="during-show-label">SHOW TO LOCAL</div>
          <h3>Browse every phrase and show it clearly.</h3>
        </div>
        <span class="during-show-arrow">→</span>
      </button>
    </section>
    <section class="during-categories">
      <h4 class="during-section-heading">Browse by situation</h4>
      <div class="during-cat-grid">
        <button class="during-cat-btn" data-situation="Food">Food</button>
        <button class="during-cat-btn" data-situation="Transport">Transport</button>
        <button class="during-cat-btn" data-situation="Hotel">Hotel</button>
        <button class="during-cat-btn" data-situation="Shopping">Shopping</button>
        <button class="during-cat-btn" data-situation="Cafe">Cafe</button>
        <button class="during-cat-btn" data-situation="Emergency">Emergency</button>
        <button class="during-cat-btn" data-situation="General">General</button>
      </div>
    </section>
    <section class="during-support">
      <button class="during-support-card" data-screen="saved">
        <div class="during-support-content">
          <h4>Saved Phrases</h4>
          <p>Your personal phrase collection.</p>
          <div class="during-support-meta">${savedCount} saved phrase${savedCount!==1?'s':''}</div>
        </div>
        <span class="during-support-arrow">→</span>
      </button>
    </section>
  `,"home");
}
function renderQuizResults(){
  const xpEarned=state.quizScore*5;
  const percent=Math.round((state.quizScore/state.quizQuestions.length)*100);
  const message=percent===100?"Perfect! 🏆":percent>=80?"Excellent! 🎉":percent>=60?"Great job! 👍":percent>=40?"Good effort! 📚":"Keep practicing! 💪";
  app.innerHTML=shell(`<div class="section-title"><h2>Quiz Complete</h2></div><div class="quiz-results"><div class="results-message">${message}</div><div class="results-score"><span class="score-label">Your Score</span><span class="score-value">${state.quizScore} / ${state.quizQuestions.length}</span></div><div class="results-xp">+${xpEarned} XP</div><button class="btn" data-action="quiz-again">Try Again</button><button class="btn secondary" data-action="back-to-before">Back to Learning</button></div>`,"before");
}
function render(){
  if(!state.country||!state.data) return renderDestinations();
  ({home:renderHome,before:renderBefore,during:renderDuring,learn:renderLearn,show:renderShow,situations:renderSituations,saved:renderSaved,quiz:renderQuiz,"quiz-results":renderQuizResults,lesson:renderLesson,"lesson-complete":renderLessonComplete}[state.screen]||renderHome)();
}

document.addEventListener("click",e=>{
  const country=e.target.closest("[data-country]")?.dataset.country;
  if(country) return loadCountry(country);

  // Bottom navigation — fixed parent rules
  const navBtn=e.target.closest("[data-nav='bottom']");
  if(navBtn){
    const navScreen=navBtn.dataset.screen;
    if(state.screen==="quiz"||state.screen==="quiz-results") resetQuizState();
    if(navScreen==="home"){state.backTarget="home";state.screen="home";render();}
    else if(navScreen==="learn") navigate("learn","before");
    else if(navScreen==="show") navigate("show","home");
    else if(navScreen==="saved") navigate("saved","home");
    return;
  }

  // Hub/screen buttons — explicit hierarchy
  const screenBtn=e.target.closest("[data-screen]");
  if(screenBtn){
    const to=screenBtn.dataset.screen;
    if(state.screen==="quiz"||state.screen==="quiz-results") resetQuizState();
    if(to==="before")     return navigate("before","home");
    if(to==="during")     return navigate("during","home");
    if(to==="learn")      return navigate("learn","before");
    if(to==="situations"){
      const parent=state.screen==="during"?"during":"home";
      return navigate("situations",parent);
    }
    if(to==="saved"){
      const parent=["before","during"].includes(state.screen)?state.screen:"home";
      return navigate("saved",parent);
    }
    state.screen=to; render(); return;
  }

  const lessonBtn=e.target.closest("[data-action='open-lesson']");
  if(lessonBtn){
    startLesson(lessonBtn.dataset.lessonId);
    return;
  }

  const action=e.target.closest("[data-action]")?.dataset.action;

  // Back
  if(action==="back"){
    if(state.screen==="home"){
      state.country=null;state.data=null;
      resetLessonState();
      localStorage.removeItem("lingogo_country");
      return render();
    }
    if(state.screen==="lesson"||state.screen==="lesson-complete"){
      resetLessonState();
      state.backTarget="home";
      state.screen="before";
      render();
      return;
    }
    if(state.screen==="quiz"||state.screen==="quiz-results"){
      resetQuizState();
      state.screen="before";state.backTarget="home";render();return;
    }
    const target=state.backTarget;
    state.screen=target;
    if(target==="before"||target==="during") state.backTarget="home";
    else if(target==="learn") state.backTarget="before";
    else state.backTarget="home";
    render();return;
  }

  if(action==="destinations"){state.country=null;state.data=null;localStorage.removeItem("lingogo_country");return render()}
  if(action==="lesson-reveal"){state.lessonRevealed=true;render();return}
  if(action==="lesson-speak"){
    const text=e.target.closest("[data-text]")?.dataset.text;
    if(text)speak(decodeURIComponent(text),state.data.lang);
    return;
  }
  if(action==="lesson-save-current"){const phrase=getCurrentLessonPhrase();if(phrase)toggleSaved(phrase);return}
  if(action==="lesson-again"){advanceLesson(0);return}
  if(action==="lesson-gotit"){advanceLesson(10);return}
  if(action==="lesson-replay"){const lessonId=state.activeLessonId;if(lessonId)startLesson(lessonId);return}
  if(action==="lesson-back-to-list"){resetLessonState();state.backTarget="home";state.screen="before";render();return}
  if(action==="speak-quiz-option"){
    const answerId=e.target.closest("[data-answer-id]").dataset.answerId;
    const q=state.quizQuestions[state.quizIndex];
    const answer=q.answers.find(a=>a.id===answerId);
    if(answer) speak(answer.local,state.data.lang);
  }
  const answerSelectBtn=e.target.closest(".answer-select");
  if(answerSelectBtn&&state.quizActive&&!state.quizAnswered){
    const answerId=answerSelectBtn.dataset.answerId;
    const q=state.quizQuestions[state.quizIndex];
    state.quizSelectedAnswer=answerId;
    state.quizAnswered=true;
    state.quizAnswerCorrect=answerId===q.correctId;
    if(state.quizAnswerCorrect) addXP(5),state.quizScore++;
    render();
  }
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
  if(sit){state.category=sit;navigate("show","during");}
  if(action==="start-quiz"){
    state.quizQuestions=generateQuizQuestions(state.data.phrases,10);
    if(state.quizQuestions.length<1) return showToast("Not enough phrases for quiz");
    state.quizActive=true;
    state.quizIndex=0;
    state.quizScore=0;
    state.quizAnswered=false;
    state.quizSelectedAnswer=null;
    state.quizAnswerCorrect=null;
    state.backTarget="before";
    state.screen="quiz";
    render();
  }
  if(action==="quiz-next"){
    if(state.quizIndex+1>=state.quizQuestions.length){
      state.screen="quiz-results";
    }else{
      state.quizIndex++;
      state.quizAnswered=false;
      state.quizSelectedAnswer=null;
      state.quizAnswerCorrect=null;
    }
    render();
  }
  if(action==="quiz-again"){
    const questions=generateQuizQuestions(state.data.phrases,10);
    if(questions.length<1) return showToast("Not enough phrases for quiz");
    resetQuizState();
    state.quizActive=true;
    state.quizQuestions=questions;
    state.backTarget="before";
    state.screen="quiz";
    render();
  }
  if(action==="back-to-before"){
    resetQuizState();
    state.backTarget="home";
    state.screen="before";
    render();
  }
  if(action==="end-quiz"){
    resetQuizState();
    state.backTarget="home";
    state.screen="before";
    render();
  }
});

if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
if(state.country) loadCountry(state.country); else render();
