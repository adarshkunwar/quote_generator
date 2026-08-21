import { Elements, clamp } from "./utils.js";
import { CONFIG } from "./config.js";
import { createGradient, createGrain, createVignette } from "./background.js";

const configTextarea = document.getElementById(
  "configText",
) as HTMLTextAreaElement;
console.log(configTextarea);
configTextarea.value = JSON.stringify(CONFIG, null, 2);

let config = CONFIG;

if (configTextarea) {
  configTextarea.value = JSON.stringify(CONFIG, null, 2);

  configTextarea.addEventListener("change", () => {
    try {
      const parsed = JSON.parse(configTextarea.value);
      Object.assign(CONFIG, parsed); // mutate in place so other modules keep the same reference
      config = CONFIG;
      draw();
    } catch (err) {
      alert(`Invalid config JSON: ${(err as Error).message}`);
    }
  });
}

const { width, height } = config.canvas;
const FONT_SIZE = config.line.font;
const HANDLE_SIZE = config.line.handle;

const clampFn = clamp(0, 255);

const canvas = document.getElementById("cardCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const els = new Elements();

els.setElements(
  canvas,
  ctx,
  document.getElementById("styleSelect") as HTMLSelectElement,
  document.getElementById("quoteText") as HTMLInputElement,
  document.getElementById("handle") as HTMLInputElement,
  document.getElementById("fontSelect") as HTMLSelectElement,
  document.getElementById("italicFirst") as HTMLInputElement,
  document.getElementById("alignSelect") as HTMLSelectElement,
);

els.addInputListener(draw);

let canvasElement = document.createElement("canvas");

// ---------- background caching ----------

// TODO: Might need to change this once we allow various wallpapers
function ensureBackground(W: number, H: number) {
  const key = [W, H].join("|");
  const off = canvasElement;
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d");
  if (!octx) throw new Error("no octx");
  drawPaperTexture(octx, W, H);
  return off;
}

function drawPaperTexture(
  octx: CanvasRenderingContext2D,
  W: number,
  H: number,
) {
  createGradient(W, H, octx, config.color.gradient);
  createGrain(W, H, octx, clampFn);
  createVignette(W, H, octx, config.color.vignette.shadow);
  createVignette(W, H, octx, config.color.vignette.lift);
}

function wrapTextWithParagraphs(
  text: string,
  maxWidth: number,
  fontSizePx: number,
  fontFamily: string,
  italicFirst: boolean,
) {
  const paragraphs = text.split("\n");
  const lines: any[] = [];
  paragraphs.forEach((p, pi) => {
    const isItalic = italicFirst && pi === 0;
    ctx.font = `${isItalic ? "italic " : ""}${fontSizePx}px "${fontFamily}"`;
    const words = p.split(" ");
    let line = "";
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push({ text: line, italic: isItalic });
        line = word;
      } else {
        line = test;
      }
    });
    lines.push({ text: line, italic: isItalic });
  });
  return lines;
}

function fitFontSize(
  text: string,
  boxWidth: number,
  boxHeight: number,
  startSize: number,
  fontFamily: string,
  italicFirst: boolean,
) {
  let size = startSize;
  const lineHeightRatio = 1.42;
  while (size > 16) {
    const lines = wrapTextWithParagraphs(
      text,
      boxWidth,
      size,
      fontFamily,
      italicFirst,
    );
    const totalHeight = lines.length * size * lineHeightRatio;
    if (totalHeight <= boxHeight) return { size, lines, lineHeightRatio };
    size -= 2;
  }
  const lines = wrapTextWithParagraphs(
    text,
    boxWidth,
    size,
    fontFamily,
    italicFirst,
  );
  return { size, lines, lineHeightRatio };
}

// ---------- main draw ----------
function draw() {
  canvas.width = width;
  canvas.height = height;
  const { style, handle, font, italicFirst, quote, align } = els.values;
  console.log(JSON.stringify(quote));

  const fontFamily = font;
  const textColor = config.color.font;
  const handleColor = config.color.handle;

  const bg = ensureBackground(width, height);
  ctx.drawImage(bg, 0, 0);

  let boxX, boxY, boxW, boxH;
  boxX = width * 0.2;
  boxW = width * 0.64;
  boxY = height * 0.28;
  boxH = height * 0.34;

  const fit = fitFontSize(
    quote,
    boxW,
    boxH,
    FONT_SIZE,
    fontFamily,
    italicFirst,
  );
  const totalTextHeight = fit.lines.length * fit.size * fit.lineHeightRatio;
  let textY = boxY + boxH / 2 - totalTextHeight / 2 + fit.size;

  ctx.fillStyle = textColor;
  ctx.textBaseline = "alphabetic";
  fit.lines.forEach((l) => {
    ctx.font = `${l.italic ? "italic " : ""}${fit.size}px "${fontFamily}"`;
    const lineWidth = ctx.measureText(l.text).width;
    const xPos = align === "center" ? boxX + boxW / 2 - lineWidth / 2 : boxX;
    ctx.fillText(l.text, xPos, textY);
    textY += fit.size * fit.lineHeightRatio;
  });

  if (handle) {
    const margin = style === "paper" ? 50 : 60;
    ctx.font = `${HANDLE_SIZE} "${fontFamily}"`;
    ctx.fillStyle = handleColor;
    const handleW = ctx.measureText(handle).width;
    ctx.fillText(handle, width - margin - handleW, height - margin);
  }
}

document.fonts.ready.then(() => {
  const fam = [
    "Itim",
    "Shantell Sans",
    "Gochi Hand",
    "Caveat",
    "Nanum Pen Script",
    "Just Me Again Down Here",
    "Advent Pro",
    "EB Garamond",
    "Playfair Display",
    "Cormorant Garamond",
    "Lora",
  ];
  const jobs: any[] = [];
  fam.forEach((f) => {
    jobs.push(document.fonts.load(`46px "${f}"`));
    jobs.push(document.fonts.load(`italic 46px "${f}"`));
  });
  Promise.all(jobs).then(draw).catch(draw);
  draw();
});

document?.getElementById("downloadBtn")?.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "quote-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
