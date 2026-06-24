// Cardo marketing site — Header / nav
const DS_h = window.CardoDesignSystem_9e0709;

function Header({ onEstimate }) {
  const { Button } = DS_h;
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
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(248,243,236,0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all 0.3s var(--ease)",
      }}
    >
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src="../../assets/logo-horizontal-color.png" alt="Cardo Vacation Rentals" style={{ height: 38, width: "auto" }} />
        <nav style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {nav.map((n) => (
            <a key={n} href="#" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--ink-soft)" }}>{n}</a>
          ))}
          <Button variant="primary" size="sm" onClick={onEstimate}>Free estimate</Button>
        </nav>
      </div>
    </header>
  );
}
window.Header = Header;
