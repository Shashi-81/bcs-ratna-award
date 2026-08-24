import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const links = [
  { to: "/about", label: "About" },
  { to: "/categories", label: "Categories" },
  { to: "/events", label: "Past Events" },
  // Winners menu item temporarily disabled.
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const row1Height = 72;
  const logoHeight = 68;

  return (
    <>
      {/* ─── FIXED HEADER ─────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(5,5,5,0.98)" : "rgba(8,8,8,0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.2)"}`,
          transition: "all 0.35s ease",
        }}
      >
        {/* ── SINGLE ROW: Logo left + Nav right (desktop) ── */}
        <div
          className="hidden md:flex"
          style={{
            height: `${row1Height}px`,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img
              src="/assets/BCS-Website-Logo.png"
              alt="BCS Ratna Award"
              style={{
                height: `${logoHeight}px`,
                width: "auto",
                maxWidth: "280px",
                objectFit: "contain",
                display: "block",
                transition: "filter 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "drop-shadow(0 0 10px rgba(201,168,76,0.6))"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
            />
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="nav2-link"
                activeProps={{ className: "nav2-link nav2-link--active" }}
                style={{ whiteSpace: "nowrap" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="nav2-link"
              activeProps={{ className: "nav2-link nav2-link--active" }}
              style={{ whiteSpace: "nowrap" }}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* ── MOBILE SINGLE ROW ── */}
        <div
          className="flex md:hidden"
          style={{
            height: "72px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/assets/BCS-Website-Logo.png"
              alt="BCS Ratna Award"
              style={{ height: "52px", width: "auto", maxWidth: "220px", objectFit: "contain", display: "block" }}
            />
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{
              display: "block", width: "22px", height: "2px", background: "#C9A84C", borderRadius: "2px",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: drawerOpen ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block", width: "22px", height: "2px", background: "#C9A84C", borderRadius: "2px",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: drawerOpen ? 0 : 1,
              transform: drawerOpen ? "scaleX(0)" : "none",
            }} />
            <span style={{
              display: "block", width: "22px", height: "2px", background: "#C9A84C", borderRadius: "2px",
              transition: "transform 0.3s ease",
              transform: drawerOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        </div>
      </header>

      {/* ─── MOBILE OVERLAY ───────────────────────── */}
      <div
        className="md:hidden"
        onClick={() => setDrawerOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
          transition: "opacity 0.3s ease",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
      />

      {/* ─── MOBILE DRAWER ────────────────────────── */}
      <div
        ref={drawerRef}
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(85vw, 320px)",
          background: "rgba(6,6,6,0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(201,168,76,0.2)",
          zIndex: 9999,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          flexShrink: 0,
        }}>
          <img
            src="/assets/BCS-Website-Logo.png"
            alt="BCS Ratna Award"
            style={{ height: "64px", width: "auto", objectFit: "contain" }}
          />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            style={{
              width: "44px", height: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C9A84C", fontSize: "20px",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer nav links */}
        <div style={{ flex: 1 }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                textDecoration: "none",
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#C9A84C";
                e.currentTarget.style.background = "rgba(201,168,76,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* Event Info accordion temporarily disabled */}

          <Link
            to="/contact"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#FFFFFF",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#C9A84C";
              e.currentTarget.style.background = "rgba(201,168,76,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
