import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { SECTIONS, ACKS, TERMS_META, PREAMBLE, BACKOUT_CALLOUT, FOOTER_LINE, richToPlain } from './content.js';
import type { AgreementDoc } from './types.js';

// ---------------------------------------------------------------------------
// PDF generation
// ---------------------------------------------------------------------------

const INK = rgb(0.055, 0.082, 0.157); // #0E1528
const BODY = rgb(0.24, 0.244, 0.278); // #3D3E47
const MUTED = rgb(0.42, 0.427, 0.47);
const PINK = rgb(0.93, 0.235, 0.47); // #ED3C78
const GREEN = rgb(0.184, 0.43, 0.333); // #2F6E55

// Replace characters Helvetica/WinAnsi can't encode.
function sanitize(text: string): string {
  return text
    .replace(/−/g, '-')
    .replace(/ /g, ' ');
}

class PdfWriter {
  doc!: PDFDocument;
  page!: PDFPage;
  font!: PDFFont;
  bold!: PDFFont;
  y = 0;
  readonly margin = 54;
  readonly width = 612;
  readonly height = 792;

  static async create(): Promise<PdfWriter> {
    const w = new PdfWriter();
    w.doc = await PDFDocument.create();
    w.font = await w.doc.embedFont(StandardFonts.Helvetica);
    w.bold = await w.doc.embedFont(StandardFonts.HelveticaBold);
    w.addPage();
    return w;
  }

  addPage() {
    this.page = this.doc.addPage([this.width, this.height]);
    this.y = this.height - this.margin;
  }

  ensure(space: number) {
    if (this.y - space < this.margin) this.addPage();
  }

  wrapLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const words = sanitize(text).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? line + ' ' + word : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  text(
    text: string,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; indent?: number; lineGap?: number; after?: number } = {},
  ) {
    const size = opts.size ?? 10;
    const font = opts.font ?? this.font;
    const color = opts.color ?? BODY;
    const indent = opts.indent ?? 0;
    const lineHeight = size * (opts.lineGap ?? 1.45);
    const maxWidth = this.width - this.margin * 2 - indent;
    for (const line of this.wrapLines(text, font, size, maxWidth)) {
      this.ensure(lineHeight);
      this.y -= lineHeight;
      this.page.drawText(line, { x: this.margin + indent, y: this.y, size, font, color });
    }
    this.y -= opts.after ?? 0;
  }

  bullet(text: string, opts: { size?: number } = {}) {
    const size = opts.size ?? 10;
    const lineHeight = size * 1.45;
    this.ensure(lineHeight);
    const startY = this.y;
    this.text(text, { size, indent: 14, after: 3 });
    this.page.drawText('•', { x: this.margin + 2, y: startY - lineHeight, size, font: this.font, color: BODY });
  }

  rule(after = 14) {
    this.ensure(after + 4);
    this.y -= 8;
    this.page.drawLine({
      start: { x: this.margin, y: this.y },
      end: { x: this.width - this.margin, y: this.y },
      thickness: 0.7,
      color: rgb(0.85, 0.84, 0.81),
    });
    this.y -= after - 8;
  }

  space(amount: number) {
    this.y -= amount;
  }
}

