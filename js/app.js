
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const learningProgressKey = "lingogo_learningProgress_v1";
const publicShareUrl = "https://jjloicfr22.github.io/lingogo/";
const publicShareText = "Practice essential Japanese and Korean travel phrases, even offline.";

function getCurrentTimestampIso(){
  return new Date().toISOString();
}

function parseIsoTimestamp(value){
  if(typeof value !== "string") return null;
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if(!isoPattern.test(value)) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function addDaysToIso(isoTimestamp, days){
  const parsed = Date.parse(isoTimestamp);
  if(!Number.isFinite(parsed) || !Number.isFinite(days) || days < 0) return null;
  return new Date(parsed + (Math.floor(days) * 86400000)).toISOString();
}

function getNextReviewIntervalDays(currentDays, outcome){
  if(outcome === "again") return 1;
  if(outcome !== "gotit") return null;
  if(currentDays <= 0) return 1;
  if(currentDays < 1) return 1;
  if(currentDays < 3) return 3;
  if(currentDays < 7) return 7;
  if(currentDays < 14) return 14;
  return 30;
}

function isPlainObject(value){
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function toSafeCount(value){
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function clampLessonIndex(value){
  const index = Number(value);
  if(!Number.isFinite(index)) return 0;
  return Math.min(4, Math.max(0, Math.floor(index)));
}

function createCountryProgress(){
  return {
    phrases: {},
    lessons: {},
    lastActiveLessonId: null
  };
}

function normalizePhraseProgress(record){
  if(!isPlainObject(record)) return null;
  return {
    seenCount: toSafeCount(record.seenCount),
    gotItCount: toSafeCount(record.gotItCount),
    againCount: toSafeCount(record.againCount),
    mastered: record.mastered === true,
    firstSeenAt: typeof record.firstSeenAt === "string" ? record.firstSeenAt : null,
    lastSeenAt: typeof record.lastSeenAt === "string" ? record.lastSeenAt : null,
    lastOutcome: record.lastOutcome === "again" || record.lastOutcome === "gotit" ? record.lastOutcome : null,
    nextReviewAt: parseIsoTimestamp(record.nextReviewAt),
    reviewIntervalDays: toSafeCount(record.reviewIntervalDays),
    reviewCount: toSafeCount(record.reviewCount)
  };
}

function normalizeLessonProgress(record){
  if(!isPlainObject(record)) return null;
  return {
    startedAt: typeof record.startedAt === "string" ? record.startedAt : null,
    completedAt: typeof record.completedAt === "string" ? record.completedAt : null,
    lastCardIndex: clampLessonIndex(record.lastCardIndex),
    timesCompleted: toSafeCount(record.timesCompleted)
  };
}

function normalizeCountryProgress(record){
  const normalized = createCountryProgress();
  if(!isPlainObject(record)) return normalized;
  if(isPlainObject(record.phrases)){
    for(const [phraseId, phraseRecord] of Object.entries(record.phrases)){
      const normalizedPhrase = normalizePhraseProgress(phraseRecord);
      if(normalizedPhrase) normalized.phrases[phraseId] = normalizedPhrase;
    }
  }
  if(isPlainObject(record.lessons)){
    for(const [lessonId, lessonRecord] of Object.entries(record.lessons)){
      const normalizedLesson = normalizeLessonProgress(lessonRecord);
      if(normalizedLesson) normalized.lessons[lessonId] = normalizedLesson;
    }
  }
  normalized.lastActiveLessonId = typeof record.lastActiveLessonId === "string" ? record.lastActiveLessonId : null;
  return normalized;
}

function normalizeLearningProgress(raw){
  const normalized = { version: 2, countries: {} };
  if(!isPlainObject(raw) || !isPlainObject(raw.countries)) return normalized;
  for(const [country, countryRecord] of Object.entries(raw.countries)){
    if(!isPlainObject(countryRecord)) continue;
    normalized.countries[country] = normalizeCountryProgress(countryRecord);
  }
  return normalized;
}

function loadLearningProgress(){
  try{
    const parsed = JSON.parse(localStorage.getItem(learningProgressKey) || "null");
    return normalizeLearningProgress(parsed);
  }catch{
    return { version: 2, countries: {} };
  }
}

function saveLearningProgress(){
  try{
    localStorage.setItem(learningProgressKey, JSON.stringify(state.learningProgress));
  }catch{
    // Ignore storage failures.
  }
}

function readPhraseProgress(country, phraseId){
  const countryProgress = state.learningProgress.countries[country];
  const phraseRecord = countryProgress?.phrases?.[phraseId];
  return isPlainObject(phraseRecord) ? phraseRecord : null;
}

function ensureCountryProgress(country = state.country){
  if(!country) return null;

  if(!isPlainObject(state.learningProgress.countries[country])){
    state.learningProgress.countries[country] = createCountryProgress();
  }

  const countryProgress = state.learningProgress.countries[country];

  if(!isPlainObject(countryProgress.phrases)){
    countryProgress.phrases = {};
  }

  if(!isPlainObject(countryProgress.lessons)){
    countryProgress.lessons = {};
  }

  if(
    countryProgress.lastActiveLessonId !== null &&
    typeof countryProgress.lastActiveLessonId !== "string"
  ){
    countryProgress.lastActiveLessonId = null;
  }

  return countryProgress;
}

function ensurePhraseProgress(country, phraseId){
  const countryProgress = ensureCountryProgress(country);
  if(!countryProgress || !phraseId) return null;
  if(!isPlainObject(countryProgress.phrases[phraseId])){
    countryProgress.phrases[phraseId] = {
      seenCount: 0,
      gotItCount: 0,
      againCount: 0,
      mastered: false,
      firstSeenAt: null,
      lastSeenAt: null,
      lastOutcome: null,
      nextReviewAt: null,
      reviewIntervalDays: 0,
      reviewCount: 0
    };
  }
  return countryProgress.phrases[phraseId];
}

function ensureLessonProgress(country, lessonId){
  const countryProgress = ensureCountryProgress(country);
  if(!countryProgress || !lessonId) return null;
  if(!isPlainObject(countryProgress.lessons[lessonId])){
    countryProgress.lessons[lessonId] = {
      startedAt: null,
      completedAt: null,
      lastCardIndex: 0,
      timesCompleted: 0
    };
  }
  return countryProgress.lessons[lessonId];
}

function getCountryProgress(country = state.country){
  return ensureCountryProgress(country);
}

function getPhraseProgress(country, phraseId){
  return ensurePhraseProgress(country, phraseId);
}

function getLessonProgress(country, lessonId){
  return ensureLessonProgress(country, lessonId);
}

function getMasteredPhraseCount(country = state.country){
  const countryProgress = getCountryProgress(country);
  if(!countryProgress) return 0;
  const validPhraseIds = new Set((state.data?.phrases || []).map(phrase => phrase.id));
  return Object.entries(countryProgress.phrases).reduce((count, [phraseId, record]) => {
    return count + (validPhraseIds.has(phraseId) && isPlainObject(record) && record.mastered ? 1 : 0);
  }, 0);
}

function formatDuePhraseCount(dueCount){
  return dueCount === 1 ? "1 phrase due" : `${dueCount} phrases due`;
}

function isPhraseDue(record, nowIso = getCurrentTimestampIso()){
  if(!isPlainObject(record)) return false;
  if(!record.nextReviewAt) return false;
  const parsedNext = Date.parse(record.nextReviewAt);
  const parsedNow = Date.parse(nowIso);
  return Number.isFinite(parsedNext) && Number.isFinite(parsedNow) && parsedNext <= parsedNow;
}

function getDuePhraseCount(country = state.country){
  const nowIso = getCurrentTimestampIso();
  return (state.data?.phrases || []).reduce((count, phrase) => {
    const progress = readPhraseProgress(country, phrase.id);
    return count + (progress && progress.seenCount > 0 && isPhraseDue(progress, nowIso) ? 1 : 0);
  }, 0);
}

function getEarliestNextReviewAt(country = state.country){
  const nowIso = getCurrentTimestampIso();
  const timestamps = (state.data?.phrases || [])
    .map(phrase => readPhraseProgress(country, phrase.id))
    .filter(progress => progress && progress.seenCount > 0 && progress.nextReviewAt && Number.isFinite(Date.parse(progress.nextReviewAt)) && Date.parse(progress.nextReviewAt) > Date.parse(nowIso))
    .map(progress => progress.nextReviewAt)
    .sort((a, b) => Date.parse(a) - Date.parse(b));
  return timestamps[0] || null;
}

function formatNextReviewMessage(country = state.country, nowIso = getCurrentTimestampIso()){
  if(getDuePhraseCount(country) > 0){
    return "More review is available now.";
  }
  const earliest = getEarliestNextReviewAt(country);
  if(!earliest) return "Your next scheduled review is soon.";
  const diffMs = Date.parse(earliest) - Date.parse(nowIso);
  if(!Number.isFinite(diffMs) || diffMs <= 0) return "Your next scheduled review is soon.";
  const days = Math.max(1, Math.ceil(diffMs / 86400000));
  return days === 1 ? "Your next scheduled review is in about 1 day." : `Your next scheduled review is in about ${days} days.`;
}

function buildDailyReviewQueue(country = state.country, maxCount = 10){
  const nowIso = getCurrentTimestampIso();
  const seen = new Set();
  const dueAgain = [];
  const dueOther = [];
  const savedSeen = [];
  const seenPhrases = [];
  for(const phrase of state.data?.phrases || []){
    const progress = readPhraseProgress(country, phrase.id);
    if(!progress || progress.seenCount <= 0) continue;
    const saved = !!state.saved[savedKey(phrase)];
    const due = progress.nextReviewAt && Number.isFinite(Date.parse(progress.nextReviewAt)) && Date.parse(progress.nextReviewAt) <= Date.parse(nowIso);
    if(progress.lastOutcome === "again" && due) dueAgain.push(phrase);
    else if(due) dueOther.push(phrase);
    else if(saved) savedSeen.push(phrase);
    else seenPhrases.push(phrase);
  }
  const sortByDue = (a, b) => (Date.parse(readPhraseProgress(country, a.id)?.nextReviewAt || "") || Infinity) - (Date.parse(readPhraseProgress(country, b.id)?.nextReviewAt || "") || Infinity) || a.id.localeCompare(b.id);
  const sortBySeen = (a, b) => (Date.parse(readPhraseProgress(country, b.id)?.lastSeenAt || "") || 0) - (Date.parse(readPhraseProgress(country, a.id)?.lastSeenAt || "") || 0) || a.id.localeCompare(b.id);
  const ordered = [...dueAgain.sort(sortByDue), ...dueOther.sort(sortByDue), ...savedSeen.sort(sortBySeen), ...seenPhrases.sort(sortBySeen)];
  const queue = [];
  for(const phrase of ordered){
    if(seen.has(phrase.id)) continue;
    seen.add(phrase.id);
    queue.push(phrase.id);
    if(queue.length >= maxCount) break;
  }
  return queue;
}

function getReviewStatusText(country = state.country){
  const dueCount = getDuePhraseCount(country);
  if(dueCount > 0) return formatDuePhraseCount(dueCount);
  const queue = buildDailyReviewQueue(country, 10);
  if(queue.length > 0) return "Practice available";
  return "No review phrases yet";
}

function recordPhraseOutcome(phrase, outcome, options = {}){
  if(!state.country || !phrase?.id) return false;
  if(outcome !== "again" && outcome !== "gotit") return false;
  const progress = ensurePhraseProgress(state.country, phrase.id);
  if(!progress) return false;
  const nowIso = options.nowIso || getCurrentTimestampIso();
  if(!progress.firstSeenAt) progress.firstSeenAt = nowIso;
  progress.lastSeenAt = nowIso;
  progress.lastOutcome = outcome;
  progress.reviewCount = toSafeCount(progress.reviewCount) + 1;
  if(outcome === "again"){
    progress.againCount = toSafeCount(progress.againCount) + 1;
    progress.reviewIntervalDays = 1;
    progress.nextReviewAt = addDaysToIso(nowIso, 1);
  }else{
    progress.gotItCount = toSafeCount(progress.gotItCount) + 1;
    progress.mastered = true;
    progress.reviewIntervalDays = getNextReviewIntervalDays(progress.reviewIntervalDays, "gotit");
    progress.nextReviewAt = addDaysToIso(nowIso, progress.reviewIntervalDays || 1);
  }
  if(options.awardXP){
    addXP(options.awardXP);
  }
  saveLearningProgress();
  return true;
}

function getReadinessLabel(percent){
  if(percent >= 100) return "Essential phrases complete";
  if(percent >= 80) return "Almost ready";
  if(percent >= 60) return "Travel ready";
  if(percent >= 40) return "Finding your footing";
  if(percent >= 20) return "Building the basics";
  return "Getting started";
}

function getTripReadiness(country = state.country){
  const totalPhraseCount = Array.isArray(state.data?.phrases) ? state.data.phrases.length : 0;
  const masteredCount = getMasteredPhraseCount(country);
  const percent = totalPhraseCount ? Math.round((masteredCount / totalPhraseCount) * 100) : 0;
  return {
    masteredCount,
    totalPhraseCount,
    percent,
    label: getReadinessLabel(percent),
    summary: `${masteredCount} of ${totalPhraseCount} essential phrases learned`
  };
}

function getSavedPhraseCount(country = state.country){
  if(!country) return 0;
  return Object.entries(state.saved).reduce((count, [key, value]) => {
    return count + (value && key.startsWith(`${country}:`) ? 1 : 0);
  }, 0);
}

function getLessonProgressSummary(country = state.country){
  const lessons = getLessons();
  let completedCount = 0;
  let reviewedCount = 0;
  for(const lesson of lessons){
    const progress = getLessonProgress(country, lesson.id);
    if(progress?.completedAt) completedCount += 1;
    if(isLessonReviewed(country, lesson)) reviewedCount += 1;
  }
  return {
    totalLessons: lessons.length,
    completedCount,
    reviewedCount
  };
}

function renderReadinessRing(percent, { size = 168, stroke = 12, compact = false, label = "Trip readiness" } = {}){
  const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = Math.max(1, (size - stroke) / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (safePercent / 100));
  return `<div class="readiness-ring ${compact ? "is-compact" : ""}" role="img" aria-label="${label}: ${safePercent}%">
    <svg class="readiness-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">
      <circle class="readiness-ring-track" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}"></circle>
      <circle class="readiness-ring-fill" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}" data-ring-offset="${offset.toFixed(2)}" style="stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${circumference.toFixed(2)}"></circle>
    </svg>
    <div class="readiness-ring-center"><b>${safePercent}%</b></div>
  </div>`;
}

function primeReadinessRings(){
  const circles = app.querySelectorAll(".readiness-ring-fill[data-ring-offset]");
  circles.forEach(circle => {
    if(circle.dataset.ringAnimated === "true") return;
    const targetOffset = Number(circle.dataset.ringOffset);
    if(!Number.isFinite(targetOffset)) return;
    circle.dataset.ringAnimated = "true";
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = String(targetOffset);
    });
  });
}

function openProgressSummary(fromScreen){
  state.progressBackTarget = fromScreen === "before" ? "before" : "home";
  state.screen = "progress";
  render();
}

async function copyShareLink(){
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(publicShareUrl);
      showToast("Link copied");
      state.shareFallbackVisible = false;
      render();
      return true;
    }
  }catch{
    // Continue to legacy fallback.
  }

  const textarea = document.createElement("textarea");
  textarea.value = publicShareUrl;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let didCopy = false;
  try{
    didCopy = document.execCommand("copy");
  }catch{
    didCopy = false;
  }
  document.body.removeChild(textarea);
  if(didCopy){
    showToast("Link copied");
    state.shareFallbackVisible = false;
    render();
    return true;
  }
  return false;
}

