const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const els = {
  style: document.getElementById("styleSelect"),
  quote: document.getElementById("quoteText"),
  handle: document.getElementById("handle"),
  font: document.getElementById("fontSelect"),
  italicFirst: document.getElementById("italicFirst"),
  align: document.getElementById("alignSelect"),
};

const colorRow = document.getElementById("colorRow");
const italicRow = document.getElementById("italicRow");
const alignRowWrap = document.getElementById("alignRowWrap");

// ---------- background caching ----------
const bgCache = { key: "", canvas: document.createElement("canvas") };

function ensureBackground(W, H) {
  const key = [W, H].join("|");
  if (bgCache.key === key) return bgCache.canvas;
  const off = bgCache.canvas;
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d");
  drawPaperTexture(octx, W, H);
  bgCache.key = key;
  return off;
}

function drawCleanBackground(octx, W, H, cardColor, bgColor) {
  octx.clearRect(0, 0, W, H);
  octx.fillStyle = bgColor || "#d6d6d6";
  octx.fillRect(0, 0, W, H);

  const cardMargin = 60;
  const cardX = cardMargin,
    cardY = cardMargin;
  const cardW = W - cardMargin * 2,
    cardH = H - cardMargin * 2;
  const radius = 6;

  octx.save();
  octx.shadowColor = "rgba(0,0,0,0.15)";
  octx.shadowBlur = 24;
  octx.shadowOffsetY = 8;
  roundRect(octx, cardX, cardY, cardW, cardH, radius);
  octx.fillStyle = cardColor || "#ffffff";
  octx.fill();
  octx.restore();
}

function drawPaperTexture(octx, W, H) {
  const grad = octx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#ececea");
  grad.addColorStop(0.5, "#e1e1de");
  grad.addColorStop(1, "#d2d2cf");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, W, H);

  // film grain
  const imgData = octx.getImageData(0, 0, W, H);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 24;
    d[i] = clamp(d[i] + n);
    d[i + 1] = clamp(d[i + 1] + n);
    d[i + 2] = clamp(d[i + 2] + n);
  }
  octx.putImageData(imgData, 0, 0);

  // dark diagonal corner shadow (bottom-right), like the reference photo
  const rg = octx.createRadialGradient(
    W * 0.92,
    H * 0.96,
    W * 0.05,
    W * 0.92,
    H * 0.96,
    W * 0.75,
  );
  rg.addColorStop(0, "rgba(8,8,8,0.8)");
  rg.addColorStop(0.35, "rgba(8,8,8,0.28)");
  rg.addColorStop(1, "rgba(8,8,8,0)");
  octx.fillStyle = rg;
  octx.fillRect(0, 0, W, H);

  // soft light lift top-left
  const rg2 = octx.createRadialGradient(
    W * 0.12,
    H * 0.08,
    10,
    W * 0.12,
    H * 0.08,
    W * 0.55,
  );
  rg2.addColorStop(0, "rgba(255,255,255,0.22)");
  rg2.addColorStop(1, "rgba(255,255,255,0)");
  octx.fillStyle = rg2;
  octx.fillRect(0, 0, W, H);
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// ---------- text layout ----------
function wrapTextWithParagraphs(
  text,
  maxWidth,
  fontSizePx,
  fontFamily,
  italicFirst,
) {
  const paragraphs = text.split("\n");
  const lines = [];
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
  text,
  boxWidth,
  boxHeight,
  startSize,
  fontFamily,
  italicFirst,
) {
  let size = parseInt(startSize.split("px")[0], 10);
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
  const style = els.style.value;
  const [W, H] = CANVAS;
  canvas.width = W;
  canvas.height = H;

  const fontFamily = els.font.value;
  const textColor = TEXT_COLOR;
  const handleColor = HANDLE_COLOR;
  const italicFirst = els.italicFirst.checked;

  const bg = ensureBackground(W, H);
  ctx.drawImage(bg, 0, 0);

  let boxX, boxY, boxW, boxH, align;
  if (style === "paper") {
    boxX = W * 0.2;
    boxW = W * 0.64;
    boxY = H * 0.28;
    boxH = H * 0.34;
    align = els.align.value;
  } else {
    const cardMargin = 60;
    boxX = cardMargin + 120;
    boxW = W - cardMargin * 2 - 240;
    boxY = cardMargin;
    boxH = H - cardMargin * 2;
    align = "center";
  }

  const quote = els.quote.value.trim();
  const fit = fitFontSize(
    quote,
    boxW,
    boxH,
    FONT_SIZE,
    fontFamily,
    italicFirst,
  );
  console.log(fit, "fit");
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

  const handle = els.handle.value.trim();
  if (handle) {
    const margin = style === "paper" ? 50 : 60;
    ctx.font = `${HANDLE_SIZE} "${fontFamily}"`;
    ctx.fillStyle = handleColor;
    const handleW = ctx.measureText(handle).width;
    ctx.fillText(handle, W - margin - handleW, H - margin);
  }
}

els.style.addEventListener("change", () => {
  const style = els.style.value;
  if (style === "paper") {
    els.shape.value = "portrait34";
    els.font.value = "EB Garamond";
    els.italicFirst.checked = true;
    els.align.value = "left";
  } else {
    els.shape.value = "square";
    els.font.value = "Itim";
  }
  draw();
});

[els.quote, els.handle, els.font, els.italicFirst, els.align].forEach((el) =>
  el.addEventListener("input", draw),
);

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
  const jobs = [];
  fam.forEach((f) => {
    jobs.push(document.fonts.load(`46px "${f}"`));
    jobs.push(document.fonts.load(`italic 46px "${f}"`));
  });
  Promise.all(jobs).then(draw).catch(draw);
  draw();
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "quote-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
