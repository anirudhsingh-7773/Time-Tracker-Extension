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
