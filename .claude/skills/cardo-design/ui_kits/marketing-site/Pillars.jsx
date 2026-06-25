// Cardo marketing site — Stats bar + Pillars (the four differentiators)
const DS_p = window.CardoDesignSystem_9e0709;

const STATS = [
  { value: "2,000+", label: "5-star guest reviews" },
  { value: "Since 2013", label: "San Diego Superhost" },
  { value: "24/7", label: "Guest support" },
  { value: "In-house", label: "Design & cleaning" },
];

const PILLARS = [
  { title: "Marketing pros", body: "Pro photography, sharp listings, and dynamic pricing across every channel — your calendar run like the asset it is.", icon: "M5 13l4 4L19 7" },
  { title: "Transparent accounting", body: "A real-time dashboard and itemized monthly statements. Every dollar visible, no mystery fees.", icon: "M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3" },
  { title: "Care that never slips", body: "Inspected after every stay, vetted local vendors, sub-hour urgent response. Fixed before anyone notices.", icon: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" },
  { title: "In-house design", body: "Home Designs by Cardo styles your home to photograph beautifully and command higher nightly rates.", icon: "M3 21l3-9 9-9 6 6-9 9-9 3z" },
];

function StatsBar() {
  const { Stat } = DS_p;
  return (
    <section className="surface-ink" style={{ background: "var(--ink)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "44px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {STATS.map((s) => <Stat key={s.label} value={s.value} label={s.label} onDark align="center" />)}
      </div>
    </section>
  );
}
window.StatsBar = StatsBar;

function Pillars() {
  const { Card, Eyebrow } = DS_p;
  return (
    <section style={{ padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 620, marginBottom: 48 }}>
          <Eyebrow>Why owners switch to Cardo</Eyebrow>
          <h2 style={{ margin: "8px 0 0" }}>Four things we do better than anyone in San Diego.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {PILLARS.map((p) => (
            <Card key={p.title} hover>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", margin: "0 0 8px" }}>{p.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.98rem" }}>{p.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Pillars = Pillars;
