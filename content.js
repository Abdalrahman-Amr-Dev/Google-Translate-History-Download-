let lastHeight = 0;

const interval = setInterval(() => {
  window.scrollTo(0, document.body.scrollHeight);

  if (document.body.scrollHeight === lastHeight) {
    clearInterval(interval);
    console.log("Auto-scroll finished");
  }

  lastHeight = document.body.scrollHeight;
}, 1500);
