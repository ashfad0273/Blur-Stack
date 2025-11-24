 // Inject CSS automatically
  (function injectBlurStackCSS() {
    const css = `
    [data-blur-stack] {
      position: relative;
      overflow: hidden;
    }
    [data-blur-stack] > * {
      position: relative;
    }
    .blur-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      mask-image: none;
      -webkit-mask-image: none;
    }`;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  })();

  // 🔹 Parse attribute data
  function parseBlurData(str) {
    const obj = {};
    const parts = str.split("_");
    for (const part of parts) {
      if (part.startsWith("step-")) obj.steps = parseInt(part.split("-")[1]);
      else if (part.startsWith("min-")) obj.min = parseFloat(part.split("-")[1]);
      else if (part.startsWith("max-")) obj.max = parseFloat(part.split("-")[1]);
      else if (
        part === "leftToRight" ||
        part === "rightToLeft" ||
        part === "topToBottom" ||
        part === "bottomToTop"
      ) {
        obj.direction = part;
      } else if (part === "soft" || part === "full") {
        obj.mode = part;
      }
    }
    return obj;
  }

  // Generate blur layers
  function applyBlurStack(el) {
    const cfg = parseBlurData(el.dataset.blurStack || "");
    const steps = cfg.steps || 8;
    const minBlur = cfg.min ?? 2;
    const maxBlur = cfg.max ?? 16;
    const direction = cfg.direction || "topToBottom";
    const mode = cfg.mode || "soft";
    const overlap = 100 / (steps * 1.5);

    el.querySelectorAll(".blur-layer").forEach((l) => l.remove());

    // Create blur layers
    for (let i = 0; i < steps; i++) {
      const blur = minBlur + (maxBlur - minBlur) * (i / (steps - 1));
      const start = i * overlap;
      const mid1 = start + overlap;
      const mid2 = start + overlap * 2;
      const end = start + overlap * 3;

      const layer = document.createElement("div");
      layer.className = "blur-layer";
      layer.style.zIndex = i + 1;
      layer.style.backdropFilter = `blur(${blur}px)`;
      layer.style.webkitBackdropFilter = `blur(${blur}px)`;

      // direction
      const dir =
        direction === "leftToRight"
          ? "to right"
          : direction === "rightToLeft"
          ? "to left"
          : direction === "bottomToTop"
          ? "to top"
          : "to bottom";

      // mask (with fixed last edge)
      let mask;
      if (mode === "full") {
        mask = `linear-gradient(${dir}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)`;
      } else {
        if (i === steps - 1) {
          mask = `linear-gradient(${dir},
            rgba(0,0,0,0) ${start}%,
            rgba(0,0,0,1) ${mid1}%,
            rgba(0,0,0,1) 100%)`;
        } else {
          mask = `linear-gradient(${dir},
            rgba(0,0,0,0) ${start}%,
            rgba(0,0,0,1) ${mid1}%,
            rgba(0,0,0,1) ${mid2}%,
            rgba(0,0,0,0) ${end}%)`;
        }
      }

      layer.style.maskImage = mask;
      layer.style.webkitMaskImage = mask;

      el.appendChild(layer);
    }

    // Raise content above all blur layers
    const contentZ = steps + 5;
    el.querySelectorAll(":scope > *:not(.blur-layer)").forEach((child) => {
      child.style.zIndex = contentZ;
      child.style.position = "relative";
    });
  }
// Auto-detect newly added blur-stack elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    m.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.hasAttribute("data-blur-stack")) {
          applyBlurStack(node);
        }
        node.querySelectorAll?.("[data-blur-stack]").forEach(applyBlurStack);
      }
    });
  });
});

// Start watching the document
observer.observe(document.body, { childList: true, subtree: true });

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-blur-stack]").forEach(applyBlurStack);
  });
