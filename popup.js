const NINE_HOURS_IN_SECONDS = 9 * 3600;

// DOM Elements
const progressCircle = document.getElementById("progressCircle");
const percentageValue = document.getElementById("percentage-value");
const timePassedEl = document.getElementById("timePassed");
const timeRemainingEl = document.getElementById("timeRemaining");

let timerInterval = null;
let startTime = null;

// --- Core Timer Logic ---
function updateTimer() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - startTime) / 1000);

  // Calculations
  const isCompleted = diffInSeconds >= NINE_HOURS_IN_SECONDS;
  const elapsedSeconds = isCompleted ? NINE_HOURS_IN_SECONDS : diffInSeconds;
  const remainingSeconds = NINE_HOURS_IN_SECONDS - elapsedSeconds;
  const percentage = (elapsedSeconds / NINE_HOURS_IN_SECONDS) * 100;

  // Update UI
  timePassedEl.textContent = formatTime(elapsedSeconds);
  timeRemainingEl.textContent = formatTime(remainingSeconds);
  percentageValue.textContent = isCompleted ? "Done!" : `${Math.floor(percentage)}%`;

  // Update the CSS variable for progress circle
  const angle = Math.min(percentage, 100) * 3.6;
  progressCircle.style.setProperty("--progress-angle", `${angle}deg`);

  if (isCompleted) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

// --- Initialize ---
function initTimer() {
  const now = new Date();
  // Default start time = today at 9:00 AM
  startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9, 0, 0
  );

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

// Run when popup loads
document.addEventListener("DOMContentLoaded", initTimer);
