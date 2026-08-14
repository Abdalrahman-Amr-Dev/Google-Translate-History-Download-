<div align="center">

# Google Translate History Exporter

**Download all of your Google Translate history with one click.**

[![Manifest Version](https://img.shields.io/badge/Manifest-V3-4f46e5?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%2F%20Edge%20%2F%20Brave-f59e0b?style=for-the-badge)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-6366f1?style=for-the-badge)]()

</div>

---

## Why?

Google Translate doesn't let you export your translation history. Every word you've ever translated is stuck inside the app — until now.

This browser extension **auto-scrolls** your entire history (so every translation loads), then exports it to **JSON** or a beautiful, searchable **HTML** file you can keep forever.

## Features

| | Feature | Details |
|---|---|---|
| Auto-scroll | Loads your **entire** history automatically | Smarter than your scroll wheel |
| Export to JSON | Structured, machine-readable output | `id`, `source`, `target`, `sourceLang`, `targetLang` |
| Export to HTML | Beautiful, readable archive | Color-coded cards, ready to open in any browser |
| Language metadata | Keeps `data-sl` / `data-tl` per entry | Know which direction each translation went |
| Stop anytime | Manual control over the crawl | See exactly how many translations loaded so far |

## How it works

```
Google Translate (history page)
        │
        ▼
  1. Auto-scroll ──► loads every translation card
        │
        ▼
  2. Extract ──► parses source / target / language pairs from the DOM
        │
        ▼
  3. Export ──► downloads a JSON or HTML file to your computer
```

The extension runs **locally in your browser** — no servers, no accounts, no data leaves your machine.

## Installation

1. Download or clone this repository:
   ```bash
   git clone https://github.com/Abdalrahman-Amr-Dev/google-translate-history-exporter.git
   ```
2. Open Chrome (or Edge / Brave) and go to the extensions page:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the project folder.
5. Pin the extension for quick access.

## Usage

1. Open your [Google Translate history](https://translate.google.com/history) page and sign in.
2. Click the extension icon in your toolbar.
3. Click **Auto-scroll history** and let it crawl through all your translations.
   - Watch the popup / console for progress.
   - Click **Stop Scrolling** anytime to pause.
4. When it's done, choose your export:
   - **Export JSON** — for scripts, apps, or data analysis.
   - **Export HTML** — for a pretty, human-readable archive.

Your file downloads automatically with a date-stamped name, e.g. `google_translate_history_2026-08-14.json`.

## Export format

### JSON

```json
[
  {
    "id": 1,
    "source": "Good morning",
    "target": "صباح الخير",
    "sourceLang": "en",
    "targetLang": "ar"
  }
]
```

### HTML

A standalone, styled document with a numbered card for every translation, including the language direction for each entry.

## Project structure

```
├── manifest.json   # Chrome extension manifest (MV3)
├── popup.html      # Extension popup UI
├── popup.js        # Popup logic + DOM scraping & export functions
└── content.js      # Legacy auto-scroll script
```

## Troubleshooting

| Problem | Fix |
|---|---|
| "Could not find the history container" | Make sure you're on the Google Translate history page and signed in |
| No translations exported | Ensure auto-scroll finished loading before exporting |
| Nothing happens on export | Try scrolling a bit first so the DOM contains translation cards |

## Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/Abdalrahman-Amr-Dev/google-translate-history-exporter/issues) or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with** by [Abdalrahman Amr](https://github.com/Abdalrahman-Amr-Dev)

</div>
