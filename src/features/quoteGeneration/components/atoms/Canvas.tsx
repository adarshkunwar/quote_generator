import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { draw } from "../../lib/drawing";
import { type TConfig } from "../../types/background";

type CanvasProps = {
  config: TConfig;
};

export type CanvasHandle = {
  download: (filename?: string) => void;
};

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ config }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    draw({
      canvas,
      ctx,
      width: config.canvas.width,
      height: config.canvas.height,
      config,
    });
  }, [config]);

  useImperativeHandle(ref, () => ({
    download: (filename = "quote-card.png") => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    },
  }));

  return (
    <div>
      <canvas id="cardCanvas" ref={canvasRef}></canvas>
    </div>
  );
});

export default Canvas;
