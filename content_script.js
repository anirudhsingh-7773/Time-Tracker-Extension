// content_script.js
setTimeout(() => {
  clickAttendanceLogs();
}, 2000);

function clickAttendanceLogs() {
  let attempts = 0;
  const maxAttempts = 5;

  const interval = setInterval(() => {
    attempts++;
    const attendanceLogsButton = document.querySelector('employee-attendance-list-view .dropdown > div');
    
    if (attendanceLogsButton) {
      attendanceLogsButton.click();
      attendanceLogsButton.click();
      clearInterval(interval);
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 500);
}

// This message listener should be active immediately to receive requests from the popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStartTime") {
    const selector =
      "employee-attendance-list-view .card-body > .ng-star-inserted span.ki-green.ki-arrow-forward + span";
    let attempts = 0;

    const findTimeElement = setInterval(() => {
      const timeElement = document.querySelector(selector);
      attempts++;

      if (timeElement && timeElement.innerText) {
        clearInterval(findTimeElement);
        sendResponse({ startTime: timeElement.innerText });
      } else if (attempts >= 10) {
        clearInterval(findTimeElement);
        sendResponse({ startTime: null });
      }
    }, 500);

    return true;
  }
});
