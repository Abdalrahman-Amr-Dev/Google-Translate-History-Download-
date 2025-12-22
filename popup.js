document.getElementById("scroll").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startAutoScroll
  });
});

document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopAutoScroll
  });
});

document.getElementById("export").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAndDownload
  });
});

// ----------- Functions injected into page ------------

function startAutoScroll() {
  if (window.scrollInterval) {
    console.log("Already scrolling...");
    return;
  }

  // Find the main scrollable container
  const container = document.querySelector('.D2iQR[jsname="KMxync"]') || 
                    document.querySelector('.D2iQR') ||
                    document.querySelector('[role="list"]')?.parentElement;

  if (!container) {
    console.error("❌ Scrollable container not found");
    alert("Could not find the history container. Make sure you're on the Google Translate history page.");
    return;
  }

  console.log("✓ Found container:", container.className);
  console.log("📜 Starting auto-scroll...");

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
      lastItem.scrollIntoView({ behavior: 'auto', block: 'end' });
    }

    const currentItemCount = items.length;
    
    // Log progress every 3 attempts
    if (totalAttempts % 3 === 0) {
      console.log(`📊 Loaded: ${currentItemCount} translations`);
    }

    // Check if new items loaded
    if (currentItemCount === lastItemCount) {
      stableCount++;
    } else {
      stableCount = 0;
      lastItemCount = currentItemCount;
    }

    // Stop when stable
    if (stableCount >= MAX_STABLE) {
      clearInterval(window.scrollInterval);
      window.scrollInterval = null;
      console.log(`✅ Finished! Total translations loaded: ${currentItemCount}`);
      alert(`Scrolling complete! Found ${currentItemCount} translations. Click "Export History" to download.`);
    }

    // Safety limit
    if (totalAttempts >= 300) {
      clearInterval(window.scrollInterval);
      window.scrollInterval = null;
      console.log(`⚠️ Reached maximum attempts. Loaded ${currentItemCount} translations.`);
      alert(`Stopped after 300 attempts. Found ${currentItemCount} translations.`);
    }
  }, 1500);

  console.log("✓ Auto-scroll started. Check console for progress...");
}

function stopAutoScroll() {
  if (window.scrollInterval) {
    clearInterval(window.scrollInterval);
    window.scrollInterval = null;
    const itemCount = document.querySelectorAll(".vvNkBd").length;
    console.log(`⏸️ Scrolling stopped by user. Current count: ${itemCount} translations`);
    alert(`Stopped. Currently loaded: ${itemCount} translations`);
  } else {
    console.log("No scrolling in progress");
    alert("No scrolling in progress");
  }
}

function extractAndDownload() {
  const data = [];
  const cards = document.querySelectorAll(".vvNkBd");
  
  console.log(`📦 Extracting ${cards.length} translations...`);

  cards.forEach((card, index) => {
    const source = card.querySelector(".EYBmYc")?.innerText.trim();
    const target = card.querySelector(".uqiNJb")?.innerText.trim();
    
    // Get language direction
    const langInfo = card.querySelector('.v2OCrb');
    const sourceLang = langInfo?.getAttribute('data-sl') || 'unknown';
    const targetLang = langInfo?.getAttribute('data-tl') || 'unknown';
    
    if (source && target) {
      data.push({
        id: index + 1,
        source: source,
        target: target,
        sourceLang: sourceLang,
        targetLang: targetLang
      });
    }
  });

  if (data.length === 0) {
    alert("No translations found to export!");
    return;
  }

  // Create JSON file
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  link.download = `google_translate_history_${timestamp}.json`;
  
  link.click();

  console.log(`✅ Exported ${data.length} translations`);
  alert(`Successfully exported ${data.length} translations!`);
}