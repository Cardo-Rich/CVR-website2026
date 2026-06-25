import React from "react";

/**
 * Big-number stat block. Display value over a small uppercase label.
 */
export function Stat({ value, label, align = "left", onDark = false, style = {}, ...rest }) {
  return (
    <div style={{ textAlign: align, ...style }} {...rest}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(2rem, 3.4vw, 2.9rem)",
          lineHeight: 1.0,
          letterSpacing: "-0.015em",
          color: onDark ? "#fff" : "var(--ink)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: onDark ? "rgba(248,243,236,0.7)" : "var(--muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
