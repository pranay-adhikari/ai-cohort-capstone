let startTime = null;
let elapsed = 0;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const appDate = document.getElementById('appDate');
const sessionMeta = document.getElementById('sessionMeta');
const subjectSelect = document.getElementById('subjectSelect');
const newSubjectInput = document.getElementById('newSubjectInput');
const sessionNotes = document.getElementById('sessionNotes');
const moodPanel = document.getElementById('moodPanel');
const moodBtns = document.querySelectorAll('.mood-btn');

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem('flow_sessions') || '[]');
  } catch {
    return [];
  }
}

function saveSession(session) {
  const sessions = loadSessions();
  sessions.push(session);
  localStorage.setItem('flow_sessions', JSON.stringify(sessions));
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.querySelector('.app').appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

let selectedMood = null;

moodBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    moodBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = parseInt(btn.dataset.mood);

    const { subject, notes } = getSessionMeta();
    const session = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duration: elapsed,
      subject: subject || 'Uncategorized',
      notes,
      mood: selectedMood,
    };
    saveSession(session);
    showToast('session saved');
    renderLog();
    renderGoalBar();
    setTimeout(() => resetTimer(), 800);
  });
});

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

function tick() {
  const now = Date.now();
  const total = elapsed + (now - startTime);
  timerDisplay.textContent = formatTime(total);
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(tick, 500);
  isRunning = true;
  timerDisplay.classList.add('running');
  timerStatus.textContent = 'running';
  timerStatus.classList.add('running');
  startStopBtn.textContent = 'Stop';
  startStopBtn.classList.add('active');
  sessionMeta.classList.add('visible');
}

function stopTimer() {
  elapsed += Date.now() - startTime;
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  timerDisplay.classList.remove('running');
  timerStatus.textContent = 'paused';
  timerStatus.classList.remove('running');
  startStopBtn.textContent = 'Start';
  startStopBtn.classList.remove('active');
  moodPanel.classList.add('visible');
}

function resetTimer() {
  if (isRunning) stopTimer();
  elapsed = 0;
  startTime = null;
  timerDisplay.textContent = '00:00:00';
  timerStatus.textContent = 'ready';
  sessionMeta.classList.remove('visible');
  moodPanel.classList.remove('visible');
  subjectSelect.value = '';
  newSubjectInput.style.display = 'none';
  sessionNotes.value = '';
  selectedMood = null;
  moodBtns.forEach(b => b.classList.remove('selected'));
}

function getSessionMeta() {
  const subject = subjectSelect.value === '__new__'
    ? newSubjectInput.value.trim()
    : subjectSelect.value;
  const notes = sessionNotes.value.trim();
  return { subject, notes };
}

subjectSelect.addEventListener('change', () => {
  if (subjectSelect.value === '__new__') {
    newSubjectInput.style.display = 'block';
    newSubjectInput.focus();
  } else {
    newSubjectInput.style.display = 'none';
  }
});

startStopBtn.addEventListener('click', () => {
  if (isRunning) stopTimer();
  else startTimer();
});

resetBtn.addEventListener('click', resetTimer);

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderLog() {
  const sessions = loadSessions().slice().reverse();
  const logList = document.getElementById('logList');
  const logCount = document.getElementById('logCount');

  logCount.textContent = sessions.length ? `${sessions.length} total` : '';

  if (sessions.length === 0) {
    logList.innerHTML = '<p class="log-empty">no sessions yet</p>';
    return;
  }

  logList.innerHTML = sessions.map(s => `
    <div class="log-item">
      <span class="log-item-subject">${s.subject}</span>
      <span class="log-item-duration">${formatDuration(s.duration)}</span>
      ${s.notes ? `<span class="log-item-notes">${s.notes}</span>` : '<span></span>'}
      <span class="log-item-meta">
        <span class="log-item-time">${formatTimestamp(s.timestamp)}</span>
        <span class="log-item-mood">${s.mood}/5</span>
      </span>
    </div>
  `).join('');
}

const GOAL_MS = 2 * 60 * 60 * 1000;

function getTodayMs() {
  const today = new Date().toDateString();
  return loadSessions()
    .filter(s => new Date(s.timestamp).toDateString() === today)
    .reduce((sum, s) => sum + s.duration, 0);
}

function renderGoalBar() {
  const spent = getTodayMs();
  const pct = Math.min(100, Math.round((spent / GOAL_MS) * 100));
  const fill = document.getElementById('goalBarFill');
  const spentLabel = document.getElementById('goalSpent');
  const targetLabel = document.getElementById('goalTarget');

  fill.style.width = pct + '%';
  fill.classList.toggle('complete', pct >= 100);
  spentLabel.textContent = formatDuration(spent) + ' today';
  targetLabel.textContent = pct >= 100 ? 'goal reached' : 'goal: 2h';
}

appDate.textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric'
});

renderLog();
renderGoalBar();