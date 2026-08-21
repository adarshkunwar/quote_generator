import { useRef } from "react";
import SelectComponent from "./shared/components/ui/select";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <div className="wrap">
        <div className="panel">
          <h1>Quote Card Generator</h1>
          <label>Style</label>
          <SelectComponent
            id="styleSheet"
            options={[{ key: "Paper Texture", value: "paper" }]}
          />
          <label>Quote text</label>
          <textarea id="quoteText" rows={10}>
            "You know you really love someone, when you don't hate them for
            breaking your heart"
          </textarea>

          <label>Watermark</label>
          <input type="text" id="handle" value="@mind0nlove" />

          <label>Font</label>
          <select id="fontSelect">
            <optgroup label="Handwriting">
              <option value="Itim" selected>
                Itim (rounded marker)
              </option>
              <option value="Shantell Sans">Shantell Sans</option>
              <option value="Gochi Hand">Gochi Hand</option>
              <option value="Caveat">Caveat</option>
              <option value="Nanum Pen Script">Nanum Pen Script</option>
              <option value="Just Me Again Down Here">
                Just Me Again Down Here
              </option>
              <option value="Advent Pro">Advent Pro (tall/elegant)</option>
            </optgroup>
            <optgroup label="Serif (paper style)">
              <option value="EB Garamond">EB Garamond</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Cormorant Garamond">Cormorant Garamond</option>
              <option value="Lora">Lora</option>
              <option value="Georgia">Georgia (system)</option>
            </optgroup>
          </select>

          <div className="checkbox-row" id="italicRow">
            <input type="checkbox" id="italicFirst" />
            <label htmlFor="italicFirst">Italicize first line</label>
          </div>

          <div id="alignRowWrap">
            <label>Text alignment</label>
            <select id="alignSelect">
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </div>

          <button id="downloadBtn">Download PNG</button>
        </div>

        <div className="canvas-holder">
          <canvas
            id="cardCanvas"
            width="1254"
            height="1254"
            ref={canvasRef}
          ></canvas>
        </div>

        <div>
          <label htmlFor="configText">Config (JSON)</label>
          <textarea id="configText" rows={20}></textarea>
          <button id="applyConfigBtn">Apply Config</button>
        </div>
      </div>
    </div>
  );
};

export default App;
