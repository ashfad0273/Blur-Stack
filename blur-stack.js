// ================================
//  Inject CSS
// ================================
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


// ================================
//  Parse Attribute
// ================================
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


// ================================
//  Create Blur Layers
// ================================
function applyBlurStack(el) {
  if (!el) return;

  const cfg = parseBlurData(el.dataset.blurStack || "");

  const steps = cfg.steps || 8;
  const minBlur = cfg.min ?? 2;
  const maxBlur = cfg.max ?? 16;
  const direction = cfg.direction || "topToBottom";
  const mode = cfg.mode || "soft";

  // Remove old layers
  el.querySelectorAll(".blur-layer").forEach((l) => l.remove());

  const overlap = 100 / (steps * 1.5);

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

    // direction mapping
    const dir =
      direction === "leftToRight"
        ? "to right"
        : direction === "rightToLeft"
        ? "to left"
        : direction === "bottomToTop"
        ? "to top"
        : "to bottom";

    // mask area
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

  // bring children above blur
  const contentZ = steps + 5;
  el.querySelectorAll(":scope > *:not(.blur-layer)").forEach((child) => {
    child.style.zIndex = contentZ;
    child.style.position = "relative";
  });
}


// ================================
//  Observe DOM + Attribute Changes
// ================================
const blurObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    // Attribute Changed → rebuild
    if (m.type === "attributes" && m.attributeName === "data-blur-stack") {
      applyBlurStack(m.target);
    }

    // New nodes added → initialize
    if (m.type === "childList") {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.hasAttribute?.("data-blur-stack")) {
          applyBlurStack(node);
        }

        node.querySelectorAll?.("[data-blur-stack]").forEach(applyBlurStack);
      });
    }
  }
});

blurObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["data-blur-stack"],
});


// ================================
//  Initial Build
// ================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-blur-stack]").forEach(applyBlurStack);
});
