// Cardo marketing site — Testimonials + Lead/estimate form + Footer
const DS_f = window.CardoDesignSystem_9e0709;

const TESTIMONIALS = [
  { quote: "Switched from a national manager and my net was up double digits in the first quarter. The statements are so clear I stopped second-guessing.", name: "Marcus T.", home: "Oceanfront condo, Pacific Beach" },
  { quote: "Their design team restyled the whole house before launch and the photos are unreal. Booked 26 nights the first month at a rate I didn't think was possible.", name: "Priya & Sam", home: "Hillside home, La Jolla" },
  { quote: "A pipe let go at 11pm. Someone was there within the hour and I found out after it was fixed. That's why I sleep at night.", name: "Diane R.", home: "Beach cottage, Encinitas" },
];

function Testimonials() {
  const { Eyebrow } = DS_f;
  return (
    <section style={{ padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 620, marginBottom: 48 }}>
          <Eyebrow>Owners on the record</Eyebrow>
          <h2 style={{ margin: "8px 0 0" }}>Trusted with San Diego's best homes.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} style={{ margin: 0, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 28, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "var(--gold)", fontSize: "1rem", letterSpacing: 2, marginBottom: 16 }}>★★★★★</div>
              <blockquote style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.18rem", lineHeight: 1.45, color: "var(--ink)", flex: 1 }}>"{t.quote}"</blockquote>
              <figcaption style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{t.name}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{t.home}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Testimonials = Testimonials;

function LeadForm({ innerRef }) {
  const { Eyebrow, Field, Button } = DS_f;
  const [sent, setSent] = React.useState(false);
  return (
    <section ref={innerRef} className="surface-ink" style={{ background: "var(--ink)", padding: "clamp(64px,9vw,120px) 0" }}>
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        <div>
          <Eyebrow><span style={{ color: "var(--cream)" }}>No obligation</span></Eyebrow>
          <h2 style={{ color: "#fff", margin: "8px 0 16px" }}>Get your home's revenue estimate.</h2>
          <p style={{ color: "rgba(248,243,236,0.82)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Send your home's details and we'll return a data-backed projection for your San Diego market — typically within one business day.
          </p>
        </div>
        <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: 30, boxShadow: "var(--shadow-lg)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 style={{ margin: "0 0 8px" }}>Estimate on the way</h3>
              <p className="muted" style={{ margin: 0 }}>We'll email your projection within one business day.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Full name" placeholder="Jane Owner" required />
                <Field label="Phone" type="tel" placeholder="619-555-0100" />
              </div>
              <Field label="Email" type="email" placeholder="jane@email.com" required />
              <Field label="Neighborhood" as="select" options={["La Jolla","Pacific Beach","Mission Beach","Del Mar","Encinitas","Carlsbad","Coronado","Other San Diego"]} />
              <Button variant="primary" block type="submit" style={{ marginTop: 6 }}>Get my free estimate</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
window.LeadForm = LeadForm;

function Footer() {
  const cols = [
    { h: "Company", links: ["For Owners", "Home Designs by Cardo", "Neighborhoods", "Blog"] },
    { h: "Markets", links: ["La Jolla", "Pacific Beach", "Del Mar", "Encinitas", "Coronado"] },
    { h: "Guests", links: ["Book a Stay", "Guest support", "Areas we serve"] },
  ];
  return (
    <footer style={{ background: "#0B1825", color: "rgba(248,243,236,0.7)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <img src="../../assets/logo-horizontal-white-color.png" alt="Cardo" style={{ height: 40, width: "auto", marginBottom: 18 }} />
          <p style={{ fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 260 }}>Luxury short-term rental management in San Diego. 5-star Superhost since 2013.</p>
          <a href="tel:+16197195282" style={{ color: "#fff", fontWeight: 600, fontSize: "1.1rem", display: "inline-block", marginTop: 10 }}>619-719-5282</a>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>{c.h}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {c.links.map((l) => <li key={l}><a href="#" style={{ fontSize: "0.92rem", color: "rgba(248,243,236,0.7)" }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", fontSize: "0.82rem", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 Cardo Vacation Rentals · cardorentals.com</span>
          <span>STRO compliant · DRE licensed</span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
