import type {
  TGradientElement,
  TRadialGradientElement,
  TVignetteElement,
} from "./config.js";
import type { TClamp } from "./utils.js";

export function createGradient(
  width: number,
  height: number,
  octx: CanvasRenderingContext2D,
  gradientArray: TGradientElement[],
) {
  const gradient = octx.createLinearGradient(0, 0, width, height);
  for (let element of gradientArray) {
    gradient.addColorStop(element.stopAt, element.color);
  }
  octx.fillStyle = gradient;
  octx.fillRect(0, 0, width, height);
}

export function createGrain(
  width: number,
  height: number,
  octx: CanvasRenderingContext2D,
  clamp: TClamp,
) {
  const imgData = octx.getImageData(0, 0, width, height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 24;
    d[i] = clamp(d[i]! + n);
    d[i + 1] = clamp(d[i + 1]! + n);
    d[i + 2] = clamp(d[i + 2]! + n);
  }
  octx.putImageData(imgData, 0, 0);
}

export function createVignette(
  width: number,
  height: number,
  octx: CanvasRenderingContext2D,
  vigenette: TVignetteElement,
) {
  let cw = width * vigenette.cx;
  let ch = height * vigenette.cy;
  let innerRadius = width * vigenette.innerRadius;
  let outerRadius = width * vigenette.outerRadius;

  const rg = octx.createRadialGradient(
    cw,
    ch,
    innerRadius,
    cw,
    ch,
    outerRadius,
  );

  vigenette.stops.forEach((s) => {
    rg.addColorStop(s.stopAt, `rgba(${s.color},${s.opacity})`);
  });

  octx.fillStyle = rg;
  octx.fillRect(0, 0, width, height);
}
