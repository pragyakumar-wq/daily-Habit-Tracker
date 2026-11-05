// 1. STATE & CONSTANTS
const STORAGE_KEY = 'beginner_habit_tracker_v13';

const TIME_SLOTS = {
  Morning: { label: '🌅 Morning', order: 1, badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800' },
  Afternoon: { label: '☀️ Afternoon', order: 2, badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800' },
  Evening: { label: '🌙 Evening', order: 3, badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800' },
  Anytime: { label: '🔄 Anytime', order: 4, badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
};
const THEME_KEY = 'beginner_habit_tracker_theme';
const SOUND_KEY = 'beginner_habit_tracker_sound';
const ACCENT_KEY = 'beginner_habit_tracker_accent';

const ACCENT_COLORS = {
  indigo: '#4f46e5',
  emerald: '#10b981',
  rose: '#e11d48',
  violet: '#7c3aed'
};

const TEMPLATE_PACKS = {
  morning: [
    { name: '🧘 5-min Morning Stretch', category: 'Health', target: 1, note: 'Loosen shoulders & back' },
    { name: '💧 Drink 1 glass of warm water', category: 'Health', target: 1, note: 'First thing after waking up' },
    { name: '📝 Plan top 3 daily priorities', category: 'Life', target: 1, note: 'Write in notebook before checking phone' }
  ],
  developer: [
    { name: '💻 Solve 1 DSA / Coding problem', category: 'Work', target: 1, note: 'Practice arrays or recursion in VS Code' },
    { name: '🐙 Commit code to GitHub', category: 'Work', target: 1, note: 'Keep the contribution graph green' },
    { name: '📚 Read technical docs for 15 mins', category: 'Mind', target: 1, note: 'MDN Web Docs or JavaScript.info' }
  ],
  fitness: [
    { name: '🏃 20-minute brisk walk or run', category: 'Health', target: 1, note: 'Outdoor or treadmill' },
    { name: '🥗 Eat 3 servings of veggies/fruit', category: 'Health', target: 3, note: 'Lunch + dinner greens' },
    { name: '😴 Screen-free 30m before sleep', category: 'Mind', target: 1, note: 'Better sleep recovery' }
  ]
};

const CATEGORY_STYLES = {
  Health: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  Mind: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  Work: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  Life: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
};

const CATEGORY_BAR_COLORS = {
  Health: 'bg-rose-500',
  Mind: 'bg-purple-500',
  Work: 'bg-sky-500',
  Life: 'bg-emerald-500'
};

const LEVEL_TITLES = [
  'Beginner Sprout',
  'Routine Apprentice',
  'Consistency Builder',
  'Momentum Keeper',
  'Habit Architect',
  'Discipline Master',
  'Zen Legend'
];

const DEFAULT_HABITS = [
  {
    id: 1,
    name: '💧 Drink 8 glasses of water',
    category: 'Health',
    timeOfDay: 'Anytime',
    target: 8,
    count: 5,
    completed: false,
    note: 'Keep water bottle on desk while coding',
    history: [true, 'frozen', true, true, true, true],
    monthHistory: [
      true, true, false, true, true, true, false,
      true, true, true, false, true, true, true,
      false, true, true, true, true, false, true,
      true, 'frozen', true, true, true, true
    ]
  },
  {
    id: 2,
    name: '📖 Read for 15 minutes',
    category: 'Mind',
    timeOfDay: 'Evening',
    target: 1,
    count: 1,
    completed: true,
    note: 'Reading Chapter 4 of Atomic Habits',
    history: [false, true, true, true, true, true],
    monthHistory: [
      true, false, true, true, false, true, true,
      true, true, false, true, true, true, true,
      true, false, true, true, true, true, false,
      false, true, true, true, true, true
    ]
  },
  {
    id: 3,
    name: '💻 Code 2 Pomodoro sessions in VS Code',
    category: 'Work',
    timeOfDay: 'Morning',
    target: 2,
    count: 1,
    completed: false,
    note: '',
    history: [true, true, false, false, true, true],
    monthHistory: [
      false, true, true, true, false, false, true,
      true, true, true, false, true, true, false,
      true, true, false, true, true, true, true,
      true, true, false, false, true, true
    ]
  }
];

let habits = [];
let nextId = 4;
let dayOffset = 0;
let freezeShields = 2;
let activeView = 'habits';
let activeCategory = 'All';
let activeTimeSlot = 'All';
let searchQuery = '';
let sortBy = 'default';
let editingHabitId = null;
let openNoteHabitId = null;
let draggedHabitId = null;
let isDarkMode = false;
let isSoundEnabled = true;
let activeAccent = 'indigo';
let audioCtx = null;

// Focus / Pomodoro Timer State
let timerHabitId = 3;
let timerTotalSeconds = 25 * 60;
let timerRemainingSeconds = 25 * 60;
let timerRunning = false;
let timerIntervalId = null;

// 2. DOM REFERENCES
const dateEl = document.getElementById('current-date');
const saveStatusEl = document.getElementById('save-status');
const bestStreakEl = document.getElementById('best-streak');
const weeklyRateEl = document.getElementById('weekly-rate');
const freezeShieldsEl = document.getElementById('freeze-shields');
const levelBadgeEl = document.getElementById('level-badge');
const levelTitleEl = document.getElementById('level-title');
const xpTextEl = document.getElementById('xp-text');
const xpProgressBarEl = document.getElementById('xp-progress-bar');
const navAwardsCountEl = document.getElementById('nav-awards-count');
const awardsGridEl = document.getElementById('awards-grid');
const awardsSummaryEl = document.getElementById('awards-summary');

const mainNavTabsEl = document.getElementById('main-nav-tabs');
const viewHabitsEl = document.getElementById('view-habits');
const viewTimerEl = document.getElementById('view-timer');
const viewAnalyticsEl = document.getElementById('view-analytics');
const viewAwardsEl = document.getElementById('view-awards');
const viewSettingsEl = document.getElementById('view-settings');
const navTimerBadgeEl = document.getElementById('nav-timer-badge');

const habitListEl = document.getElementById('habit-list');
const emptyStateEl = document.getElementById('empty-state');
const emptyStateTitleEl = document.getElementById('empty-state-title');
const progressTextEl = document.getElementById('progress-text');
const progressBarEl = document.getElementById('progress-bar');
const celebrationMsgEl = document.getElementById('celebration-msg');
const addHabitForm = document.getElementById('add-habit-form');
const habitInput = document.getElementById('habit-input');
const habitTargetInput = document.getElementById('habit-target');
const habitCategorySelect = document.getElementById('habit-category');
const habitTimeSelect = document.getElementById('habit-time');
const timeFiltersEl = document.getElementById('time-filters');
const reviewTopHabitEl = document.getElementById('review-top-habit');
const reviewFocusHabitEl = document.getElementById('review-focus-habit');
const weeklyReportPreviewEl = document.getElementById('weekly-report-preview');
const copyReportBtn = document.getElementById('copy-report-btn');
const confettiCanvasEl = document.getElementById('confetti-canvas');
const testConfettiBtn = document.getElementById('test-confetti-btn');
const archivedCountEl = document.getElementById('archived-count');
const archivedHabitsListEl = document.getElementById('archived-habits-list');
const archivedEmptyMsgEl = document.getElementById('archived-empty-msg');
let confettiAnimId = null;
const inputFeedback = document.getElementById('input-feedback');
const categoryFiltersEl = document.getElementById('category-filters');
const searchInputEl = document.getElementById('search-input');
const sortSelectEl = document.getElementById('sort-select');
const dailyChartEl = document.getElementById('daily-chart');
const categoryBreakdownEl = document.getElementById('category-breakdown');
const monthlyHeatmapEl = document.getElementById('monthly-heatmap');
const monthlySummaryEl = document.getElementById('monthly-summary');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');
const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');
const importFileInput = document.getElementById('import-file-input');
const advanceDayBtn = document.getElementById('advance-day-btn');
const resetDayBtn = document.getElementById('reset-day-btn');
const restoreDefaultsBtn = document.getElementById('restore-defaults-btn');

const templatePacksEl = document.getElementById('template-packs');
const accentPickerEl = document.getElementById('accent-picker');
const runTestsBtn = document.getElementById('run-tests-btn');
const testResultsBoxEl = document.getElementById('test-results-box');

// Focus Timer DOM References
const timerHabitNameEl = document.getElementById('timer-habit-name');
const timerHabitSelectEl = document.getElementById('timer-habit-select');
const timerDisplayEl = document.getElementById('timer-display');
const timerProgressBarEl = document.getElementById('timer-progress-bar');
const timerStartPauseBtn = document.getElementById('timer-start-pause-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerPresetsEl = document.getElementById('timer-presets');
const timerStepStatusEl = document.getElementById('timer-step-status');

// 3. VIEW / TAB NAVIGATION
function switchView(viewName) {
  activeView = viewName;
  const views = {
    habits: viewHabitsEl,
    timer: viewTimerEl,
    analytics: viewAnalyticsEl,
    awards: viewAwardsEl,
    settings: viewSettingsEl
  };

  Object.entries(views).forEach(([key, el]) => {
    if (key === activeView) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  const tabBtns = mainNavTabsEl.querySelectorAll('.main-nav-btn');
  tabBtns.forEach((btn) => {
    const isTarget = btn.dataset.view === activeView;
    if (isTarget) {
      btn.className = 'main-nav-btn accent-bg flex-1 py-2 px-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-1';
    } else {
      btn.className = 'main-nav-btn flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1';
    }
  });
}

// 4. WEB AUDIO API SYNTHESIZER
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, startTimeOffset, duration, type = 'sine', gainValue = 0.08) {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime + startTimeOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    // Ignore audio context errors if blocked
  }
}

function playStepSound() {
  playTone(587.33, 0.0, 0.07, 'sine', 0.06);
}

function playTimerFinishAlarm() {
  playTone(587.33, 0.0, 0.14, 'triangle', 0.1);
  playTone(783.99, 0.12, 0.14, 'triangle', 0.1);
  playTone(987.77, 0.24, 0.18, 'triangle', 0.1);
  playTone(1174.66, 0.38, 0.35, 'triangle', 0.12);
}

function playCheckSound(isCompleted, allDone = false) {
  if (!isSoundEnabled) return;
  if (allDone) {
    playTone(523.25, 0.0, 0.14, 'triangle', 0.09);
    playTone(659.25, 0.08, 0.14, 'triangle', 0.09);
    playTone(783.99, 0.16, 0.16, 'triangle', 0.09);
    playTone(1046.50, 0.24, 0.28, 'triangle', 0.11);
  } else if (isCompleted) {
    playTone(523.25, 0.0, 0.11, 'sine', 0.08);
    playTone(659.25, 0.07, 0.16, 'sine', 0.09);
  } else {
    playTone(392.00, 0.0, 0.09, 'sine', 0.05);
  }
}

// 5. STORAGE, THEME, ACCENT & NORMALIZATION HELPERS
function normalizeDayStatus(val) {
  if (val === 'frozen') return 'frozen';
  return Boolean(val);
}

function normalizeHabit(h) {
  const target = Math.max(1, Math.min(50, Number(h.target) || 1));
  const completed = Boolean(h.completed);
  let count = typeof h.count === 'number' ? h.count : (completed ? target : 0);
  count = Math.max(0, Math.min(target, count));
  const isNowCompleted = count >= target;

  const history6 = Array.isArray(h.history) && h.history.length === 6
    ? h.history.map(normalizeDayStatus)
    : [false, false, false, false, false, false];

  let monthHistory27 = [];
  if (Array.isArray(h.monthHistory) && h.monthHistory.length === 27) {
    monthHistory27 = h.monthHistory.map(normalizeDayStatus);
  } else {
    const filler = Array.from({ length: 21 }, (_, idx) => Boolean((idx + Number(h.id || 1)) % 2 === 0));
    monthHistory27 = [...filler, ...history6];
  }
  for (let i = 0; i < 6; i++) {
    monthHistory27[21 + i] = history6[i];
  }

  return {
    id: Number(h.id) || Date.now(),
    name: String(h.name || 'Untitled Habit'),
    category: CATEGORY_STYLES[h.category] ? h.category : 'Health',
    timeOfDay: TIME_SLOTS[h.timeOfDay] ? h.timeOfDay : 'Anytime',
    target,
    count: isNowCompleted ? target : count,
    completed: isNowCompleted,
    note: typeof h.note === 'string' ? h.note : '',
    archived: Boolean(h.archived),
    history: history6,
    monthHistory: monthHistory27
  };
}

function loadFromStorage() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      isDarkMode = true;
    }
    const savedSound = localStorage.getItem(SOUND_KEY);
    if (savedSound === 'off') {
      isSoundEnabled = false;
    }
    const savedAccent = localStorage.getItem(ACCENT_KEY);
    if (savedAccent && ACCENT_COLORS[savedAccent]) {
      activeAccent = savedAccent;
    }
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('beginner_habit_tracker_v12') ||
      localStorage.getItem('beginner_habit_tracker_v11');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.habits)) {
        habits = parsed.habits.map(normalizeHabit);
        nextId = parsed.nextId || (habits.reduce((max, h) => Math.max(max, h.id), 0) + 1);
        dayOffset = parsed.dayOffset || 0;
        freezeShields = typeof parsed.freezeShields === 'number' ? parsed.freezeShields : 2;
        if (habits.length > 0 && !habits.some(h => h.id === timerHabitId)) {
          timerHabitId = habits[0].id;
        }
        return;
      }
    }
  } catch (err) {
    // Fallback if localStorage is restricted
  }
  habits = DEFAULT_HABITS.map(normalizeHabit);
  nextId = 4;
  dayOffset = 0;
  freezeShields = 2;
}

