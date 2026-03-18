"use client";
// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contactDialogRef = useRef(null);
  const contactCloseBtnRef = useRef(null);
  const lastActiveElRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openContact = () => {
    lastActiveElRef.current = document.activeElement;
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
    setTimeout(() => lastActiveElRef.current?.focus?.(), 0);
  };

  useEffect(() => {
    if (!contactOpen) return;
    setTimeout(() => contactCloseBtnRef.current?.focus?.(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeContact();
        return;
      }
      if (e.key !== "Tab") return;
      const root = contactDialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
        return;
      }
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [contactOpen]);

  const isActive = (href) => pathname === href;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

        .hdr-root {
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          transition: box-shadow 300ms ease, background 300ms ease;
        }
        .hdr-root.scrolled {
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        }

        /* Nav link base */
        .hdr-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
          text-decoration: none;
          padding: 6px 2px;
          letter-spacing: 0.01em;
          transition: color 200ms ease;
          white-space: nowrap;
        }
        .hdr-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #EE8821;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms cubic-bezier(.4,0,.2,1);
        }
        .hdr-link:hover { color: #fff; }
        .hdr-link:hover::after { transform: scaleX(1); }
        .hdr-link.active {
          color: #fff;
          font-weight: 600;
        }
        .hdr-link.active::after { transform: scaleX(1); }

        /* Dropdown trigger */
        .hdr-drop-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
          background: none;
          border: none;
          padding: 6px 2px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: color 200ms ease;
          white-space: nowrap;
        }
        .hdr-drop-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #EE8821;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms cubic-bezier(.4,0,.2,1);
        }
        .hdr-drop-group:hover .hdr-drop-btn,
        .hdr-drop-group:focus-within .hdr-drop-btn { color: #fff; }
        .hdr-drop-group:hover .hdr-drop-btn::after,
        .hdr-drop-group:focus-within .hdr-drop-btn::after { transform: scaleX(1); }

        .hdr-drop-arrow {
          display: inline-block;
          font-size: 10px;
          opacity: 0.6;
          transition: transform 200ms ease;
        }
        .hdr-drop-group:hover .hdr-drop-arrow,
        .hdr-drop-group:focus-within .hdr-drop-arrow { transform: rotate(180deg); opacity: 1; }

        /* Dropdown panel */
        .hdr-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.06);
          padding: 6px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-6px);
          transition: opacity 200ms ease, transform 200ms ease, visibility 200ms;
        }
        .hdr-drop-group:hover .hdr-dropdown,
        .hdr-drop-group:focus-within .hdr-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .hdr-dropdown::before {
          content: '';
          position: absolute;
          top: -6px; left: 50%;
          transform: translateX(-50%);
          width: 12px; height: 12px;
          background: #fff;
          border-left: 1px solid rgba(0,0,0,0.06);
          border-top: 1px solid rgba(0,0,0,0.06);
          rotate: 45deg;
        }
        .hdr-dropdown a {
          display: block;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 9px;
          transition: background 150ms ease, color 150ms ease;
          line-height: 1.4;
        }
        .hdr-dropdown a:hover { background: #EEF2FC; color: #284181; }

        /* CTA button */
        .hdr-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EE8821;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 9px 22px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 12px rgba(238,136,33,0.38);
          transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
          white-space: nowrap;
        }
        .hdr-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(238,136,33,0.48);
        }
        .hdr-cta:active { transform: translateY(0); }

        /* Mobile drawer */
        .hdr-drawer {
          background: #1d3070;
          border-top: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 12px 32px rgba(0,0,0,0.22);
        }
        .hdr-drawer-link {
          display: flex;
          align-items: center;
          padding: 14px 0;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: color 150ms ease, padding-left 150ms ease;
        }
        .hdr-drawer-link:hover { color: #fff; padding-left: 6px; }
        .hdr-drawer-link:last-of-type { border-bottom: none; }

        /* Hamburger */
        .hdr-ham {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 9px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          font-size: 17px;
          cursor: pointer;
          transition: background 150ms ease;
        }
        .hdr-ham:hover { background: rgba(255,255,255,0.18); }

        @media (max-width: 720px) {
          .hdr-nav-links { display: none !important; }
          .hdr-ham { display: inline-flex; }
        }

        /* Modal */
        .hdr-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(17,24,39,0.6);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          animation: hdrFadeIn 200ms ease;
        }
        .hdr-modal {
          background: #fff;
          border-radius: 20px;
          padding: 2.25rem;
          width: min(440px, calc(100% - 2rem));
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          border: 1px solid rgba(0,0,0,0.06);
          animation: hdrSlideUp 220ms cubic-bezier(.34,1.56,.64,1);
          text-align: center;
        }
        @keyframes hdrFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hdrSlideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {/* ===== HEADER ===== */}
      <header className={`hdr-root bg-[#284181]${scrolled ? " scrolled" : ""}`}>
        <div className="max-w-[1200px] mx-auto px-8 max-[980px]:px-5">
          <nav
            className="grid items-center h-[72px]"
            style={{ gridTemplateColumns: "auto 1fr auto", gap: "24px" }}
            aria-label="Primary"
          >
            {/* LEFT: Logo */}
            <Link
              href="/"
              aria-label="MSC Home"
              className="inline-flex items-center no-underline shrink-0"
            >
              <img
                src="/assets/msc-logo.svg"
                alt="MSC"
                style={{ height: 36, width: "auto", display: "block" }}
              />
            </Link>

            {/* CENTER: Nav links */}
            <div
              className="hdr-nav-links inline-flex justify-center items-center"
              style={{ gap: "36px" }}
            >
              <Link
                href="/"
                className={`hdr-link${isActive("/") ? " active" : ""}`}
              >
                Home
              </Link>

              {/* Hackathons dropdown */}
              <div className="hdr-drop-group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="hdr-drop-btn"
                >
                  Hackathons
                  <span className="hdr-drop-arrow" aria-hidden="true">
                    ▾
                  </span>
                </button>
                <div className="hdr-dropdown">
                  <a
                    href="https://www.africa.engineering.cmu.edu/research/upanzi/id-hackathon.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Digital ID Hackathon Africa
                  </a>
                  <a
                    href="https://digitalidinnovations.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PNG National Digital ID Hackathon
                  </a>
                </div>
              </div>

              <Link
                href="/library"
                className={`hdr-link${isActive("/library") ? " active" : ""}`}
              >
                Use Case Library
              </Link>
              <Link
                href="/about"
                className={`hdr-link${isActive("/about") ? " active" : ""}`}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className={`hdr-link${isActive("/blog") ? " active" : ""}`}
              >
                Blog
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center shrink-0" style={{ gap: "12px" }}>
              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
                className="hdr-ham"
              >
                <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
              </button>

              {/* Contact Us */}
              <button
                type="button"
                className="hdr-cta"
                onClick={() => {
                  setMobileOpen(false);
                  openContact();
                }}
              >
                Contact Us
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="hdr-drawer absolute left-0 right-0 top-[72px] z-[60]"
            role="menu"
            aria-hidden={!mobileOpen}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-col">
              {[
                { href: "/", label: "Home" },
                { href: "/library", label: "Use Case Library" },
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hdr-drawer-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div style={{ paddingTop: "16px" }}>
                <button
                  type="button"
                  className="hdr-cta"
                  onClick={() => {
                    setMobileOpen(false);
                    openContact();
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== CONTACT MODAL ===== */}
      {contactOpen && (
        <div
          className="hdr-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeContact();
          }}
        >
          <div
            ref={contactDialogRef}
            className="hdr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #284181, #3a5bb8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(40,65,129,0.25)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h2
              id="contact-modal-title"
              style={{
                margin: "0 0 8px",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Get in Touch
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "0.9rem",
                color: "#6B7280",
                lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              For any queries please reach out to us at{" "}
              <a
                href="mailto:placeholder@microsave.net"
                style={{
                  color: "#284181",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                placeholder@microsave.net
              </a>
            </p>
            <button
              ref={contactCloseBtnRef}
              type="button"
              onClick={closeContact}
              style={{
                width: "100%",
                background: "#284181",
                color: "#fff",
                padding: "11px 0",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: "opacity 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
