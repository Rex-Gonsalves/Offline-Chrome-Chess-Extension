const OFFLINE_ERRORS = new Set([
  "net::ERR_INTERNET_DISCONNECTED",
  "net::ERR_NAME_NOT_RESOLVED",
  "net::ERR_NETWORK_CHANGED",
  "net::ERR_CONNECTION_TIMED_OUT",
  "net::ERR_CONNECTION_REFUSED",
  "net::ERR_ADDRESS_UNREACHABLE",
  "net::ERR_NETWORK_ACCESS_DENIED"
]);

const redirectingTabs = new Set();

chrome.webNavigation.onErrorOccurred.addListener(async (details) => {
  // Only react to the main page, and only ordinary websites.
  if (details.frameId !== 0) return;
  if (!/^https?:\/\//i.test(details.url)) return;
  if (!OFFLINE_ERRORS.has(details.error)) return;
  if (redirectingTabs.has(details.tabId)) return;

  try {
    const { enabled = false } = await chrome.storage.local.get({ enabled: false });
    if (!enabled) return;

    redirectingTabs.add(details.tabId);
    await chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("game/index.html")
    });
  } catch (error) {
    console.warn("Offline Pixel Chess could not open:", error);
  } finally {
    // Keep the guard briefly so duplicate error events don't cause repeated redirects.
    setTimeout(() => redirectingTabs.delete(details.tabId), 3000);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => redirectingTabs.delete(tabId));