function saveToStorage(message = '✓ Saved') {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ habits, nextId, dayOffset, freezeShields })
    );
  } catch (err) {
    // Ignore storage errors
  }
  saveStatusEl.textContent = message;
}

function applyTheme() {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    themeToggleBtn.textContent = '☀️ Light';
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleBtn.textContent = '🌙 Dark';
  }
  try {
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  } catch (err) {
    // Ignore storage errors
  }
}

function applyAccentColor() {
  const hex = ACCENT_COLORS[activeAccent] || ACCENT_COLORS.indigo;
  document.documentElement.style.setProperty('--accent-hex', hex);
  const accentBtns = accentPickerEl.querySelectorAll('.accent-choice-btn');
  accentBtns.forEach((btn) => {
    if (btn.dataset.accent === activeAccent) {
      btn.classList.add('ring-2', 'ring-offset-2', 'ring-slate-900', 'dark:ring-white');
    } else {
      btn.classList.remove('ring-2', 'ring-offset-2', 'ring-slate-900', 'dark:ring-white');
    }
  });
  try {
    localStorage.setItem(ACCENT_KEY, activeAccent);
  } catch (err) {
    // Ignore storage errors
  }
}

function applySoundSetting() {
  soundToggleBtn.textContent = isSoundEnabled ? '🔊 Sound' : '🔇 Muted';
  try {
    localStorage.setItem(SOUND_KEY, isSoundEnabled ? 'on' : 'off');
  } catch (err) {
    // Ignore storage errors
  }
}


// HTML5 <canvas> Physics Confetti Particle Engine
function launchConfetti() {
  if (!confettiCanvasEl) return;
  if (confettiAnimId !== null) {
    cancelAnimationFrame(confettiAnimId);
    confettiAnimId = null;
  }

  const ctx = confettiCanvasEl.getContext('2d');
  confettiCanvasEl.width = window.innerWidth;
  confettiCanvasEl.height = window.innerHeight;

  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
  const particles = Array.from({ length: 75 }, () => ({
    x: confettiCanvasEl.width * (0.2 + Math.random() * 0.6),
    y: confettiCanvasEl.height * 0.25,
    vx: (Math.random() - 0.5) * 11,
    vy: -(Math.random() * 9 + 4),
    size: Math.random() * 6 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.22,
    alpha: 1
  }));

  function stepFrame() {
    ctx.clearRect(0, 0, confettiCanvasEl.width, confettiCanvasEl.height);
    let alive = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // Gravity
      p.vx *= 0.99; // Air resistance
      p.rotation += p.vRot;
      p.alpha -= 0.011;

      if (p.alpha > 0 && p.y < confettiCanvasEl.height + 20) {
        alive += 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }
    });

    if (alive > 0) {
      confettiAnimId = requestAnimationFrame(stepFrame);
    } else {
      ctx.clearRect(0, 0, confettiCanvasEl.width, confettiCanvasEl.height);
      confettiAnimId = null;
    }
  }

  confettiAnimId = requestAnimationFrame(stepFrame);
}

function getActiveHabits() {
  return habits.filter(h => !h.archived);
}

function toggleArchiveHabit(id) {
  let nowArchived = false;
  habits = habits.map((h) => {
    if (h.id !== id) return h;
    nowArchived = !h.archived;
    return { ...h, archived: nowArchived };
  });
  playStepSound();
  saveToStorage(nowArchived ? '📦 Habit paused' : '↩ Habit resumed');
  renderHabits();
}

