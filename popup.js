document.getElementById("scroll").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startAutoScroll,
  });
});

document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopAutoScroll,
  });
});

document.getElementById("export").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAndDownload,
  });
});

document.getElementById("exportHTML").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAndDownloadHTML,
  });
});

// ----------- Functions injected into page ------------

function startAutoScroll() {
  if (window.scrollInterval) {
    console.log("Already scrolling...");
    return;
  }

  // Find the main scrollable container
  const container =
    document.querySelector('.D2iQR[jsname="KMxync"]') ||
    document.querySelector(".D2iQR") ||
    document.querySelector('[role="list"]')?.parentElement;

  if (!container) {
    console.error("Scrollable container not found");
    alert(
      "Could not find the history container. Make sure you're on the Google Translate history page."
    );
    return;
  }

  console.log("Found container:", container.className);
  console.log("Starting auto-scroll...");

  let lastItemCount = 0;
  let stableCount = 0;
  const MAX_STABLE = 5;
  let totalAttempts = 0;

  window.scrollInterval = setInterval(() => {
    totalAttempts++;

    // Scroll the container to bottom
    container.scrollTop = container.scrollHeight;

    // Also scroll the window
    window.scrollTo(0, document.body.scrollHeight);

    // Get the last visible item and scroll it into view to trigger loading
    const items = document.querySelectorAll(".vvNkBd");
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      lastItem.scrollIntoView({ behavior: "auto", block: "end" });
    }

    const currentItemCount = items.length;

    // Log progress every 3 attempts
    if (totalAttempts % 3 === 0) {
      console.log(`Loaded: ${currentItemCount} translations`);
    }

    // Check if new items loaded
    if (currentItemCount === lastItemCount) {
      stableCount++;
    } else {
      stableCount = 0;
      lastItemCount = currentItemCount;
    }

    // Stop when stable
    // if (stableCount >= MAX_STABLE) {
    //   clearInterval(window.scrollInterval);
    //   window.scrollInterval = null;
    //   console.log(`✅ Finished! Total translations loaded: ${currentItemCount}`);
    //   alert(`Scrolling complete! Found ${currentItemCount} translations. Click "Export History" to download.`);
    // }
  }, 1500);

  console.log("Auto-scroll started. Check console for progress...");
}

function stopAutoScroll() {
  if (window.scrollInterval) {
    clearInterval(window.scrollInterval);
    window.scrollInterval = null;
    const itemCount = document.querySelectorAll(".vvNkBd").length;
    console.log(
      `Scrolling stopped by user. Current count: ${itemCount} translations`
    );
    alert(`Stopped. Currently loaded: ${itemCount} translations`);
  } else {
    console.log("No scrolling in progress");
    alert("No scrolling in progress");
  }
}

function extractAndDownload() {
  const data = [];
  const cards = document.querySelectorAll(".vvNkBd");

  console.log(`Extracting ${cards.length} translations...`);

  cards.forEach((card, index) => {
    const source = card.querySelector(".EYBmYc")?.innerText.trim();
    const target = card.querySelector(".uqiNJb")?.innerText.trim();

    // Get language direction
    const langInfo = card.querySelector(".v2OCrb");
    const sourceLang = langInfo?.getAttribute("data-sl") || "unknown";
    const targetLang = langInfo?.getAttribute("data-tl") || "unknown";

    if (source && target) {
      data.push({
        id: index + 1,
        source: source,
        target: target,
        sourceLang: sourceLang,
        targetLang: targetLang,
      });
    }
  });

  if (data.length === 0) {
    alert("No translations found to export!");
    return;
  }

  // Create JSON file
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  link.download = `google_translate_history_${timestamp}.json`;

  link.click();

  console.log(`Exported ${data.length} translations`);
  alert(`Successfully exported ${data.length} translations!`);
}

function extractAndDownloadHTML() {
  const data = [];
  const cards = document.querySelectorAll(".vvNkBd");

  console.log(`Extracting ${cards.length} translations for HTML...`);

  cards.forEach((card, index) => {
    const source = card.querySelector(".EYBmYc")?.innerText.trim();
    const target = card.querySelector(".uqiNJb")?.innerText.trim();

    const langInfo = card.querySelector(".v2OCrb");
    const sourceLang = langInfo?.getAttribute("data-sl") || "unknown";
    const targetLang = langInfo?.getAttribute("data-tl") || "unknown";

    if (source && target) {
      data.push({
        id: index + 1,
        source: source,
        target: target,
        sourceLang: sourceLang,
        targetLang: targetLang,
      });
    }
  });

  if (data.length === 0) {
    alert("No translations found to export!");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Translate History - ${timestamp}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background: #f5f7fa;
      padding: 20px;
      color: #1f2937;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      margin-bottom: 10px;
      color: #4f46e5;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    .card-number {
      background: #4f46e5;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }
    .card-content {
      flex: 1;
    }
    .source {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #1f2937;
    }
    .target {
      font-size: 15px;
      color: #059669;
    }
    .lang-info {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #9ca3af;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Google Translate History</h1>
    <div class="subtitle">Exported on ${timestamp} - ${
    data.length
  } translations</div>
    ${data
      .map(
        (item) => `
    <div class="card">
      <div class="card-number">${item.id}</div>
      <div class="card-content">
        <div class="source">${escapeHtml(item.source)}</div>
        <div class="target">${escapeHtml(item.target)}</div>
        <div class="lang-info">${item.sourceLang} → ${item.targetLang}</div>
      </div>
    </div>`
      )
      .join("")}
    <div class="footer">Generated by Google Translate History Exporter</div>
  </div>
</body>
</html>`;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `google_translate_history_${timestamp}.html`;
  link.click();

  console.log(`Exported ${data.length} translations as HTML`);
  alert(`Successfully exported ${data.length} translations as HTML!`);
}
