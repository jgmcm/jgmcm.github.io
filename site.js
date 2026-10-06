// Illustrations ---------------------------------------------------------------
//
// Each [data-art] slot lists the sets that suit its shape, or "all" for any
// set. On every page load one set is picked at random, then one of its four
// variants. Slots are filled in page order and avoid sets already shown on
// the page while any of their candidates is still unused. Files are made
// by bin/build_art.py as /art/<set>-<variant>-<800|1600>.webp.
//
// size:  pixel size of the largest file (for width/height and srcset widths)
// focus: object-position for the hero, title plates and research cards, i.e.
//        the part kept when the slot crops the image
// zoom:  optional extra magnification per slot role, to crop away borders
// edge:  the main feature to show in the left-hand edge strip: its centre
//        (x, y) and width (w) as fractions of the image. A value may be a
//        list with one entry per variant. fill: true marks sets with a plain
//        background, which may be shown smaller than the strip with the
//        space above and below filled in their own edge colours.

const ART = {
  moire: {
    size: [928, 1232],
    focus: "50% 50%",
    zoom: { card: 1.3 },
    alt: "Moiré superlattice formed by two graphene lattices twisted by 4°, redrawn as an illustration",
  },
  streamlines: { size: [1312, 896], focus: "45% 52%" },
  "domain-walls": {
    size: [1232, 912],
    focus: "46% 46%",
    edge: { x: [0.48, 0.495, 0.49, 0.486], y: 0.45, w: 0.17 },
  },
  rhombi: { size: [1024, 964], focus: "50% 50%", edge: { x: 0.5, y: 0.5, w: 0.2 } },
  orbitals: {
    size: [992, 1216],
    focus: "50% 67%",
    edge: { x: [0.49, 0.51, 0.49, 0.52], y: 0.4, w: [0.33, 0.35, 0.45, 0.38], fill: true },
  },
  network: { size: [1024, 1024], focus: "50% 50%", edge: { x: [0.357, 0.351, 0.357, 0.343], y: 0.5, w: 0.2 } },
  layers: { size: [1256, 904], focus: "50% 45%" },
  springs: { size: [1952, 624], focus: "50% 50%" },
  lattice: { size: [1024, 1024], focus: "50% 50%", edge: { x: 0.55, y: 0.5, w: 0.32, fill: true } },
  defects: { size: [1184, 975], focus: "50% 45%", edge: { x: 0.57, y: 0.59, w: 0.18 } },
  hexagrams: { size: [744, 752], focus: "55% 50%" },
  staging: { size: [1144, 275], focus: "50% 50%" },
  net: { size: [1296, 928], focus: "55% 50%", edge: { x: 0.55, y: 0.5, w: 0.16 } },
};

