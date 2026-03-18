"use client";
// src/widgets/UseCaseSectorPie.jsx
import { useMemo, useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/navigation";

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toTitleCase(s) {
  const str = String(s || "").trim();
  if (!str) return "";
  const small = new Set([
    "to",
    "of",
    "and",
    "in",
    "on",
    "for",
    "a",
    "an",
    "the",
  ]);
  return str
    .split(/\s+/)
    .map((w, i) => {
      const lw = w.toLowerCase();
      if (i !== 0 && small.has(lw)) return lw;
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    })
    .join(" ");
}

function buildSectorDistribution(items, topN = 8) {
  const counts = new Map();
  (items || []).forEach((uc) => {
    const raw = uc?.Sectors ?? uc?.sectors ?? uc?.Sector ?? uc?.sector;
    splitValues(raw).forEach((sector) => {
      const key = String(sector || "").trim();
      if (!key) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  const rows = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  if (topN && rows.length > topN) {
    const head = rows.slice(0, topN);
    const tail = rows.slice(topN);
    const otherValue = tail.reduce((sum, r) => sum + r.value, 0);
    return [...head, { name: "Others", value: otherValue }];
  }
  return rows;
}

const COLORS = [
  "#284181",
  "#00BFDF",
  "#1F3A8A",
  "#F79433",
  "#5A5A5A",
  "#436AB3",
  "#E6E7E8",
  "#FDB913",
  "#6DCFF6",
];

const DONUT_SIZE_PX = 273;
const OUTER_RADIUS_PX = Math.floor(DONUT_SIZE_PX / 2);
const RING_THICKNESS_PX = 44;
const INNER_RADIUS_PX = OUTER_RADIUS_PX - RING_THICKNESS_PX;
const PADDING = 60;
const CHART_SIZE_PX = DONUT_SIZE_PX + PADDING * 2;

function makeInnerPercentLabel(minPercent = 0.05) {
  return function InnerPct(props) {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (typeof percent !== "number" || percent < minPercent) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.63;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: "#ffffff",
          fontSize: 12,
          fontWeight: 800,
          pointerEvents: "none",
        }}
      >
        {Math.round(percent * 100)}%
      </text>
    );
  };
}

function OverlayText({ cx, cy }) {
  return (
    <g aria-hidden="true">
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: 16,
          fontWeight: 500,
          fill: "#111827",
          pointerEvents: "none",
        }}
      >
        <tspan x={cx} y={cy - 10}>
          Distribution of Use
        </tspan>
        <tspan x={cx} y={cy + 10}>
          Cases by Sector
        </tspan>
      </text>
    </g>
  );
}

