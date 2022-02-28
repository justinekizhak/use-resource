import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasicExample from "../examples/basic";
import ContextSync from "../examples/context-sync";
import Navigation from "./navigation";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="basic" element={<BasicExample />} />
          <Route path="context-sync" element={<ContextSync />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
