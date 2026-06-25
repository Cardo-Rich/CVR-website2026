// Cardo marketing site — Neighborhoods + FAQ accordion
const DS_n = window.CardoDesignSystem_9e0709;

const HOODS = [
  { name: "La Jolla", note: "Bluff-top luxury & coastal estates", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811" },
  { name: "Pacific Beach", note: "Walkable, high-occupancy favorites", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
  { name: "Del Mar", note: "Racetrack-season premium homes", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
  { name: "Encinitas", note: "Surf-town charm, strong year-round", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
  { name: "Coronado", note: "Island prestige & event demand", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750" },
  { name: "Carlsbad", note: "Family coastal & North County demand", img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" },
];

function Neighborhoods() {
  const { Eyebrow } = DS_n;
  return (
    <section style={{ padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 620, marginBottom: 48 }}>
          <Eyebrow>Where we manage</Eyebrow>
          <h2 style={{ margin: "8px 0 0" }}>Local experts across coastal San Diego.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {HOODS.map((h) => (
            <a key={h.name} href="#" style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "3 / 2", display: "block", isolation: "isolate" }}>
              <img src={`${h.img}?auto=format&fit=crop&w=800&q=80`} alt={h.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s var(--ease)" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(8,18,28,0.78))", zIndex: 1 }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, zIndex: 2, color: "#fff" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{h.name}</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.82)", marginTop: 2 }}>{h.note}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Neighborhoods = Neighborhoods;

const FAQS = [
  { q: "What does Cardo charge?", a: "A straightforward management percentage of booking revenue — no setup fees, no charge until your home is earning. We quote it exactly in your free property analysis." },
  { q: "How fast can my home go live?", a: "Most homes launch within a few weeks: onboarding and permitting, in-house design and photography, listing build-out, and pricing setup before your first guest." },
  { q: "Will I still control my calendar?", a: "Always. Block owner stays anytime from your dashboard. It's your home — we keep it performing when you're not using it." },
  { q: "Do you handle San Diego STR permits and TOT?", a: "Yes — STRO licensing, compliance reporting, and transient occupancy tax filings so your home stays fully compliant." },
  { q: "How do I see my numbers?", a: "A real-time owner dashboard plus itemized monthly statements. Every booking, payout, and expense, whenever you want it." },
];

function FAQ() {
  const { Eyebrow } = DS_n;
  const [open, setOpen] = React.useState(0);
  return (
    <section className="surface-cream2" style={{ background: "var(--cream-2)", padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Eyebrow center>Questions, answered</Eyebrow>
          <h2 style={{ margin: "8px 0 0" }}>The owner FAQ.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--ink)" }}>
                  {f.q}
                  <span style={{ color: "var(--rose)", fontSize: "1.4rem", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.25s var(--ease)", lineHeight: 1 }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s var(--ease)" }}>
                  <p className="muted" style={{ margin: 0, padding: "0 24px 22px", fontSize: "0.98rem" }}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.FAQ = FAQ;
