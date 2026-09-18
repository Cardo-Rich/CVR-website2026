// =============================================================
// Journal article model + category chips.
//
// Articles themselves live in Firestore, one document each (`articles` for
// live posts, `articleDrafts` for pending ones) and are read at build time by
// src/lib/content/articles.ts. Nothing in this file is content; it is the
// shape every reader agrees on plus the filter chips for /blog. To add a post
// from a coding session, see "Journal authoring" in CLAUDE.md.
// =============================================================

export interface CaseStudyMeta {
  name: string;     // short home name for the card/popup (e.g. "Falcon")
  hood: string;     // neighborhood label (card + popup eyebrow)
  beds: string;     // e.g. "4 BR"
  revenue: string;  // e.g. "$214,800"
  nightly: string;  // e.g. "$589 / night"
  lift: string;     // e.g. "+57% over market"
  gallery?: string[]; // extra thumbnails for the owners preview popup
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  dateFull: string;
  dateShort: string;
  date: string;     // ISO yyyy-mm-dd derived from dateFull on save; drives ordering
  img: string;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
  };
  author: {
    name: string;
    initials: string;
  };
  heroCaption: string;
  bodyHtml: string;
  // Blog posts are the single source of truth. A post always shows in its blog
  // category; these toggles additionally surface it as a card elsewhere.
  localTip?: string;      // "Explore like a local" card tip line (home page)
  showOnHome?: boolean;   // surface as an Explore-like-a-local card on the home page
  showOnOwners?: boolean; // surface as a case-study card on the owners page
  caseStudy?: CaseStudyMeta;
}

export const categories = ['All', 'Revenue', 'Tax', 'Accounting', 'Design', 'Compliance', 'Neighborhoods', 'Operations', 'Case studies', 'Explore like a local'];

// Chip label -> the article categories it covers on /blog. A chip that is not
// listed here matches articles whose `category` is the chip's own label; the
// guest guides each carry their own category and sit together under one chip.
export const categoryGroups: Record<string, string[]> = {
  'Explore like a local': ['Surf & sand', 'Food & drink', 'Family adventures'],
};
