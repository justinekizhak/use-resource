import "bootstrap/dist/css/bootstrap.min.css";
import "../css/examples-app.css";

import { Routes, Route } from "react-router-dom";
import Navigation from "./navigation";

import BasicExample from "../components/examples/basic";
import ContextSync from "../components/examples/context-sync";
import EventQueue from "../components/examples/event-queue";
import { HashRouter } from "react-router-dom";

function Home() {
  return <h3 className="display-6">Please select one of the examples</h3>;
}

export default function App() {
  return (
    <div className="px-8 py-4">
      <HashRouter basename="examples">
        <h1 className="display-1">Use Resource Hook</h1>
        <h2 className="display-5">Examples</h2>
        <Navigation />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="basic" element={<BasicExample />} />
          <Route path="context-sync" element={<ContextSync />} />
          <Route path="event-queue" element={<EventQueue />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
