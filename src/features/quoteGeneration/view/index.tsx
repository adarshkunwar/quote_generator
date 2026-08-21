import { useRef, useState } from "react";
import Canvas, { type CanvasHandle } from "../components/atoms/Canvas";
import type { TConfig } from "../types/background";
import { CONFIG } from "../../../config";

const QuoteGeneration = () => {
  const canvasRef = useRef<CanvasHandle>(null);

  const [config, setConfig] = useState<TConfig>(CONFIG);
  const [configText, setConfigText] = useState(() =>
    JSON.stringify(CONFIG, null, 2),
  );

  const handleApplyConfig = () => {
    try {
      const parsed = JSON.parse(configText);
      setConfig({ ...config, ...parsed }); // new object -> triggers Canvas's useEffect
    } catch (err) {
      alert(`Invalid config JSON: ${(err as Error).message}`);
    }
  };

  return (
    <div>
      <div className="wrap">
        <div className="panel">
          <h1>Quote Card Generator</h1>
          <button onClick={() => canvasRef.current?.download()}>
            Download PNG
          </button>
        </div>

        <div className="canvas-holder">
          <Canvas ref={canvasRef} config={config} />
        </div>

        <div>
          <label htmlFor="configText">Config (JSON)</label>
          <textarea
            id="configText"
            rows={20}
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
          />
          <button id="applyConfigBtn" onClick={handleApplyConfig}>
            Apply Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneration;
