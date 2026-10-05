// Illustrations ---------------------------------------------------------------
//
// Each [data-art] slot lists the sets that suit its shape. On every page load
// one set is picked at random, then one of its four variants. Files are made
// by bin/build_art.py as /art/<set>-<variant>-<800|1600>.webp.
//
// size:  pixel size of the largest file (for width/height and srcset widths)
// focus: object-position, i.e. the part kept when the slot crops the image;
//        either one value, or one per slot role (hero, plate, edge)

const ART = {
  moire: {
    size: [928, 1232],
    focus: "50% 50%",
    alt: "Moiré superlattice formed by two graphene lattices twisted by 4°, redrawn as an illustration",
  },
  streamlines: { size: [1312, 896], focus: "45% 52%" },
  "domain-walls": { size: [1232, 912], focus: "46% 46%" },
  rhombi: { size: [1024, 964], focus: "50% 50%" },
  orbitals: { size: [992, 1216], focus: { edge: "40% 66%", plate: "50% 67%" } },
  network: { size: [1024, 1024], focus: "50% 50%" },
  layers: { size: [1256, 904], focus: "50% 45%" },
  springs: { size: [1952, 624], focus: "50% 50%" },
  lattice: { size: [1024, 1024], focus: "50% 50%" },
  defects: { size: [1184, 975], focus: "50% 45%" },
  hexagrams: { size: [744, 752], focus: "55% 50%" },
  staging: { size: [1144, 275], focus: "50% 50%" },
  net: { size: [1296, 928], focus: "55% 50%" },
};

const SIZES = {
  hero: "(max-width: 760px) min(90vw, 340px), 340px",
  plate: "(max-width: 640px) 92vw, 450px",
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const showLabels = new URLSearchParams(location.search).has("art");

document.querySelectorAll("[data-art]").forEach((slot) => {
  const name = pick(slot.dataset.art.split(/\s+/));
  const set = ART[name];
  if (!set) return;

  const role = slot.dataset.artRole;
  const variant = Math.floor(Math.random() * 4);
  const [w, h] = set.size;
  const widthAt = (longSide) => Math.round(w * Math.min(1, longSide / Math.max(w, h)));
  const base = `/art/${name}-${variant}`;

  const img = new Image();
  img.alt = role === "hero" ? set.alt : "";
  img.width = w;
  img.height = h;
  img.decoding = "async";
  img.style.objectPosition = (typeof set.focus === "object" ? set.focus[role] : set.focus) || "50% 50%";
  img.className = "is-pending";
  img.addEventListener("load", () => img.classList.remove("is-pending"), { once: true });

  // The edge strip is as tall as the window, so it always needs the large file.
  if (role === "edge") {
    img.src = `${base}-1600.webp`;
  } else {
    img.sizes = SIZES[role] || "100vw";
    img.srcset = `${base}-800.webp ${widthAt(800)}w, ${base}-1600.webp ${widthAt(1600)}w`;
    img.src = `${base}-800.webp`;
  }

  if (showLabels) slot.dataset.artLabel = `${name} ${variant + 1}/4`;
  slot.replaceChildren(img);
});

// The edge strip's image is taller than the strip (see styles.css) and pans
// from top to bottom as the page scrolls. Pages that do not scroll show its middle.

const edge = document.querySelector(".edge");

if (edge && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let queued = false;
  const update = () => {
    queued = false;
    const range = document.documentElement.scrollHeight - innerHeight;
    edge.style.setProperty("--edge-progress", range > 0 ? (scrollY / range).toFixed(4) : "0.5");
  };
  const queue = () => {
    if (!queued) requestAnimationFrame(update);
    queued = true;
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
}

// Day / night toggle ----------------------------------------------------------
//
// With no stored choice the page follows the system setting. The inline
// script in each <head> applies a stored choice before the first paint.

const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const PAPER = { light: "#f6f7f9", dark: "#101217" };

const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

function syncToggle() {
  if (!toggle) return;
  const label = `Switch to ${currentTheme() === "dark" ? "day" : "night"} mode`;
  toggle.setAttribute("aria-label", label);
  toggle.title = label;
}

function applyStoredThemeColor() {
  if (!root.dataset.theme) return;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.content = PAPER[root.dataset.theme];
  });
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const theme = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Storage can be unavailable (private mode); the choice then lasts for this page only.
    }
    applyStoredThemeColor();
    syncToggle();
  });
  systemDark.addEventListener("change", syncToggle);
  syncToggle();
  applyStoredThemeColor();
}

// Publication filter ----------------------------------------------------------

const search = document.querySelector("[data-publication-search]");

if (search) {
  const items = Array.from(document.querySelectorAll(".publication-item"));
  const groups = Array.from(document.querySelectorAll("[data-year-group]"));
  const empty = document.querySelector("[data-publication-empty]");

  search.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase();

    items.forEach((item) => {
      item.hidden = query.length > 0 && !item.textContent.toLocaleLowerCase().includes(query);
    });

    groups.forEach((group) => {
      group.hidden = !Array.from(group.querySelectorAll(".publication-item")).some((item) => !item.hidden);
    });

    if (empty) empty.hidden = items.some((item) => !item.hidden);
  });
}
