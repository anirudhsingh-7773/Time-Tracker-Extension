// content_script.js

function notifyBackground() {
  const isTarget = location.hash && location.hash.includes('/me/attendance/logs');
  chrome.runtime.sendMessage({ targetPage: isTarget });
}

// initial check
notifyBackground();

// hash changes
window.addEventListener('hashchange', notifyBackground);

// catch history API navigations (pushState/replaceState)
(function() {
  const originalPush = history.pushState;
  history.pushState = function() {
    originalPush.apply(this, arguments);
    notifyBackground();
  };
  const originalReplace = history.replaceState;
  history.replaceState = function() {
    originalReplace.apply(this, arguments);
    notifyBackground();
  };
})();

// (Your notifyBackground function can stay here if you have it)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStartTime") {
    // We will replace this selector in the next step
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

    return true;
  }
});
