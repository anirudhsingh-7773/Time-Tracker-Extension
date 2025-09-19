// Disable the action button by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
});

// Enable only on the target page
function checkUrlAndToggle(tabId, url) {
  if (url && url.startsWith("https://innoraft.keka.com/") &&
      url.includes("#/me/attendance/logs")) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
}

// When a tab is updated (like navigation inside Keka)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    checkUrlAndToggle(tabId, tab.url);
  }
});

// When the active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    checkUrlAndToggle(activeInfo.tabId, tab.url);
  });
});
