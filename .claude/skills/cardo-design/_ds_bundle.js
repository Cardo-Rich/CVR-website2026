/* @ds-bundle: {"format":3,"namespace":"CardoDesignSystem_9e0709","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"PhotoTile","sourcePath":"components/core/PhotoTile.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"4e4890222774","components/core/Button.jsx":"20e67f0fd245","components/core/Card.jsx":"9039c535c08e","components/core/Eyebrow.jsx":"f57ebd56d859","components/core/Field.jsx":"0134f214b42c","components/core/PhotoTile.jsx":"9a51b8b97f8b","components/core/Stat.jsx":"6a1980ede948","ui_kits/marketing-site/CaseStudies.jsx":"f242457ba018","ui_kits/marketing-site/Footer.jsx":"534f2d3250a0","ui_kits/marketing-site/Header.jsx":"1ccd66347867","ui_kits/marketing-site/Hero.jsx":"1f020741b444","ui_kits/marketing-site/Neighborhoods.jsx":"391cebad028d","ui_kits/marketing-site/Pillars.jsx":"775b6b7f92a0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CardoDesignSystem_9e0709 = window.CardoDesignSystem_9e0709 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small label chip. `tone` sets the color treatment.
 */
function Badge({
  children,
  tone = "neutral",
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      background: "var(--cream-2)",
      color: "var(--ink-soft)",
      border: "1px solid var(--line)"
    },
    rose: {
      background: "var(--accent-soft)",
      color: "var(--rose-deep)",
      border: "1px solid transparent"
    },
    gold: {
      background: "rgba(193,154,91,0.16)",
      color: "var(--gold-deep)",
      border: "1px solid transparent"
    },
    sea: {
      background: "rgba(31,111,107,0.14)",
      color: "var(--sea)",
      border: "1px solid transparent"
    },
    ink: {
      background: "var(--ink)",
      color: "#fff",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Cardo pill button. Maps to the brand's .btn system.
 */
function Button({
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
    primary: {
      background: "var(--rose)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-accent)"
    },
    ink: {
      background: "var(--ink)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "0 8px 22px rgba(16,34,52,0.22)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--line-strong)",
      boxShadow: "none"
    },
    "ghost-light": {
      background: "transparent",
      color: "#fff",
      border: "1px solid var(--line-light)",
      boxShadow: "none"
    }
  };
  const sizes = {
    md: {
      padding: "16px 28px",
      fontSize: "1rem"
    },
    lg: {
      padding: "19px 36px",
      fontSize: "1.08rem"
    },
    sm: {
      padding: "11px 20px",
      fontSize: "0.9rem"
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: className,
    style: {
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
      ...style
    }
  }, rest), iconStart, children, iconEnd);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Paper surface card with soft radius and diffuse shadow.
 */
function Card({
  children,
  padding = 28,
  hover = false,
  style = {},
  ...rest
}) {
  const [raised, setRaised] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hover && setRaised(true),
    onMouseLeave: () => hover && setRaised(false),
    style: {
      background: "var(--paper)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: raised ? "var(--shadow-md)" : "var(--shadow-sm)",
      padding,
      transition: "box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)",
      transform: raised ? "translateY(-3px)" : "none",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Uppercase overline with a brass rule — the brand's section kicker.
 */
function Eyebrow({
  children,
  center = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 1,
      background: "var(--gold)",
      display: "inline-block"
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Labeled form control — input, textarea, or select.
 */
function Field({
  label,
  as = "input",
  id,
  options = [],
  style = {},
  ...rest
}) {
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
    width: "100%"
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginBottom: 16,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--ink-soft)"
    }
  }, label), as === "textarea" ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    rows: 4,
    style: control,
    onFocus: onFocus,
    onBlur: onBlur
  }, rest)) : as === "select" ? /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    style: control,
    onFocus: onFocus,
    onBlur: onBlur
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))) : /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    style: control,
    onFocus: onFocus,
    onBlur: onBlur
  }, rest)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/core/PhotoTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Photo tile with the brand's gradient fallback + dark scrim, an optional
 * corner meta pill and a display-serif caption. Pass `img` for real photography.
 */
