export type TGradientElement = {
  color: string;
  stopAt: number;
};

export type TRadialGradientElement = {
  color: string;
  stopAt: number;
  opacity: number;
};

export type TVignetteElement = {
  cx: number; // fraction of Width
  cy: number; // fraction of Height
  innerRadius: number; // fraction of W
  outerRadius: number; // fraction of W
  stops: TRadialGradientElement[];
};

export type TConfig = {
  canvas: { width: number; height: number };
  line: { font: number; handle: number };
  color: {
    font: string;
    handle: string;
    gradient: TGradientElement[];
    vignette: {
      shadow: TVignetteElement;
      lift: TVignetteElement;
    };
  };
};
