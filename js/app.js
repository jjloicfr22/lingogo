
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const learningProgressKey = "lingogo_learningProgress_v1";
const publicShareUrl = "https://jjloicfr22.github.io/lingogo/";
const publicShareText = "Practice essential Japanese and Korean travel phrases, even offline.";
const uiLanguageKey = "lingogo_uiLanguage";

function normalizeUILanguage(value){
  return value === "fr" || value === "es" ? value : "en";
}

const translations = {
  en: {
    navHome: "Home", navLearn: "Learn", navShow: "Show", navSaved: "Saved",
    language: "Language", languageEnglish: "English", languageFrench: "Français", languageSpanish: "Español", languagePanelTitle: "Choose app language", toggleLanguageAria: "Choose app language",
    brandTagline: "Travel smarter. Speak local.",
    destinationTitle: "Where are you going?", destinationSubtitle: "Pick a destination and get the right words, right when you need them.",
    destinationKoreaName: "South Korea", destinationKoreaDesc: "Korean essentials for real travel", destinationJapanName: "Japan", destinationJapanDesc: "Japanese essentials for real travel",
    countrySubtitle_japan: "Your Japanese travel companion", countrySubtitle_korea: "Your Korean travel companion",
    homeTitle: "Ready when you are.", homeSubtitle: "Learn before you go. Speak when it matters.",
    beforeTripTitle: "Before Your Trip", beforeTripDesc: "Learn the essentials in just 10 minutes a day.",
    duringTripTitle: "During Your Trip", duringTripDesc: "Show phrases instantly and communicate with confidence.",
    tripReadiness: "Trip readiness", progressSummaryTitle: "Progress Summary", progressMasteredPhrases: "Mastered phrases", progressTotalXP: "Total XP", progressCompletedLessons: "Completed lessons", progressReviewedLessons: "Reviewed lessons", progressDue: "Daily Review due", progressSaved: "Saved phrases",
    continueLearning: "CONTINUE LEARNING", resumeLessonHint: "Resume your lesson", openDeckHint: "Open the full phrase deck", dailyReviewLabel: "DAILY REVIEW", dailyReviewTitleShort: "Daily Review", fullPhraseDeck: "FULL PHRASE DECK", mustKnowDesc: "Review all 50 essential phrases.", quickQuestions: "10 quick questions", savedPhrases: "Saved Phrases", savedCollectionDesc: "Review your personal collection.", browseBySituation: "Browse by situation", personalCollection: "Your personal phrase collection.",
    situationModeTitle: "Situation Mode", situationModeDesc: "Eat, travel, shop, stay.",
    shareTitle: "Share LingoGo", shareDesc: "Send the public app link.", shareAria: "Share LingoGo with a public link", sharePublicUrlLabel: "Public URL", copyLink: "Copy Link",
    statXP: "XP", statSaved: "Saved", statPhrases: "Phrases",
    savedToast: "Saved ✓", removedToast: "Removed", copyToast: "Link copied", xpToast: "+{amount} XP",
    phraseDueOne: "1 phrase due", phraseDueMany: "{count} phrases due", practiceAvailable: "Practice available", noReviewPhrases: "No review phrases yet",
    moreReviewNow: "More review is available now.", nextReviewSoon: "Your next scheduled review is soon.", nextReviewInOneDay: "Your next scheduled review is in about 1 day.", nextReviewInDays: "Your next scheduled review is in about {days} days.",
    readLabel_complete: "Essential phrases complete", readLabel_almost: "Almost ready", readLabel_travelReady: "Travel ready", readLabel_footing: "Finding your footing", readLabel_building: "Building the basics", readLabel_starting: "Getting started", phraseSummary: "{mastered} of {total} essential phrases learned",
    all: "All", showToLocal: "Show to Local", tapToSpeak: "Tap to speak", play: "Play", save: "Save", saved: "Saved", remove: "Remove", reveal: "Reveal", listen: "Listen", again: "Again", gotIt: "Got it",
    whatAboutToDo: "What are you about to do?", savedEmpty: "Your saved travel phrases will appear here.",
    reviewTitle: "Daily Review", reviewComplete: "Review complete", reviewEmptyTitle: "Nothing to review yet", reviewEmptyCopy: "Complete your first lesson or explore Must Know 50 to build your review list.",
    startLessonOne: "Start Lesson 1", openMustKnow: "Open Must Know 50", backToBefore: "Back to Before", reviewAgain: "Review Again",
    notQuite: "Not quite - the correct answer is:", correctMark: "Correct!", quiz: "Quiz", quizComplete: "Quiz Complete", yourScore: "Your Score", tryAgain: "Try Again", backToLearning: "Back to Learning", seeResults: "See Results", nextQuestion: "Next Question", endQuiz: "End Quiz", quizNotEnough: "Not enough phrases for quiz",
    perfect: "Perfect!", excellent: "Excellent!", greatJob: "Great job!", goodEffort: "Good effort!", keepPracticing: "Keep practicing!",
    mustKnow50: "Must Know 50", lessonUnavailable: "Lesson unavailable.",
    lessonProgress: "{current} of {total}", lessonLabel: "Lesson {order}", lessonTime: "{minutes} min",
    lessonMastered: "Mastered", lessonReviewed: "Reviewed", lessonMasteredCount: "{count}/5 mastered", lessonResumeAt: "Resume at {index}/5",
    xpEarnedInline: "+{amount} XP earned", replayLesson: "Replay Lesson", backToLessons: "Back to Lessons",
    reviewUniqueCount: "{count} unique phrases reviewed", reviewCardEncounters: "{count} card encounters",
    beforeReadyCount: "You have {count} phrases ready to practice.", beforeMetaProgress: "{xp} XP earned · {saved} phrase{suffix} saved",
    lessonListTitle: "Your 10 Lessons", lessonListMeta: "5 phrases · 3 min each", openLessonAria: "Open Lesson {order}, {title}", lessonsUnavailable: "Lessons are not available yet."
    ,continueLessonLabel: "Continue Lesson {order}", startLessonLabel: "Start Lesson {order}", allLessonsReviewed: "All lessons reviewed", continueDeckDescription: "Continue the full phrase deck.", beginLesson: "Begin the lesson", resumeAtCard: "Resume at card {index}",
    quizTeaser: "Test what you remember.", phrasesCountLabel: "{count} phrases", savedCountLabel: "{count} saved phrase{suffix}", masteredWithLabel: "{count} mastered · {label}", completedOfTotal: "{completed} of {total}"
  },
  fr: {
    navHome: "Accueil", navLearn: "Apprendre", navShow: "Afficher", navSaved: "Favoris",
    language: "Langue", languageEnglish: "English", languageFrench: "Français", languageSpanish: "Español", languagePanelTitle: "Choisir la langue", toggleLanguageAria: "Choisir la langue",
    brandTagline: "Voyagez plus malin. Parlez local.",
    destinationTitle: "Ou allez-vous ?", destinationSubtitle: "Choisissez une destination et obtenez les bonnes phrases au bon moment.",
    destinationKoreaName: "Coree du Sud", destinationKoreaDesc: "Essentiels coreens pour voyager", destinationJapanName: "Japon", destinationJapanDesc: "Essentiels japonais pour voyager",
    countrySubtitle_japan: "Votre compagnon de voyage en japonais", countrySubtitle_korea: "Votre compagnon de voyage en coreen",
    homeTitle: "Pret quand vous l'etes.", homeSubtitle: "Apprenez avant de partir. Parlez quand c'est important.",
    beforeTripTitle: "Avant votre voyage", beforeTripDesc: "Apprenez l'essentiel en 10 minutes par jour.",
    duringTripTitle: "Pendant votre voyage", duringTripDesc: "Affichez des phrases instantanement et communiquez avec confiance.",
    tripReadiness: "Preparation du voyage", progressSummaryTitle: "Resume", progressMasteredPhrases: "Phrases maitrisees", progressTotalXP: "XP total", progressCompletedLessons: "Lecons terminees", progressReviewedLessons: "Lecons revisees", progressDue: "Revisions du jour", progressSaved: "Phrases favorites",
    continueLearning: "CONTINUER", resumeLessonHint: "Reprendre votre lecon", openDeckHint: "Ouvrir le pack complet", dailyReviewLabel: "REVISION QUOTIDIENNE", dailyReviewTitleShort: "Revision quotidienne", fullPhraseDeck: "PACK COMPLET", mustKnowDesc: "Revisez les 50 phrases essentielles.", quickQuestions: "10 questions rapides", savedPhrases: "Phrases favorites", savedCollectionDesc: "Revoyez votre collection personnelle.", browseBySituation: "Parcourir par situation", personalCollection: "Votre collection personnelle de phrases.",
    situationModeTitle: "Mode Situation", situationModeDesc: "Manger, se deplacer, acheter, sejourner.",
    shareTitle: "Partager LingoGo", shareDesc: "Envoyer le lien public de l'app.", shareAria: "Partager LingoGo", sharePublicUrlLabel: "URL publique", copyLink: "Copier le lien",
    statXP: "XP", statSaved: "Favoris", statPhrases: "Phrases",
    savedToast: "Enregistre ✓", removedToast: "Retire", copyToast: "Lien copie", xpToast: "+{amount} XP",
    phraseDueOne: "1 phrase a reviser", phraseDueMany: "{count} phrases a reviser", practiceAvailable: "Revision disponible", noReviewPhrases: "Aucune phrase de revision",
    moreReviewNow: "D'autres revisions sont disponibles maintenant.", nextReviewSoon: "Votre prochaine revision est bientot.", nextReviewInOneDay: "Votre prochaine revision est dans environ 1 jour.", nextReviewInDays: "Votre prochaine revision est dans environ {days} jours.",
    readLabel_complete: "Phrases essentielles completes", readLabel_almost: "Presque pret", readLabel_travelReady: "Pret a voyager", readLabel_footing: "Vous prenez vos reperes", readLabel_building: "Bases en cours", readLabel_starting: "Demarrage", phraseSummary: "{mastered} sur {total} phrases essentielles apprises",
    all: "Tout", showToLocal: "Montrer au local", tapToSpeak: "Touchez pour ecouter", play: "Lire", save: "Enregistrer", saved: "Enregistre", remove: "Retirer", reveal: "Reveler", listen: "Ecouter", again: "Encore", gotIt: "Je sais",
    whatAboutToDo: "Que comptez-vous faire ?", savedEmpty: "Vos phrases favorites apparaitront ici.",
    reviewTitle: "Revision quotidienne", reviewComplete: "Revision terminee", reviewEmptyTitle: "Rien a reviser pour l'instant", reviewEmptyCopy: "Terminez votre premiere lecon ou ouvrez Must Know 50 pour creer votre liste de revision.",
    startLessonOne: "Commencer la lecon 1", openMustKnow: "Ouvrir Must Know 50", backToBefore: "Retour a Avant", reviewAgain: "Revoir encore",
    notQuite: "Pas tout a fait - la bonne reponse est :", correctMark: "Correct !", quiz: "Quiz", quizComplete: "Quiz termine", yourScore: "Votre score", tryAgain: "Reessayer", backToLearning: "Retour a l'apprentissage", seeResults: "Voir les resultats", nextQuestion: "Question suivante", endQuiz: "Terminer le quiz", quizNotEnough: "Pas assez de phrases pour le quiz",
    perfect: "Parfait !", excellent: "Excellent !", greatJob: "Tres bien !", goodEffort: "Bon effort !", keepPracticing: "Continuez a pratiquer !",
    mustKnow50: "Must Know 50", lessonUnavailable: "Lecon indisponible.",
    lessonProgress: "{current} sur {total}", lessonLabel: "Lecon {order}", lessonTime: "{minutes} min",
    lessonMastered: "Maitrisee", lessonReviewed: "Revisee", lessonMasteredCount: "{count}/5 maitrisees", lessonResumeAt: "Reprendre a {index}/5",
    xpEarnedInline: "+{amount} XP gagnes", replayLesson: "Rejouer la lecon", backToLessons: "Retour aux lecons",
    reviewUniqueCount: "{count} phrases uniques revisees", reviewCardEncounters: "{count} passages",
    beforeReadyCount: "Vous avez {count} phrases pretes a pratiquer.", beforeMetaProgress: "{xp} XP gagnes · {saved} phrase{suffix} enregistree{suffix}",
    lessonListTitle: "Vos 10 lecons", lessonListMeta: "5 phrases · 3 min chacune", openLessonAria: "Ouvrir la lecon {order}, {title}", lessonsUnavailable: "Les lecons ne sont pas disponibles."
    ,continueLessonLabel: "Continuer la lecon {order}", startLessonLabel: "Commencer la lecon {order}", allLessonsReviewed: "Toutes les lecons revisees", continueDeckDescription: "Continuez le pack complet.", beginLesson: "Commencer la lecon", resumeAtCard: "Reprendre a la carte {index}",
    quizTeaser: "Testez ce dont vous vous souvenez.", phrasesCountLabel: "{count} phrases", savedCountLabel: "{count} phrase{suffix} favorite{suffix}", masteredWithLabel: "{count} maitrisees · {label}", completedOfTotal: "{completed} sur {total}"
  },
  es: {
    navHome: "Inicio", navLearn: "Aprender", navShow: "Mostrar", navSaved: "Guardadas",
    language: "Idioma", languageEnglish: "English", languageFrench: "Français", languageSpanish: "Español", languagePanelTitle: "Elegir idioma", toggleLanguageAria: "Elegir idioma",
    brandTagline: "Viaja mejor. Habla local.",
    destinationTitle: "Adonde vas?", destinationSubtitle: "Elige un destino y obten las frases correctas justo cuando las necesitas.",
    destinationKoreaName: "Corea del Sur", destinationKoreaDesc: "Esenciales de coreano para viajar", destinationJapanName: "Japon", destinationJapanDesc: "Esenciales de japones para viajar",
    countrySubtitle_japan: "Tu companero de viaje en japones", countrySubtitle_korea: "Tu companero de viaje en coreano",
    homeTitle: "Listo cuando tu lo estes.", homeSubtitle: "Aprende antes de salir. Habla cuando importa.",
    beforeTripTitle: "Antes de tu viaje", beforeTripDesc: "Aprende lo esencial en solo 10 minutos al dia.",
    duringTripTitle: "Durante tu viaje", duringTripDesc: "Muestra frases al instante y comunicate con confianza.",
    tripReadiness: "Preparacion del viaje", progressSummaryTitle: "Resumen", progressMasteredPhrases: "Frases dominadas", progressTotalXP: "XP total", progressCompletedLessons: "Lecciones completadas", progressReviewedLessons: "Lecciones repasadas", progressDue: "Repaso pendiente", progressSaved: "Frases guardadas",
    continueLearning: "SEGUIR APRENDIENDO", resumeLessonHint: "Retomar tu leccion", openDeckHint: "Abrir el mazo completo", dailyReviewLabel: "REPASO DIARIO", dailyReviewTitleShort: "Repaso diario", fullPhraseDeck: "MAZO COMPLETO", mustKnowDesc: "Repasa las 50 frases esenciales.", quickQuestions: "10 preguntas rapidas", savedPhrases: "Frases guardadas", savedCollectionDesc: "Repasa tu coleccion personal.", browseBySituation: "Explorar por situacion", personalCollection: "Tu coleccion personal de frases.",
    situationModeTitle: "Modo Situacion", situationModeDesc: "Comer, moverse, comprar, alojarse.",
    shareTitle: "Compartir LingoGo", shareDesc: "Envia el enlace publico de la app.", shareAria: "Compartir LingoGo", sharePublicUrlLabel: "URL publica", copyLink: "Copiar enlace",
    statXP: "XP", statSaved: "Guardadas", statPhrases: "Frases",
    savedToast: "Guardada ✓", removedToast: "Eliminada", copyToast: "Enlace copiado", xpToast: "+{amount} XP",
    phraseDueOne: "1 frase pendiente", phraseDueMany: "{count} frases pendientes", practiceAvailable: "Repaso disponible", noReviewPhrases: "Aun no hay frases de repaso",
    moreReviewNow: "Hay mas repaso disponible ahora.", nextReviewSoon: "Tu proximo repaso es pronto.", nextReviewInOneDay: "Tu proximo repaso es en aproximadamente 1 dia.", nextReviewInDays: "Tu proximo repaso es en aproximadamente {days} dias.",
    readLabel_complete: "Frases esenciales completas", readLabel_almost: "Casi listo", readLabel_travelReady: "Listo para viajar", readLabel_footing: "Tomando ritmo", readLabel_building: "Construyendo base", readLabel_starting: "Empezando", phraseSummary: "{mastered} de {total} frases esenciales aprendidas",
    all: "Todas", showToLocal: "Mostrar al local", tapToSpeak: "Toca para escuchar", play: "Reproducir", save: "Guardar", saved: "Guardada", remove: "Quitar", reveal: "Revelar", listen: "Escuchar", again: "Otra vez", gotIt: "Lo se",
    whatAboutToDo: "Que vas a hacer ahora?", savedEmpty: "Tus frases guardadas apareceran aqui.",
    reviewTitle: "Repaso diario", reviewComplete: "Repaso completado", reviewEmptyTitle: "Aun no hay nada para repasar", reviewEmptyCopy: "Completa tu primera leccion o abre Must Know 50 para crear tu lista de repaso.",
    startLessonOne: "Empezar leccion 1", openMustKnow: "Abrir Must Know 50", backToBefore: "Volver a Antes", reviewAgain: "Repasar de nuevo",
    notQuite: "Casi - la respuesta correcta es:", correctMark: "Correcto!", quiz: "Quiz", quizComplete: "Quiz completado", yourScore: "Tu puntuacion", tryAgain: "Intentar de nuevo", backToLearning: "Volver al aprendizaje", seeResults: "Ver resultados", nextQuestion: "Siguiente pregunta", endQuiz: "Terminar quiz", quizNotEnough: "No hay suficientes frases para el quiz",
    perfect: "Perfecto!", excellent: "Excelente!", greatJob: "Muy bien!", goodEffort: "Buen esfuerzo!", keepPracticing: "Sigue practicando!",
    mustKnow50: "Must Know 50", lessonUnavailable: "Leccion no disponible.",
    lessonProgress: "{current} de {total}", lessonLabel: "Leccion {order}", lessonTime: "{minutes} min",
    lessonMastered: "Dominada", lessonReviewed: "Repasada", lessonMasteredCount: "{count}/5 dominadas", lessonResumeAt: "Retomar en {index}/5",
    xpEarnedInline: "+{amount} XP ganados", replayLesson: "Repetir leccion", backToLessons: "Volver a lecciones",
    reviewUniqueCount: "{count} frases unicas repasadas", reviewCardEncounters: "{count} intentos",
    beforeReadyCount: "Tienes {count} frases listas para practicar.", beforeMetaProgress: "{xp} XP ganados · {saved} frase{suffix} guardada{suffix}",
    lessonListTitle: "Tus 10 lecciones", lessonListMeta: "5 frases · 3 min cada una", openLessonAria: "Abrir leccion {order}, {title}", lessonsUnavailable: "Las lecciones no estan disponibles."
    ,continueLessonLabel: "Continuar leccion {order}", startLessonLabel: "Empezar leccion {order}", allLessonsReviewed: "Todas las lecciones repasadas", continueDeckDescription: "Continua el mazo completo.", beginLesson: "Comenzar leccion", resumeAtCard: "Retomar en la tarjeta {index}",
    quizTeaser: "Pon a prueba lo que recuerdas.", phrasesCountLabel: "{count} frases", savedCountLabel: "{count} frase{suffix} guardada{suffix}", masteredWithLabel: "{count} dominadas · {label}", completedOfTotal: "{completed} de {total}"
  }
};

