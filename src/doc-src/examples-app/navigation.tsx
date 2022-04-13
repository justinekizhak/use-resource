import { NavLink } from "react-router-dom";

export default function Navigation() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/basic", label: "Basic" },
    { href: "/context-sync", label: "Context sync" },
    { href: "/event-queue", label: "Event queue" }
  ];

  return (
    <nav>
      <ul className="nav nav-tabs">
        {links.map(({ href, label }) => (
          <li key={href} className="nav-item">
            <NavLink to={href} className="nav-link">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