async function shareLingoGo(){
  if(navigator.share){
    try{
      await navigator.share({
        title: "LingoGo",
        text: publicShareText,
        url: publicShareUrl
      });
      return;
    }catch(error){
      if(error?.name === "AbortError") return;
    }
  }
  const copied = await copyShareLink();
  if(!copied){
    state.shareFallbackVisible = true;
    render();
  }
}

function getLessonMasteryCount(country, lesson){
  const countryProgress = getCountryProgress(country);
  if(!countryProgress || !lesson) return 0;
  const validPhraseIds = new Set((lesson.phraseIds || []).filter(phraseId => !!getPhraseById(phraseId)));
  return Object.entries(countryProgress.phrases).reduce((count, [phraseId, record]) => {
    return count + (validPhraseIds.has(phraseId) && isPlainObject(record) && record.mastered ? 1 : 0);
  }, 0);
}

function isLessonMastered(country, lesson){
  return getLessonMasteryCount(country, lesson) === 5;
}

function isLessonReviewed(country, lesson){
  const lessonProgress = getLessonProgress(country, lesson?.id);
  return !!lessonProgress?.completedAt && !isLessonMastered(country, lesson);
}

function getContinueLearningPlan(country = state.country){
  const lessons = getLessons();
  if(!lessons.length){
    return {
      label: "Must Know 50",
      description: "Continue the full phrase deck.",
      action: "learn",
      lessonId: null,
      resume: false
    };
  }
  const countryProgress = getCountryProgress(country);
  const lastActiveLessonId = countryProgress?.lastActiveLessonId;
  const activeLesson = lastActiveLessonId ? getLessonById(lastActiveLessonId) : null;
  const activeProgress = activeLesson ? getLessonProgress(country, activeLesson.id) : null;
  if(activeLesson && activeProgress?.startedAt && !activeProgress.completedAt){
    const masteredCount = getLessonMasteryCount(country, activeLesson);
    return {
      label: `Continue Lesson ${activeLesson.order}`,
      description: `${masteredCount}/5 mastered · resume at card ${clampLessonIndex(activeProgress.lastCardIndex) + 1}`,
      action: "lesson",
      lessonId: activeLesson.id,
      resume: true
    };
  }
  const firstIncomplete = lessons.find(lesson => !isLessonReviewed(country, lesson) && !isLessonMastered(country, lesson));
  if(firstIncomplete){
    const firstProgress = getLessonProgress(country, firstIncomplete.id);
    const started = !!firstProgress?.startedAt && !firstProgress?.completedAt;
    const masteredCount = getLessonMasteryCount(country, firstIncomplete);
    return {
      label: started ? `Continue Lesson ${firstIncomplete.order}` : `Start Lesson ${firstIncomplete.order}`,
      description: started
        ? `${masteredCount}/5 mastered · resume at card ${clampLessonIndex(firstProgress.lastCardIndex) + 1}`
        : `${masteredCount}/5 mastered · begin the lesson`,
      action: "lesson",
      lessonId: firstIncomplete.id,
      resume: started
    };
  }
  return {
    label: "All lessons reviewed",
    description: "Review Lesson 1 or revisit Must Know 50.",
    action: "lesson",
    lessonId: lessons[0].id,
    resume: false
  };
}

