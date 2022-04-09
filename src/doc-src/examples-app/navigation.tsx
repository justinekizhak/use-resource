import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div>
      <h1>Navigation</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/basic">Basic</Link>
        <Link to="/context-sync">Context sync</Link>
        <Link to="/event-queue">Event Queue</Link>
      </nav>
    </div>
  );
}
