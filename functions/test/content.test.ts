import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('content module parity', () => {
  it('matches the canonical Supabase content module byte-for-byte', () => {
    const here = readFileSync(new URL('../src/content.ts', import.meta.url), 'utf8');
    const canonical = readFileSync(new URL('../../supabase/functions/agreements/content.ts', import.meta.url), 'utf8');
    expect(here).toBe(canonical);
  });
});
