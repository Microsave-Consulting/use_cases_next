"use client";
// src/components/MapPageClient.jsx
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UseCaseDotMap from "./UseCaseDotMap";
import UseCaseSectorPie from "@/widgets/UseCaseSectorPie";

const FONT =
  '"Albert Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function formatInt(n) {
  const x = Number(n || 0);
  return Number.isFinite(x) ? x.toLocaleString() : "0";
}

// ─── HackathonsCarousel ────────────────────────────────────────────────────────
function HackathonsCarousel({ items = [] }) {
  return (
    // full-bleed bg handled by parent section
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 var(--page-pad-x, 0px)",
        fontFamily: FONT,
      }}
    >
      {/* Head */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: FONT,
            color: "#0b0b0b",
          }}
        >
          Explore Hackathons
        </h2>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: 18,
            fontWeight: 400,
            fontFamily: FONT,
          }}
          lang="en"
        >
          Participate in global challenges and solve real-world problems.
        </p>
      </div>

      {/* Table card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          padding: "12px 16px",
          boxShadow: "0 6px 16px rgba(17,24,39,0.04)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: FONT,
          }}
          role="table"
          aria-label="Hackathons table"
        >
          <thead>
            <tr>
              {["Event Name", "Track", "Timeline", "Location", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 12px",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#284181",
                      background: "#f9fafb",
                      fontFamily: FONT,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "1rem", fontFamily: FONT }}>
                  No hackathons found.
                </td>
              </tr>
            )}
            {items.map((h) => (
              <tr key={h.id}>
                <td
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(17,24,39,0.04)",
                    verticalAlign: "middle",
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: FONT,
                  }}
                >
                  {h.name}
                </td>
                <td
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(17,24,39,0.04)",
                    verticalAlign: "middle",
                    fontSize: 18,
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                >
                  {h.track}
                </td>
                <td
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(17,24,39,0.04)",
                    verticalAlign: "middle",
                    fontSize: 18,
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                >
                  {h.timeline}
                </td>
                <td
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(17,24,39,0.04)",
                    verticalAlign: "middle",
                    fontSize: 18,
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                >
                  {h.location}
                </td>
                <td
                  style={{
                    padding: 12,
                    borderTop: "1px solid rgba(17,24,39,0.04)",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 18,
                      fontWeight: 400,
                      fontFamily: FONT,
                      background:
                        h.status === "LIVE"
                          ? "#EE8821"
                          : "rgba(99,102,241,0.12)",
                      color: h.status === "LIVE" ? "#fff" : "#374151",
                    }}
                  >
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TopSectorCard ─────────────────────────────────────────────────────────────
function TopSectorCard({ sector, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View use cases in ${sector.name}`}
      style={{
        textAlign: "left",
        background: "#F3F5FC",
        border: "1px solid rgba(17,24,39,0.06)",
        borderRadius: 10,
        padding: 12,
        boxShadow: hovered
          ? "0 12px 24px rgba(17,24,39,0.08)"
          : "0 8px 18px rgba(17,24,39,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 110,
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        fontFamily: FONT,
      }}
    >
      {/* Chip row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            background: "#EBF1FF",
            border: "1px dashed #BCCBEE",
            color: "#0b0b0b",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: 8,
            fontSize: 14,
            wordBreak: "break-word",
            fontFamily: FONT,
          }}
        >
          {sector.name}
        </span>
      </div>

      {/* Meta */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: "auto",
          justifyContent: "space-between",
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "#6b7280",
            fontSize: 18,
            fontWeight: 400,
            minWidth: 0,
            fontFamily: FONT,
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/folder_blue.svg`}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
            style={{ opacity: 0.9, flexShrink: 0 }}
          />
          <span>{formatInt(sector.useCases)} Use cases</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "#6b7280",
            fontSize: 18,
            fontWeight: 400,
            minWidth: 0,
            fontFamily: FONT,
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/loc_pin_blue.svg`}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
            style={{ opacity: 0.9, flexShrink: 0 }}
          />
          <span>{formatInt(sector.countries)} Countries</span>
        </div>
      </div>
    </button>
  );
}

