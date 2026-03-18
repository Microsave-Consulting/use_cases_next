"use client";
// src/components/Footer.jsx
import Link from "next/link";
import { useRef, useState } from "react";

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const contactDialogRef = useRef(null);
  const contactCloseBtnRef = useRef(null);
  const lastActiveElRef = useRef(null);

  const openContact = () => {
    lastActiveElRef.current = document.activeElement;
    setContactOpen(true);
    setTimeout(() => contactCloseBtnRef.current?.focus?.(), 0);
  };

  const closeContact = () => {
    setContactOpen(false);
    setTimeout(() => lastActiveElRef.current?.focus?.(), 0);
  };

  return (
    <>
      {/* ===== FOOTER ===== */}
      <footer
        className="bg-[#284181] text-white"
        style={{ fontFamily: "'Albert Sans', system-ui, sans-serif" }}
      >
        {/* 4-column grid — matches original 1.8fr 1fr 1fr 1fr */}
        <div
          className="max-w-[1200px] mx-auto px-4"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: "20px",
            alignItems: "start",
            padding: "28px 16px",
          }}
        >
          {/* Brand */}
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/msc-logo.svg`}
              alt="MSC"
              style={{
                height: 30,
                width: "auto",
                display: "block",
                marginBottom: 12,
              }}
            />
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                maxWidth: 320,
                lineHeight: 1.6,
              }}
            >
              MSC (MicroSave Consulting) is a global consulting firm that
              enables social, financial, and economic inclusion for everyone in
              the digital age.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a href="#" aria-label="LinkedIn">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/li_white.svg`}
                  alt="LinkedIn"
                  style={{ width: 28, height: 28 }}
                />
              </a>
              <a href="#" aria-label="X">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/x_white.svg`}
                  alt="X"
                  style={{ width: 28, height: 28 }}
                />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
              }}
            >
              PLATFORM
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <Link
                  href="/library"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                  className="hover:underline"
                >
                  Library
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                  className="hover:underline"
                >
                  Hackathons
                </a>
              </li>
            </ul>
          </div>

          {/* Partner with us */}
          <div>
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
              }}
            >
              Partner with us
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <button
                  type="button"
                  onClick={openContact}
                  className="hover:underline"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "inherit",
                    fontSize: 16,
                    fontWeight: 400,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Send your Query
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
              }}
            >
              LEGAL
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                  className="hover:underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                  className="hover:underline"
                >
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "12px 0 28px",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4">
            <p
              style={{
                margin: 0,
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            >
              © 2026 Microsave Consulting &nbsp; All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== CONTACT MODAL — original logic restored ===== */}
      {contactOpen && (
        <div
          className="contact-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeContact();
          }}
        >
          <div
            className="contact-modal"
            ref={contactDialogRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="contact-modal-title">Contact Us</h2>
            <p>
              For any queries please contact{" "}
              <a href="mailto:placeholder@microsave.net">
                placeholder@microsave.net
              </a>
            </p>
            <button
              type="button"
              className="contact-modal-close"
              onClick={closeContact}
              ref={contactCloseBtnRef}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
