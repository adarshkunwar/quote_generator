import Generation from "./features/generation/view";
import CanvasGeneration from "./features/quoteGeneration/view";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CanvasGeneration />} />
          <Route path="/generation" element={<Generation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
