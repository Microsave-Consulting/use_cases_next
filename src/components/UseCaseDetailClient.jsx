"use client";
// src/components/UseCaseDetailClient.jsx
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FONT =
  '"Albert Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function splitMainAndTip(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return { main: "—", tip: null };
  const idx = raw.indexOf(";");
  if (idx === -1) return { main: raw, tip: null };
  return {
    main: raw.slice(0, idx).trim() || "—",
    tip: raw.slice(idx + 1).trim() || null,
  };
}

// ─── MetaItem ─────────────────────────────────────────────────────────────────
function MetaItem({ label, value, tooltipValue }) {
  const [tipVisible, setTipVisible] = useState(false);
  const { main, tip } = tooltipValue
    ? splitMainAndTip(tooltipValue)
    : { main: value ?? "—", tip: null };

  return (
    <div style={{ minWidth: 0, fontFamily: FONT }}>
      <div
        style={{
          fontSize: "0.7rem",
          lineHeight: 1.1,
          color: "#4b5563",
          fontWeight: 600,
          marginBottom: "0.15rem",
          whiteSpace: "nowrap",
        }}
      >
        {label}:
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          fontSize: "0.8rem",
          color: "#111",
          fontWeight: 700,
          minWidth: 0,
        }}
      >
        <span
          style={{
            minWidth: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {main || "—"}
        </span>
        {tip && (
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              marginLeft: "0.15rem",
            }}
            onMouseEnter={() => setTipVisible(true)}
            onMouseLeave={() => setTipVisible(false)}
          >
            <span
              role="img"
              aria-label={`More info about ${label}`}
              tabIndex={0}
              onFocus={() => setTipVisible(true)}
              onBlur={() => setTipVisible(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 999,
                fontSize: 11,
                lineHeight: 1,
                cursor: "help",
                userSelect: "none",
                opacity: 0.85,
              }}
            >
              ⓘ
            </span>
            {tipVisible && (
              <span
                role="tooltip"
                style={{
                  position: "absolute",
                  left: 0,
                  top: "calc(100% + 8px)",
                  minWidth: 220,
                  maxWidth: 360,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#111",
                  fontSize: 12,
                  lineHeight: 1.35,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  zIndex: 50,
                  fontFamily: FONT,
                }}
              >
                {tip}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Source pill ───────────────────────────────────────────────────────────────
function SourcePill({ title, url }) {
  const [hovered, setHovered] = useState(false);
  const isExternal = /^https?:\/\//i.test(String(url));
  return (
    <a
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      title={url}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        background: hovered ? "#ffffff" : "#F6F8FF",
        border: `1px dashed ${hovered ? "rgba(40,65,129,0.28)" : "#AFB7CD"}`,
        textDecoration: "none",
        color: "#1d4ed8",
        transition: "background 150ms ease, border-color 150ms ease",
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#284181",
          background: "rgba(40,65,129,0.08)",
          border: "1px solid rgba(40,65,129,0.16)",
          borderRadius: 6,
          flex: "0 0 auto",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 13a5 5 0 0 1 0-7l1.2-1.2a5 5 0 0 1 7 7L17 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14 11a5 5 0 0 1 0 7L12.8 19.2a5 5 0 1 1-7-7L7 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.25, color: "#1f3b8a" }}>
        {title}
      </span>
    </a>
  );
}

function normalizeUrl(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  return s;
}

function makeSourcesFromLinks(linksValue) {
  return splitValues(linksValue)
    .map((p) => {
      const url = normalizeUrl(p);
      if (!url) return null;
      let title = p;
      try {
        if (/^https?:\/\//i.test(url))
          title = new URL(url).hostname.replace(/^www\./i, "");
      } catch {
        /* leave as-is */
      }
      return { title, url };
    })
    .filter(Boolean);
}

function SourcesSection({ linksValue }) {
  const sources = useMemo(() => makeSourcesFromLinks(linksValue), [linksValue]);
  return (
    <section style={{ marginTop: "1.05rem" }}>
      <h2
        style={{
          margin: "0 0 0.6rem",
          fontSize: "1.05rem",
          fontWeight: 800,
          color: "#111",
          fontFamily: FONT,
        }}
      >
        Sources
      </h2>
      {sources.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
          }}
        >
          {sources.map((s, idx) => (
            <SourcePill key={`${s.url}-${idx}`} {...s} />
          ))}
        </div>
      ) : (
        <p style={{ color: "#666", margin: "0.25rem 0 0", fontFamily: FONT }}>
          No sources
        </p>
      )}
    </section>
  );
}

