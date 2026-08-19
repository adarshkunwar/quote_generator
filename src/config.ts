type TGradientElement = {
  color: string;
  stopAt: number;
};

type TConfig = {
  canvas: { width: number; height: number };
  line: { font: number; handle: number };
  color: {
    font: string;
    handle: string;
    gradient: TGradientElement[];
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
  },
  line: {
    font: 40,
    handle: 20,
  },
};