const categoryTranslations = {
  General: { en: "General", fr: "General", es: "General" },
  Food: { en: "Food", fr: "Repas", es: "Comida" },
  Transport: { en: "Transport", fr: "Transport", es: "Transporte" },
  Hotel: { en: "Hotel", fr: "Hotel", es: "Hotel" },
  Shopping: { en: "Shopping", fr: "Achats", es: "Compras" },
  Emergency: { en: "Emergency", fr: "Urgence", es: "Emergencia" },
  Cafe: { en: "Cafe", fr: "Cafe", es: "Cafe" }
};

function interpolate(template, params = {}){
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`;
  });
}

function t(key, params = {}, language = state?.uiLanguage || "en"){
  const selected = translations[language] || translations.en;
  const fallback = translations.en[key] || key;
  const template = selected[key] || fallback;
  return interpolate(template, params);
}

function trCategory(category, language = state?.uiLanguage || "en"){
  const map = categoryTranslations[category];
  if(!map) return category;
  return map[language] || map.en || category;
}

function getPhrasePrompt(phrase, language = state?.uiLanguage || "en"){
  if(!phrase) return "";
  if(isPlainObject(phrase.translations)){
    if(typeof phrase.translations[language] === "string" && phrase.translations[language]) return phrase.translations[language];
    if(typeof phrase.translations.en === "string" && phrase.translations.en) return phrase.translations.en;
  }
  return phrase.english || "";
}

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
  return dueCount === 1 ? t("phraseDueOne") : t("phraseDueMany", { count: dueCount });
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
    return t("moreReviewNow");
  }
  const earliest = getEarliestNextReviewAt(country);
  if(!earliest) return t("nextReviewSoon");
  const diffMs = Date.parse(earliest) - Date.parse(nowIso);
  if(!Number.isFinite(diffMs) || diffMs <= 0) return t("nextReviewSoon");
  const days = Math.max(1, Math.ceil(diffMs / 86400000));
  return days === 1 ? t("nextReviewInOneDay") : t("nextReviewInDays", { days });
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
  if(queue.length > 0) return t("practiceAvailable");
  return t("noReviewPhrases");
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
  if(percent >= 100) return t("readLabel_complete");
  if(percent >= 80) return t("readLabel_almost");
  if(percent >= 60) return t("readLabel_travelReady");
  if(percent >= 40) return t("readLabel_footing");
  if(percent >= 20) return t("readLabel_building");
  return t("readLabel_starting");
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
    summary: t("phraseSummary", { mastered: masteredCount, total: totalPhraseCount })
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
      showToast(t("copyToast"));
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
    showToast(t("copyToast"));
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
      label: t("mustKnow50"),
      description: t("continueDeckDescription"),
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
      label: t("continueLessonLabel", { order: activeLesson.order }),
      description: `${t("lessonMasteredCount", { count: masteredCount })} · ${t("resumeAtCard", { index: clampLessonIndex(activeProgress.lastCardIndex) + 1 })}`,
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
      label: started ? t("continueLessonLabel", { order: firstIncomplete.order }) : t("startLessonLabel", { order: firstIncomplete.order }),
      description: started
        ? `${t("lessonMasteredCount", { count: masteredCount })} · ${t("resumeAtCard", { index: clampLessonIndex(firstProgress.lastCardIndex) + 1 })}`
        : `${t("lessonMasteredCount", { count: masteredCount })} · ${t("beginLesson")}`,
      action: "lesson",
      lessonId: firstIncomplete.id,
      resume: started
    };
  }
  return {
    label: t("allLessonsReviewed"),
    description: t("continueDeckDescription"),
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
  uiLanguage: normalizeUILanguage(localStorage.getItem(uiLanguageKey) || "en"),
  languagePanelOpen: false,
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
  showToast(state.saved[key] ? t("savedToast") : t("removedToast"));
  render();
}

function addXP(amount){
  state.xp += amount;
  localStorage.setItem("lingogo_xp", state.xp);
  showToast(t("xpToast", { amount }));
}

function setUILanguage(language){
  const nextLanguage = normalizeUILanguage(language);
  state.uiLanguage = nextLanguage;
  localStorage.setItem(uiLanguageKey, nextLanguage);
  render();
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
    questions.push({phraseId:correct.id,english:correct.english,translations:isPlainObject(correct.translations)?correct.translations:null,correctId:correct.id,answers:answers.map(a=>({id:a.id,local:a.local,roman:a.roman}))});
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
  showToast(t("lessonUnavailable"));
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

function getCountrySubtitle(country = state.country){
  if(country === "japan") return t("countrySubtitle_japan");
  if(country === "korea") return t("countrySubtitle_korea");
  return "";
}

function shell(content, active="home"){
  const d=state.data;
  const countryTheme=getCountryTheme(state.country);
  return `<main class="shell" data-country-theme="${countryTheme}" data-screen="${state.screen}">
    <div class="topbar">
      <button class="icon-btn" data-action="back">←</button>
      <div class="country-title"><h1>${d.flag} ${d.name}</h1><p>${getCountrySubtitle()}</p></div>
    </div>
    <div class="screen-content">${content}</div>
  </main>
  <nav class="bottom-nav"><div class="bottom-inner">
    ${navButton("home","⌂",t("navHome"),active,true)}
    ${navButton("learn","◫",t("navLearn"),active,true)}
    ${navButton("show","▣",t("navShow"),active,true)}
    ${navButton("saved","♥",t("navSaved"),active,true)}
  </div></nav>`;
}
function navButton(screen,icon,label,active,isNav=false){
  return `<button class="nav-btn ${active===screen?"active":""}" data-screen="${screen}" ${isNav?'data-nav="bottom"':''}><strong>${icon}</strong>${label}</button>`
}

function renderDestinations(){
  app.innerHTML=`<main class="shell">
    <div class="brand"><div><div class="logo">LingoGo</div><div class="tag">${t("brandTagline")}</div></div><span>✦</span></div>
    <section class="hero"><h1>${t("destinationTitle")}</h1><p>${t("destinationSubtitle")}</p></section>
    <section class="grid destinations">
      ${destinationCard("korea","🇰🇷",t("destinationKoreaName"),t("destinationKoreaDesc"))}
      ${destinationCard("japan","🇯🇵",t("destinationJapanName"),t("destinationJapanDesc"))}
    </section>
  </main>`;
}
function destinationCard(id,flag,name,desc){
  return `<button class="destination" data-country="${id}"><div class="wash"></div><div class="content"><div class="flag">${flag}</div><h2>${name}</h2><p>${desc}</p></div></button>`
}

function renderHome(){
  const d=state.data;
  const savedCount=getSavedPhraseCount(state.country);
  const uiLanguageLabel = state.uiLanguage === "fr" ? t("languageFrench") : state.uiLanguage === "es" ? t("languageSpanish") : t("languageEnglish");
  app.innerHTML=shell(`
    <section class="hero"><h1>${t("homeTitle")}</h1><p>${t("homeSubtitle")}</p></section>
    <section class="language-tools">
      <button class="btn secondary language-toggle" data-action="toggle-language-panel" aria-label="${t("toggleLanguageAria")}">${t("language")}: ${uiLanguageLabel}</button>
      ${state.languagePanelOpen ? `<div class="language-panel" role="group" aria-label="${t("languagePanelTitle")}">
        <button class="chip ${state.uiLanguage==="en"?"active":""}" data-action="set-language" data-lang="en">${t("languageEnglish")}</button>
        <button class="chip ${state.uiLanguage==="fr"?"active":""}" data-action="set-language" data-lang="fr">${t("languageFrench")}</button>
        <button class="chip ${state.uiLanguage==="es"?"active":""}" data-action="set-language" data-lang="es">${t("languageSpanish")}</button>
      </div>` : ""}
    </section>
    <section class="stats">
      <button class="stat stat-pill" data-action="open-progress-home" aria-label="${state.xp} ${t("statXP")}"><b>${state.xp}</b><span>${t("statXP")}</span></button>
      <button class="stat stat-pill" data-action="home-open-saved" aria-label="${savedCount} ${t("statSaved")}"><b>${savedCount}</b><span>${t("statSaved")}</span></button>
      <button class="stat stat-pill" data-action="home-open-learn" aria-label="${d.phrases.length} ${t("statPhrases")}"><b>${d.phrases.length}</b><span>${t("statPhrases")}</span></button>
    </section>
    <section class="trip-phases">
      <button class="trip-card before-trip" data-screen="before">
        <div class="trip-card-emoji">✈️</div>
        <h2>${t("beforeTripTitle")}</h2>
        <p>${t("beforeTripDesc")}</p>
      </button>
      <button class="trip-card during-trip" data-screen="during">
        <div class="trip-card-emoji">🌏</div>
        <h2>${t("duringTripTitle")}</h2>
        <p>${t("duringTripDesc")}</p>
      </button>
    </section>
    <section class="additional-options">
      <button class="situation-button" data-screen="situations"><div class="emoji">🧭</div><h3>${t("situationModeTitle")}</h3><p>${t("situationModeDesc")}</p></button>
      <button class="share-lingogo" data-action="share-lingogo" aria-label="${t("shareAria")}">
        <div class="emoji">🔗</div>
        <h3>${t("shareTitle")}</h3>
        <p>${t("shareDesc")}</p>
      </button>
      ${state.shareFallbackVisible ? `<div class="share-fallback" role="status" aria-live="polite">
        <p>${t("sharePublicUrlLabel")}</p>
        <input type="text" readonly value="${publicShareUrl}" aria-label="Public LingoGo URL" />
        <button class="btn secondary" data-action="copy-share-url">${t("copyLink")}</button>
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
    <p class="lesson-progress">${t("lessonProgress", { current: state.lessonCardIndex+1, total: phrases.length })}</p>
    <div class="card-stage lesson-screen"><article class="flashcard">
      <div class="label">${t("lessonLabel", { order: lesson.order })}</div>
      <div><h2>${getPhrasePrompt(phrase)}</h2>${answer}</div>
      <div>
        ${state.lessonRevealed?`<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="lesson-speak" data-text="${encodeURIComponent(phrase.local)}" aria-label="${t("listen")}">🔊 ${t("listen")}</button>
          <button class="btn ghost" data-action="lesson-save-current">${isSaved(phrase)?`♥ ${t("saved")}`:`♡ ${t("save")}`}</button>
        </div>`:`<button class="btn" data-action="lesson-reveal">${t("reveal")}</button>`}
      </div>
    </article></div>
    ${state.lessonRevealed?`<div class="review-actions"><button class="btn secondary" data-action="lesson-again">${t("again")}</button><button class="btn" data-action="lesson-gotit">${t("gotIt")}</button></div>`:""}
  `,"learn");
}