// ─── ViewLibraryBtn ────────────────────────────────────────────────────────────
function ViewLibraryBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(238,136,33,0.21)" : "#ffffff",
        border: "1px solid #EE8821",
        padding: "6px 12px",
        fontWeight: 700,
        color: "#0b0b0b",
        cursor: "pointer",
        borderRadius: 999,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        flexShrink: 0,
        fontFamily: FONT,
        transition: "background 150ms ease",
      }}
    >
      View Library <span style={{ marginLeft: 8 }}>→</span>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MapPageClient({
  initialUseCases = [],
  initialHackathons = [],
}) {
  const router = useRouter();

  const stats = useMemo(() => {
    const sectorSet = new Set();
    const countrySet = new Set();
    for (const it of initialUseCases) {
      const sectorsRaw = it?.Sectors ?? it?.sectors ?? it?.Sector ?? it?.sector;
      const sectors = Array.isArray(sectorsRaw)
        ? sectorsRaw
        : splitValues(sectorsRaw);
      sectors
        .map((s) => String(s).trim())
        .filter(Boolean)
        .forEach((s) => sectorSet.add(s));
      const countryRaw =
        it?.countries ?? it?.Countries ?? it?.country ?? it?.Country;
      const countries = Array.isArray(countryRaw)
        ? countryRaw
        : splitValues(countryRaw);
      countries
        .map((c) => String(c).trim())
        .filter(Boolean)
        .forEach((c) => countrySet.add(c));
    }
    return {
      sectors: sectorSet.size,
      useCases: initialUseCases.length,
      countries: countrySet.size,
      hackathons: initialHackathons.length,
    };
  }, [initialUseCases, initialHackathons]);

  const topSectors = useMemo(() => {
    const sectorToUseCases = new Map();
    const sectorToCountries = new Map();
    for (const it of initialUseCases) {
      const sectorsRaw = it?.Sectors ?? it?.sectors ?? it?.Sector ?? it?.sector;
      const sectors = Array.isArray(sectorsRaw)
        ? sectorsRaw
        : splitValues(sectorsRaw);
      const sectorList = [
        ...new Set(sectors.map((s) => String(s).trim()).filter(Boolean)),
      ];
      if (!sectorList.length) continue;
      const countryRaw =
        it?.countries ?? it?.Countries ?? it?.country ?? it?.Country;
      const countries = (
        Array.isArray(countryRaw) ? countryRaw : splitValues(countryRaw)
      )
        .map((c) => String(c).trim())
        .filter(Boolean);
      for (const s of sectorList) {
        sectorToUseCases.set(s, (sectorToUseCases.get(s) || 0) + 1);
        if (!sectorToCountries.has(s)) sectorToCountries.set(s, new Set());
        for (const c of countries) sectorToCountries.get(s).add(c);
      }
    }
    const rows = [];
    for (const [name, useCases] of sectorToUseCases.entries()) {
      rows.push({
        name,
        useCases,
        countries: sectorToCountries.get(name)?.size || 0,
      });
    }
    return rows.sort((a, b) => b.useCases - a.useCases).slice(0, 3);
  }, [initialUseCases]);

  const STAT_ITEMS = [
    {
      icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/loc_pin_blue.svg`,
      value: `${formatInt(stats.countries)}+`,
      label: "COUNTRIES",
    },
    {
      icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/sectors_left.svg`,
      value: `${formatInt(stats.sectors)}+`,
      label: "SECTORS",
    },
    {
      icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/uc_left.svg`,
      value: formatInt(stats.useCases),
      label: "USE CASES",
    },
    {
      icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/folder_blue.svg`,
      value: formatInt(stats.hackathons),
      label: "HACKATHONS",
    },
  ];

  return (
    <>
      {/* Responsive rules — only what inline styles cannot express */}
      <style>{`
        .mp-below-inner {
          display: grid;
          grid-template-columns: minmax(0,560px) minmax(0,520px);
          gap: 2rem;
          align-items: start;
          justify-content: space-between;
        }
        .mp-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 1.25rem;
          max-width: 560px;
        }
        .mp-below-card {
          width: 100%; max-width: 520px;
          height: auto; min-height: 420px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid rgba(17,24,39,0.06);
          box-shadow: 0 12px 28px rgba(17,24,39,0.07);
          padding: 12px;
          display: flex; flex-direction: column;
          overflow: hidden; min-width: 0;
        }
        .mp-below-card > * { flex: 1 1 auto; min-height: 0; min-width: 0; }
        .mp-below-card svg, .mp-below-card canvas { display: block; width: 100% !important; height: auto !important; }
        @media (min-width: 981px) { .mp-below-card { aspect-ratio: 1/1; } }
        .mp-ts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }
        @media (max-width: 980px) {
          .mp-below-inner { grid-template-columns: 1fr; gap: 1.5rem; padding: 0 12px; justify-content: initial; }
          .mp-stats-grid { max-width: 100%; }
          .mp-below-card { max-width: 100%; min-height: 360px; aspect-ratio: auto; }
          .mp-ts-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .mp-hack-thead { display: none; }
          .mp-hack-td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
          .mp-hack-tr { display: block !important; margin-bottom: 16px; background: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid rgba(17,24,39,0.04); }
        }
        @media (max-width: 640px) {
          .mp-below-inner { gap: 1rem; padding: 0; }
          .mp-stats-grid { grid-template-columns: 1fr; gap: 0.75rem; max-width: 100%; }
          .mp-below-card { min-height: 300px; aspect-ratio: auto; }
          .mp-ts-grid { grid-template-columns: 1fr; gap: 0.75rem; }
        }
      `}</style>

      <div style={{ width: "100%", fontFamily: FONT }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 0 }}>
          {/* ── Map section ─────────────────────────────────────────────── */}
          <section
            aria-label="Use case map"
            style={{
              background: "#284181",
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: 0 }}>
              <UseCaseDotMap items={initialUseCases} />
            </div>
          </section>

          {/* ── Below-map section ───────────────────────────────────────── */}
          <section
            aria-label="Explore sectoral use cases"
            style={{
              background: "#eef2fc",
              padding: "3.1rem 1.25rem 3.2rem",
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <div
              className="mp-below-inner"
              style={{ maxWidth: 1200, margin: "0 auto" }}
            >
              {/* Left column */}
              <div style={{ minWidth: 0, paddingTop: "0.2rem", maxWidth: 560 }}>
                <h1
                  style={{
                    margin: "0 0 0.9rem",
                    fontSize: 32,
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: "#0b0b0b",
                    letterSpacing: "-0.015em",
                    fontFamily: FONT,
                  }}
                >
                  Explore Sectoral Digital ID Use Cases across Countries of the
                  World
                </h1>
                <p
                  style={{
                    margin: "0 0 1.6rem",
                    fontSize: 18,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    color: "#374151",
                    maxWidth: "62ch",
                    fontFamily: FONT,
                  }}
                  lang="en"
                >
                  Dive deep into our verified registry of Digital ID
                  implementations. Our data allows researchers and policymakers
                  to analyse adoption patterns, technological stacks, and
                  societal impact across diverse regulatory environments.
                </p>

                {/* Stats 2×2 grid */}
                <div
                  className="mp-stats-grid"
                  role="list"
                  aria-label="Summary statistics"
                >
                  {STAT_ITEMS.map((s) => (
                    <div
                      key={s.label}
                      role="listitem"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(17,24,39,0.06)",
                        borderRadius: 10,
                        boxShadow: "0 8px 18px rgba(17,24,39,0.06)",
                        padding: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          background: "rgba(37,99,235,0.08)",
                          border: "1px solid rgba(37,99,235,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        <img
                          src={s.icon}
                          alt=""
                          width={28}
                          height={28}
                          style={{ display: "block" }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 26,
                            lineHeight: 1,
                            fontWeight: 800,
                            color: "#1e3a8a",
                            margin: "0 0 6px",
                            fontFamily: FONT,
                          }}
                        >
                          {s.value}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            letterSpacing: "0.12em",
                            fontWeight: 700,
                            color: "#6b7280",
                            whiteSpace: "nowrap",
                            fontFamily: FONT,
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — pie chart card */}
              <div
                style={{
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <div className="mp-below-card" aria-label="Sector distribution">
                  <UseCaseSectorPie items={initialUseCases} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Top Sectors ─────────────────────────────────────────────── */}
          <section
            style={{
              marginTop: "2rem",
              marginBottom: "2rem",
              padding: "0 var(--page-pad-x, 0px)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Head row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontFamily: FONT,
                    color: "#0b0b0b",
                  }}
                >
                  Top Sectors
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "#374151",
                    fontSize: 18,
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                  lang="en"
                >
                  Explore award-winning projects and verified studies driving
                  global digital transformation.
                </p>
              </div>
              <ViewLibraryBtn onClick={() => router.push("/library")} />
            </div>

            {/* Sector cards grid */}
            <div className="mp-ts-grid">
              {topSectors.map((s) => (
                <TopSectorCard
                  key={s.name}
                  sector={s}
                  onClick={() =>
                    router.push(`/library?sector=${encodeURIComponent(s.name)}`)
                  }
                />
              ))}
            </div>
          </section>

          {/* ── Hackathons ───────────────────────────────────────────────── */}
          <section
            aria-label="Explore hackathons"
            style={{
              background: "#eef2fc",
              padding: "2.25rem 1.25rem",
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <HackathonsCarousel items={initialHackathons} />
          </section>
        </div>
      </div>
    </>
  );
}