function PhotoTile({
  img,
  tag,
  meta,
  ratio = "4 / 3",
  phA = "#1b3a52",
  phB = "#2c6e6b",
  style = {},
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      aspectRatio: ratio,
      color: "#fff",
      isolation: "isolate",
      background: `radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,0.18), transparent 50%), linear-gradient(135deg, ${phA}, ${phB})`,
      ...style
    }
  }, rest), img && /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: tag || "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, transparent 35%, rgba(8,18,28,0.66))",
      zIndex: 1
    }
  }), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 16,
      top: 16,
      zIndex: 2,
      fontSize: "0.72rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: "rgba(255,255,255,0.16)",
      backdropFilter: "blur(4px)",
      padding: "6px 12px",
      borderRadius: "var(--radius-pill)"
    }
  }, meta), tag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 18,
      bottom: 16,
      zIndex: 2,
      fontFamily: "var(--font-display)",
      fontSize: "1.15rem"
    }
  }, tag), children);
}
Object.assign(__ds_scope, { PhotoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PhotoTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Big-number stat block. Display value over a small uppercase label.
 */
function Stat({
  value,
  label,
  align = "left",
  onDark = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: "clamp(2rem, 3.4vw, 2.9rem)",
      lineHeight: 1.0,
      letterSpacing: "-0.015em",
      color: onDark ? "#fff" : "var(--ink)"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: "0.8rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: onDark ? "rgba(248,243,236,0.7)" : "var(--muted)"
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/CaseStudies.jsx
try { (() => {
// Cardo marketing site — Case studies (performance) + decor gallery
const DS_cs = window.CardoDesignSystem_9e0709;
const CASES = [{
  home: "La Jolla Bluff Villa",
  neighborhood: "La Jolla",
  gross: "$214,800",
  lift: "+57% over market",
  beds: "4 BR",
  img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
}, {
  home: "Cardiff Surf House",
  neighborhood: "Encinitas",
  gross: "$168,300",
  lift: "+41% over market",
  beds: "3 BR",
  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
}, {
  home: "Del Mar Retreat",
  neighborhood: "Del Mar",
  gross: "$192,500",
  lift: "+48% over market",
  beds: "4 BR",
  img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
}];
function CaseStudies() {
  const {
    Eyebrow,
    Badge
  } = DS_cs;
  return /*#__PURE__*/React.createElement("section", {
    className: "surface-cream2",
    style: {
      background: "var(--cream-2)",
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Real results"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0"
    }
  }, "Homes that perform above their market.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, CASES.map(c => /*#__PURE__*/React.createElement("article", {
    key: c.home,
    style: {
      background: "var(--paper)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--line)",
      boxShadow: "var(--shadow-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${c.img}?auto=format&fit=crop&w=900&q=80`,
    alt: c.home,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 14,
      right: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ink"
  }, c.beds))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.78rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: 6
    }
  }, c.neighborhood), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "1.3rem",
      margin: "0 0 16px"
    }
  }, c.home), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingTop: 14,
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.7rem",
      color: "var(--ink)",
      lineHeight: 1
    }
  }, c.gross), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.78rem",
      color: "var(--muted)",
      marginTop: 4
    }
  }, "annual gross")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sea)",
      fontWeight: 600,
      fontSize: "0.9rem"
    }
  }, c.lift))))))));
}
window.CaseStudies = CaseStudies;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/CaseStudies.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Footer.jsx
try { (() => {
// Cardo marketing site — Testimonials + Lead/estimate form + Footer
const DS_f = window.CardoDesignSystem_9e0709;
const TESTIMONIALS = [{
  quote: "Switched from a national manager and my net was up double digits in the first quarter. The statements are so clear I stopped second-guessing.",
  name: "Marcus T.",
  home: "Oceanfront condo, Pacific Beach"
}, {
  quote: "Their design team restyled the whole house before launch and the photos are unreal. Booked 26 nights the first month at a rate I didn't think was possible.",
  name: "Priya & Sam",
  home: "Hillside home, La Jolla"
}, {
  quote: "A pipe let go at 11pm. Someone was there within the hour and I found out after it was fixed. That's why I sleep at night.",
  name: "Diane R.",
  home: "Beach cottage, Encinitas"
}];
function Testimonials() {
  const {
    Eyebrow
  } = DS_f;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Owners on the record"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0"
    }
  }, "Trusted with San Diego's best homes.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, TESTIMONIALS.map(t => /*#__PURE__*/React.createElement("figure", {
    key: t.name,
    style: {
      margin: 0,
      background: "var(--paper)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      padding: 28,
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--gold)",
      fontSize: "1rem",
      letterSpacing: 2,
      marginBottom: 16
    }
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "1.18rem",
      lineHeight: 1.45,
      color: "var(--ink)",
      flex: 1
    }
  }, "\"", t.quote, "\""), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 20,
      paddingTop: 18,
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      color: "var(--muted)"
    }
  }, t.home)))))));
}
window.Testimonials = Testimonials;
function LeadForm({
  innerRef
}) {
  const {
    Eyebrow,
    Field,
    Button
  } = DS_f;
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    ref: innerRef,
    className: "surface-ink",
    style: {
      background: "var(--ink)",
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-narrow)",
      margin: "0 auto",
      padding: "0 24px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cream)"
    }
  }, "No obligation")), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#fff",
      margin: "8px 0 16px"
    }
  }, "Get your home's revenue estimate."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(248,243,236,0.82)",
      fontSize: "1.1rem",
      lineHeight: 1.6
    }
  }, "Send your home's details and we'll return a data-backed projection for your San Diego market \u2014 typically within one business day.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      borderRadius: "var(--radius-lg)",
      padding: 30,
      boxShadow: "var(--shadow-lg)"
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "var(--accent-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 18px"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--rose)",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 8px"
    }
  }, "Estimate on the way"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: 0
    }
  }, "We'll email your projection within one business day.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    placeholder: "Jane Owner",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Phone",
    type: "tel",
    placeholder: "619-555-0100"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    placeholder: "jane@email.com",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Neighborhood",
    as: "select",
    options: ["La Jolla", "Pacific Beach", "Mission Beach", "Del Mar", "Encinitas", "Carlsbad", "Coronado", "Other San Diego"]
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    type: "submit",
    style: {
      marginTop: 6
    }
  }, "Get my free estimate")))));
}
window.LeadForm = LeadForm;
function Footer() {
  const cols = [{
    h: "Company",
    links: ["For Owners", "Home Designs by Cardo", "Neighborhoods", "Blog"]
  }, {
    h: "Markets",
    links: ["La Jolla", "Pacific Beach", "Del Mar", "Encinitas", "Coronado"]
  }, {
    h: "Guests",
    links: ["Book a Stay", "Guest support", "Areas we serve"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "#0B1825",
      color: "rgba(248,243,236,0.7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "64px 24px 40px",
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-horizontal-white-color.png",
    alt: "Cardo",
    style: {
      height: 40,
      width: "auto",
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.92rem",
      lineHeight: 1.6,
      maxWidth: 260
    }
  }, "Luxury short-term rental management in San Diego. 5-star Superhost since 2013."), /*#__PURE__*/React.createElement("a", {
    href: "tel:+16197195282",
    style: {
      color: "#fff",
      fontWeight: 600,
      fontSize: "1.1rem",
      display: "inline-block",
      marginTop: 10
    }
  }, "619-719-5282")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.78rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--gold)",
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: "0.92rem",
      color: "rgba(248,243,236,0.7)"
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,0.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "20px 24px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.82rem",
      flexWrap: "wrap",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Cardo Vacation Rentals \xB7 cardorentals.com"), /*#__PURE__*/React.createElement("span", null, "STRO compliant \xB7 DRE licensed"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Header.jsx
try { (() => {
// Cardo marketing site — Header / nav
const DS_h = window.CardoDesignSystem_9e0709;
function Header({
  onEstimate
}) {
  const {
    Button
  } = DS_h;
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector("[data-scroll]") || window;
    const onScroll = () => {
      const y = el === window ? window.scrollY : el.scrollTop;
      setScrolled(y > 12);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const nav = ["For Owners", "Design", "Neighborhoods", "Blog"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: scrolled ? "rgba(248,243,236,0.86)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all 0.3s var(--ease)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-horizontal-color.png",
    alt: "Cardo Vacation Rentals",
    style: {
      height: 38,
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 30
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    style: {
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "var(--ink-soft)"
    }
  }, n)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onEstimate
  }, "Free estimate"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Hero.jsx
try { (() => {
// Cardo marketing site — Hero with booking search widget
const DS_hero = window.CardoDesignSystem_9e0709;
function BookingWidget() {
  const [guests, setGuests] = React.useState(2);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      padding: 14,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr auto",
      gap: 10,
      alignItems: "end",
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    title: "Check in"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: fieldCss,
    defaultValue: "2026-07-10"
  })), /*#__PURE__*/React.createElement(Lbl, {
    title: "Check out"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: fieldCss,
    defaultValue: "2026-07-15"
  })), /*#__PURE__*/React.createElement(Lbl, {
    title: "Guests"
  }, /*#__PURE__*/React.createElement("select", {
    style: fieldCss,
    value: guests,
    onChange: e => setGuests(e.target.value)
  }, [1, 2, 3, 4, 5, 6, 8].map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n, " guest", n > 1 ? "s" : "")))), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      height: 48,
      padding: "0 22px"
    }
  }, "Search"));
}
const fieldCss = {
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  padding: "12px 12px",
  border: "1px solid var(--line-strong)",
  borderRadius: 10,
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
  outline: "none"
};
function Lbl({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontSize: "0.74rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, title, children);
}
function Hero({
  onEstimate
}) {
  const {
    Button,
    Eyebrow
  } = DS_hero;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(100deg, rgba(16,34,52,0.82) 0%, rgba(16,34,52,0.55) 48%, rgba(16,34,52,0.18) 100%)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "120px 24px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cream)"
    }
  }, "San Diego \xB7 Since 2013")), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#fff",
      fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
      margin: "10px 0 18px"
    }
  }, "Your home, run like the asset it is."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(248,243,236,0.9)",
      fontSize: "1.28rem",
      lineHeight: 1.55,
      maxWidth: 560,
      marginBottom: 30
    }
  }, "San Diego's design-led vacation rental manager \u2014 a 5-star Superhost with 2,000+ reviews. Pro marketing, transparent accounting, and care that never lets your home slip."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onEstimate
  }, "Get my free estimate"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost-light",
    size: "lg"
  }, "See how it works"))), /*#__PURE__*/React.createElement(BookingWidget, null)));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Neighborhoods.jsx