function renderLessonComplete(){
  const lesson=getCurrentLesson();
  if(!lesson){
    returnToBeforeWithLessonUnavailable();
    return;
  }
  const masteredCount=getLessonMasteryCount(state.country, lesson);
  const completionLabel=masteredCount===5 ? t("lessonMastered") : t("lessonReviewed");
  app.innerHTML=shell(`
    <div class="lesson-complete">
      <div class="lesson-complete-kicker">${completionLabel}</div>
      <h2>${lesson.title}</h2>
      <p>${t("lessonMasteredCount", { count: masteredCount })} · ${completionLabel}</p>
      ${state.lessonXpEarned?`<div class="lesson-complete-xp">${t("xpEarnedInline", { amount: state.lessonXpEarned })}</div>`:""}
      <div class="lesson-complete-actions">
        <button class="btn" data-action="lesson-replay">${t("replayLesson")}</button>
        <button class="btn secondary" data-action="lesson-back-to-list">${t("backToLessons")}</button>
      </div>
    </div>
  `,"learn");
}

function renderReviewEmpty(){
  app.innerHTML=shell(`
    <div class="review-empty">
      <div class="lesson-complete-kicker">${t("reviewTitle")}</div>
      <h2>${t("reviewEmptyTitle")}</h2>
      <p>${t("reviewEmptyCopy")}</p>
      <div class="review-empty-actions">
        <button class="btn" data-action="review-start-lesson-1">${t("startLessonOne")}</button>
        <button class="btn secondary" data-action="review-open-learn">${t("openMustKnow")}</button>
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
    <div class="section-title lesson-title"><h2>${t("reviewTitle")}</h2><small>${state.reviewIndex+1} / ${state.reviewQueueIds.length}</small></div>
    <p class="lesson-progress">${state.reviewIndex+1} of ${state.reviewQueueIds.length}</p>
    <div class="card-stage"><article class="flashcard">
      <div class="label">${t("reviewTitle")}</div>
      <div><h2>${getPhrasePrompt(phrase)}</h2>${answer}</div>
      <div>
        ${state.reviewRevealed ? `<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="review-speak" data-text="${encodeURIComponent(phrase.local)}" aria-label="${t("listen")}">🔊 ${t("listen")}</button>
          <button class="btn ghost" data-action="review-save-current">${isSaved(phrase)?`♥ ${t("saved")}`:`♡ ${t("save")}`}</button>
        </div>` : `<button class="btn" data-action="review-reveal">${t("reveal")}</button>`}
      </div>
    </article></div>
    ${state.reviewRevealed ? `<div class="review-actions"><button class="btn secondary" data-action="review-again">${t("again")}</button><button class="btn" data-action="review-gotit">${t("gotIt")}</button></div>` : ""}
  `,"before");
}

