import React from "react";
import "./HomePage.css";

export default function TrudleHeader({ onHomeClick, games = [], onSelectGame }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="trudle-header">
      <div className="header-left">
        <button
          className="menu-btn"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((s) => !s)}
        >
          ☰
        </button>
        <div className="brand" onClick={onHomeClick} role="button" tabIndex={0}>
          <span className="brand-dot" /> TRUDLE
        </div>
      </div>

      <nav className={`header-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        {games.map((g) => (
          <button
            key={g.id}
            className="menu-item"
            onClick={() => {
              onSelectGame(g.id);
              setOpen(false);
            }}
          >
            {g.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