function renderArchivedHabits() {
  if (!archivedHabitsListEl || !archivedCountEl) return;
  const archivedList = habits.filter(h => h.archived);
  archivedCountEl.textContent = String(archivedList.length);
  archivedHabitsListEl.innerHTML = '';

  if (archivedList.length === 0) {
    archivedEmptyMsgEl.classList.remove('hidden');
    return;
  }
  archivedEmptyMsgEl.classList.add('hidden');

  archivedList.forEach((habit) => {
    const li = document.createElement('li');
    li.className = 'p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2';

    const info = document.createElement('div');
    info.className = 'min-w-0 flex-1';
    info.innerHTML = `<div class="text-xs font-bold text-slate-700 dark:text-slate-200 break-words">${habit.name}</div><div class="text-[10px] text-slate-400 mt-0.5">${habit.category} • 🔥 ${computeStreak(habit)}d streak preserved</div>`;

    const resumeBtn = document.createElement('button');
    resumeBtn.type = 'button';
    resumeBtn.className = 'px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shrink-0';
    resumeBtn.textContent = '↩ Resume';
    resumeBtn.addEventListener('click', () => toggleArchiveHabit(habit.id));

    li.appendChild(info);
    li.appendChild(resumeBtn);
    archivedHabitsListEl.appendChild(li);
  });
}

// 6. POMODORO / FOCUS TIMER LOGIC
function formatSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderTimerUI() {
  const linkedHabit = habits.find(h => h.id === timerHabitId) || habits[0] || null;
  if (linkedHabit && linkedHabit.id !== timerHabitId) {
    timerHabitId = linkedHabit.id;
  }

  timerHabitSelectEl.innerHTML = '';
  habits.forEach((h) => {
    const opt = document.createElement('option');
    opt.value = String(h.id);
    opt.textContent = `${h.name} (${h.count}/${h.target})`;
    if (h.id === timerHabitId) {
      opt.selected = true;
    }
    timerHabitSelectEl.appendChild(opt);
  });

  timerHabitNameEl.textContent = linkedHabit
    ? `Focused on: ${linkedHabit.name}`
    : 'Select or add a habit to time';

  timerStepStatusEl.textContent = linkedHabit
    ? `Today's status: ${linkedHabit.count} of ${linkedHabit.target} completed ${linkedHabit.completed ? '✅' : ''}`
    : '';

  const formattedTime = formatSeconds(timerRemainingSeconds);
  timerDisplayEl.textContent = formattedTime;

  if (timerRunning) {
    navTimerBadgeEl.textContent = formattedTime;
    navTimerBadgeEl.classList.remove('hidden');
  } else {
    navTimerBadgeEl.classList.add('hidden');
  }

  const elapsedPct = timerTotalSeconds === 0
    ? 0
    : Math.round(((timerTotalSeconds - timerRemainingSeconds) / timerTotalSeconds) * 100);
  timerProgressBarEl.style.width = `${elapsedPct}%`;

  if (timerRunning) {
    timerStartPauseBtn.textContent = '⏸ Pause';
    timerStartPauseBtn.className = 'px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors';
  } else {
    timerStartPauseBtn.textContent = '▶ Start Focus';
    timerStartPauseBtn.className = 'accent-bg px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors';
  }
}

function stopTimerInterval() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  timerRunning = false;
}

function startOrPauseTimer() {
  if (timerRunning) {
    stopTimerInterval();
    renderTimerUI();
    return;
  }

  if (timerRemainingSeconds <= 0) {
    timerRemainingSeconds = timerTotalSeconds;
  }

  stopTimerInterval();
  timerRunning = true;
  playStepSound();
  renderTimerUI();

  timerIntervalId = setInterval(() => {
    timerRemainingSeconds = Math.max(0, timerRemainingSeconds - 1);
    renderTimerUI();

    if (timerRemainingSeconds <= 0) {
      stopTimerInterval();
      playTimerFinishAlarm();
      const targetHabit = habits.find(h => h.id === timerHabitId);
      if (targetHabit) {
        if (!targetHabit.completed) {
          incrementHabitStep(targetHabit.id);
        }
        saveToStorage(`⏱ Focus complete!`);
      }
      timerRemainingSeconds = timerTotalSeconds;
      renderTimerUI();
    }
  }, 1000);
}

function resetTimer(newSeconds = timerTotalSeconds) {
  stopTimerInterval();
  timerTotalSeconds = newSeconds;
  timerRemainingSeconds = newSeconds;
  renderTimerUI();
}

function selectHabitForTimer(habitId, jumpToTimerTab = true) {
  timerHabitId = habitId;
  renderTimerUI();
  renderHabits();
  if (jumpToTimerTab) {
    switchView('timer');
  }
}

// 7. DATE, STREAK, DRAG-REORDER & GAMIFIED XP
function getDayLabels(numDays = 7) {
  const labels = [];
  const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset - i);
    labels.push({
      short: letters[d.getDay()],
      isToday: i === 0,
      fullDate: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    });
  }
  return labels;
}

function computeStreak(habit) {
  let count = 0;
  if (habit.completed) {
    count += 1;
  }
  const hist = Array.isArray(habit.monthHistory) ? habit.monthHistory : (habit.history || []);
  for (let i = hist.length - 1; i >= 0; i--) {
    const status = hist[i];
    if (status === true) {
      count += 1;
    } else if (status === 'frozen') {
      continue;
    } else {
      break;
    }
  }
  return count;
}

function computeTotalXP(habitList = habits) {
  return habitList.reduce((xp, h) => {
    const hist = Array.isArray(h.monthHistory) ? h.monthHistory : (h.history || []);
    const pastCheckins = hist.filter(v => v === true).length;
    const todayBonus = h.completed ? 25 : 0;
    const stepBonus = (h.count || 0) * 5;
    const noteBonus = h.note && h.note.trim() ? 10 : 0;
    return xp + (pastCheckins * 15) + todayBonus + stepBonus + noteBonus;
  }, 0);
}

// Pure helper for reordering an array by item ID (used by Drag & Drop + Unit Tests)
function reorderHabitsList(list, sourceId, targetId) {
  if (sourceId === targetId) return [...list];
  const copy = [...list];
  const fromIdx = copy.findIndex(h => h.id === sourceId);
  const toIdx = copy.findIndex(h => h.id === targetId);
  if (fromIdx === -1 || toIdx === -1) return copy;
  const [moved] = copy.splice(fromIdx, 1);
  copy.splice(toIdx, 0, moved);
  return copy;
}

function handleHabitDrop(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return;
  habits = reorderHabitsList(habits, sourceId, targetId);
  sortBy = 'default';
  sortSelectEl.value = 'default';
  playStepSound();
  saveToStorage('✓ Reordered habits');
  renderHabits();
}

function moveHabitByOffset(habitId, offset) {
  const idx = habits.findIndex(h => h.id === habitId);
  if (idx === -1) return;
  const targetIdx = idx + offset;
  if (targetIdx < 0 || targetIdx >= habits.length) return;
  const targetId = habits[targetIdx].id;
  handleHabitDrop(habitId, targetId);
}

