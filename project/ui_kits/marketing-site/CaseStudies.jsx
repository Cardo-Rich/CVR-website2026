// Cardo marketing site — Case studies (performance) + decor gallery
const DS_cs = window.CardoDesignSystem_9e0709;

const CASES = [
  { home: "La Jolla Bluff Villa", neighborhood: "La Jolla", gross: "$214,800", lift: "+57% over market", beds: "4 BR", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811" },
  { home: "Cardiff Surf House", neighborhood: "Encinitas", gross: "$168,300", lift: "+41% over market", beds: "3 BR", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
  { home: "Del Mar Retreat", neighborhood: "Del Mar", gross: "$192,500", lift: "+48% over market", beds: "4 BR", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
];

function CaseStudies() {
  const { Eyebrow, Badge } = DS_cs;
  return (
    <section className="surface-cream2" style={{ background: "var(--cream-2)", padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 620, marginBottom: 48 }}>
          <Eyebrow>Real results</Eyebrow>
          <h2 style={{ margin: "8px 0 0" }}>Homes that perform above their market.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {CASES.map((c) => (
            <article key={c.home} style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
                <img src={`${c.img}?auto=format&fit=crop&w=900&q=80`} alt={c.home} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 14, right: 14 }}><Badge tone="ink">{c.beds}</Badge></span>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>{c.neighborhood}</div>
                <h3 style={{ fontSize: "1.3rem", margin: "0 0 16px" }}>{c.home}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--ink)", lineHeight: 1 }}>{c.gross}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 4 }}>annual gross</div>
                  </div>
                  <span style={{ color: "var(--sea)", fontWeight: 600, fontSize: "0.9rem" }}>{c.lift}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
window.CaseStudies = CaseStudies;
