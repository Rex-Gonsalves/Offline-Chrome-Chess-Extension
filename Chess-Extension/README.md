# Offline Pixel Chess

A Manifest V3 Chrome extension that can open the included chess game when a normal
website navigation fails with a recognised network/offline error.

## Important limitation

Chrome extensions cannot replace or edit Chrome's protected built-in Dino/error
page itself. This extension uses Chrome's `webNavigation.onErrorOccurred` event
to detect selected network errors and then navigates the same tab to the local
chess game. The exact timing/behaviour can vary across Chrome versions and should
be tested on the target version.

The switch is OFF by default. Click the extension icon and turn on **Enable
offline chess** to activate it. The **Play chess now** button opens the game
manually at any time.

## Install from this GitHub repository

1. Download the repository ZIP and extract it.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted `Offline-Pixel-Chess-Extension` folder (the folder that
   contains `manifest.json`).
6. Pin the extension if desired. Open its popup to use the switch.

This is a developer-mode installation, not a one-click Chrome Web Store install.
Do not enable Developer mode or install extensions from sources you do not trust.

## Files

- `manifest.json` — extension configuration.
- `background.js` — watches for supported main-frame network errors.
- `popup.html` / `popup.js` — ON/OFF switch and manual Play button.
- `game/index.html` — the supplied chess game.
- `game/engine.js` — chess engine worker extracted from the original HTML so it
  can run as a packaged worker under Manifest V3.

No remote server or internet connection is needed to play the packaged game.
