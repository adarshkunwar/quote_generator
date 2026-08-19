export type TClamp = (value: number) => number;

export function clamp(minimum: number, maximum: number): TClamp {
  return function (value: number): number {
    return Math.max(minimum, Math.min(maximum, value));
  };
}

interface IElements {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  style: HTMLSelectElement | null;
  quote: HTMLInputElement | null;
  handle: HTMLInputElement | null;
  font: HTMLSelectElement | null;
  italicFirst: HTMLInputElement | null;
  align: HTMLSelectElement | null;
}

export class Elements implements IElements {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  style: HTMLSelectElement | null;
  quote: HTMLInputElement | null;
  handle: HTMLInputElement | null;
  font: HTMLSelectElement | null;
  italicFirst: HTMLInputElement | null;
  align: HTMLSelectElement | null;

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.style = null;
    this.quote = null;
    this.handle = null;
    this.font = null;
    this.italicFirst = null;
    this.align = null;
  }

  setElements(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    style: HTMLSelectElement,
    quote: HTMLInputElement,
    handle: HTMLInputElement,
    font: HTMLSelectElement,
    italicFirst: HTMLInputElement,
    align: HTMLSelectElement,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.style = style;
    this.quote = quote;
    this.handle = handle;
    this.font = font;
    this.italicFirst = italicFirst;
    this.align = align;
  }

  get values() {
    return {
      style: this.style?.value || "",
      quote: this.quote?.value || "",
      handle: this.handle?.value || "",
      font: this.font?.value || "",
      italicFirst: this.italicFirst?.checked || false,
      align: this.align?.value || "",
    };
  }

  addInputListener(callback: (e: Event) => void) {
    [
      this.style,
      this.quote,
      this.handle,
      this.font,
      this.italicFirst,
      this.align,
    ].forEach((el) => {
      el?.addEventListener("input", callback);
    });
  }
}