function renderXPAndAchievements(completedCount, total, maxStreak, rate7d) {
  const totalXP = computeTotalXP(habits);
  const xpPerLevel = 200;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const currentLevelXP = totalXP % xpPerLevel;
  const levelPct = Math.round((currentLevelXP / xpPerLevel) * 100);
  const titleIdx = Math.min(LEVEL_TITLES.length - 1, level - 1);

  levelBadgeEl.textContent = `⚡ Lv. ${level}`;
  levelTitleEl.textContent = LEVEL_TITLES[titleIdx];
  xpTextEl.textContent = `${totalXP} XP (${currentLevelXP}/${xpPerLevel} to Lv. ${level + 1})`;
  xpProgressBarEl.style.width = `${levelPct}%`;

  const notesCount = habits.filter(h => h.note && h.note.trim()).length;
  const multiStepDone = habits.some(h => h.target > 1 && h.completed);

  const badges = [
    {
      icon: '🌱',
      title: 'First Step',
      desc: 'Complete at least 1 habit today.',
      unlocked: completedCount >= 1,
      progress: `${Math.min(1, completedCount)}/1 today`
    },
    {
      icon: '🎯',
      title: 'Perfect Day',
      desc: 'Complete 100% of your habits for the day.',
      unlocked: total > 0 && completedCount === total,
      progress: `${completedCount}/${total} done`
    },
    {
      icon: '🔥',
      title: 'Streak Builder',
      desc: 'Reach a 5-day streak on any habit.',
      unlocked: maxStreak >= 5,
      progress: `Best: ${maxStreak}/5 days`
    },
    {
      icon: '💧',
      title: 'Multi-Target Pro',
      desc: 'Finish a multi-step habit (Goal/day ≥ 2).',
      unlocked: multiStepDone,
      progress: multiStepDone ? 'Completed!' : 'In progress'
    },
    {
      icon: '📝',
      title: 'Mindful Journaler',
      desc: 'Write reflection notes on at least 2 habits.',
      unlocked: notesCount >= 2,
      progress: `${Math.min(2, notesCount)}/2 notes`
    },
    {
      icon: '👑',
      title: 'Consistency Champion',
      desc: 'Maintain a 70%+ 7-day completion rate.',
      unlocked: rate7d >= 70,
      progress: `${rate7d}% / 70%`
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  navAwardsCountEl.textContent = `${unlockedCount}/${badges.length}`;
  awardsSummaryEl.textContent = `${unlockedCount} of ${badges.length} Badges Unlocked`;

  awardsGridEl.innerHTML = '';
  badges.forEach((b) => {
    const card = document.createElement('div');
    card.className = `p-4 rounded-xl border transition-all flex items-start gap-3 ${
      b.unlocked
        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 shadow-xs'
        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-65'
    }`;

    const iconBox = document.createElement('div');
    iconBox.className = `w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
      b.unlocked
        ? 'bg-amber-100 dark:bg-amber-900/70'
        : 'bg-slate-200 dark:bg-slate-700 grayscale'
    }`;
    iconBox.textContent = b.icon;

    const body = document.createElement('div');
    body.className = 'min-w-0 flex-1';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between gap-1';

    const title = document.createElement('span');
    title.className = 'text-xs font-bold text-slate-900 dark:text-white truncate';
    title.textContent = b.title;

    const statusPill = document.createElement('span');
    statusPill.className = `px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
      b.unlocked
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
    }`;
    statusPill.textContent = b.unlocked ? '✓ Unlocked' : b.progress;

    header.appendChild(title);
    header.appendChild(statusPill);

    const desc = document.createElement('p');
    desc.className = 'text-[11px] text-slate-500 dark:text-slate-400 mt-1';
    desc.textContent = b.desc;

    body.appendChild(header);
    body.appendChild(desc);
    card.appendChild(iconBox);
    card.appendChild(body);
    awardsGridEl.appendChild(card);
  });
}

function updateDateDisplay() {
  const displayDate = new Date();
  displayDate.setDate(displayDate.getDate() + dayOffset);
  const formatted = displayDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  dateEl.textContent = dayOffset > 0 ? `${formatted} (+${dayOffset}d)` : formatted;
}

function getVisibleHabits() {
  const query = searchQuery.trim().toLowerCase();
  const filtered = habits.filter((h) => {
    if (h.archived) return false;
    const matchesCategory = activeCategory === 'All' || h.category === activeCategory;
    const matchesTime = activeTimeSlot === 'All' || h.timeOfDay === activeTimeSlot;
    const matchesSearch =
      !query ||
      h.name.toLowerCase().includes(query) ||
      h.category.toLowerCase().includes(query) ||
      (h.timeOfDay && h.timeOfDay.toLowerCase().includes(query)) ||
      (h.note && h.note.toLowerCase().includes(query));
    return matchesCategory && matchesTime && matchesSearch;
  });

  const sorted = [...filtered];
  if (sortBy === 'streak-desc') {
    sorted.sort((a, b) => computeStreak(b) - computeStreak(a));
  } else if (sortBy === 'incomplete-first') {
    sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
  } else if (sortBy === 'alpha') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'time-of-day') {
    sorted.sort((a, b) => {
      const orderA = (TIME_SLOTS[a.timeOfDay] || TIME_SLOTS.Anytime).order;
      const orderB = (TIME_SLOTS[b.timeOfDay] || TIME_SLOTS.Anytime).order;
      return orderA - orderB;
    });
  }
  return sorted;
}

// 8. RENDER FUNCTIONS
function renderTimeTabs() {
  if (!timeFiltersEl) return;
  const buttons = timeFiltersEl.querySelectorAll('.time-tab');
  buttons.forEach((btn) => {
    const slot = btn.dataset.time;
    const activeList = getActiveHabits();
    const count = slot === 'All'
      ? activeList.length
      : activeList.filter(h => h.timeOfDay === slot).length;
    const base = slot === 'All' ? 'All Times' : TIME_SLOTS[slot].label;
    btn.textContent = `${base} (${count})`;
    if (slot === activeTimeSlot) {
      btn.className = 'time-tab accent-bg px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-xs transition-colors';
    } else {
      btn.className = 'time-tab px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors';
    }
  });
}

function buildWeeklyReportText() {
  if (habits.length === 0) {
    reviewTopHabitEl.textContent = 'Add a habit to see insights';
    reviewFocusHabitEl.textContent = 'Add a habit to see insights';
    weeklyReportPreviewEl.textContent = 'No habits tracked yet.';
    return 'No habits tracked yet.';
  }

  const scored = habits.map((h) => {
    const done7d = h.history.filter(v => v === true).length + (h.completed ? 1 : 0);
    const pct = Math.round((done7d / 7) * 100);
    return { habit: h, done7d, pct, streak: computeStreak(h) };
  });

  const sortedByRate = [...scored].sort((a, b) => b.pct - a.pct || b.streak - a.streak);
  const top = sortedByRate[0];
  const focus = sortedByRate[sortedByRate.length - 1];

  reviewTopHabitEl.textContent = `${top.habit.name} (${top.pct}% • 🔥 ${top.streak}d)`;
  reviewFocusHabitEl.textContent = `${focus.habit.name} (${focus.pct}% • ${focus.done7d}/7 days)`;

  const totalPossible = habits.length * 7;
  const totalDone = scored.reduce((s, item) => s + item.done7d, 0);
  const overallRate = Math.round((totalDone / totalPossible) * 100);
  const totalXP = computeTotalXP(habits);
  const level = Math.floor(totalXP / 200) + 1;

  const lines = [
    `📊 WEEKLY HABIT REVIEW (${dateEl.textContent})`,
    `• Overall 7-Day Consistency: ${overallRate}% (${totalDone}/${totalPossible} check-ins)`,
    `• Current Level: Lv. ${level} (${totalXP} XP) | Shields: 🧊 ${freezeShields}/3`,
    `• Top Habit: ${top.habit.name} (${top.pct}%)`,
    `• Focus for Next Week: ${focus.habit.name} (${focus.pct}%)`,
    ``,
    `HABIT BREAKDOWN (LAST 7 DAYS):`,
    ...scored.map(s => `- ${s.habit.name} [${s.habit.timeOfDay}]: ${s.done7d}/7 days (${s.pct}%) | 🔥 ${s.streak}d streak`)
  ];
  const report = lines.join('\n');
  weeklyReportPreviewEl.textContent = report;
  return report;
}

function renderCategoryTabs() {
  const buttons = categoryFiltersEl.querySelectorAll('.filter-tab');
  buttons.forEach((btn) => {
    const cat = btn.dataset.category;
    const activeList = getActiveHabits();
    const count = cat === 'All'
      ? activeList.length
      : activeList.filter(h => h.category === cat).length;

    const baseLabel = cat === 'All' ? 'All' : btn.textContent.split(' (')[0];
    btn.textContent = `${baseLabel} (${count})`;

    if (cat === activeCategory) {
      btn.className = 'filter-tab accent-bg px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors shrink-0';
    } else {
      btn.className = 'filter-tab px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0';
    }
  });
}

function renderMonthlyHeatmap() {
  monthlyHeatmapEl.innerHTML = '';
  const labels28 = getDayLabels(28);
  const totalHabits = habits.length;
  let perfectDays = 0;

  labels28.forEach((dayInfo, idx) => {
    const completedOnDay = habits.reduce((acc, h) => {
      const done = dayInfo.isToday ? h.completed : h.monthHistory[idx] === true;
      return acc + (done ? 1 : 0);
    }, 0);

    const ratio = totalHabits === 0 ? 0 : completedOnDay / totalHabits;
    if (totalHabits > 0 && ratio === 1) {
      perfectDays += 1;
    }

    let colorClass = 'bg-slate-200 dark:bg-slate-700/70 text-slate-400';
    if (ratio === 1 && totalHabits > 0) {
      colorClass = 'bg-emerald-500 text-white shadow-xs';
    } else if (ratio >= 0.5) {
      colorClass = 'bg-emerald-300 dark:bg-emerald-700 text-emerald-950 dark:text-emerald-100';
    } else if (ratio > 0) {
      colorClass = 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300';
    }

    const cell = document.createElement('div');
    cell.title = `${dayInfo.fullDate}: ${completedOnDay}/${totalHabits} completed (${Math.round(ratio * 100)}%)`;
    cell.className = `h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold transition-all ${colorClass} ${
      dayInfo.isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-800' : ''
    }`;
    cell.textContent = dayInfo.isToday ? '★' : dayInfo.short;
    monthlyHeatmapEl.appendChild(cell);
  });

  monthlySummaryEl.textContent = `${perfectDays} of 28 days at 100% completion`;
}

function renderAnalytics(dayLabels) {
  dailyChartEl.innerHTML = '';
  const totalHabits = habits.length;

  dayLabels.forEach((dayInfo, idx) => {
    const completedOnDay = habits.reduce((acc, h) => {
      const done = dayInfo.isToday ? h.completed : h.history[idx] === true;
      return acc + (done ? 1 : 0);
    }, 0);

    const pct = totalHabits === 0 ? 0 : Math.round((completedOnDay / totalHabits) * 100);

    const col = document.createElement('div');
    col.className = 'flex-1 flex flex-col items-center gap-1';

    const countLabel = document.createElement('span');
    countLabel.className = 'text-[10px] font-semibold text-slate-400 dark:text-slate-500';
    countLabel.textContent = `${completedOnDay}/${totalHabits}`;

    const barTrack = document.createElement('div');
    barTrack.className = 'w-full max-w-[32px] h-20 bg-slate-200/80 dark:bg-slate-700/70 rounded-lg flex items-end overflow-hidden p-0.5';

    const barFill = document.createElement('div');
    barFill.className = `chart-bar w-full rounded-md ${
      dayInfo.isToday ? 'accent-bg' : 'bg-emerald-500 dark:bg-emerald-400'
    }`;
    barFill.style.height = `${Math.max(pct, completedOnDay > 0 ? 15 : 4)}%`;

    barTrack.appendChild(barFill);

    const dayText = document.createElement('span');
    dayText.className = `text-[10px] font-bold ${
      dayInfo.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
    }`;
    dayText.textContent = dayInfo.isToday ? 'Today' : dayInfo.short;

    col.appendChild(countLabel);
    col.appendChild(barTrack);
    col.appendChild(dayText);
    dailyChartEl.appendChild(col);
  });

  categoryBreakdownEl.innerHTML = '';
  const categories = ['Health', 'Mind', 'Work', 'Life'];

  categories.forEach((cat) => {
    const catHabits = habits.filter(h => h.category === cat);
    if (catHabits.length === 0) return;

    const possibleCheckins = catHabits.length * 7;
    const actualCheckins = catHabits.reduce((sum, h) => {
      const historyCount = h.history.filter(v => v === true).length;
      return sum + historyCount + (h.completed ? 1 : 0);
    }, 0);
    const catPct = Math.round((actualCheckins / possibleCheckins) * 100);

    const row = document.createElement('div');
    row.className = 'space-y-1';

    const labelRow = document.createElement('div');
    labelRow.className = 'flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300';
    labelRow.innerHTML = `<span>${cat} (${catHabits.length})</span><span class="font-semibold">${catPct}%</span>`;

    const track = document.createElement('div');
    track.className = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden';

    const fill = document.createElement('div');
    fill.className = `h-full ${CATEGORY_BAR_COLORS[cat]} rounded-full transition-all duration-300`;
    fill.style.width = `${catPct}%`;

    track.appendChild(fill);
    row.appendChild(labelRow);
    row.appendChild(track);
    categoryBreakdownEl.appendChild(row);
  });

  renderMonthlyHeatmap();
  buildWeeklyReportText();
}

function renderHabits() {
  updateDateDisplay();
  renderTimeTabs();
  renderCategoryTabs();
  renderTimerUI();
  habitListEl.innerHTML = '';

  const dayLabels = getDayLabels(7);
  const visibleHabits = getVisibleHabits();

  if (visibleHabits.length === 0) {
    emptyStateEl.classList.remove('hidden');
    if (habits.length === 0) {
      emptyStateTitleEl.textContent = 'No habits in your list yet!';
    } else if (searchQuery.trim()) {
      emptyStateTitleEl.textContent = `No habits matching "${searchQuery.trim()}".`;
    } else {
      emptyStateTitleEl.textContent = `No habits in the "${activeCategory}" category yet.`;
    }
  } else {
    emptyStateEl.classList.add('hidden');
  }

  visibleHabits.forEach((habit, visibleIdx) => {
    const activeStreak = computeStreak(habit);
    const catClass = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.Health;
    const targetPct = Math.round((habit.count / habit.target) * 100);
    const hasNote = Boolean(habit.note && habit.note.trim());
    const isTimerTarget = habit.id === timerHabitId;

    const li = document.createElement('li');
    li.draggable = editingHabitId !== habit.id;
    li.dataset.habitId = String(habit.id);
    li.className = `habit-item p-3.5 rounded-xl border select-none ${
      habit.completed
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/70'
        : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
    }`;

    // HTML5 Drag & Drop Event Listeners
    li.addEventListener('dragstart', (event) => {
      draggedHabitId = habit.id;
      li.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(habit.id));
      }
    });

    li.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (draggedHabitId && draggedHabitId !== habit.id) {
        li.classList.add('drag-over');
      }
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over');
    });

    li.addEventListener('drop', (event) => {
      event.preventDefault();
      li.classList.remove('drag-over');
      if (draggedHabitId && draggedHabitId !== habit.id) {
        handleHabitDrop(draggedHabitId, habit.id);
      }
      draggedHabitId = null;
    });

    li.addEventListener('dragend', () => {
      draggedHabitId = null;
      li.classList.remove('dragging');
      habitListEl.querySelectorAll('.habit-item').forEach(el => el.classList.remove('drag-over'));
    });

    // ROW 1: Drag Handle + Checkbox + Full-Width Habit Name + Streak Pill
    const topRow = document.createElement('div');
    topRow.className = 'flex items-start justify-between gap-2.5 cursor-pointer';
    topRow.addEventListener('click', () => {
      if (editingHabitId !== habit.id) {
        incrementHabitStep(habit.id);
      }
    });

    const leftDiv = document.createElement('div');
    leftDiv.className = 'flex items-start gap-2.5 min-w-0 flex-1';

    const dragHandle = document.createElement('span');
    dragHandle.title = 'Drag to reorder habit';
    dragHandle.className = 'mt-0.5 text-slate-300 dark:text-slate-600 hover:text-slate-500 cursor-grab active:cursor-grabbing text-xs font-bold select-none shrink-0';
    dragHandle.textContent = '⋮⋮';

    const checkbox = document.createElement('div');
    checkbox.className = `mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
      habit.completed
        ? 'bg-emerald-500 border-emerald-500 text-white'
        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
    }`;
    checkbox.innerHTML = habit.completed
      ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
      : '';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'flex items-center gap-1.5 min-w-0 flex-1';

    if (editingHabitId === habit.id) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = habit.name;
      editInput.maxLength = 60;
      editInput.className = 'px-2.5 py-1 text-sm rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full';
      editInput.addEventListener('click', (e) => e.stopPropagation());
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEditedHabit(habit.id, editInput.value);
        } else if (e.key === 'Escape') {
          editingHabitId = null;
          renderHabits();
        }
      });
      editInput.addEventListener('blur', () => {
        saveEditedHabit(habit.id, editInput.value);
      });
      titleWrap.appendChild(editInput);
      setTimeout(() => editInput.focus(), 0);
    } else {
      const shortcutBadge = document.createElement('kbd');
      shortcutBadge.className = 'hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-600 shrink-0';
      shortcutBadge.textContent = String(visibleIdx + 1);
      shortcutBadge.title = `Press ${visibleIdx + 1} on your keyboard to advance`;

      const titleSpan = document.createElement('span');
      titleSpan.className = `text-sm sm:text-base font-semibold leading-snug break-words ${
        habit.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
      }`;
      titleSpan.textContent = habit.name;

      if (visibleIdx < 9) {
        titleWrap.appendChild(shortcutBadge);
      }
      titleWrap.appendChild(titleSpan);
    }

    leftDiv.appendChild(dragHandle);
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(titleWrap);

    const streakBadge = document.createElement('span');
    streakBadge.className = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
      activeStreak > 0
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
    }`;
    streakBadge.textContent = `🔥 ${activeStreak}d`;

    topRow.appendChild(leftDiv);
    topRow.appendChild(streakBadge);
    li.appendChild(topRow);

    // ROW 2: Category Badge + Multi-Step Counter (Left) & Action Toolbar (Right)
    const actionRow = document.createElement('div');
    actionRow.className = 'mt-2.5 pl-7 flex flex-wrap items-center justify-between gap-2';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'flex items-center gap-2 flex-wrap';

    const catBadge = document.createElement('span');
    catBadge.className = `px-2 py-0.5 text-[11px] font-semibold rounded-md border ${catClass}`;
    catBadge.textContent = habit.category;
    metaLeft.appendChild(catBadge);

    const timeInfo = TIME_SLOTS[habit.timeOfDay] || TIME_SLOTS.Anytime;
    const timeBadge = document.createElement('span');
    timeBadge.className = `px-2 py-0.5 text-[11px] font-semibold rounded-md border ${timeInfo.badge}`;
    timeBadge.textContent = timeInfo.label;
    metaLeft.appendChild(timeBadge);

    if (habit.target > 1) {
      const stepper = document.createElement('div');
      stepper.className = 'inline-flex items-center bg-slate-100 dark:bg-slate-700/80 rounded-lg p-0.5';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.title = 'Decrease count';
      minusBtn.className = 'w-6 h-6 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-colors';
      minusBtn.textContent = '−';
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        adjustHabitCount(habit.id, -1);
      });

      const countText = document.createElement('span');
      countText.className = 'px-2 text-xs font-bold text-indigo-600 dark:text-indigo-300';
      countText.textContent = `${habit.count}/${habit.target}`;

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.title = 'Increase count';
      plusBtn.className = 'w-6 h-6 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-colors';
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        adjustHabitCount(habit.id, 1);
      });

      stepper.appendChild(minusBtn);
      stepper.appendChild(countText);
      stepper.appendChild(plusBtn);
      metaLeft.appendChild(stepper);
    }

    const toolsRight = document.createElement('div');
    toolsRight.className = 'flex items-center gap-1 ml-auto';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.type = 'button';
    moveUpBtn.title = 'Move habit up';
    moveUpBtn.className = 'p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs';
    moveUpBtn.textContent = '↑';
    moveUpBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      moveHabitByOffset(habit.id, -1);
    });

    const timerBtn = document.createElement('button');
    timerBtn.type = 'button';
    timerBtn.title = 'Open in Focus Timer tab';
    timerBtn.className = `p-1.5 rounded-lg text-xs transition-colors ${
      isTimerTarget
        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold'
        : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;
    timerBtn.textContent = '⏱';
    timerBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      selectHabitForTimer(habit.id, true);
    });

    const noteBtn = document.createElement('button');
    noteBtn.type = 'button';
    noteBtn.title = hasNote ? 'View/Edit daily note' : 'Add daily note';
    noteBtn.className = `p-1.5 rounded-lg text-xs transition-colors ${
      hasNote || openNoteHabitId === habit.id
        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300'
        : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;
    noteBtn.textContent = '📝';
    noteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      openNoteHabitId = openNoteHabitId === habit.id ? null : habit.id;
      renderHabits();
    });

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.title = 'Rename habit';
    editBtn.className = 'p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors';
    editBtn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>';
    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      editingHabitId = habit.id;
      renderHabits();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.title = 'Remove habit';
    deleteBtn.className = 'p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-colors';
    deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteHabit(habit.id);
    });

    const archiveBtn = document.createElement('button');
    archiveBtn.type = 'button';
    archiveBtn.title = 'Pause / Archive habit without losing history';
    archiveBtn.className = 'p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs';
    archiveBtn.textContent = '📦';
    archiveBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleArchiveHabit(habit.id);
    });

    toolsRight.appendChild(moveUpBtn);
    toolsRight.appendChild(timerBtn);
    toolsRight.appendChild(noteBtn);
    toolsRight.appendChild(archiveBtn);
    toolsRight.appendChild(editBtn);
    toolsRight.appendChild(deleteBtn);

    actionRow.appendChild(metaLeft);
    actionRow.appendChild(toolsRight);
    li.appendChild(actionRow);

    if (openNoteHabitId === habit.id) {
      const noteBox = document.createElement('div');
      noteBox.className = 'mt-2.5 flex items-center gap-2';
      noteBox.addEventListener('click', (e) => e.stopPropagation());

      const noteInput = document.createElement('input');
      noteInput.type = 'text';
      noteInput.value = habit.note || '';
      noteInput.placeholder = 'Add a reflection or note (e.g., Pages read, workout weight)...';
      noteInput.maxLength = 120;
      noteInput.className = 'flex-1 px-3 py-1.5 text-xs rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500';
      noteInput.addEventListener('input', () => {
        saveHabitNote(habit.id, noteInput.value, false);
      });
      noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          openNoteHabitId = null;
          renderHabits();
        }
      });

      const doneNoteBtn = document.createElement('button');
      doneNoteBtn.type = 'button';
      doneNoteBtn.className = 'accent-bg px-2.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors';
      doneNoteBtn.textContent = 'Done';
      doneNoteBtn.addEventListener('click', () => {
        openNoteHabitId = null;
        renderHabits();
      });

      noteBox.appendChild(noteInput);
      noteBox.appendChild(doneNoteBtn);
      li.appendChild(noteBox);
    } else if (hasNote) {
      const notePreview = document.createElement('div');
      notePreview.className = 'mt-2 text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400';
      notePreview.textContent = `📝 "${habit.note}"`;
      notePreview.addEventListener('click', (e) => {
        e.stopPropagation();
        openNoteHabitId = habit.id;
        renderHabits();
      });
      li.appendChild(notePreview);
    }

    if (habit.target > 1) {
      const miniTrack = document.createElement('div');
      miniTrack.className = 'mt-2.5 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden';
      const miniFill = document.createElement('div');
      miniFill.className = `h-full transition-all duration-300 rounded-full ${
        habit.completed ? 'bg-emerald-500' : 'accent-bg'
      }`;
      miniFill.style.width = `${targetPct}%`;
      miniTrack.appendChild(miniFill);
      li.appendChild(miniTrack);
    }

    const weekRow = document.createElement('div');
    weekRow.className = 'mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/70 flex flex-col gap-1.5';

    const weekHeader = document.createElement('div');
    weekHeader.className = 'flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500';
    weekHeader.innerHTML = '<span>Last 7 days</span><span>Tap day: ✓ / 🧊 / ×</span>';

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'grid grid-cols-7 gap-1.5 w-full';

    dayLabels.forEach((dayInfo, idx) => {
      const status = dayInfo.isToday ? habit.completed : habit.history[idx];
      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';

      let statusLabel = 'Missed';
      let colorStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600';
      let buttonText = dayInfo.short;

      if (status === true) {
        statusLabel = 'Completed';
        colorStyle = 'bg-emerald-500 text-white shadow-xs';
      } else if (status === 'frozen') {
        statusLabel = 'Streak Shield Frozen (🧊)';
        colorStyle = 'bg-sky-100 dark:bg-sky-900/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700';
        buttonText = '🧊';
      }

      dayBtn.title = `${dayInfo.fullDate}: ${statusLabel}`;
      dayBtn.className = `h-8 w-full rounded-lg text-xs font-bold flex items-center justify-center transition-all ${colorStyle} ${
        dayInfo.isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-800' : ''
      }`;
      dayBtn.textContent = buttonText;

      dayBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (dayInfo.isToday) {
          incrementHabitStep(habit.id);
        } else {
          togglePastDay(habit.id, idx);
        }
      });

      dotsContainer.appendChild(dayBtn);
    });

    weekRow.appendChild(weekHeader);
    weekRow.appendChild(dotsContainer);

    li.appendChild(weekRow);
    habitListEl.appendChild(li);
  });

  updateProgressAndStreaks();
  renderArchivedHabits();
  renderAnalytics(dayLabels);
}

function updateProgressAndStreaks() {
  const activeList = getActiveHabits();
  const total = activeList.length;
  const completedCount = activeList.filter(h => h.completed).length;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  progressTextEl.textContent = `${completedCount} of ${total} done (${percent}%)`;
  progressBarEl.style.width = `${percent}%`;

  if (total > 0 && completedCount === total) {
    celebrationMsgEl.classList.remove('hidden');
  } else {
    celebrationMsgEl.classList.add('hidden');
  }

  const maxStreak = habits.reduce((max, h) => Math.max(max, computeStreak(h)), 0);
  bestStreakEl.textContent = `🔥 ${maxStreak}d`;
  freezeShieldsEl.textContent = `🧊 ${freezeShields}/3`;

  const totalPossible = total * 7;
  const totalDone7d = activeList.reduce((sum, h) => {
    return sum + h.history.filter(v => v === true).length + (h.completed ? 1 : 0);
  }, 0);
  const rate7d = totalPossible === 0 ? 0 : Math.round((totalDone7d / totalPossible) * 100);
  weeklyRateEl.textContent = `${rate7d}%`;

  renderXPAndAchievements(completedCount, total, maxStreak, rate7d);
}

// 9. TEMPLATES, CSV SPREADSHEET EXPORT & UNIT TEST SUITE
function applyTemplatePack(packKey) {
  const items = TEMPLATE_PACKS[packKey];
  if (!items) return;

  let addedCount = 0;
  items.forEach((tpl) => {
    const exists = habits.some(h => h.name.toLowerCase() === tpl.name.toLowerCase());
    if (!exists) {
      habits.push(normalizeHabit({
        id: nextId++,
        name: tpl.name,
        category: tpl.category,
        target: tpl.target,
        count: 0,
        completed: false,
        note: tpl.note,
        history: [false, false, false, false, false, false],
        monthHistory: Array(27).fill(false)
      }));
      addedCount += 1;
    }
  });

  playCheckSound(true, false);
  saveToStorage(addedCount > 0 ? `✓ Added ${addedCount} template habit(s)` : '✓ Pack already in list');
  renderHabits();
  switchView('habits');
}

function escapeCsvCell(value) {
  const str = String(value ?? '').replace(/"/g, '""');
  return `"${str}"`;
}

function buildCsvContent(habitList = habits) {
  const headers = [
    'ID',
    'Habit Name',
    'Category',
    'Daily Goal',
    'Today Count',
    'Completed Today',
    'Active Streak (Days)',
    '7-Day Completion %',
    'Reflection Note'
  ];
  const rows = habitList.map((h) => {
    const done7d = h.history.filter(v => v === true).length + (h.completed ? 1 : 0);
    const pct7d = Math.round((done7d / 7) * 100);
    return [
      h.id,
      h.name,
      h.category,
      h.target,
      h.count,
      h.completed ? 'Yes' : 'No',
      computeStreak(h),
      `${pct7d}%`,
      h.note || ''
    ].map(escapeCsvCell).join(',');
  });
  return [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
}

function exportCsvFile() {
  const csv = buildCsvContent(habits);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'habits-report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  saveToStorage('✓ Exported CSV');
}

function runUnitTests() {
  const results = [];
  const assert = (name, condition) => {
    results.push({ name, passed: Boolean(condition) });
  };

  assert('formatSeconds(1505) === "25:05"', formatSeconds(1505) === '25:05');

  const sampleStreakHabit = {
    completed: true,
    monthHistory: [false, true, true, true]
  };
  assert('computeStreak() counts 3 past days + today = 4', computeStreak(sampleStreakHabit) === 4);

  const frozenStreakHabit = {
    completed: true,
    monthHistory: [false, true, 'frozen', true]
  };
  assert('computeStreak() bridges across "frozen" shield day (3d)', computeStreak(frozenStreakHabit) === 3);

  const normalized = normalizeHabit({ id: 99, name: 'Test', category: 'Work', target: 4, count: 4 });
  assert('normalizeHabit() sets completed=true when count === target', normalized.completed === true && normalized.target === 4);

  const xpSample = [{
    completed: true,
    count: 2,
    note: 'Done!',
    monthHistory: [true, true, false]
  }];
  assert('computeTotalXP() sums history + today + steps + note = 75 XP', computeTotalXP(xpSample) === 75);

  const reordered = reorderHabitsList([{ id: 1 }, { id: 2 }, { id: 3 }], 3, 1);
  assert('reorderHabitsList() moves dragged item #3 to index 0', reordered[0].id === 3 && reordered[1].id === 1);

  testResultsBoxEl.classList.remove('hidden');
  testResultsBoxEl.innerHTML = '';

  const passedCount = results.filter(r => r.passed).length;
  const header = document.createElement('div');
  header.className = 'text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2';
  header.textContent = `🧪 Test Suite Result: ${passedCount}/${results.length} Assertions Passed`;
  testResultsBoxEl.appendChild(header);

  const list = document.createElement('ul');
  list.className = 'space-y-1 text-[11px] font-mono';
  results.forEach((r) => {
    const item = document.createElement('li');
    item.className = r.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 font-bold';
    item.textContent = `${r.passed ? '✓ PASS' : '✗ FAIL'}: ${r.name}`;
    list.appendChild(item);
  });
  testResultsBoxEl.appendChild(list);
  playCheckSound(passedCount === results.length, false);
}

// 10. EVENT HANDLERS & MUTATIONS
function incrementHabitStep(id) {
  let reachedComplete = false;
  let steppedUp = false;

  habits = habits.map((habit) => {
    if (habit.id !== id) return habit;
    if (habit.target === 1) {
      const nextDone = !habit.completed;
      reachedComplete = nextDone;
      return {
        ...habit,
        count: nextDone ? 1 : 0,
        completed: nextDone
      };
    }
    const nextCount = habit.completed ? 0 : habit.count + 1;
    const nextDone = nextCount >= habit.target;
    reachedComplete = nextDone;
    steppedUp = nextCount > 0 && !nextDone;
    return {
      ...habit,
      count: nextCount,
      completed: nextDone
    };
  });

  const activeList = getActiveHabits();
  const allDone = activeList.length > 0 && activeList.every(h => h.completed);
  if (steppedUp) {
    playStepSound();
  } else {
    playCheckSound(reachedComplete, reachedComplete && allDone);
    if (reachedComplete && allDone) {
      launchConfetti();
    }
  }
  saveToStorage();
  renderHabits();
}

function adjustHabitCount(id, delta) {
  let reachedComplete = false;
  let stepped = false;

  habits = habits.map((habit) => {
    if (habit.id !== id) return habit;
    const nextCount = Math.max(0, Math.min(habit.target, habit.count + delta));
    const nextDone = nextCount >= habit.target;
    reachedComplete = !habit.completed && nextDone;
    stepped = nextCount !== habit.count;
    return {
      ...habit,
      count: nextCount,
      completed: nextDone
    };
  });

  if (reachedComplete) {
    const allDone = habits.length > 0 && habits.every(h => h.completed);
    playCheckSound(true, allDone);
  } else if (stepped) {
    playStepSound();
  }
  saveToStorage();
  renderHabits();
}

function togglePastDay(id, historyIdx) {
  let nextState = false;
  habits = habits.map((habit) => {
    if (habit.id !== id) return habit;
    const current = habit.history[historyIdx];
    if (current === false) {
      nextState = true;
    } else if (current === true) {
      nextState = 'frozen';
    } else {
      nextState = false;
    }

    const updatedHistory = [...habit.history];
    updatedHistory[historyIdx] = nextState;

    const updatedMonth = [...habit.monthHistory];
    updatedMonth[21 + historyIdx] = nextState;
    return { ...habit, history: updatedHistory, monthHistory: updatedMonth };
  });
  playCheckSound(nextState === true, false);
  saveToStorage(nextState === 'frozen' ? '🧊 Shield Frozen' : '✓ Updated');
  renderHabits();
}

function saveHabitNote(id, newNote, shouldReRender = true) {
  habits = habits.map(h => (h.id === id ? { ...h, note: newNote } : h));
  saveToStorage('✓ Saved note');
  if (shouldReRender) {
    renderHabits();
  } else {
    const completedCount = habits.filter(h => h.completed).length;
    const maxStreak = habits.reduce((max, h) => Math.max(max, computeStreak(h)), 0);
    const totalPossible = habits.length * 7;
    const totalDone7d = habits.reduce((sum, h) => sum + h.history.filter(v => v === true).length + (h.completed ? 1 : 0), 0);
    const rate7d = totalPossible === 0 ? 0 : Math.round((totalDone7d / totalPossible) * 100);
    renderXPAndAchievements(completedCount, habits.length, maxStreak, rate7d);
  }
}

function saveEditedHabit(id, newName) {
  if (editingHabitId !== id) return;
  const trimmed = newName.trim();
  if (trimmed) {
    habits = habits.map(h => (h.id === id ? { ...h, name: trimmed } : h));
    saveToStorage('✓ Renamed');
  }
  editingHabitId = null;
  renderHabits();
}

function deleteHabit(id) {
  habits = habits.filter(habit => habit.id !== id);
  saveToStorage();
  renderHabits();
}

mainNavTabsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('.main-nav-btn');
  if (!btn) return;
  switchView(btn.dataset.view);
});

templatePacksEl.addEventListener('click', (event) => {
  const btn = event.target.closest('.template-pack-btn');
  if (!btn) return;
  applyTemplatePack(btn.dataset.pack);
});

accentPickerEl.addEventListener('click', (event) => {
  const btn = event.target.closest('.accent-choice-btn');
  if (!btn) return;
  activeAccent = btn.dataset.accent;
  applyAccentColor();
  renderHabits();
});

runTestsBtn.addEventListener('click', runUnitTests);
exportCsvBtn.addEventListener('click', exportCsvFile);

timerHabitSelectEl.addEventListener('change', () => {
  selectHabitForTimer(Number(timerHabitSelectEl.value), false);
});
timerStartPauseBtn.addEventListener('click', startOrPauseTimer);
timerResetBtn.addEventListener('click', () => resetTimer(timerTotalSeconds));
timerPresetsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('.timer-preset-btn');
  if (!btn) return;
  const seconds = Number(btn.dataset.seconds) || 1500;
  resetTimer(seconds);
});

categoryFiltersEl.addEventListener('click', (event) => {
  const btn = event.target.closest('.filter-tab');
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderHabits();
});

searchInputEl.addEventListener('input', () => {
  searchQuery = searchInputEl.value;
  renderHabits();
});

sortSelectEl.addEventListener('change', () => {
  sortBy = sortSelectEl.value;
  renderHabits();
});

addHabitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = habitInput.value.trim();

  if (!text) {
    inputFeedback.classList.remove('hidden');
    return;
  }

  inputFeedback.classList.add('hidden');
  const selectedCategory = habitCategorySelect.value;
  const selectedTime = habitTimeSelect ? habitTimeSelect.value : 'Anytime';
  const targetVal = Math.max(1, Math.min(50, Number(habitTargetInput.value) || 1));

  const newHabit = normalizeHabit({
    id: nextId++,
    name: text,
    category: selectedCategory,
    timeOfDay: selectedTime,
    target: targetVal,
    count: 0,
    completed: false,
    note: '',
    history: [false, false, false, false, false, false],
    monthHistory: Array(27).fill(false)
  });

  habits.push(newHabit);
  timerHabitId = newHabit.id;

  if (activeCategory !== 'All' && activeCategory !== selectedCategory) {
    activeCategory = selectedCategory;
  }

  habitInput.value = '';
  habitTargetInput.value = '1';
  playCheckSound(true, false);
  saveToStorage();
  renderHabits();
});

habitInput.addEventListener('input', () => {
  if (habitInput.value.trim()) {
    inputFeedback.classList.add('hidden');
  }
});

themeToggleBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  applyTheme();
});

soundToggleBtn.addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  applySoundSetting();
  if (isSoundEnabled) {
    playCheckSound(true, false);
  }
});

exportJsonBtn.addEventListener('click', () => {
  const payload = JSON.stringify({ habits, nextId, dayOffset, freezeShields }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'habits-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  saveToStorage('✓ Exported JSON');
});

importJsonBtn.addEventListener('click', () => {
  importFileInput.click();
});

importFileInput.addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(String(e.target.result));
      if (Array.isArray(parsed.habits)) {
        habits = parsed.habits.map(normalizeHabit);
        nextId = parsed.nextId || (habits.reduce((max, h) => Math.max(max, h.id), 0) + 1);
        dayOffset = parsed.dayOffset || 0;
        if (typeof parsed.freezeShields === 'number') {
          freezeShields = parsed.freezeShields;
        }
        saveToStorage('✓ Imported JSON');
        renderHabits();
      }
    } catch (err) {
      saveToStorage('⚠ Invalid JSON');
    }
  };
  reader.readAsText(file);
  importFileInput.value = '';
});

advanceDayBtn.addEventListener('click', () => {
  dayOffset += 1;
  const allCompletedToday = habits.length > 0 && habits.every(h => h.completed);
  let shieldsUsed = 0;

  habits = habits.map((habit) => {
    let dayOutcome = habit.completed;
    const priorStreak = computeStreak(habit);

    if (!dayOutcome && priorStreak > 0 && freezeShields > 0) {
      dayOutcome = 'frozen';
      freezeShields -= 1;
      shieldsUsed += 1;
    }

    return {
      ...habit,
      history: [...habit.history.slice(1), dayOutcome],
      monthHistory: [...habit.monthHistory.slice(1), dayOutcome],
      count: 0,
      completed: false
    };
  });

  if (allCompletedToday && freezeShields < 3) {
    freezeShields += 1;
    saveToStorage('🎉 +1 🧊 Shield');
  } else if (shieldsUsed > 0) {
    saveToStorage(`🧊 Used ${shieldsUsed} Shield(s)`);
  } else {
    saveToStorage('✓ Next Day');
  }
  renderHabits();
});

resetDayBtn.addEventListener('click', () => {
  habits = habits.map(habit => ({ ...habit, count: 0, completed: false }));
  saveToStorage('✓ Unchecked today');
  renderHabits();
});

restoreDefaultsBtn.addEventListener('click', () => {
  habits = DEFAULT_HABITS.map(normalizeHabit);
  nextId = 4;
  dayOffset = 0;
  freezeShields = 2;
  activeCategory = 'All';
  searchQuery = '';
  sortBy = 'default';
  searchInputEl.value = '';
  sortSelectEl.value = 'default';
  saveToStorage('✓ Restored');
  renderHabits();
});

// Global Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') {
    if (event.key === 'Escape') {
      document.activeElement.blur();
    }
    return;
  }

  const key = event.key.toLowerCase();
  if (key === 'n') {
    event.preventDefault();
    switchView('habits');
    habitInput.focus();
  } else if (key === '/') {
    event.preventDefault();
    switchView('habits');
    searchInputEl.focus();
  } else if (key === 'd') {
    event.preventDefault();
    isDarkMode = !isDarkMode;
    applyTheme();
  } else if (key === 'm') {
    event.preventDefault();
    isSoundEnabled = !isSoundEnabled;
    applySoundSetting();
  } else if (key >= '1' && key <= '9' && activeView === 'habits') {
    const idx = Number(key) - 1;
    const visible = getVisibleHabits();
    if (visible[idx]) {
      event.preventDefault();
      incrementHabitStep(visible[idx].id);
    }
  }
});

// Initialize
loadFromStorage();
applyTheme();
applyAccentColor();
applySoundSetting();
switchView('habits');
renderHabits();


// 11. PWA SERVICE WORKER REGISTRATION & NATIVE INSTALL PROMPT
let deferredInstallPrompt = null;
const installAppBtn = document.getElementById('install-app-btn');
const installModalEl = document.getElementById('install-modal');
const installEnvStatusEl = document.getElementById('install-env-status');
const closeInstallModalBtn = document.getElementById('close-install-modal-btn');
const gotItInstallBtn = document.getElementById('got-it-install-btn');

// Register Service Worker when served over http://localhost or https://
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    const swFile = './' + 'sw.js';
    navigator.serviceWorker.register(swFile).catch(() => {});
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppBtn) {
    installAppBtn.textContent = '📲 Install App Ready!';
  }
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  saveToStorage('🎉 Installed as App!');
  if (installAppBtn) {
    installAppBtn.textContent = '✓ App Installed';
  }
});

function openInstallModal() {
  let envMsg = '';
  if (window.location.protocol === 'file:') {
    envMsg = '❌ Detected file:// URL — Open with VS Code Live Server (http://127.0.0.1:5500) to enable install!';
  } else if (window.self !== window.top) {
    envMsg = 'ℹ️ Running inside preview panel — Open in VS Code Live Server to install on your laptop!';
  } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    envMsg = '✅ Running on localhost! Look at the right side of your Chrome/Edge address bar for the Install icon.';
  } else {
    envMsg = 'ℹ️ Use Chrome or Edge on localhost / HTTPS to install as an app.';
  }
  installEnvStatusEl.textContent = envMsg;
  installModalEl.classList.remove('hidden');
}

function closeInstallModal() {
  installModalEl.classList.add('hidden');
}

installAppBtn.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredInstallPrompt = null;
    }
  } else {
    openInstallModal();
  }
});

closeInstallModalBtn.addEventListener('click', closeInstallModal);
gotItInstallBtn.addEventListener('click', closeInstallModal);


if (timeFiltersEl) {
  timeFiltersEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.time-tab');
    if (!btn) return;
    activeTimeSlot = btn.dataset.time;
    renderHabits();
  });
}

if (copyReportBtn) {
  copyReportBtn.addEventListener('click', () => {
    const reportText = buildWeeklyReportText();
    const onCopied = () => {
      copyReportBtn.textContent = '✓ Copied Report!';
      saveToStorage('✓ Copied Weekly Report');
      setTimeout(() => {
        copyReportBtn.textContent = '📋 Copy Weekly Report';
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reportText).then(onCopied).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = reportText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        onCopied();
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = reportText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied();
    }
  });
}

if (testConfettiBtn) {
  testConfettiBtn.addEventListener('click', () => {
    playCheckSound(true, true);
    launchConfetti();
  });
}
