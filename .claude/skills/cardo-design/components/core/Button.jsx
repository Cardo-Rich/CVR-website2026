import React from "react";

/**
 * Cardo pill button. Maps to the brand's .btn system.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  as = "button",
  iconStart,
  iconEnd,
  className = "",
  style = {},
  ...rest
}) {
  const variants = {
    primary: { background: "var(--rose)", color: "#fff", border: "1px solid transparent", boxShadow: "var(--shadow-accent)" },
    ink: { background: "var(--ink)", color: "#fff", border: "1px solid transparent", boxShadow: "0 8px 22px rgba(16,34,52,0.22)" },
    ghost: { background: "transparent", color: "var(--ink)", border: "1px solid var(--line-strong)", boxShadow: "none" },
    "ghost-light": { background: "transparent", color: "#fff", border: "1px solid var(--line-light)", boxShadow: "none" },
  };
  const sizes = {
    md: { padding: "16px 28px", fontSize: "1rem" },
    lg: { padding: "19px 36px", fontSize: "1.08rem" },
    sm: { padding: "11px 20px", fontSize: "0.9rem" },
  };
  const Tag = as;
  return (
    <Tag
      className={className}
      style={{
        display: block ? "flex" : "inline-flex",
        width: block ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        transition: "transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {iconStart}
      {children}
      {iconEnd}
    </Tag>
  );
}