function recordPhraseSeenOnce(flow, phrase){
  if(!state.country || !phrase?.id) return;
  const trackerKey = flow === "lesson" ? "lessonSeenRecordedPhraseId" : flow === "learn" ? "learnSeenRecordedPhraseId" : null;
  if(!trackerKey) return;
  if(state[trackerKey] === phrase.id) return;
  const progress = getPhraseProgress(state.country, phrase.id);
  if(!progress) return;
  state[trackerKey] = phrase.id;
  const now = new Date().toISOString();
  progress.seenCount = toSafeCount(progress.seenCount) + 1;
  if(!progress.firstSeenAt) progress.firstSeenAt = now;
  progress.lastSeenAt = now;
  saveLearningProgress();
}
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
  learningProgress: loadLearningProgress(),
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
  lessonAnswering: false,
  learnSeenRecordedPhraseId: null,
  lessonSeenRecordedPhraseId: null,
  learnAnswering: false,
  reviewQueueIds: [],
  reviewIndex: 0,
  reviewRevealed: false,
  reviewAnswering: false,
  reviewCompleted: false,
  reviewSessionXp: 0,
  reviewEncounterCount: 0,
  reviewEncounteredIds: new Set(),
  reviewRequeuedIds: new Set(),
  progressBackTarget: "home",
  shareFallbackVisible: false
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
  ensureCountryProgress(country);
  saveLearningProgress();
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

