(function applyTheme() {
  var saved = localStorage.getItem("theme");

  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
})();

function checkAuth() {
  var isLoggedIn = localStorage.getItem("isLoggedIn");
  var examStarted = localStorage.getItem("examStarted");

  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.replace("login.html");
    return;
  }

  if (!examStarted || examStarted !== "true") {
    window.location.replace("home.html");
    return;
  }
}

checkAuth();

function getUserKey() {
  var userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;
  try {
    var u = JSON.parse(userStr);

    if (u && u.email) {
      return "examState_" + u.email;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

function saveState() {
  var key = getUserKey();
  if (!key) return;

  var state = {
    questions: questions,
    userAnswers: userAnswers,
    bookmarkedQuestions: bookmarkedQuestions,
    questionNotes: questionNotes,
    examDeadline: examDeadline,
    currentQuestionIndex: currentQuestionIndex,
    examStartedFlag: examStartedFlag,
    examSubject: examSubject,
  };

  localStorage.setItem(key, JSON.stringify(state));
}

function clearState() {
  var key = getUserKey();
  if (key) localStorage.removeItem(key);

  localStorage.removeItem("examStarted");
}

function saveResult(score, total) {
  var userStr = localStorage.getItem("currentUser");
  if (!userStr) return;
  try {
    var u = JSON.parse(userStr);
    if (!u || !u.email) return;

    var pct = Math.round((score / total) * 100);

    var resultKey = "examResult_" + u.email + "_" + examSubject;
    localStorage.setItem(
      resultKey,
      JSON.stringify({ score: score, total: total, pct: pct }),
    );
  } catch (e) {}
}

var questionBanks = {
  uiux: [
    {
      question: "What does UX stand for in design?",
      options: [
        "User Experience",
        "User Extension",
        "Unified Experience",
        "Unique Expression",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "Which principle states that users should always know where they are in a system?",
      options: [
        "Feedback",
        "Visibility of system status",
        "Match with real world",
        "Error prevention",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is a wireframe in UX design?",
      options: [
        "A high-fidelity prototype",
        "A low-fidelity skeletal layout of a page",
        "A color scheme guide",
        "A user research report",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which color scheme uses colors directly opposite on the color wheel?",
      options: ["Analogous", "Triadic", "Complementary", "Monochromatic"],
      correctAnswer: 2,
    },
    {
      question:
        "What is the minimum recommended touch target size for mobile UI elements?",
      options: ["24x24 px", "44x44 px", "16x16 px", "32x32 px"],
      correctAnswer: 1,
    },
    {
      question: "Fitts's Law in UX relates to what?",
      options: [
        "Reading speed",
        "Time to acquire a target based on size and distance",
        "Color contrast ratios",
        "Font legibility",
      ],
      correctAnswer: 1,
    },
    {
      question: "What does WCAG stand for?",
      options: [
        "Web Content Accessibility Guidelines",
        "Web Component Application Guide",
        "World Color Accessibility Group",
        "Web CSS Authoring Guidelines",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "Which UX research method involves observing users in their natural environment?",
      options: [
        "A/B Testing",
        "Card Sorting",
        "Contextual Inquiry",
        "Heuristic Evaluation",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the purpose of a style guide in UI design?",
      options: [
        "To define server configuration",
        "To ensure visual consistency across a product",
        "To document API endpoints",
        "To describe database schemas",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Miller's Law in UX states that the average person can hold how many items in working memory?",
      options: ["5 +/- 2", "7 +/- 2", "9 +/- 2", "3 +/- 1"],
      correctAnswer: 1,
    },
  ],
};

var examSubject = localStorage.getItem("examSubject") || "uiux";

var questionBank = questionBanks[examSubject] || questionBanks.uiux;

var subjectLabels = {
  uiux: "UI/UX Design Exam",
};
var examLabel = subjectLabels[examSubject] || "Exam";

function shuffleArray(arr) {
  var a = arr.slice();

  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));

    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

var questions = shuffleArray(questionBank);
var currentQuestionIndex = 0;
var userAnswers = [];
var bookmarkedQuestions = [];
var questionNotes = [];
var EXAM_DURATION_MS = 30 * 60 * 1000;
var examDeadline = null;
var examStartedFlag = false;

var mainTimerInterval = null;
var questionTimerActive = false;
var questionTimerSeconds = 0;
var questionTimerInterval = null;
var tabSwitchCount = 0;
var currentFilter = "all";
var calcCurrentValue = "";
var isSubmitted = false;

for (var qi = 0; qi < questions.length; qi++) {
  userAnswers[qi] = null;
  bookmarkedQuestions[qi] = false;
  questionNotes[qi] = "";
}

(function restoreState() {
  var forceNew = localStorage.getItem("forceNewExam");
  if (forceNew === "true") {
    clearState();
    localStorage.removeItem("forceNewExam");
    return;
  }

  var key = getUserKey();
  if (!key) return;
  var raw = localStorage.getItem(key);
  if (!raw) return;

  try {
    var s = JSON.parse(raw);

    if (s.questions && s.questions.length) {
      questions = s.questions;
    }
    if (s.userAnswers && s.userAnswers.length) {
      userAnswers = s.userAnswers;
    }
    if (s.bookmarkedQuestions && s.bookmarkedQuestions.length) {
      bookmarkedQuestions = s.bookmarkedQuestions;
    }
    if (s.questionNotes && s.questionNotes.length) {
      questionNotes = s.questionNotes;
    }
    if (typeof s.examDeadline === "number") {
      examDeadline = s.examDeadline;
    }
    if (typeof s.currentQuestionIndex === "number") {
      currentQuestionIndex = s.currentQuestionIndex;
    }

    examStartedFlag = !!s.examStartedFlag;
  } catch (e) {
    console.error("Failed to restore exam state:", e);
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      themeToggle.checked = true;
    }
    themeToggle.addEventListener("change", function (e) {
      var theme;
      if (e.target.checked) {
        theme = "dark";
      } else {
        theme = "light";
      }
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    });
  }

  if (examStartedFlag) {
    var instrModal = document.getElementById("exam-instructions-modal");
    if (instrModal) instrModal.checked = false;
  }

  initExam();
});

function startMainTimer() {
  if (mainTimerInterval) return;

  if (!examDeadline) {
    examDeadline = Date.now() + EXAM_DURATION_MS;
    saveState();
  }

  function tick() {
    var remaining = Math.round((examDeadline - Date.now()) / 1000);
    if (remaining < 0) remaining = 0;

    var display = document.getElementById("mainTimer");
    if (display) display.textContent = formatTime(remaining);

    var timerBox = document.getElementById("timerBox");
    if (timerBox) {
      if (remaining <= 300) {
        timerBox.classList.add("timer-urgent");
        timerBox.classList.remove("timer-warning");
      } else if (remaining <= 600) {
        timerBox.classList.add("timer-warning");
        timerBox.classList.remove("timer-urgent");
      }
    }

    if (remaining % 5 === 0) saveState();

    if (remaining <= 0) {
      clearInterval(mainTimerInterval);
      mainTimerInterval = null;
      autoSubmitExam();
    }
  }

  tick();
  mainTimerInterval = setInterval(tick, 1000);
}

function toggleQuestionTimer() {
  if (!questionTimerActive) {
    questionTimerActive = true;
    questionTimerSeconds = 0;
    questionTimerInterval = setInterval(function () {
      questionTimerSeconds++;
      var d = document.getElementById("questionTimerDisplay");
      if (d) d.textContent = formatTime(questionTimerSeconds);
    }, 1000);

    var btn = document.getElementById("toggleQuestionTimer");
    if (btn) btn.classList.add("text-primary");
  } else {
    questionTimerActive = false;
    clearInterval(questionTimerInterval);
    var btn = document.getElementById("toggleQuestionTimer");
    if (btn) btn.classList.remove("text-primary");
  }
}

function resetQuestionTimer() {
  if (questionTimerActive) {
    clearInterval(questionTimerInterval);
    questionTimerActive = false;
    var btn = document.getElementById("toggleQuestionTimer");
    if (btn) btn.classList.remove("text-primary");
  }
  questionTimerSeconds = 0;
  var d = document.getElementById("questionTimerDisplay");
  if (d) d.textContent = "00:00";
}

function formatTime(secs) {
  var m = Math.floor(secs / 60);
  var s = secs % 60;

  var mStr;
  if (m < 10) {
    mStr = "0" + m;
  } else {
    mStr = "" + m;
  }
  var sStr;
  if (s < 10) {
    sStr = "0" + s;
  } else {
    sStr = "" + s;
  }
  return mStr + ":" + sStr;
}

document.addEventListener("visibilitychange", function () {
  if (!examStartedFlag || isSubmitted) return;

  if (document.hidden) {
    tabSwitchCount++;
    if (tabSwitchCount === 1) {
      showTabWarning(
        "This is your FIRST and ONLY warning! Leaving the exam tab again will automatically submit your exam.",
      );
    } else {
      autoSubmitExam();
    }
  }
});

function showTabWarning(message) {
  var overlay = document.getElementById("tabWarningOverlay");
  var msg = document.getElementById("warningMessage");
  var cnt = document.getElementById("warningCount");
  if (msg) msg.textContent = message;
  if (cnt)
    cnt.textContent =
      "Warning " + tabSwitchCount + " of 1 Next violation will auto-submit!";
  if (overlay) overlay.classList.remove("hidden");
}

function dismissWarning() {
  var overlay = document.getElementById("tabWarningOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function saveNotes() {
  var ta = document.getElementById("questionNotes");
  if (ta) questionNotes[currentQuestionIndex] = ta.value;
  saveState();
}

function loadNotes() {
  var ta = document.getElementById("questionNotes");
  if (ta) ta.value = questionNotes[currentQuestionIndex] || "";
}

function createSidebar() {
  var sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = "";

  for (var i = 0; i < questions.length; i++) {
    (function (index) {
      var btn = document.createElement("button");
      btn.className =
        "question-btn btn btn-md w-full justify-start gap-3 text-left";

      var numSpan = document.createElement("span");
      numSpan.className = "font-bold";
      numSpan.textContent = index + 1;

      var bmSpan = document.createElement("span");
      bmSpan.className = "bookmark-icon ml-auto text-amber-500 hidden";
      bmSpan.innerHTML = "&#9733;";

      btn.appendChild(numSpan);
      btn.appendChild(bmSpan);

      btn.addEventListener("click", function () {
        showQuestion(index);
      });

      sidebar.appendChild(btn);
    })(i);
  }

  updateSidebarHighlight();
}

function showQuestion(index) {
  currentQuestionIndex = index;
  var question = questions[index];

  var qt = document.getElementById("questionText");
  if (qt) qt.textContent = question.question;

  var qn = document.getElementById("currentQuestionNumber");
  if (qn) qn.textContent = index + 1;

  resetQuestionTimer();

  var container = document.getElementById("answersContainer");
  if (!container) return;
  container.innerHTML = "";

  var optionLetters = ["A", "B", "C", "D"];

  for (var i = 0; i < question.options.length; i++) {
    (function (optIndex) {
      var optionDiv = document.createElement("div");
      optionDiv.className = "form-control";

      var label = document.createElement("label");
      label.className =
        "answer-option label cursor-pointer justify-start gap-4 p-4 rounded-xl border-2 border-base-300";

      if (userAnswers[index] === optIndex) {
        label.classList.add("selected");
      }

      var badge = document.createElement("span");
      badge.className =
        "option-badge flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 border-current";
      badge.textContent = optionLetters[optIndex];

      var input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.className = "hidden";
      input.checked = userAnswers[index] === optIndex;

      input.addEventListener("change", function () {
        userAnswers[index] = optIndex;
        showQuestion(index);
        updateSidebarHighlight();
        saveState();
      });

      label.addEventListener("click", function () {
        input.checked = true;

        var evt = document.createEvent("Event");
        evt.initEvent("change", true, true);
        input.dispatchEvent(evt);
      });

      var text = document.createElement("span");
      text.className = "label-text text-base font-medium flex-1";
      text.textContent = question.options[optIndex];

      label.appendChild(input);
      label.appendChild(badge);
      label.appendChild(text);
      optionDiv.appendChild(label);
      container.appendChild(optionDiv);
    })(i);
  }

  loadNotes();

  updateBookmarkButton();

  updateSidebarHighlight();

  updateNavigationButtons();
}

function updateSidebarHighlight() {
  var sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  var buttons = sidebar.querySelectorAll(".question-btn");

  for (var i = 0; i < buttons.length; i++) {
    var btn = buttons[i];
    var bmIcon = btn.querySelector(".bookmark-icon");

    btn.classList.remove("active", "answered", "bookmarked");

    if (bookmarkedQuestions[i]) {
      btn.classList.add("bookmarked");
      if (bmIcon) bmIcon.classList.remove("hidden");
    } else {
      if (bmIcon) bmIcon.classList.add("hidden");
    }

    if (userAnswers[i] !== null) btn.classList.add("answered");

    if (i === currentQuestionIndex) btn.classList.add("active");

    var isAnswered = userAnswers[i] !== null;
    var isBookmarked = bookmarkedQuestions[i];
    var show = false;

    if (currentFilter === "all") show = true;
    if (currentFilter === "answered" && isAnswered) show = true;
    if (currentFilter === "unanswered" && !isAnswered) show = true;
    if (currentFilter === "bookmarked" && isBookmarked) show = true;

    if (show) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  }

  updateProgress();
}

function updateProgress() {
  var answeredCount = 0;
  for (var i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] !== null) answeredCount++;
  }
  var total = questions.length;
  var pct = (answeredCount / total) * 100;

  var pt = document.getElementById("progressText");
  var pb = document.getElementById("examProgress");
  if (pt) pt.textContent = answeredCount + "/" + total + " Answered";
  if (pb) pb.value = pct;
}

function filterQuestions(type) {
  currentFilter = type;

  var filterTypes = ["all", "answered", "unanswered", "bookmarked"];
  for (var i = 0; i < filterTypes.length; i++) {
    var f = filterTypes[i];
    var btn = document.getElementById("filterBtn-" + f);
    if (!btn) continue;
    if (f === type) {
      btn.className =
        "btn btn-xs rounded-full border-none bg-primary text-primary-content hover:bg-primary/80 transition-colors";
    } else {
      btn.className =
        "btn btn-xs rounded-full border-none bg-base-200 text-base-content hover:bg-base-300 transition-colors";
    }
  }

  updateSidebarHighlight();
}

function updateNavigationButtons() {
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;

  if (nextBtn) nextBtn.disabled = currentQuestionIndex === questions.length - 1;
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    showQuestion(currentQuestionIndex + 1);
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    showQuestion(currentQuestionIndex - 1);
  }
}

function toggleBookmark() {
  bookmarkedQuestions[currentQuestionIndex] =
    !bookmarkedQuestions[currentQuestionIndex];
  updateBookmarkButton();
  updateSidebarHighlight();
  saveState();
}

function updateBookmarkButton() {
  var btn = document.getElementById("bookmarkBtn");
  if (!btn) return;
  var svg = btn.querySelector("svg");
  if (bookmarkedQuestions[currentQuestionIndex]) {
    if (svg) svg.setAttribute("fill", "currentColor");
    btn.classList.add("text-amber-500");
    btn.title = "Remove bookmark";
  } else {
    if (svg) svg.setAttribute("fill", "none");
    btn.classList.remove("text-amber-500");
    btn.title = "Bookmark this question";
  }
}

function submitExam() {
  var unansweredCount = 0;
  for (var i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === null) unansweredCount++;
  }

  if (unansweredCount > 0) {
    var countEl = document.getElementById("unansweredCount");
    var countLabelEl = document.getElementById("unansweredCountLabel");
    if (countEl) countEl.textContent = unansweredCount;
    if (countLabelEl) countLabelEl.textContent = unansweredCount;

    document.getElementById("unanswered-modal").checked = true;
    return;
  }

  document.getElementById("submit-modal").checked = true;
}

function confirmSubmit() {
  if (isSubmitted) return;
  isSubmitted = true;

  clearInterval(mainTimerInterval);
  clearInterval(questionTimerInterval);

  var score = 0;
  for (var i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === questions[i].correctAnswer) score++;
  }

  saveResult(score, questions.length);

  clearState();

  showResults();
}

function autoSubmitExam() {
  if (isSubmitted) return;
  isSubmitted = true;

  clearInterval(mainTimerInterval);
  clearInterval(questionTimerInterval);

  var score = 0;
  for (var i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === questions[i].correctAnswer) score++;
  }

  saveResult(score, questions.length);
  clearState();

  var overlay = document.getElementById("tabWarningOverlay");
  var msg = document.getElementById("warningMessage");
  var cnt = document.getElementById("warningCount");
  var btn = document.getElementById("dismissWarningBtn");
  if (msg)
    msg.textContent =
      "Time's up or exam rules violated. Your exam is being submitted automatically.";
  if (cnt) cnt.textContent = "Please wait...";
  if (btn) btn.style.display = "none";
  if (overlay) overlay.classList.remove("hidden");

  setTimeout(function () {
    if (overlay) overlay.classList.add("hidden");
    showResults();
  }, 2000);
}

function showResults() {
  playSubmitSound();

  var score = 0;
  var html = "";

  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var ua = userAnswers[i];
    var correct = ua === q.correctAnswer;
    if (correct) score++;

    var cardClass;
    if (correct) {
      cardClass = "result-correct";
    } else {
      cardClass = "result-incorrect";
    }

    var iconBg;
    if (correct) {
      iconBg = "bg-emerald-500";
    } else {
      iconBg = "bg-red-500";
    }
    var iconSvg;
    if (correct) {
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
    } else {
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>';
    }

    var yourAnswerHtml;
    if (ua !== null) {
      yourAnswerHtml =
        '<p class="text-sm"><span class="font-semibold">Your answer:</span> ' +
        q.options[ua] +
        "</p>";
    } else {
      yourAnswerHtml =
        '<p class="text-sm opacity-60"><span class="font-semibold">Your answer:</span> Not answered</p>';
    }

    var correctHtml;
    if (!correct) {
      correctHtml =
        '<p class="text-sm text-emerald-700"><span class="font-semibold">Correct:</span> ' +
        q.options[q.correctAnswer] +
        "</p>";
    } else {
      correctHtml = "";
    }

    html += '<div class="p-5 rounded-2xl border-2 ' + cardClass + ' mb-3">';
    html += '<div class="flex items-start gap-4">';
    html +=
      '<div class="result-icon flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ' +
      iconBg +
      '">' +
      iconSvg +
      "</div>";
    html += '<div class="flex-1 min-w-0">';
    html +=
      '<h5 class="font-bold text-base mb-1">Question ' + (i + 1) + "</h5>";
    html += '<p class="text-sm mb-2 opacity-80">' + q.question + "</p>";
    html += yourAnswerHtml;
    html += correctHtml;
    html += "</div></div></div>";
  }

  var pct = Math.round((score / questions.length) * 100);
  var passed = pct >= 60;

  document.getElementById("finalScore").textContent =
    score + "/" + questions.length;

  var verdict;
  if (passed) {
    verdict = "PASSED";
  } else {
    verdict = "FAILED";
  }
  document.getElementById("scorePercentage").textContent = pct + "% " + verdict;
  document.getElementById("detailedResults").innerHTML = html;

  var resultIcon = document.getElementById("resultIconWrap");
  if (resultIcon) {
    if (passed) {
      resultIcon.className =
        "w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4";
    } else {
      resultIcon.className =
        "w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4";
    }
  }

  var resultSvg = document.getElementById("resultIconSvg");
  if (resultSvg) {
    if (passed) {
      resultSvg.className = "w-12 h-12 text-emerald-500";
      resultSvg.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
    } else {
      resultSvg.className = "w-12 h-12 text-red-500";
      resultSvg.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
    }
  }

  var scoreEl = document.getElementById("scorePercentage");
  if (scoreEl) {
    if (passed) {
      scoreEl.className = "text-xl font-bold text-emerald-600 mt-2";
    } else {
      scoreEl.className = "text-xl font-bold text-red-500 mt-2";
    }
  }

  document.getElementById("submit-modal").checked = false;
  document.getElementById("results-modal").checked = true;
}

function returnToDashboard() {
  window.location.replace("home.html");
}

window.addEventListener("beforeunload", function () {
  if (
    localStorage.getItem("examStarted") === "true" &&
    !isSubmitted &&
    examStartedFlag
  ) {
    saveState();
  }
});

function startExamNow() {
  document.getElementById("exam-instructions-modal").checked = false;

  examStartedFlag = true;
  localStorage.setItem("examStarted", "true");

  if (!examDeadline) {
    examDeadline = Date.now() + EXAM_DURATION_MS;
  }

  saveState();

  startMainTimer();
}

function initExam() {
  var instrTitle = document.getElementById("instrExamTitle");
  if (instrTitle) instrTitle.textContent = examLabel;

  var display = document.getElementById("mainTimer");
  if (display) {
    if (examDeadline) {
      var remaining = Math.round((examDeadline - Date.now()) / 1000);
      if (remaining < 0) remaining = 0;
      display.textContent = formatTime(remaining);
    } else {
      display.textContent = "30:00";
    }
  }

  createSidebar();

  showQuestion(currentQuestionIndex);

  if (examStartedFlag) {
    startMainTimer();
  }

  setInterval(saveState, 30000);
}

function calcAction(val) {
  var display = document.getElementById("calcDisplay");
  if (!display) return;

  if (val === "C") {
    calcCurrentValue = "";
    display.textContent = "0";
  } else if (val === "\u232B") {
    calcCurrentValue = calcCurrentValue.slice(0, -1);
    display.textContent = calcCurrentValue || "0";
  } else if (val === "=") {
    if (calcCurrentValue) {
      try {
        var result = Function(
          '"use strict"; return (' + calcCurrentValue + ")",
        )();
        calcCurrentValue = String(result);
        display.textContent = calcCurrentValue;
      } catch (e) {
        display.textContent = "Error";
        calcCurrentValue = "";
      }
    }
  } else {
    calcCurrentValue += val;
    display.textContent = calcCurrentValue;
  }
}

function playSubmitSound() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    function tone(freq, start, duration) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + duration,
      );

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.01);
    }

    tone(523, 0, 0.2);
    tone(659, 0.2, 0.2);
    tone(784, 0.4, 0.3);
    tone(1047, 0.65, 0.5);
  } catch (e) {}
}
