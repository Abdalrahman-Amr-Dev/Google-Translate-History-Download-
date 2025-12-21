document.getElementById("scroll").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

document.getElementById("export").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAndDownload
  });
});

function extractAndDownload() {
  const data = {};

  document.querySelectorAll(".vvNkBd").forEach(card => {
    const source = card.querySelector(".EYBmYc")?.innerText.trim();
    const target = card.querySelector(".uqiNJb")?.innerText.trim();

    if (source && target) {
      data[source] = target;
    }
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "translate_history.json";
  link.click();

  console.log("Saved entries:", Object.keys(data).length);
}
