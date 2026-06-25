import React from "react";

/**
 * Uppercase overline with a brass rule — the brand's section kicker.
 */
export function Eyebrow({ children, center = false, style = {}, ...rest }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: "0.78rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--rose)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: center ? "center" : undefined,
        gap: 10,
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 26, height: 1, background: "var(--gold)", display: "inline-block" }} />
      {children}
    </span>
  );
}
