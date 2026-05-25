function applyTheme() {
  var saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
}

applyTheme();

if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.replace("login.html");
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch (e) {
    return null;
  }
}

function examStateKey(email) {
  return "examState_" + email;
}

function examResultKey(email, subject) {
  return "examResult_" + email + "_" + subject;
}

function getExamMemory(user, subject) {
  if (!user || !user.email) {
    return { status: "not_started" };
  }

  var resultRaw = localStorage.getItem(examResultKey(user.email, subject));
  if (resultRaw) {
    try {
      var result = JSON.parse(resultRaw);

      return {
        status: "submitted",
        score: result.score,
        total: result.total,
        pct: result.pct,
      };
    } catch (e) {}
  }

  var stateRaw = localStorage.getItem(examStateKey(user.email));
  if (stateRaw) {
    try {
      var state = JSON.parse(stateRaw);

      if (state.examSubject === subject && state.examStartedFlag) {
        return { status: "in_progress" };
      }
    } catch (e) {}
  }

  return { status: "not_started" };
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.history && window.history.pushState) {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, null, window.location.href);
    };
  }

  var currentUser = getCurrentUser();
  if (currentUser && currentUser.email) {
    var displayName = currentUser.firstName + " " + currentUser.lastName;
    var navEl = document.getElementById("navUserName");
    var welcomeEl = document.getElementById("welcomeMessage");
    if (navEl) navEl.textContent = displayName;
    if (welcomeEl) welcomeEl.textContent = "Hello, " + displayName + "! 👋";
  }

  function updateHeroStats() {
    if (!currentUser) return;
    var completed = 0;

    for (var e = 0; e < exams.length; e++) {
      var mem = getExamMemory(currentUser, exams[e].subject);
      if (mem.status === "submitted") {
        completed++;
      }
    }
    var completedEl = document.getElementById("heroCompletedCount");
    if (completedEl) completedEl.textContent = completed;
  }

  var logoutBtn = document.getElementById("confirmLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.replace("login.html");
    });
  }

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    var currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
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

  var exams = [
    {
      id: "exam_uiux",
      subject: "uiux",
      title: "UI/UX Design",
      category: "Design",
      duration: "30 Minutes",
      questions: 10,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      iconPath:
        "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      status: "active",
    },
    {
      id: "exam_html",
      subject: "html",
      title: "HTML Fundamentals",
      category: "Markup",
      duration: "30 Minutes",
      questions: 10,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      status: "upcoming",
    },
    {
      id: "exam_css",
      subject: "css",
      title: "CSS Styling",
      category: "Styling",
      duration: "30 Minutes",
      questions: 10,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      iconPath:
        "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
      status: "upcoming",
    },
    {
      id: "exam_js",
      subject: "javascript",
      title: "JavaScript",
      category: "Programming",
      duration: "30 Minutes",
      questions: 10,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      iconPath:
        "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      status: "upcoming",
    },
  ];

  var grid = document.getElementById("examsGrid");
  var searchInput = document.getElementById("searchInput");
  var emptyState = document.getElementById("emptyState");

  function renderExams(filterText) {
    filterText = (filterText || "").toLowerCase();
    if (!grid) return;

    grid.innerHTML = "";

    var filtered = [];
    for (var f = 0; f < exams.length; f++) {
      var e = exams[f];
      var titleMatch = e.title.toLowerCase().indexOf(filterText) !== -1;
      var categoryMatch = e.category.toLowerCase().indexOf(filterText) !== -1;
      if (titleMatch || categoryMatch) filtered.push(e);
    }

    if (filtered.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }
    if (emptyState) emptyState.classList.add("hidden");

    var tpl = document.getElementById("exam-card-tpl");

    for (var i = 0; i < filtered.length; i++) {
      var exam = filtered[i];
      var isActive = exam.status === "active";
      var memory = getExamMemory(currentUser, exam.subject);
      var memStatus = memory.status;

      var card = tpl.content.cloneNode(true).querySelector("div");

      function slot(name) {
        return card.querySelector('[data-slot="' + name + '"]');
      }

      slot("iconWrapper").classList.add(exam.iconBg);
      slot("iconSvg").classList.add(exam.iconColor);
      slot("iconPath").setAttribute("d", exam.iconPath);

      if (memStatus === "submitted") {
        var passed = memory.score !== undefined && memory.pct >= 60;
        if (passed) {
          slot("badgePassed").classList.remove("hidden");
        } else {
          slot("badgeFailed").classList.remove("hidden");
        }
      } else if (memStatus === "in_progress")
        slot("badgeInProgress").classList.remove("hidden");
      else if (isActive) slot("badgeActive").classList.remove("hidden");
      else slot("badgeUpcoming").classList.remove("hidden");

      slot("title").textContent = exam.title;
      slot("category").textContent = exam.category;
      slot("duration").textContent = exam.duration;
      slot("questions").textContent = exam.questions + " Questions";

      if (memStatus === "submitted" && memory.score !== undefined) {
        var passed = memory.pct >= 60;
        var scoreRow = slot("scoreRow");
        var scoreText = slot("scoreText");
        scoreRow.classList.remove("hidden");

        if (passed) {
          scoreRow.classList.add("text-emerald-600");
        } else {
          scoreRow.classList.add("text-red-500");
        }

        var verdict;
        if (passed) {
          verdict = "PASSED ✓";
        } else {
          verdict = "FAILED ✗";
        }
        scoreText.textContent =
          "Score: " +
          memory.score +
          "/" +
          memory.total +
          " (" +
          memory.pct +
          "%) — " +
          verdict;
      }

      if (memStatus === "submitted") {
        var passed = memory.score !== undefined && memory.pct >= 60;
        if (passed) {
          slot("btnPassed").classList.remove("hidden");
        } else {
          slot("btnFailed").classList.remove("hidden");
        }
      } else if (memStatus === "in_progress") {
        var btnResume = slot("btnResume");
        btnResume.classList.remove("hidden");

        (function (id) {
          btnResume.addEventListener("click", function () {
            resumeExam(id);
          });
        })(exam.id);
      } else if (isActive) {
        var btnStart = slot("btnStart");
        btnStart.classList.remove("hidden");
        (function (id) {
          btnStart.addEventListener("click", function () {
            startExamNow(id);
          });
        })(exam.id);
      } else {
        slot("btnComingSoon").classList.remove("hidden");
      }

      grid.appendChild(card);
    }

    updateHeroStats();
  }

  renderExams();

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      renderExams(e.target.value);
    });
  }

  window.startExamNow = function (examId) {
    var exam = null;
    for (var i = 0; i < exams.length; i++) {
      if (exams[i].id === examId) {
        exam = exams[i];
        break;
      }
    }
    if (!exam) return;

    localStorage.setItem("examStarted", "true");
    localStorage.setItem("forceNewExam", "true");
    localStorage.setItem("examSubject", exam.subject);

    window.location.assign("exam.html");
  };

  window.resumeExam = function (examId) {
    var exam = null;
    for (var i = 0; i < exams.length; i++) {
      if (exams[i].id === examId) {
        exam = exams[i];
        break;
      }
    }
    if (!exam) return;

    localStorage.setItem("examStarted", "true");
    localStorage.setItem("examSubject", exam.subject);

    window.location.assign("exam.html");
  };
});
