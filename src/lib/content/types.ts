import type { Article as SeedArticle } from '../../data/blog';
import type { CaseStudy as SeedCaseStudy } from '../../data/case-studies';

export type Status = 'draft' | 'published';

export interface Article extends SeedArticle {
  status: Status;
  createdAt?: string;   // ISO
  updatedAt?: string;
  publishedAt?: string;
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
