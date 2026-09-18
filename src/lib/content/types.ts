import type { Article as SeedArticle } from '../../data/blog';
import type { CaseStudy as SeedCaseStudy } from '../../data/case-studies';

export type Status = 'draft' | 'published';

// A live Journal post: one document in the `articles` collection.
export interface Article extends SeedArticle {
  status: Status;
  createdAt?: string;   // ISO
  updatedAt?: string;
  publishedAt?: string;
}

// A pending post or pending edits: one document in `articleDrafts`. The
// preview page is built at /blog/preview/{previewKey}, unlisted and noindex.
export interface DraftArticle extends SeedArticle {
  previewKey: string;
  createdAt: string;
  updatedAt: string;
  source: 'admin' | 'script' | 'restore';
}

export interface CaseStudy extends SeedCaseStudy {
  status: Status;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Property {
  guestyId: string;
  name: string;
  neighborhood: string;
  beds: string;
  baths: string;
  guests: string;
  photos: string[];
  bookingUrl: string;
  active: boolean;
}

export interface FeaturedEntry {
  id: string;
  premier: boolean;
}
