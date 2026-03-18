"use client";
// src/components/UseCaseDotMap.jsx
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
const ALL_SECTORS = "__ALL_SECTORS__";
const NO_COUNTRY = "";

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function getSectorsFromItem(it) {
  const raw = it?.Sectors ?? it?.sectors ?? it?.Sector ?? it?.sector;
  if (Array.isArray(raw))
    return raw.map((s) => String(s).trim()).filter(Boolean);
  return splitValues(raw);
}

function getCountriesFromItem(it) {
  const raw =
    it?.countries ??
    it?.Countries ??
    it?.country ??
    it?.Country ??
    it?.country_covered ??
    it?.countryCovered ??
    it?.country_name;
  if (Array.isArray(raw))
    return raw.map((c) => String(c).trim()).filter(Boolean);
  return splitValues(raw);
}

function flagUrlFromIso2(iso2) {
  if (!iso2) return null;
  return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
}

function safeUpperLabel(label) {
  const t = String(label || "").toUpperCase();
  return t.length > 22 ? `${t.slice(0, 22)}…` : t;
}

export default function UseCaseDotMap({ items }) {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState(ALL_SECTORS);
  const [selectedCountry, setSelectedCountry] = useState(NO_COUNTRY);
  const isSectorSelected = selectedSector !== ALL_SECTORS;
  const [hover, setHover] = useState(null);

  const hideTimerRef = useRef(null);
  const scheduleHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setHover(null), 120);
  };
  const cancelHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  };

  const MAP_W = 1200;
  const MAP_H = 520;
  const PROJ_CFG = { scale: 190, center: [0, 12] };
  const TIP_W = 200;
  const TIP_H = 64;
  const TIP_HALF = TIP_W / 2;

  const hoverFill = "rgba(76,98,152,0.51)";
  const hoverGlow = "drop-shadow(0 0 10px rgba(76,98,152,0.51))";

  const baseGeoStyle = {
    default: {
      outline: "none",
      transition: "fill 160ms ease, filter 160ms ease, opacity 160ms ease",
    },
    hover: { outline: "none" },
    pressed: { outline: "none" },
  };

  const filteredItems = useMemo(() => {
    if (!items?.length) return [];
    if (!isSectorSelected) return items;
    return items.filter((it) =>
      getSectorsFromItem(it).includes(selectedSector),
    );
  }, [items, isSectorSelected, selectedSector]);

  const { countsByIso2, labelByIso2 } = useMemo(() => {
    const counts = {},
      labels = {};
    (filteredItems || []).forEach((row) => {
      getCountriesFromItem(row).forEach((name) => {
        const iso2 = countries.getAlpha2Code(name, "en");
        if (!iso2) return;
        const code = iso2.toUpperCase();
        counts[code] = (counts[code] || 0) + 1;
        if (!labels[code]) labels[code] = name;
      });
    });
    return { countsByIso2: counts, labelByIso2: labels };
  }, [filteredItems]);

  function goToLibraryForCountry(countryLabel) {
    if (!countryLabel) return;
    const params = new URLSearchParams();
    params.set("country", countryLabel);
    if (isSectorSelected) params.set("sector", selectedSector);
    router.push(`/library?${params.toString()}`);
  }

  return (
    // .ucdm-wrap
    <div style={{ width: "100%" }}>
      {/* .ucdm-card.ucdm-card--map */}
      <div
        style={{
          width: "100%",
          background: "#284181",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <ComposableMap
          projection="geoEquirectangular"
          projectionConfig={PROJ_CFG}
          width={MAP_W}
          height={MAP_H}
          // .ucdm-map
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            background: "#284181",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              const wanted = new Set(Object.keys(countsByIso2));
              const centroidsByIso2 = {};

              geographies.forEach((geo) => {
                const p = geo.properties || {};
                const geoName = p.name || p.NAME || p.ADMIN || "Unknown";
                let iso2 = (p.ISO_A2 || p.iso_a2 || p.ISO2 || "").toUpperCase();
                if (!iso2 && geoName !== "Unknown") {
                  const resolved = countries.getAlpha2Code(geoName, "en");
                  if (resolved) iso2 = resolved.toUpperCase();
                }
                if (!iso2 || !wanted.has(iso2)) return;
                const c = geoCentroid(geo);
                if (
                  Array.isArray(c) &&
                  !Number.isNaN(c[0]) &&
                  !Number.isNaN(c[1])
                ) {
                  centroidsByIso2[iso2] = c;
                }
              });

              return (
                <>
                  {geographies.map((geo) => {
                    const p = geo.properties || {};
                    const geoName = p.name || p.NAME || p.ADMIN || "Unknown";
                    let iso2 = (
                      p.ISO_A2 ||
                      p.iso_a2 ||
                      p.ISO2 ||
                      ""
                    ).toUpperCase();
                    if (!iso2 && geoName !== "Unknown") {
                      const resolved = countries.getAlpha2Code(geoName, "en");
                      if (resolved) iso2 = resolved.toUpperCase();
                    }
                    const value = iso2 ? countsByIso2[iso2] || 0 : 0;
                    const hasData = Boolean(iso2 && value > 0);
                    const isHovered = Boolean(
                      hover?.iso2 && iso2 && hover.iso2 === iso2,
                    );

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHovered ? hoverFill : "transparent"}
                        stroke="rgba(193,201,221,0.70)"
                        strokeWidth={0.85}
                        strokeDasharray="2,3"
                        filter={isHovered ? hoverGlow : "none"}
                        tabIndex={-1}
                        aria-hidden="true"
                        onMouseEnter={() => {
                          if (!hasData) return;
                          cancelHide();
                          const label = labelByIso2[iso2] || geoName;
                          const coords =
                            centroidsByIso2[iso2] || geoCentroid(geo);
                          if (!coords) return;
                          setHover({ iso2, label, value, coords });
                        }}
                        onMouseLeave={() => {
                          if (hasData) scheduleHide();
                        }}
                        onClick={() => {
                          if (hasData)
                            goToLibraryForCountry(labelByIso2[iso2] || geoName);
                        }}
                        style={{
                          default: {
                            outline: "none",
                            cursor: hasData ? "pointer" : "default",
                            transition:
                              "fill 160ms ease, filter 160ms ease, opacity 160ms ease",
                          },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })}

                  {Object.keys(countsByIso2).map((iso2) => {
                    const coords = centroidsByIso2[iso2];
                    if (!coords) return null;
                    const value = countsByIso2[iso2] || 0;
                    const label = labelByIso2[iso2] || iso2;
                    return (
                      <Marker
                        key={iso2}
                        coordinates={coords}
                        onMouseEnter={() => {
                          cancelHide();
                          setHover({ iso2, label, value, coords });
                        }}
                        onMouseLeave={scheduleHide}
                        onClick={() => goToLibraryForCountry(label)}
                      >
                        {/* .ucdm-dot */}
                        <g aria-hidden="true">
                          {/* .ucdm-dot-outer — fill forced inline to beat any global rules */}
                          <circle r={3.5} style={{ fill: "#c1c9dd" }} />
                          {/* .ucdm-dot-inner */}
                          <circle r={2.5} style={{ fill: "#19e65e" }} />
                        </g>
                      </Marker>
                    );
                  })}

                  {hover?.coords && (
                    <Marker coordinates={hover.coords}>
                      {/* .ucdm-bubble-hit */}
                      <g
                        onMouseEnter={cancelHide}
                        onMouseLeave={scheduleHide}
                        onClick={() => goToLibraryForCountry(hover.label)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            goToLibraryForCountry(hover.label);
                        }}
                        aria-label={`View use cases for ${hover.label}`}
                        style={{ cursor: "pointer" }}
                      >
                        {/* .ucdm-dot--front — pointer-events none */}
                        <g aria-hidden="true" style={{ pointerEvents: "none" }}>
                          <circle r={3.5} style={{ fill: "#c1c9dd" }} />
                          <circle r={2.5} style={{ fill: "#19e65e" }} />
                        </g>

                        {/* Bubble tooltip */}
                        <g
                          transform={`translate(${-TIP_HALF}, ${-(TIP_H + 18)})`}
                        >
                          {/* .ucdm-bubble-card */}
                          <rect
                            x="0"
                            y="0"
                            rx="12"
                            ry="12"
                            width={TIP_W}
                            height={TIP_H}
                            style={{
                              fill: "#ffffff",
                              stroke: "rgba(0,0,0,0.08)",
                              strokeWidth: 1,
                              filter:
                                "drop-shadow(0 14px 28px rgba(0,0,0,0.18))",
                            }}
                          />

                          {/* flag */}
                          <image
                            href={flagUrlFromIso2(hover.iso2)}
                            x="12"
                            y="12"
                            width="22"
                            height="16"
                            preserveAspectRatio="xMidYMid slice"
                          />

                          {/* .ucdm-bubble-country */}
                          <text
                            x="42"
                            y="25"
                            style={{
                              fontFamily:
                                'system-ui,-apple-system,"Segoe UI",sans-serif',
                              fontWeight: 800,
                              fontSize: 14,
                              fill: "#0b0b0b",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {safeUpperLabel(hover.label)}
                          </text>

                          {/* .ucdm-bubble-uses */}
                          <text
                            x="12"
                            y="48"
                            style={{
                              fontFamily:
                                'system-ui,-apple-system,"Segoe UI",sans-serif',
                              fontSize: 14,
                              fill: "#111827",
                            }}
                          >
                            {/* .ucdm-bubble-uses-label */}
                            <tspan style={{ fontWeight: 500, fill: "#111827" }}>
                              Use Cases:{" "}
                            </tspan>
                            {/* .ucdm-bubble-uses-value */}
                            <tspan style={{ fontWeight: 800, fill: "#111827" }}>
                              {hover.value}
                            </tspan>
                          </text>

                          {/* .ucdm-bubble-tip — pointer triangle */}
                          <path
                            d={`M ${TIP_HALF - 12} ${TIP_H} L ${TIP_HALF} ${TIP_H + 14} L ${TIP_HALF + 12} ${TIP_H} Z`}
                            style={{
                              fill: "#ffffff",
                              stroke: "rgba(0,0,0,0.08)",
                              strokeWidth: 1,
                            }}
                          />
                        </g>
                      </g>
                    </Marker>
                  )}
                </>
              );
            }}
          </Geographies>
        </ComposableMap>

        {/* Filters — kept but hidden (.ucdm-filters { display: none }) */}
        <div
          style={{
            display: "none",
            gap: "0.75rem",
            padding: "0.9rem 1rem 1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 220 }}>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              aria-label="Filter by sector"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 700,
                padding: "0 0.85rem",
                outline: "none",
              }}
            >
              <option value={ALL_SECTORS}>All Sectors</option>
            </select>
          </div>
          <div style={{ minWidth: 220 }}>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              aria-label="Filter by country"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 700,
                padding: "0 0.85rem",
                outline: "none",
              }}
            >
              <option value={NO_COUNTRY}>Country</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