const SIZES = {
  hero: "(max-width: 760px) min(90vw, 340px), 340px",
  plate: "(max-width: 640px) 92vw, 450px",
  card: "(max-width: 800px) 92vw, 480px",
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const perVariant = (value, variant) => (Array.isArray(value) ? value[variant] : value);
const showLabels = new URLSearchParams(location.search).has("art");
let edgeArt = null;
const used = new Set();

document.querySelectorAll("[data-art]").forEach((slot) => {
  const listed = slot.dataset.art === "all" ? Object.keys(ART) : slot.dataset.art.split(/\s+/);
  const unused = listed.filter((candidate) => !used.has(candidate));
  const name = pick(unused.length ? unused : listed);
  used.add(name);
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
  img.className = "is-pending";
  img.addEventListener("load", () => img.classList.remove("is-pending"), { once: true });

  if (role === "edge" && set.edge) {
    // The edge strip is as tall as the window, so it always needs the large file.
    const feature = {
      x: perVariant(set.edge.x, variant),
      y: perVariant(set.edge.y, variant),
      w: perVariant(set.edge.w, variant),
      fill: Boolean(set.edge.fill),
    };
    img.src = `${base}-1600.webp`;
    img.style.objectPosition = `${feature.x * 100}% ${feature.y * 100}%`;
    edgeArt = { slot, img, size: set.size, feature };
  } else {
    img.style.objectPosition = set.focus || "50% 50%";
    if (set.zoom?.[role]) img.style.transform = `scale(${set.zoom[role]})`;
    img.sizes = SIZES[role] || "100vw";
    img.srcset = `${base}-800.webp ${widthAt(800)}w, ${base}-1600.webp ${widthAt(1600)}w`;
    img.src = `${base}-800.webp`;
  }

  if (showLabels) slot.dataset.artLabel = `${name} ${variant + 1}/4`;
  slot.replaceChildren(img);
});

// Edge strip layout -------------------------------------------------------------
//
// On wide screens the strip is a fixed column beside the content (styles.css).
// Its right side fades out towards the text, so the image is scaled so that its
// feature fits within the solid part (FEATURE_WIDTH of the strip) and is
// centred there (FEATURE_CENTRE across the strip). It is never larger than PAN times the strip height, and never shorter
// than the strip, except for "fill" sets, which may shrink to MIN_FILL of the
// strip height with the space above and below filled in the colours of the
// image's own top and bottom edges. An image taller than the strip pans from
// top to bottom as the page scrolls. On phones the strip is a band across the
// top of the page and the image simply covers it.

const PAN = 1.12;
const MIN_FILL = 0.75;
const FEATURE_CENTRE = 0.42;
const FEATURE_WIDTH = 0.78;

if (edgeArt) {
  const { slot, img, size, feature } = edgeArt;
  const [iw, ih] = size;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  let pixels = null;
  let progress = 0.5;
  let layout = null;

  // Average colour of rows [r0, r1) and columns [c0, c1), all as fractions.
  const edgeColour = (r0, r1, c0, c1) => {
    const n = 64;
    const sum = [0, 0, 0];
    let count = 0;
    for (let y = Math.floor(r0 * n); y < Math.ceil(r1 * n); y++) {
      for (let x = Math.floor(c0 * n); x < Math.ceil(c1 * n); x++) {
        const i = (y * n + x) * 4;
        sum[0] += pixels[i];
        sum[1] += pixels[i + 1];
        sum[2] += pixels[i + 2];
        count++;
      }
    }
    return `rgb(${sum.map((v) => Math.round(v / count)).join(" ")})`;
  };

  const place = () => {
    if (!layout) return;
    const { height, top } = layout;
    const y = height > slot.clientHeight ? -(height - slot.clientHeight) * progress : top;
    img.style.top = `${y}px`;
  };

  const measure = () => {
    if (getComputedStyle(slot).position !== "fixed") {
      layout = null;
      slot.style.background = "";
      for (const prop of ["width", "height", "left", "top", "maskImage", "webkitMaskImage"]) img.style[prop] = "";
      return;
    }
    const W = slot.clientWidth;
    const H = slot.clientHeight;
    const floor = (feature.fill ? MIN_FILL : 1) * (H / ih);
    const scale = Math.max(Math.min((PAN * H) / ih, (FEATURE_WIDTH * W) / (feature.w * iw)), floor, W / iw);
    const width = iw * scale;
    const height = ih * scale;
    const left = clamp(FEATURE_CENTRE * W - feature.x * width, W - width, 0);
    const top = clamp(H / 2 - feature.y * height, 0, H - height);
    layout = { height, top };

    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.left = `${left}px`;

    const short = height < H;
    const fade = short ? "linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)" : "";
    img.style.maskImage = fade;
    img.style.webkitMaskImage = fade;
    if (short && pixels) {
      const c0 = -left / width;
      const c1 = (W - left) / width;
      const above = edgeColour(0.015, 0.035, c0, c1);
      const below = edgeColour(0.965, 0.985, c0, c1);
      slot.style.background = `linear-gradient(to bottom, ${above} 50%, ${below} 50%)`;
    } else {
      slot.style.background = "";
    }
    place();
  };

  img.addEventListener(
    "load",
    () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(img, 0, 0, 64, 64);
      pixels = context.getImageData(0, 0, 64, 64).data;
      measure();
    },
    { once: true },
  );

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const range = document.documentElement.scrollHeight - innerHeight;
      progress = range > 0 ? scrollY / range : 0.5;
      place();
    });
  };

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  addEventListener("resize", measure);
  measure();
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
