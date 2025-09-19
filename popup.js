const NINE_HOURS_IN_SECONDS = 9 * 3600;

// DOM Elements
const progressCircle = document.getElementById("progressCircle");
const percentageValue = document.getElementById("percentage-value");
const timePassedEl = document.getElementById("timePassed");
const timeRemainingEl = document.getElementById("timeRemaining");
const statusMessageEl = document.getElementById("statusMessage");

let timerInterval = null;

// --- Helper Function to Parse Time ---
function parseKekaTime(timeString) {
  // timeString is expected to be in "H:MM:SS AM/PM" format, e.g., "9:09:16 AM"
  const now = new Date();
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes, seconds] = time.split(':');

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  seconds = parseInt(seconds, 10);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) { // Handle midnight case
    hours = 0;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
}


// --- Core Timer Logic ---
function updateTimer(startTime) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - startTime) / 1000);

  // Calculations
  const isCompleted = diffInSeconds >= NINE_HOURS_IN_SECONDS;
  const elapsedSeconds = isCompleted ? NINE_HOURS_IN_SECONDS : Math.max(0, diffInSeconds);
  const remainingSeconds = NINE_HOURS_IN_SECONDS - elapsedSeconds;
  const percentage = (elapsedSeconds / NINE_HOURS_IN_SECONDS) * 100;

  // Update UI
  timePassedEl.innerHTML = formatTime(elapsedSeconds);
  timeRemainingEl.innerHTML = formatTime(remainingSeconds);
  percentageValue.textContent = isCompleted ? "Done!" : `${Math.floor(percentage)}%`;

  const angle = Math.min(percentage, 100) * 3.6;
  progressCircle.style.setProperty("--progress-angle", `${angle}deg`);

  if (isCompleted) {
    clearInterval(timerInterval);
  }
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

// --- Initialize ---
function init() {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;

    if (statusMessageEl) statusMessageEl.textContent = "Fetching start time from Keka...";

    // Send a message to the content script in that tab
    chrome.tabs.sendMessage(activeTabId, { action: "getStartTime" }, (response) => {
      // Check if we got a response and it has a startTime
      if (response && response.startTime) {
        if (statusMessageEl) statusMessageEl.textContent = `Start time found: ${response.startTime}`;
        console.log("Received start time from content script:", response.startTime);
        const startTime = parseKekaTime(response.startTime);
        
        // Start the timer with the fetched time
        updateTimer(startTime); // Initial call to display immediately
        timerInterval = setInterval(() => updateTimer(startTime), 1000);

      } else {
        // Handle the case where the time element wasn't found
        if (statusMessageEl) statusMessageEl.textContent = "Could not find clock-in time on the page.";
        timeRemainingEl.innerHTML = "Not found";
        console.error("Error fetching start time or element not found on page.");
      }
    });
  });
}

// Run when popup loads
document.addEventListener("DOMContentLoaded", init);