function renderReviewComplete(){
  const message = formatNextReviewMessage(state.country);
  const encounterMeta = state.reviewEncounterCount > state.reviewEncounteredIds.size ? ` · ${t("reviewCardEncounters", { count: state.reviewEncounterCount })}` : "";
  app.innerHTML=shell(`
    <div class="review-complete">
      <div class="lesson-complete-kicker">${t("reviewComplete")}</div>
      <h2>${t("reviewComplete")}</h2>
      <p>${t("reviewUniqueCount", { count: state.reviewEncounteredIds.size })}${encounterMeta}</p>
      ${state.reviewSessionXp ? `<div class="lesson-complete-xp">${t("xpEarnedInline", { amount: state.reviewSessionXp })}</div>` : ""}
      <div class="review-next-message">${message}</div>
      <div class="lesson-complete-actions">
        <button class="btn" data-action="review-back-to-before">${t("backToBefore")}</button>
        <button class="btn secondary" data-action="review-again-session">${t("reviewAgain")}</button>
      </div>
    </div>
  `,"before");
}

function renderQuiz(){
  if(!state.quizActive||state.quizQuestions.length===0) return state.screen="before",render();
  const q=state.quizQuestions[state.quizIndex];
  const correctAnswer=q.answers.find(a=>a.id===q.correctId);
  const incorrectFeedback=state.quizAnswerCorrect?"":`<div class="quiz-feedback incorrect">${t("notQuite")}<div class="quiz-correct-answer"><div class="quiz-correct-local">${correctAnswer.local}</div><div class="quiz-correct-roman">${correctAnswer.roman}</div></div></div>`;
  const correctFeedback=state.quizAnswerCorrect?`<div class="quiz-feedback correct">✓ ${t("correctMark")}</div>`:"";
  const feedback=state.quizAnswered?`${correctFeedback}${incorrectFeedback}`:"";
  app.innerHTML=shell(`<div class="section-title"><h2>${t("quiz")}</h2><small>${state.quizIndex+1} / ${state.quizQuestions.length}</small></div><div class="quiz-container"><div class="quiz-question"><h2>${getPhrasePrompt({ english: q.english, translations: q.translations || null })}</h2></div><div class="quiz-answers">${q.answers.map(a=>`<div class="answer-choice ${state.quizAnswered?(a.id===q.correctId?"correct":a.id===state.quizSelectedAnswer?"incorrect":"muted"):(a.id===state.quizSelectedAnswer?"selected":"")}"><button class="answer-select" data-answer-id="${a.id}" ${state.quizAnswered?'aria-disabled="true"':""}><div class="answer-local">${a.local}</div><div class="answer-roman">${a.roman}</div></button><button class="quiz-option-audio" data-action="speak-quiz-option" data-answer-id="${a.id}" aria-label="${t("listen")}">🔊</button></div>`).join("")}</div>${feedback}${state.quizAnswered?`<div class="quiz-actions"><button class="btn" data-action="quiz-next">${state.quizIndex+1>=state.quizQuestions.length?t("seeResults"):t("nextQuestion")}</button><button class="btn secondary" data-action="end-quiz">${t("endQuiz")}</button></div>`:""}</div>`,`quiz`);
}