export default function UseCaseSectorPie({ items, topN = 8 }) {
  const router = useRouter();
  const boxRef = useRef(null);
  const popupRef = useRef(null);

  const rawData = useMemo(
    () => buildSectorDistribution(items, topN),
    [items, topN],
  );
  const data = useMemo(
    () =>
      rawData.map((d) => ({
        ...d,
        displayName: d.name === "Others" ? "Others" : toTitleCase(d.name),
      })),
    [rawData],
  );

  const [activeIdx, setActiveIdx] = useState(null);
  const [hoverPopup, setHoverPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
    alignLeft: false,
  });

  const activeEntry = typeof activeIdx === "number" ? data[activeIdx] : null;
  const activeColor =
    typeof activeIdx === "number" ? COLORS[activeIdx % COLORS.length] : null;
  const innerPercentLabel = useMemo(() => makeInnerPercentLabel(0.05), []);
  const legendItems = useMemo(
    () =>
      data.map((d, idx) => ({
        name: d.displayName,
        color: COLORS[idx % COLORS.length],
      })),
    [data],
  );

  function goToSector(sector) {
    if (!sector || sector === "Others") return;
    router.push(`/library?sector=${encodeURIComponent(sector)}`);
  }

  const cx = DONUT_SIZE_PX / 2 + PADDING;
  const cy = DONUT_SIZE_PX / 2 + PADDING;

  function handleCellMouseMove(e, idx, entry) {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const alignLeft = relX < rect.width / 2;
    const top = Math.max(8, Math.min(rect.height - 8, relY));
    setHoverPopup({
      visible: true,
      x: relX,
      y: top,
      text: entry.displayName,
      alignLeft,
    });
    setActiveIdx(idx);
  }

  function handleCellLeave() {
    setHoverPopup((s) => ({ ...s, visible: false }));
    setActiveIdx(null);
  }

  useEffect(() => {
    function onPointerDown(ev) {
      try {
        if (!boxRef.current || ev.__ucsp_handled) return;
        const rect = boxRef.current.getBoundingClientRect();
        const { clientX, clientY } = ev;
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        )
          return;
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;
        const dx = relX - cx,
          dy = relY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INNER_RADIUS_PX || dist > OUTER_RADIUS_PX) return;
        const deg = (360 + (-Math.atan2(dy, dx) * 180) / Math.PI) % 360;
        const total = data.reduce((s, d) => s + d.value, 0);
        let acc = 0,
          picked = null;
        for (let i = 0; i < data.length; i++) {
          const end = acc + (data[i].value / total) * 360;
          if (deg >= acc && deg < end) {
            picked = i;
            break;
          }
          acc = end;
        }
        if (picked !== null) {
          ev.__ucsp_handled = true;
          goToSector(data[picked].name);
        }
      } catch {
        /* swallow */
      }
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [data, cx, cy]);

  function handleDonutClick(e) {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left,
      relY = e.clientY - rect.top;
    const dx = relX - cx,
      dy = relY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < INNER_RADIUS_PX || dist > OUTER_RADIUS_PX) return;
    const deg = (360 + (-Math.atan2(dy, dx) * 180) / Math.PI) % 360;
    const total = data.reduce((s, d) => s + d.value, 0);
    let acc = 0,
      picked = null;
    for (let i = 0; i < data.length; i++) {
      const end = acc + (data[i].value / total) * 360;
      if (deg >= acc && deg < end) {
        picked = i;
        break;
      }
      acc = end;
    }
    if (picked !== null) goToSector(data[picked].name);
  }

  return (
    <>
      {/* Only the legend responsive rule needs a media query */}
      <style>{`
        .ucsp-legend-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 16px;
        }
        @media (max-width: 560px) {
          .ucsp-legend-grid { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>

      <section
        style={{ width: "100%", height: "100%" }}
        aria-label="Sector distribution donut chart"
      >
        {/* Shell */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Donut area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "6px 0",
              minHeight: 0,
            }}
          >
            <div
              ref={boxRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: CHART_SIZE_PX,
                height: CHART_SIZE_PX,
              }}
              onClickCapture={handleDonutClick}
              onClick={handleDonutClick}
            >
              <PieChart width={CHART_SIZE_PX} height={CHART_SIZE_PX}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="displayName"
                  cx={cx}
                  cy={cy}
                  innerRadius={INNER_RADIUS_PX}
                  outerRadius={OUTER_RADIUS_PX}
                  onClick={(d) => goToSector(d?.name || d?.displayName)}
                  paddingAngle={1}
                  labelLine={false}
                  label={innerPercentLabel}
                  isAnimationActive={false}
                >
                  {data.map((entry, idx) => (
                    <Cell
                      key={entry.displayName || idx}
                      fill={COLORS[idx % COLORS.length]}
                      style={{
                        pointerEvents: "auto",
                        cursor:
                          entry.displayName !== "Others"
                            ? "pointer"
                            : "default",
                      }}
                      onMouseEnter={(e) =>
                        handleCellMouseMove(e.nativeEvent || e, idx, entry)
                      }
                      onMouseMove={(e) =>
                        handleCellMouseMove(e.nativeEvent || e, idx, entry)
                      }
                      onMouseLeave={() => handleCellLeave()}
                      onClick={() => goToSector(entry.name)}
                    />
                  ))}
                </Pie>
                <OverlayText cx={cx} cy={cy} />
              </PieChart>

              {/* Hover popup */}
              {hoverPopup.visible && (
                <div
                  ref={popupRef}
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    background: "transparent",
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: "#111827",
                    textShadow: "0 0 6px rgba(255,255,255,0.95)",
                    left: hoverPopup.x,
                    top: hoverPopup.y,
                    transform: `translateX(${hoverPopup.alignLeft ? "calc(-100% - 8px)" : "8px"}) translateY(-50%)`,
                  }}
                >
                  {hoverPopup.text}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div
            className="ucsp-legend-grid"
            role="list"
            aria-label="Sectors legend"
            style={{
              margin: "6px auto 0",
              maxWidth: 520,
              padding: "0 6px 4px",
            }}
          >
            {legendItems.map((it, idx) => {
              const isActive =
                activeEntry?.displayName && it.name === activeEntry.displayName;
              return (
                <div
                  key={it.name}
                  role="listitem"
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      flexShrink: 0,
                      opacity: 0.95,
                      background: it.color,
                    }}
                  />
                  <span
                    title={it.name}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.2,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? activeColor : "#374151",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {it.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
