import React from "react";

/**
 * Small label chip. `tone` sets the color treatment.
 */
export function Badge({ children, tone = "neutral", style = {}, ...rest }) {
  const tones = {
    neutral: { background: "var(--cream-2)", color: "var(--ink-soft)", border: "1px solid var(--line)" },
    rose: { background: "var(--accent-soft)", color: "var(--rose-deep)", border: "1px solid transparent" },
    gold: { background: "rgba(193,154,91,0.16)", color: "var(--gold-deep)", border: "1px solid transparent" },
    sea: { background: "rgba(31,111,107,0.14)", color: "var(--sea)", border: "1px solid transparent" },
    ink: { background: "var(--ink)", color: "#fff", border: "1px solid transparent" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: "0.74rem",
        letterSpacing: "0.04em",
        padding: "5px 12px",
        borderRadius: "var(--radius-pill)",
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
