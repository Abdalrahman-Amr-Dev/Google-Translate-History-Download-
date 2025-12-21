let scrollInterval; // store interval globally

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
    console.log("Already scrolling");
    return;
  }

  let lastHeight = 0;
  let stableCount = 0;
  const MAX_STABLE = 4;

  window.scrollInterval = setInterval(() => {
    window.scrollTo(0, document.body.scrollHeight);

    const currentHeight = document.body.scrollHeight;
    if (currentHeight === lastHeight) stableCount++;
    else {
      stableCount = 0;
      lastHeight = currentHeight;
    }

    if (stableCount >= MAX_STABLE) {
      clearInterval(window.scrollInterval);
      window.scrollInterval = null;
      console.log("Scrolling finished (no more history)");
    }
  }, 1500);

  console.log("Auto-scroll started");
}

function stopAutoScroll() {
  if (window.scrollInterval) {
    clearInterval(window.scrollInterval);
    window.scrollInterval = null;
    console.log("Scrolling stopped by user");
  } else {
    console.log("No scrolling in progress");
  }
}

function extractAndDownload() {
  const data = {};
  document.querySelectorAll(".vvNkBd").forEach(card => {
    const source = card.querySelector(".EYBmYc")?.innerText.trim();
    const target = card.querySelector(".uqiNJb")?.innerText.trim();
    if (source && target) data[source] = target;
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "translate_history.json";
  link.click();

  console.log("Saved entries:", Object.keys(data).length);
}
