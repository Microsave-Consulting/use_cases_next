"use client";
// src/components/UseCaseLibrary.jsx
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import populationData from "country-json/src/country-by-population.json";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

// ─── pill palette per index ────────────────────────────────────────────────────
const PILL_STYLES = [
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
  {
    bg: "#EEF2FC",
    border: "#ABB5D0",
    selBg: "#EEF2FC",
    selBorder: "#ABB5D0",
    selColor: "#284181",
  },
];

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function toAbsAssetUrl(maybeRelativeUrl) {
  if (!maybeRelativeUrl) return null;
  const s = String(maybeRelativeUrl).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^data:/i.test(s)) return s;
  return "/" + s.replace(/^\//, "");
}

const POPULATION_MAP = (() => {
  const map = new Map();
  populationData.forEach((row) => {
    if (!row || !row.country) return;
    map.set(String(row.country).toLowerCase(), Number(row.population));
  });
  return map;
})();

const COUNTRY_ALIASES = { rawanda: "rwanda" };

function normalizeCountryName(name) {
  if (!name) return null;
  const trimmed = name.trim();
  const key = trimmed.toLowerCase();
  if (COUNTRY_ALIASES[key]) return COUNTRY_ALIASES[key];
  return trimmed;
}

function normalizeCountryLabelForMatch(label) {
  if (!label) return "";
  let s = String(label).trim().toLowerCase();
  s = s.replace(/[^a-z0-9\s]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function normalizeLabelForMatch(label) {
  if (!label) return "";
  let s = String(label).trim().toLowerCase();
  s = s.replace(/[^a-z0-9\s]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

// ─── FilterBubble ──────────────────────────────────────────────────────────────
function FilterBubble({
  id,
  label,
  options,
  selectedValues,
  onChange,
  pillIndex,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pill = PILL_STYLES[pillIndex % PILL_STYLES.length];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = selectedValues || [];
  const hasSelection = selected.length > 0;

  const toggleValue = (value) => {
    if (!value) return;
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  };

  const pillText = hasSelection ? selected[0] : label;
  const showCount = selected.length > 1;

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`ucl-dropdown-${id}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.55rem",
          borderRadius: 999,
          padding: "0.35rem 0.75rem",
          fontSize: "0.75rem",
          cursor: "pointer",
          whiteSpace: "nowrap",
          border: `1px solid ${hasSelection ? pill.selBorder : pill.border}`,
          background: hasSelection ? pill.selBg : pill.bg,
          color: hasSelection ? pill.selColor : "#797979",
          fontWeight: 500,
          fontFamily: '"Albert Sans", system-ui, sans-serif',
          transition: "filter 120ms ease",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          {showCount && (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 600,
                color: "#284181",
                background: "#ffffff",
                border: "1px solid #ABB5D0",
              }}
            >
              {selected.length}
            </span>
          )}
          <span style={{ fontWeight: 500 }}>{pillText}</span>
        </span>
        <span style={{ opacity: 0.9, fontSize: "0.7rem" }} aria-hidden="true">
          ▼
        </span>
      </button>

      {open && (
        <div
          id={`ucl-dropdown-${id}`}
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 30,
            minWidth: 240,
            maxHeight: 260,
            overflowY: "auto",
            background: "#fff",
            borderRadius: "0.75rem",
            border: `1px solid ${pill.border}`,
            boxShadow: "0 10px 26px rgba(0,0,0,0.14)",
            padding: "0.4rem",
          }}
        >
          {(!options || options.length === 0) && (
            <div
              style={{
                fontSize: "0.82rem",
                color: "#666",
                padding: "0.25rem 0.4rem",
              }}
            >
              No options
            </div>
          )}
          {(options || []).map((value) => {
            const active = selected.includes(value);
            return (
              <div
                key={value}
                onClick={() => toggleValue(value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleValue(value);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.3rem 0.45rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  background: active ? pill.bg : "transparent",
                  transition: "background 100ms ease",
                  fontFamily: '"Albert Sans", system-ui, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${pill.selBorder}`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#1f2a44",
                    background: active ? pill.selBg : "transparent",
                    flexShrink: 0,
                  }}
                >
                  {active ? "✓" : ""}
                </span>
                <span style={{ flex: 1 }}>{value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── UseCaseCard ───────────────────────────────────────────────────────────────
function UseCaseCard({ uc, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const sectors = splitValues(uc.Sectors);
  const primarySector = sectors[0] || "—";
  const countriesList = splitValues(uc.Country);
  const primaryCountry = countriesList[0] || uc.Country || "—";
  const maturityValue = uc.MaturityLevel || "—";
  const description = uc.Remarks || uc.Summary || uc.Description || "";

  const handleOpen = () => {
    if (typeof onOpen === "function") onOpen(uc);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open details for ${uc.Title || "use case"}`}
      style={{
        borderRadius: 12,
        border: "1px solid #e5e9f3",
        background: "#fff",
        padding: "0.9rem 0.75rem",
        display: "grid",
        gridTemplateRows: "28px 64px 56px 48px 1px auto",
        gap: 8,
        alignItems: "start",
        boxShadow: hovered
          ? "0 10px 22px rgba(0,0,0,0.12)"
          : "0 4px 10px rgba(0,0,0,0.04)",
        cursor: "pointer",
        transition: "box-shadow 200ms ease",
        outline: "none",
        fontFamily: '"Albert Sans", system-ui, sans-serif',
      }}
    >
      {/* Country badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#345096",
          color: "#fff",
          padding: "8px 10px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 1,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          alignSelf: "start",
          justifySelf: "start",
          gridRow: 1,
          fontFamily: '"Albert Sans", system-ui, sans-serif',
        }}
      >
        {String(primaryCountry).toUpperCase()}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#000",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          gridRow: 2,
          paddingTop: 2,
          maxHeight: 64,
        }}
      >
        {uc.Title || "Untitled use case"}
      </div>

      {/* Description */}
      <div
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 400,
          color: "#000",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          gridRow: 3,
          paddingRight: 8,
          maxHeight: 80,
        }}
      >
        {description}
      </div>

      {/* Maturity pill */}
      <div
        style={{
          margin: 0,
          display: "flex",
          alignItems: "center",
          gridRow: 4,
          paddingTop: 14,
          justifySelf: "start",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #A4A4A4",
            background: "#fff",
            fontWeight: 600,
            fontSize: "0.78rem",
            color: "#575757",
          }}
        >
          Maturity Level: {maturityValue}
        </span>
      </div>

      {/* Separator */}
      <div style={{ borderBottom: "1px dashed #CCDBFF", gridRow: 5 }} />

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gridRow: 6,
          paddingTop: 22,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            color: "#2a4aa6",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.78rem",
          }}
        >
          {primarySector}
        </div>
        <div style={{ color: "#2a4aa6", fontWeight: 700, fontSize: "1rem" }}>
          →
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function UseCaseLibrary({
  initialData = [],
  filterConfig = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rawItems] = useState(initialData);
  const [filters, setFilters] = useState(() => {
    const init = {};
    filterConfig.forEach((f) => {
      if (f && f.id) init[f.id] = [];
    });
    return init;
  });
  const [search, setSearch] = useState("");

  const useCases = useMemo(() => rawItems || [], [rawItems]);

  const filterOptions = useMemo(() => {
    if (!filterConfig.length) return {};
    const map = {};
    filterConfig.forEach((f) => {
      map[f.id] = new Set();
    });

    useCases.forEach((uc) => {
      filterConfig.forEach((f) => {
        if (!f || !f.id) return;
        if (f.usesSubregion) {
          const r = uc.Region || "";
          const s = uc.Subregion || "";
          const combined = r && s ? `${r} — ${s}` : r || s;
          if (combined) map[f.id].add(combined);
          return;
        }
        const raw = uc[f.field];
        if (!raw) return;
        const isAssuranceField =
          f.field === "IdentityAssuranceLevel" ||
          f.field === "AuthenticationAssuranceLevel";
        if (f.multiValue) {
          splitValues(raw).forEach((v) => {
            const cleaned =
              isAssuranceField && v.includes(";") ? v.split(";")[0].trim() : v;
            map[f.id].add(cleaned);
          });
        } else {
          const cleaned =
            isAssuranceField && raw.includes(";")
              ? raw.split(";")[0].trim()
              : raw;
          map[f.id].add(cleaned);
        }
      });
    });

    const final = {};
    Object.keys(map).forEach((id) => {
      final[id] = Array.from(map[id]).sort((a, b) =>
        String(a).localeCompare(String(b)),
      );
    });
    return final;
  }, [useCases, filterConfig]);

  useEffect(() => {
    if (!filterConfig.length) return;
    const countryParam = searchParams.get("country");
    if (countryParam) {
      const countryFilter = filterConfig.find((f) => f.id === "country");
      if (countryFilter) {
        const optionsForCountry = filterOptions[countryFilter.id] || [];
        const targetNorm = normalizeCountryLabelForMatch(countryParam);
        const match =
          optionsForCountry.find(
            (opt) => normalizeCountryLabelForMatch(opt) === targetNorm,
          ) || null;
        if (match)
          setFilters((prev) => ({ ...prev, [countryFilter.id]: [match] }));
      }
    }
    const sectorParam = searchParams.get("sector");
    if (sectorParam) {
      const sectorFilter = filterConfig.find((f) => f.id === "sector");
      if (sectorFilter) {
        const optionsForSector = filterOptions[sectorFilter.id] || [];
        const wanted = splitValues(sectorParam);
        const matches = wanted
          .map((w) => {
            const wNorm = normalizeLabelForMatch(w);
            return (
              optionsForSector.find(
                (opt) => normalizeLabelForMatch(opt) === wNorm,
              ) || null
            );
          })
          .filter(Boolean);
        if (matches.length)
          setFilters((prev) => ({ ...prev, [sectorFilter.id]: matches }));
      }
    }
    const maturityParam = searchParams.get("maturity");
    if (maturityParam) {
      const maturityFilter = filterConfig.find((f) => f.id === "maturity");
      if (maturityFilter) {
        const optionsForMaturity = filterOptions[maturityFilter.id] || [];
        const targetNorm = normalizeLabelForMatch(maturityParam);
        const match =
          optionsForMaturity.find(
            (opt) => normalizeLabelForMatch(opt) === targetNorm,
          ) || null;
        if (match)
          setFilters((prev) => ({ ...prev, [maturityFilter.id]: [match] }));
      }
    }
  }, [filterConfig, filterOptions, searchParams]);

  const updateFilter = (id, values) =>
    setFilters((prev) => ({ ...prev, [id]: values }));

  const clearAll = () => {
    const cleared = {};
    filterConfig.forEach((f) => {
      if (f && f.id) cleared[f.id] = [];
    });
    setFilters(cleared);
    setSearch("");
  };

  const openUseCase = (uc) => {
    const caseId = uc?.ID ?? uc?.Id;
    if (!caseId) return;
    router.push(`/use-cases/${caseId}`);
  };

  const filtered = useMemo(() => {
    if (!filterConfig.length) return useCases;
    return useCases.filter((uc) => {
      if (search.trim()) {
        const haystack = [
          uc.Title,
          uc.Country,
          uc.Sectors,
          uc.KeyTerms,
          uc.Remarks,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return filterConfig.every((f) => {
        if (!f || !f.id) return true;
        const selected = filters[f.id];
        if (!selected || selected.length === 0) return true;
        if (f.usesSubregion) {
          const r = uc.Region || "";
          const s = uc.Subregion || "";
          const combined = r && s ? `${r} — ${s}` : r || s;
          return selected.includes(combined);
        }
        const raw = uc[f.field];
        if (!raw) return false;
        const isAssuranceField =
          f.field === "IdentityAssuranceLevel" ||
          f.field === "AuthenticationAssuranceLevel";
        const values = f.multiValue ? splitValues(raw) : [raw];
        const cleanedValues = isAssuranceField
          ? values.map((v) => (v.includes(";") ? v.split(";")[0].trim() : v))
          : values;
        return selected.some((v) => cleanedValues.includes(v));
      });
    });
  }, [useCases, search, filters, filterConfig]);

  return (
    <div
      style={{
        width: "min(1120px, calc(100% - 112px))",
        margin: "0 auto",
        padding: "1.25rem 0 2.25rem",
        background: "#ffffff",
        fontFamily: '"Albert Sans", system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "0.85rem" }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            fontFamily: '"Albert Sans", system-ui, sans-serif',
          }}
        >
          Explore World's Use Cases Repository
        </h1>
      </header>

      {/* Search + Filters */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        {/* Search bar */}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#fff",
              color: "#24304a",
              borderRadius: 12,
              padding: "0.6rem 0.9rem",
              border: "1px solid rgba(17,24,39,0.06)",
              width: "min(760px, 100%)",
              boxShadow:
                "0px 1px 1px 0px #0000000A, 0px 2px 10.4px 0px #FFDB5870",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{
                  stroke: "#EE8821",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.65 16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search use Cases"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#1f2a44",
                padding: "0.45rem 0",
                fontSize: "0.95rem",
                outline: "none",
                fontFamily: '"Albert Sans", system-ui, sans-serif',
              }}
            />
            <button
              type="button"
              aria-label="Search"
              style={{
                border: "none",
                borderRadius: 8,
                padding: "0.45rem 0.9rem",
                background: "#EEF2FC",
                color: "#284181",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: '"Albert Sans", system-ui, sans-serif',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters row */}
        {filterConfig.length > 0 && (
          <div
            style={{
              width: "min(760px, 100%)",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              columnGap: "0.9rem",
              alignItems: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
                width: "100%",
              }}
            >
              {filterConfig.map((f, index) => (
                <Fragment key={f.id}>
                  <FilterBubble
                    id={f.id}
                    label={f.label}
                    options={filterOptions[f.id] || []}
                    selectedValues={filters[f.id] || []}
                    onChange={(vals) => updateFilter(f.id, vals)}
                    pillIndex={index}
                  />
                  {index === 3 && (
                    <span
                      style={{
                        flexBasis: "100%",
                        height: 0,
                        padding: 0,
                        margin: 0,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </Fragment>
              ))}
            </div>
            <button
              type="button"
              onClick={clearAll}
              style={{
                borderRadius: 999,
                padding: "0.38rem 0.9rem",
                fontSize: "0.78rem",
                background: "#284181",
                color: "#fff",
                border: "1px solid #1f2c57",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: '"Albert Sans", system-ui, sans-serif',
              }}
            >
              Clear all{" "}
              <span style={{ fontSize: "1rem", lineHeight: 1, opacity: 0.95 }}>
                ×
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Results count */}
      <div
        style={{
          fontSize: "0.85rem",
          color: "#444",
          margin: "0.2rem 0 0.75rem",
          fontFamily: '"Albert Sans", system-ui, sans-serif',
        }}
      >
        Showing {filtered.length} of {useCases.length} use cases
      </div>

      {/* Cards or empty state */}
      {filtered.length === 0 ? (
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#555",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <p>No use cases match your search and filters.</p>
          <button
            onClick={clearAll}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: 999,
              border: "none",
              background: "#26436b",
              color: "#fff",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontFamily: '"Albert Sans", system-ui, sans-serif',
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section
          style={{
            background: "#eef5fb",
            borderRadius: 14,
            padding: "1rem 1rem 1.25rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(240px, 1fr))",
              gap: "0.9rem",
            }}
          >
            {filtered.map((uc, idx) => (
              <UseCaseCard
                key={uc.ID ?? uc.Id ?? idx}
                uc={uc}
                onOpen={openUseCase}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
