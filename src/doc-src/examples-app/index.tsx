import "bootstrap/dist/css/bootstrap.min.css";
import "../css/examples-app.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./navigation";
import { Link } from "react-router-dom";

import BasicExample from "../components/examples/basic";
import ContextSync from "../components/examples/context-sync";
import EventQueue from "../components/examples/event-queue";

function Home() {
  return (
    <div>
      <div>Please select one of the examples</div>
      <Link to="/basic">Basic</Link>
      <Link to="/context-sync">Context sync</Link>
      <Link to="/event-queue">Event Queue</Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="px-8 py-4">
      <BrowserRouter basename="/examples">
        <h1 className="display-1">Use Resource Hook</h1>
        <h6 className="display-6">Examples</h6>
        <Navigation />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="basic" element={<BasicExample />} />
          <Route path="context-sync" element={<ContextSync />} />
          <Route path="event-queue" element={<EventQueue />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
