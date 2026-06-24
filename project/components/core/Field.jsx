import React from "react";

/**
 * Labeled form control — input, textarea, or select.
 */
export function Field({ label, as = "input", id, options = [], style = {}, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const control = {
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    padding: "13px 15px",
    border: `1px solid ${focused ? "var(--rose)" : "var(--line-strong)"}`,
    borderRadius: "12px",
    background: "#fff",
    color: "var(--ink)",
    boxShadow: focused ? "0 0 0 3px var(--accent-soft)" : "none",
    outline: "none",
    transition: "border-color 0.15s var(--ease), box-shadow 0.15s var(--ease)",
    width: "100%",
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16, ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-soft)" }}>
          {label}
        </label>
      )}
      {as === "textarea" ? (
        <textarea id={fieldId} rows={4} style={control} onFocus={onFocus} onBlur={onBlur} {...rest} />
      ) : as === "select" ? (
        <select id={fieldId} style={control} onFocus={onFocus} onBlur={onBlur} {...rest}>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      ) : (
        <input id={fieldId} style={control} onFocus={onFocus} onBlur={onBlur} {...rest} />
      )}
    </div>
  );
}