function renderLearn(){
  const p=state.data.phrases[state.cardIndex % state.data.phrases.length];
  const answer=state.revealed?`<div class="answer"><div class="local">${p.local}</div><div class="roman">${p.roman}</div></div>`:"";
  app.innerHTML=shell(`
    <div class="section-title"><h2>${t("mustKnow50")}</h2><small>${state.cardIndex+1} / ${state.data.phrases.length}</small></div>
    <div class="card-stage"><article class="flashcard">
      <div class="label">${trCategory(p.category)}</div>
      <div><h2>${getPhrasePrompt(p)}</h2>${answer}</div>
      <div>
        ${state.revealed?`<div class="row" style="justify-content:center">
          <button class="btn secondary" data-action="speak" data-text="${encodeURIComponent(p.local)}">🔊 ${t("listen")}</button>
          <button class="btn ghost" data-action="save-current">${isSaved(p)?`♥ ${t("saved")}`:`♡ ${t("save")}`}</button>
        </div>`:`<button class="btn" data-action="reveal">${t("reveal")}</button>`}
      </div>
    </article></div>
    ${state.revealed?`<div class="review-actions"><button class="btn secondary" data-action="again">${t("again")}</button><button class="btn" data-action="gotit">${t("gotIt")}</button></div>`:""}
  `,"learn");
}

