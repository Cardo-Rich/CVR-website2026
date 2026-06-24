// Cardo marketing site — Hero with booking search widget
const DS_hero = window.CardoDesignSystem_9e0709;

function BookingWidget() {
  const [guests, setGuests] = React.useState(2);
  return (
    <div style={{
      background: "var(--paper)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
      padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end",
      maxWidth: 720,
    }}>
      <Lbl title="Check in"><input type="date" style={fieldCss} defaultValue="2026-07-10" /></Lbl>
      <Lbl title="Check out"><input type="date" style={fieldCss} defaultValue="2026-07-15" /></Lbl>
      <Lbl title="Guests">
        <select style={fieldCss} value={guests} onChange={(e) => setGuests(e.target.value)}>
          {[1,2,3,4,5,6,8].map((n) => <option key={n} value={n}>{n} guest{n>1?"s":""}</option>)}
        </select>
      </Lbl>
      <button className="btn" style={{ height: 48, padding: "0 22px" }}>Search</button>
    </div>
  );
}
const fieldCss = { fontFamily: "var(--font-body)", fontSize: "0.95rem", padding: "12px 12px", border: "1px solid var(--line-strong)", borderRadius: 10, background: "#fff", color: "var(--ink)", width: "100%", outline: "none" };
function Lbl({ title, children }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>{title}{children}</label>;
}

function Hero({ onEstimate }) {
  const { Button, Eyebrow } = DS_hero;
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(16,34,52,0.82) 0%, rgba(16,34,52,0.55) 48%, rgba(16,34,52,0.18) 100%)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "var(--container)", margin: "0 auto", padding: "120px 24px 64px" }}>
        <div style={{ maxWidth: 680 }}>
          <Eyebrow><span style={{ color: "var(--cream)" }}>San Diego · Since 2013</span></Eyebrow>
          <h1 style={{ color: "#fff", fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)", margin: "10px 0 18px" }}>Your home, run like the asset it is.</h1>
          <p style={{ color: "rgba(248,243,236,0.9)", fontSize: "1.28rem", lineHeight: 1.55, maxWidth: 560, marginBottom: 30 }}>
            San Diego's design-led vacation rental manager — a 5-star Superhost with 2,000+ reviews. Pro marketing, transparent accounting, and care that never lets your home slip.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
            <Button variant="primary" size="lg" onClick={onEstimate}>Get my free estimate</Button>
            <Button variant="ghost-light" size="lg">See how it works</Button>
          </div>
        </div>
        <BookingWidget />
      </div>
    </section>
  );
}
window.Hero = Hero;
