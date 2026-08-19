function clamp(v) {
  return Math.max(0, Math.min(255, v));
}

class Elements {
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

  setElements(canvas, ctx, style, quote, handle, font, italicFirst, align) {
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
      style: this.style.value,
      quote: this.quote.value,
      handle: this.handle.value,
      font: this.font.value,
      italicFirst: this.italicFirst.checked,
      align: this.align.value,
    };
  }

  addInputListener(callback) {
    [
      this.style,
      this.quote,
      this.handle,
      this.font,
      this.italicFirst,
      this.align,
    ].forEach((el) => {
      el.addEventListener("input", callback);
    });
  }
}
