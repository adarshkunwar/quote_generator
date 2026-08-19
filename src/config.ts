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

type TConfig = {
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

export const CONFIG: TConfig = {
  canvas: {
    width: 1254,
    height: 1672,
  },
  color: {
    font: "#333333",
    handle: "#9a9a9a",
    gradient: [
      {
        color: "#ececea",
        stopAt: 0,
      },
      {
        color: "#e1e1de",
        stopAt: 0.5,
      },
      {
        color: "#d2d2cf",
        stopAt: 1,
      },
    ],
    vignette: {
      shadow: {
        cx: 0.92,
        cy: 0.96,
        innerRadius: 0.05,
        outerRadius: 0.75,
        stops: [
          { color: "8,8,8", opacity: 0.8, stopAt: 0 },
          { color: "8,8,8", opacity: 0.28, stopAt: 0.35 },
          { color: "8,8,8", opacity: 0, stopAt: 1 },
        ],
      },
      lift: {
        cx: 0.12,
        cy: 0.08,
        innerRadius: 0.1, // fixed px, not a fraction — see note below
        outerRadius: 0.55,
        stops: [
          { color: "255,255,255", opacity: 0.22, stopAt: 0 },
          { color: "255,255,255", opacity: 0, stopAt: 1 },
        ],
      },
    },
  },
  line: {
    font: 40,
    handle: 20,
  },
};
