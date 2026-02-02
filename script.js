document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle-games");

  toggles.forEach(button => {
    const container = document.querySelector(button.dataset.target);
    if (!container) return;

    const items = Array.from(container.children);

    const stagger = 70;
    const itemDuration = 300;
    const containerDuration = 400;

    let isAnimating = false;

    container.style.display = "grid";
    container.style.overflow = "hidden";
    container.style.maxHeight = "0px";

    items.forEach(item => {
      item.style.opacity = "0";
      item.style.transform = "translateY(12px)";
    });

    button.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;

      const opening = container.style.maxHeight === "0px";
      const totalItemTime = items.length * stagger + itemDuration;

      if (opening) {
        container.style.maxHeight = container.scrollHeight + "px";
        button.textContent = button.dataset.hide

        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * stagger}ms`;
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        });

        setTimeout(() => {
          container.style.maxHeight = "none";
          isAnimating = false;
        }, Math.max(totalItemTime, containerDuration));

      } else {
        [...items].reverse().forEach((item, i) => {
          item.style.transitionDelay = `${i * stagger}ms`;
          item.style.opacity = "0";
          item.style.transform = "translateY(12px)";
        });

        setTimeout(() => {
          container.style.maxHeight = container.scrollHeight + "px";
          requestAnimationFrame(() => {
            container.style.maxHeight = "0px";
          });
        }, totalItemTime);

        setTimeout(() => {
          isAnimating = false;
        }, totalItemTime + containerDuration);

        button.textContent = button.dataset.show;
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Function to build jsDelivr link
  const buildLink = (filename) => `https://cdn.jsdelivr.net/gh/marlwolf606-dev/GHMain/${filename}.html`;

  // PLAY BUTTONS
  const playButtons = document.querySelectorAll(".playButton");

  playButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const gameName = button.dataset.game; // e.g. "game1"
      if (!gameName) return;

      const jsdelivrLink = buildLink(gameName);

      try {
        const response = await fetch(jsdelivrLink);
        if (!response.ok) throw new Error("File not found on jsDelivr");

        const code = await response.text();

        const newTab = window.open("about:blank", "_blank");
        newTab.document.open();
        newTab.document.write(`
          <title>${gameName}.html</title>
          ${code}
        `);
        newTab.document.close();

      } catch (err) {
        console.error("Error loading game file:", err);
      }
    });
  });

  const downloadButtons = document.querySelectorAll(".downloadButton");

  downloadButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const gameName = button.dataset.game;
      if (!gameName) return;

      const jsdelivrLink = buildLink(gameName);

      try {
        const response = await fetch(jsdelivrLink);
        if (!response.ok) throw new Error("File not found on jsDelivr");

        const blob = await response.blob();
        
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${gameName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

      } catch (err) {
        console.error("Error downloading game file:", err);
      }
    });
  });
});