import React from "react";

/**
 * Photo tile with the brand's gradient fallback + dark scrim, an optional
 * corner meta pill and a display-serif caption. Pass `img` for real photography.
 */
export function PhotoTile({ img, tag, meta, ratio = "4 / 3", phA = "#1b3a52", phB = "#2c6e6b", style = {}, children, ...rest }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        aspectRatio: ratio,
        color: "#fff",
        isolation: "isolate",
        background: `radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,0.18), transparent 50%), linear-gradient(135deg, ${phA}, ${phB})`,
        ...style,
      }}
      {...rest}
    >
      {img && (
        <img src={img} alt={tag || ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(8,18,28,0.66))", zIndex: 1 }} />
      {meta && (
        <span style={{ position: "absolute", right: 16, top: 16, zIndex: 2, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.16)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "var(--radius-pill)" }}>{meta}</span>
      )}
      {tag && (
        <span style={{ position: "absolute", left: 18, bottom: 16, zIndex: 2, fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>{tag}</span>
      )}
      {children}
    </div>
  );
}
