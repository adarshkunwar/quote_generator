import type { TConfig } from "../types/background";
import { createGradient, createGrain, createVignette } from "./background";
import { clamp } from "../../../shared/utils/NumberManipulation";

const clampFn = clamp(0, 255);

type TDraw = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  config: TConfig;
};

function ensureBackground(
  W: number,
  H: number,
  config: TConfig,
  canvasElement: HTMLCanvasElement,
) {
  const off = canvasElement;
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d");
  if (!octx) throw new Error("no octx");
  drawPaperTexture(octx, config, W, H);
  return off;
}

function drawPaperTexture(
  octx: CanvasRenderingContext2D,
  config: TConfig,
  W: number,
  H: number,
) {
  createGradient(W, H, octx, config.color.gradient);
  createGrain(W, H, octx, clampFn);
  createVignette(W, H, octx, config.color.vignette.shadow);
  createVignette(W, H, octx, config.color.vignette.lift);
}

export function draw({ canvas, ctx, width, height, config }: TDraw) {
  canvas.width = width;
  canvas.height = height;
  // const { style, handle, font, italicFirst, quote, align } = els.values;
  // console.log(JSON.stringify(quote));

  // const fontFamily = font;
  // const textColor = config.color.font;
  // const handleColor = config.color.handle;

  const bg = ensureBackground(width, height, config, canvas);
  ctx.drawImage(bg, 0, 0);

  // let boxX, boxY, boxW, boxH;
  // boxX = width * 0.2;
  // boxW = width * 0.64;
  // boxY = height * 0.28;
  // boxH = height * 0.34;
  //
  // const fit = fitFontSize(
  //   quote,
  //   boxW,
  //   boxH,
  //   FONT_SIZE,
  //   fontFamily,
  //   italicFirst,
  // );
  // const totalTextHeight = fit.lines.length * fit.size * fit.lineHeightRatio;
  // let textY = boxY + boxH / 2 - totalTextHeight / 2 + fit.size;

  // ctx.fillStyle = textColor;
  // ctx.textBaseline = "alphabetic";
  // fit.lines.forEach((l) => {
  //   ctx.font = `${l.italic ? "italic " : ""}${fit.size}px "${fontFamily}"`;
  //   const lineWidth = ctx.measureText(l.text).width;
  //   const xPos = align === "center" ? boxX + boxW / 2 - lineWidth / 2 : boxX;
  //   ctx.fillText(l.text, xPos, textY);
  //   textY += fit.size * fit.lineHeightRatio;
  // });

  // if (handle) {
  //   const margin = style === "paper" ? 50 : 60;
  //   ctx.font = `${HANDLE_SIZE} "${fontFamily}"`;
  //   ctx.fillStyle = handleColor;
  //   const handleW = ctx.measureText(handle).width;
  //   ctx.fillText(handle, width - margin - handleW, height - margin);
  // }
}