export async function buildPdf(doc: AgreementDoc): Promise<Uint8Array> {
  const w = await PdfWriter.create();
  const terms = doc.terms || {};
  const owner = doc.owner || {};
  const acks = doc.acks || {};

  w.text('RENTAL PROPERTY MANAGEMENT AGREEMENT', { size: 9, font: w.bold, color: PINK, after: 6 });
  w.text('Rental Management Agreement', { size: 22, font: w.bold, color: INK, after: 4 });
  w.text('Scherf Property Management, LLC · doing business as Cardo Vacation Rentals · one agreement per property', {
    size: 9,
    color: MUTED,
    after: 10,
  });
  w.text(PREAMBLE, { size: 9.5, after: 4 });
  w.rule();

  // Key commercial terms
  w.text('KEY COMMERCIAL TERMS', { size: 10, font: w.bold, color: INK, after: 6 });
  const fmt = (m: (typeof TERMS_META)[number]) =>
    `${m.prefix ?? ''}${terms[m.key] ?? m.default}${m.suffix ? (m.suffix === '%' ? '%' : ' ' + m.suffix) : ''}`;
  for (const m of TERMS_META) {
    w.text(`${m.label}:  ${fmt(m)}   (${richToPlain(m.sub)})`, { size: 9.5, after: 2 });
  }
  const total = (parseFloat(terms.startupFee || '0') || 0) + (parseFloat(terms.lockSyncFee || '0') || 0);
  w.text(`Total due at signing: $0 — the $${total.toLocaleString('en-US')} in startup and lock-sync fees roll into the first monthly payout.`, {
    size: 9.5,
    font: w.bold,
    color: GREEN,
    after: 4,
  });
  w.rule();

  // Owner & property details
  w.text('OWNER & PROPERTY DETAILS', { size: 10, font: w.bold, color: INK, after: 6 });
  const ownerLines: [string, string][] = [
    ['Full Name ("Owner")', owner.fullName || ''],
    ['Address of Managed Property ("Home")', owner.homeAddress || ''],
    ['Personal Mailing Address', owner.mailingAddress || ''],
    ['Phone Number', owner.phone || ''],
    ['Email Address', owner.email || doc.clientEmail],
  ];
  for (const [label, value] of ownerLines) {
    w.text(`${label}:  ${value}`, { size: 9.5, after: 2 });
  }
  w.rule();

  // Risk-free commitment callout
  w.text(BACKOUT_CALLOUT.kicker.toUpperCase() + ' — ' + BACKOUT_CALLOUT.title, { size: 10, font: w.bold, color: INK, after: 4 });
  w.text(BACKOUT_CALLOUT.body, { size: 9.5, after: 4 });
  w.rule();

  // Acknowledgments
  w.text('BY SIGNING, I ACKNOWLEDGE', { size: 10, font: w.bold, color: INK, after: 6 });
  for (const ack of ACKS) {
    const checked = acks[ack.key] ? '[X]' : '[  ]';
    w.text(`${checked}  ${richToPlain(ack.text)}`, { size: 9.5, after: 3 });
  }
  w.rule();

  // Addendum
  w.text('ADDENDUM', { size: 10, font: w.bold, color: INK, after: 5 });
  w.text(doc.addendum?.trim() ? doc.addendum : 'None.', { size: 9.5, after: 4 });
  w.rule();

  // Signature
  w.text('OWNER SIGNATURE', { size: 10, font: w.bold, color: INK, after: 6 });
  if (doc.sigData?.startsWith('data:image/png;base64,')) {
    try {
      const png = await w.doc.embedPng(doc.sigData);
      const sigW = 180;
      const sigH = (png.height / png.width) * sigW;
      w.ensure(sigH + 8);
      w.y -= sigH;
      w.page.drawImage(png, { x: w.margin, y: w.y, width: sigW, height: sigH });
      w.space(6);
    } catch (e) {
      console.error('signature embed failed', e);
    }
  }
  w.text(`Signed by: ${doc.sigName || ''}`, { size: 9.5, color: INK, after: 2 });
  w.text(`Date: ${doc.sigDate || ''}${doc.signedAt ? `   ·   Executed electronically ${new Date(doc.signedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT` : ''}`, {
    size: 9.5,
    color: INK,
    after: 2,
  });
  w.text('Electronic signatures are as valid as originals. The Owner may cancel within 14 days of signing with no termination fee — see Section 15.', {
    size: 8.5,
    color: MUTED,
    after: 4,
  });
  w.rule();

  // Full agreement
  w.text('FULL AGREEMENT', { size: 12, font: w.bold, color: INK, after: 4 });
  w.text('The following numbered terms govern the relationship between Cardo and the Owner.', { size: 9, color: MUTED, after: 8 });
  for (const section of SECTIONS) {
    w.ensure(40);
    w.text(`${section.n}.  ${section.title}`, { size: 10.5, font: w.bold, color: INK, after: 3 });
    for (const block of section.blocks) {
      if (block.p) w.text(richToPlain(block.p), { size: 9.5, after: 4 });
      if (block.ul) {
        for (const item of block.ul) w.bullet(richToPlain(item), { size: 9.5 });
        w.space(4);
      }
    }
    w.space(6);
  }
  w.rule();
  w.text(FOOTER_LINE, { size: 8, color: MUTED });

  return await w.doc.save();
}