function triggerSuccessPulse(button){
  if(!button) return;
  button.classList.remove("success-pulse");
  void button.offsetWidth;
  button.classList.add("success-pulse");
  setTimeout(() => button.classList.remove("success-pulse"), 260);
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
  state.lessonSeenRecordedPhraseId=null;
}

function resetReviewState(){
  state.reviewQueueIds=[];
  state.reviewIndex=0;
  state.reviewRevealed=false;
  state.reviewAnswering=false;
  state.reviewCompleted=false;
  state.reviewSessionXp=0;
  state.reviewEncounterCount=0;
  state.reviewEncounteredIds=new Set();
  state.reviewRequeuedIds=new Set();
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

function getCurrentReviewPhrase(){
  while(state.reviewIndex < state.reviewQueueIds.length){
    const phrase = getPhraseById(state.reviewQueueIds[state.reviewIndex]);
    if(phrase) return phrase;
    state.reviewIndex += 1;
  }
  return null;
}

function startDailyReview(){
  resetLessonState();
  resetReviewState();
  state.reviewQueueIds=buildDailyReviewQueue(state.country,10);
  state.backTarget="before";
  state.screen=state.reviewQueueIds.length ? "review" : "review-empty";
  render();
}

function advanceReviewCard(outcome){
  if(state.reviewCompleted || state.reviewAnswering || !state.reviewRevealed) return;
  const phrase = getCurrentReviewPhrase();
  if(!phrase) return;
  state.reviewAnswering=true;
  const didRecord = recordPhraseOutcome(phrase, outcome, { awardXP: outcome === "gotit" ? 10 : 0 });
  if(!didRecord){
    state.reviewAnswering=false;
    return;
  }
  if(outcome === "gotit"){
    state.reviewSessionXp += 10;
  }
  state.reviewEncounterCount += 1;
  state.reviewEncounteredIds.add(phrase.id);
  if(outcome === "again" && !state.reviewRequeuedIds.has(phrase.id)){
    state.reviewRequeuedIds.add(phrase.id);
    state.reviewQueueIds.push(phrase.id);
  }
  state.reviewRevealed=false;
  state.reviewIndex += 1;
  state.reviewAnswering=false;
  if(state.reviewIndex >= state.reviewQueueIds.length){
    state.reviewCompleted=true;
    state.screen="review-complete";
  }
  render();
}

function persistCurrentLessonPosition(){
  const lesson = getCurrentLesson();
  if(!lesson || !state.country) return;
  const lessonProgress = getLessonProgress(state.country, lesson.id);
  const countryProgress = getCountryProgress(state.country);
  if(!lessonProgress || !countryProgress) return;
  if(!lessonProgress.startedAt) lessonProgress.startedAt = new Date().toISOString();
  lessonProgress.lastCardIndex = clampLessonIndex(state.lessonCardIndex);
  countryProgress.lastActiveLessonId = lesson.id;
  saveLearningProgress();
}

function completeLessonProgress(){
  const lesson = getCurrentLesson();
  if(!lesson || !state.country) return;
  const lessonProgress = getLessonProgress(state.country, lesson.id);
  const countryProgress = getCountryProgress(state.country);
  if(!lessonProgress || !countryProgress) return;
  const now = new Date().toISOString();
  lessonProgress.completedAt = lessonProgress.completedAt || now;
  lessonProgress.timesCompleted = toSafeCount(lessonProgress.timesCompleted) + 1;
  lessonProgress.lastCardIndex = 4;
  countryProgress.lastActiveLessonId = lesson.id;
  saveLearningProgress();
}

function startLesson(lessonId, { resume = false } = {}){
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
  state.activeLessonId=lesson.id;
  state.lessonXpEarned=0;
  state.backTarget="before";
  const lessonProgress = getLessonProgress(state.country, lesson.id);
  const canResume = resume && !!lessonProgress?.startedAt && !lessonProgress?.completedAt;
  state.lessonCardIndex = canResume ? clampLessonIndex(lessonProgress.lastCardIndex) : 0;
  if(lessonProgress && !lessonProgress.startedAt) lessonProgress.startedAt = new Date().toISOString();
  const countryProgress = getCountryProgress(state.country);
  if(countryProgress) countryProgress.lastActiveLessonId = lesson.id;
  saveLearningProgress();
  state.screen="lesson";
  render();
}

function advanceLesson(outcome){
  if(state.lessonCompleted || state.lessonAnswering || !state.lessonRevealed) return;
  if(outcome!=="again" && outcome!=="gotit") return;
  const phrases=getCurrentLessonPhrases();
  if(phrases.length!==5){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const lesson = getCurrentLesson();
  const phrase = getCurrentLessonPhrase();
  if(!lesson || !phrase) return;
  state.lessonAnswering=true;
  const didRecord = recordPhraseOutcome(phrase, outcome, { awardXP: outcome === "gotit" ? 10 : 0 });
  if(!didRecord){
    state.lessonAnswering=false;
    return;
  }
  if(outcome==="gotit"){
    state.lessonXpEarned += 10;
  }
  const nextIndex=state.lessonCardIndex+1;
  if(nextIndex>=phrases.length){
    completeLessonProgress();
    state.lessonCompleted=true;
    state.lessonRevealed=false;
    state.lessonAnswering=false;
    state.screen="lesson-complete";
    render();
    return;
  }
  state.lessonCardIndex=nextIndex;
  state.lessonRevealed=false;
  state.lessonSeenRecordedPhraseId=null;
  state.lessonAnswering=false;
  persistCurrentLessonPosition();
  render();
}

function answerLearnCard(outcome){
  if(state.learnAnswering || !state.revealed) return;
  if(outcome!=="again" && outcome!=="gotit") return;
  const phrase=state.data.phrases[state.cardIndex % state.data.phrases.length];
  if(!phrase) return;
  state.learnAnswering=true;
  const didRecord = recordPhraseOutcome(phrase, outcome, { awardXP: outcome === "gotit" ? 10 : 0 });
  if(!didRecord){
    state.learnAnswering=false;
    return;
  }
  state.revealed=false;
  state.cardIndex=(state.cardIndex+1)%state.data.phrases.length;
  state.learnSeenRecordedPhraseId=null;
  state.learnAnswering=false;
  render();
}

function getCountryTheme(country){
  if(country==="japan") return "japan";
  if(country==="korea") return "korea";
  return "default";
}

function shell(content, active="home"){
  const d=state.data;
  const countryTheme=getCountryTheme(state.country);
  return `<main class="shell" data-country-theme="${countryTheme}" data-screen="${state.screen}">
    <div class="topbar">
      <button class="icon-btn" data-action="back">←</button>
      <div class="country-title"><h1>${d.flag} ${d.name}</h1><p>${d.subtitle}</p></div>
    </div>
    <div class="screen-content">${content}</div>
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
  const savedCount=getSavedPhraseCount(state.country);
  app.innerHTML=shell(`
    <section class="hero"><h1>Ready when you are.</h1><p>Learn before you go. Speak when it matters.</p></section>
    <section class="stats">
      <button class="stat stat-pill" data-action="open-progress-home" aria-label="Open progress summary. ${state.xp} total XP."><b>${state.xp}</b><span>XP</span></button>
      <button class="stat stat-pill" data-action="home-open-saved" aria-label="Open saved phrases. ${savedCount} saved."><b>${savedCount}</b><span>Saved</span></button>
      <button class="stat stat-pill" data-action="home-open-learn" aria-label="Open Must Know 50 with ${d.phrases.length} phrases."><b>${d.phrases.length}</b><span>Phrases</span></button>
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
      <button class="share-lingogo" data-action="share-lingogo" aria-label="Share LingoGo with a public link">
        <div class="emoji">🔗</div>
        <h3>Share LingoGo</h3>
        <p>Send the public app link.</p>
      </button>
      ${state.shareFallbackVisible ? `<div class="share-fallback" role="status" aria-live="polite">
        <p>Public URL</p>
        <input type="text" readonly value="${publicShareUrl}" aria-label="Public LingoGo URL" />
        <button class="btn secondary" data-action="copy-share-url">Copy Link</button>
      </div>` : ""}
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
  const masteredCount=getLessonMasteryCount(state.country, lesson);
  const completionLabel=masteredCount===5 ? "Mastered" : "Reviewed";
  app.innerHTML=shell(`
    <div class="lesson-complete">
      <div class="lesson-complete-kicker">${completionLabel}</div>
      <h2>${lesson.title}</h2>
      <p>${masteredCount}/5 mastered · ${completionLabel}</p>
      ${state.lessonXpEarned?`<div class="lesson-complete-xp">+${state.lessonXpEarned} XP earned</div>`:""}
      <div class="lesson-complete-actions">
        <button class="btn" data-action="lesson-replay">Replay Lesson</button>
        <button class="btn secondary" data-action="lesson-back-to-list">Back to Lessons</button>
      </div>
    </div>
  `,"learn");
}

function renderReviewEmpty(){
  app.innerHTML=shell(`
    <div class="review-empty">
      <div class="lesson-complete-kicker">Daily Review</div>
      <h2>Nothing to review yet</h2>
      <p>Complete your first lesson or explore Must Know 50 to build your review list.</p>
      <div class="review-empty-actions">
        <button class="btn" data-action="review-start-lesson-1">Start Lesson 1</button>
        <button class="btn secondary" data-action="review-open-learn">Open Must Know 50</button>
      </div>
    </div>
  `,"before");
}

function renderReview(){
  if(state.reviewCompleted) return renderReviewComplete();
  const phrase = getCurrentReviewPhrase();
  if(!phrase){
    state.reviewCompleted=true;
    state.screen="review-complete";
    return renderReviewComplete();
  }
  const answer = state.reviewRevealed ? `<div class="answer"><div class="local">${phrase.local}</div><div class="roman">${phrase.roman}</div></div>` : "";
  app.innerHTML=shell(`
    <div class="section-title lesson-title"><h2>Daily Review</h2><small>${state.reviewIndex+1} / ${state.reviewQueueIds.length}</small></div>
    <p class="lesson-progress">${state.reviewIndex+1} of ${state.reviewQueueIds.length}</p>
    <div class="card-stage"><article class="flashcard">
      <div class="label">Daily Review</div>
      <div><h2>${phrase.english}</h2>${answer}</div>
      <div>
        ${state.reviewRevealed ? `<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="review-speak" data-text="${encodeURIComponent(phrase.local)}" aria-label="Listen to this phrase">🔊 Listen</button>
          <button class="btn ghost" data-action="review-save-current">${isSaved(phrase)?"♥ Saved":"♡ Save"}</button>
        </div>` : `<button class="btn" data-action="review-reveal">Reveal</button>`}
      </div>
    </article></div>
    ${state.reviewRevealed ? `<div class="review-actions"><button class="btn secondary" data-action="review-again">Again</button><button class="btn" data-action="review-gotit">Got it</button></div>` : ""}
  `,"before");
}

function renderReviewComplete(){
  const message = formatNextReviewMessage(state.country);
  app.innerHTML=shell(`
    <div class="review-complete">
      <div class="lesson-complete-kicker">Review complete</div>
      <h2>Review complete</h2>
      <p>${state.reviewEncounteredIds.size} unique phrases reviewed${state.reviewEncounterCount > state.reviewEncounteredIds.size ? ` · ${state.reviewEncounterCount} card encounters` : ""}</p>
      ${state.reviewSessionXp ? `<div class="lesson-complete-xp">+${state.reviewSessionXp} XP earned</div>` : ""}
      <div class="review-next-message">${message}</div>
      <div class="lesson-complete-actions">
        <button class="btn" data-action="review-back-to-before">Back to Before</button>
        <button class="btn secondary" data-action="review-again-session">Review Again</button>
      </div>
    </div>
  `,"before");
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
}

function renderProgress(){
  const readiness=getTripReadiness(state.country);
  const lessonSummary=getLessonProgressSummary(state.country);
  const dueCount=getDuePhraseCount(state.country);
  const savedCount=getSavedPhraseCount(state.country);
  app.innerHTML=shell(`
    <section class="progress-summary">
      <div class="lesson-complete-kicker">Progress Summary</div>
      ${renderReadinessRing(readiness.percent,{size:188,stroke:12,label:"Trip readiness"})}
      <h2>${readiness.label}</h2>
      <p class="progress-summary-note">Trip Readiness is based on unique phrases marked Got it.</p>
      <div class="progress-metrics">
        <div class="progress-metric"><span>Mastered phrases</span><b>${readiness.masteredCount} of ${readiness.totalPhraseCount}</b></div>
        <div class="progress-metric"><span>Total XP</span><b>${state.xp}</b></div>
        <div class="progress-metric"><span>Completed lessons</span><b>${lessonSummary.completedCount} of ${lessonSummary.totalLessons}</b></div>
        ${lessonSummary.reviewedCount>0 ? `<div class="progress-metric"><span>Reviewed lessons</span><b>${lessonSummary.reviewedCount}</b></div>` : ""}
        <div class="progress-metric"><span>Daily Review due</span><b>${dueCount}</b></div>
        <div class="progress-metric"><span>Saved phrases</span><b>${savedCount}</b></div>
      </div>
    </section>
  `,"home");
}

function renderBefore(){
  const d=state.data;
  const savedCount=getSavedPhraseCount(state.country);
  const lessons=getLessons();
  const readiness=getTripReadiness(state.country);
  const continuePlan=getContinueLearningPlan(state.country);
  const reviewStatusText=getReviewStatusText(state.country);
  app.innerHTML=shell(`
    <div class="before-header">
      <h2>Before Your Trip</h2>
      <p>Build confidence before you arrive.</p>
    </div>
    <section class="before-summary">
      <button class="trip-readiness trip-readiness-button" data-action="open-progress-before" aria-label="Open progress summary. Trip readiness ${readiness.percent} percent.">
        <div class="trip-readiness-top">
          <div>
            <div class="trip-readiness-label">Trip readiness</div>
            <div class="trip-readiness-percent">${readiness.percent}%</div>
          </div>
          ${renderReadinessRing(readiness.percent,{size:84,stroke:8,compact:true,label:"Trip readiness"})}
          <div class="trip-readiness-label">${readiness.label}</div>
        </div>
        <p class="trip-readiness-copy">${readiness.summary}</p>
        <progress class="trip-readiness-meter" value="${readiness.masteredCount}" max="${readiness.totalPhraseCount}" aria-label="Trip readiness ${readiness.percent} percent"></progress>
        <div class="trip-readiness-meta">${readiness.masteredCount} mastered · ${readiness.label}</div>
      </button>
    </section>
    <div class="before-progress">
      <p class="before-progress-main">You have ${d.phrases.length} phrases ready to practice.</p>
      <p class="before-progress-meta">${state.xp} XP earned · ${savedCount} phrase${savedCount!==1?'s':''} saved</p>
    </div>
    <section class="before-learning">
      <button class="learning-featured continue-learning-card" data-action="continue-learning">
        <div class="learning-label">CONTINUE LEARNING</div>
        <h3>${continuePlan.label}</h3>
        <p>${continuePlan.description}</p>
        <div class="learning-meta">
          <span>${continuePlan.action==="lesson" && continuePlan.lessonId ? "Resume your lesson" : "Open the full phrase deck"}</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
      <button class="learning-featured daily-review-card" data-action="daily-review">
        <div class="learning-label">DAILY REVIEW</div>
        <h3>Daily Review</h3>
        <p>${reviewStatusText}</p>
        <div class="learning-meta">
          <span>${reviewStatusText}</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
      <button class="learning-featured" data-screen="learn">
        <div class="learning-label">FULL PHRASE DECK</div>
        <h3>Must Know 50</h3>
        <p>Review all 50 essential phrases.</p>
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
        ${lessons.map(lesson=>{
          const masteredCount=getLessonMasteryCount(state.country, lesson);
          const lessonProgress=getLessonProgress(state.country, lesson.id);
          const mastered=masteredCount===5;
          const reviewed=!!lessonProgress?.completedAt && !mastered;
          const canResume=!!lessonProgress?.startedAt && !lessonProgress?.completedAt;
          const resumeIndex=clampLessonIndex(lessonProgress?.lastCardIndex) + 1;
          const stateClass=mastered ? "is-mastered" : reviewed ? "is-reviewed" : "";
          return `<button class="lesson-item ${stateClass}" data-action="open-lesson" data-lesson-id="${lesson.id}" aria-label="Open Lesson ${lesson.order}, ${lesson.title}">
          <div class="lesson-item-top">
            <span class="lesson-number">Lesson ${lesson.order}</span>
            <span class="lesson-time">${lesson.estimatedMinutes} min</span>
          </div>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
          <small class="lesson-item-progress">${masteredCount}/5 mastered</small>
          ${reviewed || mastered ? `<span class="lesson-item-badge ${mastered ? "is-mastered" : "is-reviewed"}">${mastered ? "Mastered" : "Reviewed"}</span>` : ""}
          ${canResume ? `<small class="lesson-item-progress">Resume at ${resumeIndex}/5</small>` : ""}
        </button>`;
        }).join("")}
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
  ({home:renderHome,before:renderBefore,during:renderDuring,learn:renderLearn,show:renderShow,situations:renderSituations,saved:renderSaved,progress:renderProgress,quiz:renderQuiz,"quiz-results":renderQuizResults,lesson:renderLesson,"lesson-complete":renderLessonComplete,review:renderReview,"review-empty":renderReviewEmpty,"review-complete":renderReviewComplete}[state.screen]||renderHome)();
  primeReadinessRings();
}

document.addEventListener("click",e=>{
  const country=e.target.closest("[data-country]")?.dataset.country;
  if(country) return loadCountry(country);

  // Bottom navigation — fixed parent rules
  const navBtn=e.target.closest("[data-nav='bottom']");
  if(navBtn){
    const navScreen=navBtn.dataset.screen;
    if(state.screen==="quiz"||state.screen==="quiz-results") resetQuizState();
    if(state.screen==="review"||state.screen==="review-empty"||state.screen==="review-complete") resetReviewState();
    if(navScreen==="home"){state.backTarget="home";state.screen="home";render();}
    else if(navScreen==="learn") navigate("learn","before");
    else if(navScreen==="show") navigate("show","home");
    else if(navScreen==="saved") navigate("saved","home");
    return;
  }

  // Hub/screen buttons — explicit hierarchy
  const screenBtn=e.target.closest("[data-screen]");
  if(screenBtn && !screenBtn.classList.contains("shell")){
    const to=screenBtn.dataset.screen;
    if(state.screen==="quiz"||state.screen==="quiz-results") resetQuizState();
    if(state.screen==="review"||state.screen==="review-empty"||state.screen==="review-complete") resetReviewState();
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
    if(state.screen==="review"||state.screen==="review-empty"||state.screen==="review-complete") resetReviewState();
    const lessonProgress=getLessonProgress(state.country, lessonBtn.dataset.lessonId);
    startLesson(lessonBtn.dataset.lessonId, { resume: !!lessonProgress?.startedAt && !lessonProgress?.completedAt });
    return;
  }

  const action=e.target.closest("[data-action]")?.dataset.action;

  // Back
  if(action==="back"){
    if(state.screen==="progress"){
      const target=state.progressBackTarget==="before" ? "before" : "home";
      state.progressBackTarget="home";
      state.screen=target;
      render();
      return;
    }
    if(state.screen==="review"||state.screen==="review-empty"||state.screen==="review-complete"){
      resetReviewState();
      state.backTarget="home";
      state.screen="before";
      render();
      return;
    }
    if(state.screen==="home"){
      state.country=null;state.data=null;
      resetLessonState();
      resetReviewState();
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

  if(action==="destinations"){state.country=null;state.data=null;resetReviewState();localStorage.removeItem("lingogo_country");return render()}
  if(action==="open-progress-home"){
    openProgressSummary("home");
    return;
  }
  if(action==="open-progress-before"){
    openProgressSummary("before");
    return;
  }
  if(action==="home-open-saved"){
    navigate("saved","home");
    return;
  }
  if(action==="home-open-learn"){
    navigate("learn","home");
    return;
  }
  if(action==="share-lingogo"){
    void shareLingoGo();
    return;
  }
  if(action==="copy-share-url"){
    void copyShareLink();
    return;
  }
  if(action==="continue-learning"){
    const plan=getContinueLearningPlan(state.country);
    if(plan.action==="lesson" && plan.lessonId){
      if(state.screen==="review"||state.screen==="review-empty"||state.screen==="review-complete") resetReviewState();
      startLesson(plan.lessonId, { resume: plan.resume });
      return;
    }
    state.screen="learn";
    render();
    return;
  }
  if(action==="daily-review"){
    startDailyReview();
    return;
  }
  if(action==="review-back-to-before"){
    resetReviewState();
    state.backTarget="home";
    state.screen="before";
    render();
    return;
  }
  if(action==="review-again-session"){
    startDailyReview();
    return;
  }
  if(action==="review-start-lesson-1"){
    resetReviewState();
    const firstLesson=getLessons()[0];
    if(firstLesson) startLesson(firstLesson.id,{resume:false});
    return;
  }
  if(action==="review-open-learn"){
    resetReviewState();
    state.screen="learn";
    state.backTarget="before";
    render();
    return;
  }
  if(action==="lesson-reveal"){
    const phrase=getCurrentLessonPhrase();
    if(phrase) recordPhraseSeenOnce("lesson", phrase);
    state.lessonRevealed=true;
    render();
    return;
  }
  if(action==="review-reveal"){
    state.reviewRevealed=true;
    render();
    return;
  }
  if(action==="review-speak"){
    const text=e.target.closest("[data-text]")?.dataset.text;
    if(text)speak(decodeURIComponent(text),state.data.lang);
    return;
  }
  if(action==="review-save-current"){const phrase=getCurrentReviewPhrase();if(phrase)toggleSaved(phrase);return}
  if(action==="review-again"){advanceReviewCard("again");return}
  if(action==="review-gotit"){triggerSuccessPulse(e.target.closest("button"));advanceReviewCard("gotit");return}
  if(action==="lesson-speak"){
    const text=e.target.closest("[data-text]")?.dataset.text;
    if(text)speak(decodeURIComponent(text),state.data.lang);
    return;
  }
  if(action==="lesson-save-current"){const phrase=getCurrentLessonPhrase();if(phrase)toggleSaved(phrase);return}
  if(action==="lesson-again"){advanceLesson("again");return}
  if(action==="lesson-gotit"){triggerSuccessPulse(e.target.closest("button"));advanceLesson("gotit");return}
  if(action==="lesson-replay"){const lessonId=state.activeLessonId;if(lessonId)startLesson(lessonId, { resume: false });return}
  if(action==="lesson-back-to-list"){persistCurrentLessonPosition();resetLessonState();state.backTarget="home";state.screen="before";render();return}
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
  if(action==="reveal"){
    const p=state.data.phrases[state.cardIndex%state.data.phrases.length];
    if(p) recordPhraseSeenOnce("learn", p);
    state.revealed=true;
    render();
    if(p) setTimeout(()=>speak(p.local,state.data.lang),100);
  }
  if(action==="again"){answerLearnCard("again");return}
  if(action==="gotit"){triggerSuccessPulse(e.target.closest("button"));answerLearnCard("gotit");return}
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
