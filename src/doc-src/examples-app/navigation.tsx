import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    pathname !== "/" && (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/basic">Basic</Link>
        <Link to="/context-sync">Context sync</Link>
        <Link to="/event-queue">Event Queue</Link>
      </nav>
    )
  );
}