function categories(){
  return [...new Set(state.data.phrases.map(p=>p.category))];
}
function renderShow(){
  const filtered=state.category==="all"?state.data.phrases:state.data.phrases.filter(p=>p.category===state.category);
  app.innerHTML=shell(`
    <div class="section-title"><h2>${t("showToLocal")}</h2><small>${t("tapToSpeak")}</small></div>
    <div class="quick"><button class="chip${state.category==="all"?" active":""}" data-category="all" ${state.category==="all"?'aria-current="true"':""}>${t("all")}</button>${categories().map(c=>`<button class="chip${state.category===c?" active":""}" data-category="${c}" ${state.category===c?'aria-current="true"':""} >${trCategory(c)}</button>`).join("")}</div>
    <div class="list" style="margin-top:14px">${filtered.map(p=>`<article class="phrase">
      <div class="en">${getPhrasePrompt(p)}</div><div class="local">${p.local}</div><div class="roman">${p.roman}</div>
      <div class="row"><button class="btn" data-speak="${encodeURIComponent(p.local)}">🔊 ${t("play")}</button><button class="btn secondary" data-save="${p.id}">${isSaved(p)?`♥ ${t("saved")}`:`♡ ${t("save")}`}</button></div>
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
  app.innerHTML=shell(`<div class="section-title"><h2>${t("whatAboutToDo")}</h2></div>
  <div class="categories">${categories().map(c=>`<button class="category" data-situation="${c}"><span>${icons[c]||"✦"}</span><b>${trCategory(c)}</b></button>`).join("")}</div>`,`home`);
}
function renderSaved(){
  const phrases=state.data.phrases.filter(isSaved);
  app.innerHTML=shell(`<div class="section-title"><h2>${t("navSaved")}</h2><small>${phrases.length}</small></div>
  ${phrases.length?`<div class="list">${phrases.map(p=>`<article class="phrase"><div class="en">${getPhrasePrompt(p)}</div><div class="local">${p.local}</div><div class="roman">${p.roman}</div><div class="row"><button class="btn" data-speak="${encodeURIComponent(p.local)}">🔊 ${t("play")}</button><button class="btn secondary" data-save="${p.id}">${t("remove")}</button></div></article>`).join("")}</div>`:`<div class="empty">${t("savedEmpty")}</div>`}`,"saved");
}

function renderProgress(){
  const readiness=getTripReadiness(state.country);
  const lessonSummary=getLessonProgressSummary(state.country);
  const dueCount=getDuePhraseCount(state.country);
  const savedCount=getSavedPhraseCount(state.country);
  app.innerHTML=shell(`
    <section class="progress-summary">
      <div class="lesson-complete-kicker">${t("progressSummaryTitle")}</div>
      ${renderReadinessRing(readiness.percent,{size:188,stroke:12,label:t("tripReadiness")})}
      <h2>${readiness.label}</h2>
      <p class="progress-summary-note">${readiness.summary}</p>
      <div class="progress-metrics">
        <div class="progress-metric"><span>${t("progressMasteredPhrases")}</span><b>${t("phraseSummary", { mastered: readiness.masteredCount, total: readiness.totalPhraseCount })}</b></div>
        <div class="progress-metric"><span>${t("progressTotalXP")}</span><b>${state.xp}</b></div>
        <div class="progress-metric"><span>${t("progressCompletedLessons")}</span><b>${t("completedOfTotal", { completed: lessonSummary.completedCount, total: lessonSummary.totalLessons })}</b></div>
        ${lessonSummary.reviewedCount>0 ? `<div class="progress-metric"><span>${t("progressReviewedLessons")}</span><b>${lessonSummary.reviewedCount}</b></div>` : ""}
        <div class="progress-metric"><span>${t("progressDue")}</span><b>${dueCount}</b></div>
        <div class="progress-metric"><span>${t("progressSaved")}</span><b>${savedCount}</b></div>
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
      <h2>${t("beforeTripTitle")}</h2>
      <p>${t("homeSubtitle")}</p>
    </div>
    <section class="before-summary">
      <button class="trip-readiness trip-readiness-button" data-action="open-progress-before" aria-label="${t("tripReadiness")} ${readiness.percent}%">
        <div class="trip-readiness-top">
          <div>
            <div class="trip-readiness-label">${t("tripReadiness")}</div>
            <div class="trip-readiness-percent">${readiness.percent}%</div>
          </div>
          ${renderReadinessRing(readiness.percent,{size:84,stroke:8,compact:true,label:t("tripReadiness")})}
          <div class="trip-readiness-label">${readiness.label}</div>
        </div>
        <p class="trip-readiness-copy">${readiness.summary}</p>
        <progress class="trip-readiness-meter" value="${readiness.masteredCount}" max="${readiness.totalPhraseCount}" aria-label="${t("tripReadiness")} ${readiness.percent}%"></progress>
        <div class="trip-readiness-meta">${t("masteredWithLabel", { count: readiness.masteredCount, label: readiness.label })}</div>
      </button>
    </section>
    <div class="before-progress">
      <p class="before-progress-main">${t("beforeReadyCount", { count: d.phrases.length })}</p>
      <p class="before-progress-meta">${t("beforeMetaProgress", { xp: state.xp, saved: savedCount, suffix: savedCount!==1?'s':'' })}</p>
    </div>
    <section class="before-learning">
      <button class="learning-featured continue-learning-card" data-action="continue-learning">
        <div class="learning-label">${t("continueLearning")}</div>
        <h3>${continuePlan.label}</h3>
        <p>${continuePlan.description}</p>
        <div class="learning-meta">
          <span>${continuePlan.action==="lesson" && continuePlan.lessonId ? t("resumeLessonHint") : t("openDeckHint")}</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
      <button class="learning-featured daily-review-card" data-action="daily-review">
        <div class="learning-label">${t("dailyReviewLabel")}</div>
        <h3>${t("dailyReviewTitleShort")}</h3>
        <p>${reviewStatusText}</p>
        <div class="learning-meta">
          <span>${reviewStatusText}</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
      <button class="learning-featured" data-screen="learn">
        <div class="learning-label">${t("fullPhraseDeck")}</div>
        <h3>${t("mustKnow50")}</h3>
        <p>${t("mustKnowDesc")}</p>
        <div class="learning-meta">
          <span>${t("phrasesCountLabel", { count: d.phrases.length })}</span>
          <span class="learning-arrow">→</span>
        </div>
      </button>
    </section>
    <section class="before-actions">
      <button class="before-action-card before-action-quiz" data-action="start-quiz">
        <div class="action-content">
          <h4>${t("quiz")}</h4>
          <p>${t("quizTeaser")}</p>
          <div class="before-action-meta">${t("quickQuestions")}</div>
        </div>
        <span class="action-arrow">→</span>
      </button>
      <button class="before-action-card before-action-saved" data-screen="saved">
        <div class="action-content">
          <h4>${t("savedPhrases")}</h4>
          <p>${t("savedCollectionDesc")}</p>
          <div class="before-action-meta">${t("savedCountLabel", { count: savedCount, suffix: savedCount!==1?'s':'' })}</div>
        </div>
        <span class="action-arrow">→</span>
      </button>
    </section>
    <section class="before-lessons">
      <div class="section-title lesson-section-title"><h2>${t("lessonListTitle")}</h2><small>${t("lessonListMeta")}</small></div>
      ${lessons.length?`<div class="lesson-list">
        ${lessons.map(lesson=>{
          const masteredCount=getLessonMasteryCount(state.country, lesson);
          const lessonProgress=getLessonProgress(state.country, lesson.id);
          const mastered=masteredCount===5;
          const reviewed=!!lessonProgress?.completedAt && !mastered;
          const canResume=!!lessonProgress?.startedAt && !lessonProgress?.completedAt;
          const resumeIndex=clampLessonIndex(lessonProgress?.lastCardIndex) + 1;
          const stateClass=mastered ? "is-mastered" : reviewed ? "is-reviewed" : "";
          return `<button class="lesson-item ${stateClass}" data-action="open-lesson" data-lesson-id="${lesson.id}" aria-label="${t("openLessonAria", { order: lesson.order, title: lesson.title })}">
          <div class="lesson-item-top">
            <span class="lesson-number">${t("lessonLabel", { order: lesson.order })}</span>
            <span class="lesson-time">${t("lessonTime", { minutes: lesson.estimatedMinutes })}</span>
          </div>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
          <small class="lesson-item-progress">${t("lessonMasteredCount", { count: masteredCount })}</small>
          ${reviewed || mastered ? `<span class="lesson-item-badge ${mastered ? "is-mastered" : "is-reviewed"}">${mastered ? t("lessonMastered") : t("lessonReviewed")}</span>` : ""}
          ${canResume ? `<small class="lesson-item-progress">${t("lessonResumeAt", { index: resumeIndex })}</small>` : ""}
        </button>`;
        }).join("")}
      </div>`:`<div class="empty">${t("lessonsUnavailable")}</div>`}
    </section>
  `,"before");
}
function renderDuring(){
  const savedCount=Object.values(state.saved).filter(Boolean).length;
  app.innerHTML=shell(`
    <div class="during-header">
      <h2>${t("duringTripTitle")}</h2>
      <p>${t("duringTripDesc")}</p>
    </div>
    <section class="during-featured">
      <button class="during-show-card" data-situation="all">
        <div class="during-show-content">
          <div class="during-show-label">${t("showToLocal")}</div>
          <h3>${t("tapToSpeak")}</h3>
        </div>
        <span class="during-show-arrow">→</span>
      </button>
    </section>
    <section class="during-categories">
      <h4 class="during-section-heading">${t("browseBySituation")}</h4>
      <div class="during-cat-grid">
        <button class="during-cat-btn" data-situation="Food">${trCategory("Food")}</button>
        <button class="during-cat-btn" data-situation="Transport">${trCategory("Transport")}</button>
        <button class="during-cat-btn" data-situation="Hotel">${trCategory("Hotel")}</button>
        <button class="during-cat-btn" data-situation="Shopping">${trCategory("Shopping")}</button>
        <button class="during-cat-btn" data-situation="Cafe">${trCategory("Cafe")}</button>
        <button class="during-cat-btn" data-situation="Emergency">${trCategory("Emergency")}</button>
        <button class="during-cat-btn" data-situation="General">${trCategory("General")}</button>
      </div>
    </section>
    <section class="during-support">
      <button class="during-support-card" data-screen="saved">
        <div class="during-support-content">
          <h4>${t("savedPhrases")}</h4>
          <p>${t("personalCollection")}</p>
          <div class="during-support-meta">${t("savedCountLabel", { count: savedCount, suffix: savedCount!==1?'s':'' })}</div>
        </div>
        <span class="during-support-arrow">→</span>
      </button>
    </section>
  `,"home");
}
function renderQuizResults(){
  const xpEarned=state.quizScore*5;
  const percent=Math.round((state.quizScore/state.quizQuestions.length)*100);
  const message=percent===100?t("perfect"):percent>=80?t("excellent"):percent>=60?t("greatJob"):percent>=40?t("goodEffort"):t("keepPracticing");
  app.innerHTML=shell(`<div class="section-title"><h2>${t("quizComplete")}</h2></div><div class="quiz-results"><div class="results-message">${message}</div><div class="results-score"><span class="score-label">${t("yourScore")}</span><span class="score-value">${state.quizScore} / ${state.quizQuestions.length}</span></div><div class="results-xp">${t("xpEarnedInline", { amount: xpEarned })}</div><button class="btn" data-action="quiz-again">${t("tryAgain")}</button><button class="btn secondary" data-action="back-to-before">${t("backToLearning")}</button></div>`,`before`);
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

  if(action==="toggle-language-panel"){
    state.languagePanelOpen=!state.languagePanelOpen;
    render();
    return;
  }
  if(action==="set-language"){
    const lang=e.target.closest("[data-lang]")?.dataset.lang || "en";
    state.languagePanelOpen=false;
    setUILanguage(lang);
    return;
  }

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
    if(state.quizQuestions.length<1) return showToast(t("quizNotEnough"));
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
    if(questions.length<1) return showToast(t("quizNotEnough"));
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
