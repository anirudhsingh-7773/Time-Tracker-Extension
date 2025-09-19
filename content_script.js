// content_script.js
clickAttendanceLogs();

/**
 * Finds and clicks the attendance log dropdown.
 * It retries every half-second because the button might be loaded by JavaScript after the DOM is ready.
 */
function clickAttendanceLogs() {
  const interval = setInterval(() => {
    const attendanceLogsButton = document.querySelector('employee-attendance-list-view .dropdown > div');
    
    if (attendanceLogsButton) {
      attendanceLogsButton.click();
      attendanceLogsButton.click();
      console.log("✅ Attendance dropdown found and clicked.");
      clearInterval(interval); // Stop searching once it's clicked.
    } 
    else {  
      console.log("🔍 Attendance dropdown not found yet, retrying...");
    }
  }, 500); // Check every 500 milliseconds.
}

// This message listener should be active immediately to receive requests from the popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStartTime") {
    const selector = 'employee-attendance-list-view .card-body > .ng-star-inserted span.ki-green.ki-arrow-forward + span';
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

    return true; // Required for asynchronous sendResponse.
  }
});