// ─── Back button ───────────────────────────────────────────────────────────────
function BackButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        border: "none",
        background: hovered ? "rgba(40,65,129,0.1)" : "#eef2fc",
        color: "#111",
        padding: "0.5rem 0.85rem",
        borderRadius: 8,
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT,
        transition: "background 150ms ease",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          padding: 0,
          borderRadius: 6,
          background: "transparent",
          color: "#152A61",
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        ←
      </span>
      <span>Back</span>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function UseCaseDetailClient({ useCase }) {
  const router = useRouter();

  if (!useCase) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1.1rem 1rem 2.25rem",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          fontFamily: FONT,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#111",
          }}
        >
          Use case not found
        </h2>
        <p style={{ margin: 0, color: "#666" }}>
          The link may be broken, or the item was removed.
        </p>
        <Link
          href="/library"
          style={{
            display: "inline-block",
            padding: "0.6rem 0.85rem",
            borderRadius: 10,
            textDecoration: "none",
            background: "#1e3a8a",
            color: "#fff",
            fontWeight: 700,
            fontFamily: FONT,
          }}
        >
          Back to Use Case Library
        </Link>
      </div>
    );
  }

  const title = useCase.Title || "Use case";
  const description = useCase.Remarks || "";
  const region = useCase.Region || "—";
  const subregion = useCase.Subregion || "";
  const country = useCase.Country || "—";
  const accessibility = useCase.Accessibility || useCase.ModeOfAccess || "—";
  const ialRaw = useCase.IdentityAssuranceLevel;
  const aalRaw = useCase.AuthenticationAssuranceLevel;
  const regionText = `${region}${subregion ? `; ${subregion}` : ""}`;
  const keyTerms = splitValues(useCase.KeyTerms);
  const linksValue = useCase.Links;

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/library");
  };

  // content column — shared by all sections
  const col = {
    maxWidth: 980,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <>
      {/* Responsive overrides — only what inline styles can't express */}
      <style>{`
        @media (max-width: 980px) {
          .ucd-meta-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 560px) {
          .ucd-page-wrap { padding: 0.9rem 0.85rem 2rem !important; }
          .ucd-meta-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="ucd-page-wrap"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0.85rem 1rem 2.25rem",
          fontFamily: FONT,
        }}
      >
        {/* Back */}
        <div
          style={{
            ...col,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "0.85rem",
          }}
        >
          <BackButton onClick={handleBack} />
        </div>

        {/* Header */}
        <header style={{ ...col }}>
          <h1
            style={{
              margin: "0 0 0.6rem",
              color: "#111",
              fontSize: 32,
              lineHeight: 1.2,
              fontWeight: 700,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              fontFamily: FONT,
            }}
          >
            {title}
          </h1>

          {description ? (
            <div>
              {String(description)
                .split(/\n\s*\n/)
                .map((p, idx) => (
                  <p
                    key={idx}
                    style={{
                      margin: "30px 0",
                      color: "#222",
                      lineHeight: 1.2,
                      fontSize: 18,
                      fontWeight: 400,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                      overflowWrap: "anywhere",
                      fontFamily: FONT,
                    }}
                  >
                    {p.trim()}
                  </p>
                ))}
            </div>
          ) : (
            <p
              style={{ color: "#666", margin: "0.25rem 0 0", fontFamily: FONT }}
            >
              No description available.
            </p>
          )}

          {/* Meta strip */}
          <div
            className="ucd-meta-strip"
            role="group"
            aria-label="Use case metadata"
            style={{
              marginTop: "0.9rem",
              background: "#eef2fc",
              borderRadius: 8,
              padding: "0.75rem 0.9rem",
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "0.9rem",
              border: "1px solid rgba(17,24,39,0.08)",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <MetaItem label="Region" value={regionText} />
            <MetaItem label="Country" value={country} />
            <MetaItem label="Accessibility" value={accessibility} />
            <MetaItem
              label="Authentication Assurance Level"
              tooltipValue={aalRaw}
            />
            <MetaItem label="Identity Assurance Level" tooltipValue={ialRaw} />
          </div>
        </header>

        {/* Body */}
        <main style={{ ...col, paddingTop: "0.95rem" }}>
          {/* Key terms */}
          <section style={{ marginTop: "1.05rem" }}>
            <h2
              style={{
                margin: "0 0 0.6rem",
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#111",
                fontFamily: FONT,
              }}
            >
              Key terms
            </h2>
            {keyTerms.length ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                {keyTerms.map((t) => (
                  <span
                    key={t}
                    style={{
                      border: "1px dashed #000",
                      borderRadius: 12,
                      padding: "0.45rem 0.75rem",
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#111",
                      background: "#fff",
                      overflowWrap: "anywhere",
                      fontFamily: FONT,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "#666",
                  margin: "0.25rem 0 0",
                  fontFamily: FONT,
                }}
              >
                No key terms listed.
              </p>
            )}
          </section>

          <SourcesSection linksValue={linksValue} />
        </main>
      </div>
    </>
  );
}