try { (() => {
// Cardo marketing site — Neighborhoods + FAQ accordion
const DS_n = window.CardoDesignSystem_9e0709;
const HOODS = [{
  name: "La Jolla",
  note: "Bluff-top luxury & coastal estates",
  img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
}, {
  name: "Pacific Beach",
  note: "Walkable, high-occupancy favorites",
  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
}, {
  name: "Del Mar",
  note: "Racetrack-season premium homes",
  img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
}, {
  name: "Encinitas",
  note: "Surf-town charm, strong year-round",
  img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
}, {
  name: "Coronado",
  note: "Island prestige & event demand",
  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
}, {
  name: "Carlsbad",
  note: "Family coastal & North County demand",
  img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
}];
function Neighborhoods() {
  const {
    Eyebrow
  } = DS_n;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Where we manage"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0"
    }
  }, "Local experts across coastal San Diego.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20
    }
  }, HOODS.map(h => /*#__PURE__*/React.createElement("a", {
    key: h.name,
    href: "#",
    style: {
      position: "relative",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      aspectRatio: "3 / 2",
      display: "block",
      isolation: "isolate"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${h.img}?auto=format&fit=crop&w=800&q=80`,
    alt: h.name,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s var(--ease)"
    },
    onMouseEnter: e => e.currentTarget.style.transform = "scale(1.06)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, transparent 40%, rgba(8,18,28,0.78))",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 20,
      bottom: 18,
      zIndex: 2,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem"
    }
  }, h.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      color: "rgba(255,255,255,0.82)",
      marginTop: 2
    }
  }, h.note)))))));
}
window.Neighborhoods = Neighborhoods;
const FAQS = [{
  q: "What does Cardo charge?",
  a: "A straightforward management percentage of booking revenue — no setup fees, no charge until your home is earning. We quote it exactly in your free property analysis."
}, {
  q: "How fast can my home go live?",
  a: "Most homes launch within a few weeks: onboarding and permitting, in-house design and photography, listing build-out, and pricing setup before your first guest."
}, {
  q: "Will I still control my calendar?",
  a: "Always. Block owner stays anytime from your dashboard. It's your home — we keep it performing when you're not using it."
}, {
  q: "Do you handle San Diego STR permits and TOT?",
  a: "Yes — STRO licensing, compliance reporting, and transient occupancy tax filings so your home stays fully compliant."
}, {
  q: "How do I see my numbers?",
  a: "A real-time owner dashboard plus itemized monthly statements. Every booking, payout, and expense, whenever you want it."
}];
function FAQ() {
  const {
    Eyebrow
  } = DS_n;
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "surface-cream2",
    style: {
      background: "var(--cream-2)",
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-narrow)",
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    center: true
  }, "Questions, answered"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0"
    }
  }, "The owner FAQ.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, FAQS.map((f, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: f.q,
      style: {
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        padding: "20px 24px",
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-display)",
        fontSize: "1.15rem",
        color: "var(--ink)"
      }
    }, f.q, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--rose)",
        fontSize: "1.4rem",
        transform: isOpen ? "rotate(45deg)" : "none",
        transition: "transform 0.25s var(--ease)",
        lineHeight: 1
      }
    }, "+")), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 200 : 0,
        overflow: "hidden",
        transition: "max-height 0.3s var(--ease)"
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0,
        padding: "0 24px 22px",
        fontSize: "0.98rem"
      }
    }, f.a)));
  }))));
}
window.FAQ = FAQ;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Neighborhoods.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Pillars.jsx
try { (() => {
// Cardo marketing site — Stats bar + Pillars (the four differentiators)
const DS_p = window.CardoDesignSystem_9e0709;
const STATS = [{
  value: "2,000+",
  label: "5-star guest reviews"
}, {
  value: "Since 2013",
  label: "San Diego Superhost"
}, {
  value: "24/7",
  label: "Guest support"
}, {
  value: "In-house",
  label: "Design & cleaning"
}];
const PILLARS = [{
  title: "Marketing pros",
  body: "Pro photography, sharp listings, and dynamic pricing across every channel — your calendar run like the asset it is.",
  icon: "M5 13l4 4L19 7"
}, {
  title: "Transparent accounting",
  body: "A real-time dashboard and itemized monthly statements. Every dollar visible, no mystery fees.",
  icon: "M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3"
}, {
  title: "Care that never slips",
  body: "Inspected after every stay, vetted local vendors, sub-hour urgent response. Fixed before anyone notices.",
  icon: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"
}, {
  title: "In-house design",
  body: "Home Designs by Cardo styles your home to photograph beautifully and command higher nightly rates.",
  icon: "M3 21l3-9 9-9 6 6-9 9-9 3z"
}];
function StatsBar() {
  const {
    Stat
  } = DS_p;
  return /*#__PURE__*/React.createElement("section", {
    className: "surface-ink",
    style: {
      background: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "44px 24px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 24
    }
  }, STATS.map(s => /*#__PURE__*/React.createElement(Stat, {
    key: s.label,
    value: s.value,
    label: s.label,
    onDark: true,
    align: "center"
  }))));
}
window.StatsBar = StatsBar;
function Pillars() {
  const {
    Card,
    Eyebrow
  } = DS_p;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "clamp(64px,9vw,120px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Why owners switch to Cardo"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0"
    }
  }, "Four things we do better than anyone in San Diego.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 24
    }
  }, PILLARS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.title,
    hover: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "var(--accent-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--rose)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: p.icon
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "1.25rem",
      margin: "0 0 8px"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: 0,
      fontSize: "0.98rem"
    }
  }, p.body))))));
}
window.Pillars = Pillars;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Pillars.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.PhotoTile = __ds_scope.PhotoTile;

__ds_ns.Stat = __ds_scope.Stat;

})();
