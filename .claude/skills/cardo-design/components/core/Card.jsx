import React from "react";

/**
 * Paper surface card with soft radius and diffuse shadow.
 */
export function Card({ children, padding = 28, hover = false, style = {}, ...rest }) {
  const [raised, setRaised] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hover && setRaised(true)}
      onMouseLeave={() => hover && setRaised(false)}
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        boxShadow: raised ? "var(--shadow-md)" : "var(--shadow-sm)",
        padding,
        transition: "box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)",
        transform: raised ? "translateY(-3px)" : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
