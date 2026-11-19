const toggle = document.getElementById("enabled");
const status = document.getElementById("status");

function showStatus(enabled) {
  status.textContent = enabled
    ? "ON — supported network errors open chess in this tab."
    : "OFF — Chrome handles failed pages normally.";
}

chrome.storage.local.get({ enabled: false }, ({ enabled }) => {
  toggle.checked = enabled;
  showStatus(enabled);
});

toggle.addEventListener("change", async () => {
  await chrome.storage.local.set({ enabled: toggle.checked });
  showStatus(toggle.checked);
});

document.getElementById("play").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("game/index.html") });
});
