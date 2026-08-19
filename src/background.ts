import type { TGradientElement } from "./config.js";

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
