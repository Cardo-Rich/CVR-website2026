// HighLevel custom-object and association calls used by the Owner sync.
import type { OwnerSyncClient, RecordRelation } from './ownerSync.js';

const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const PROPERTIES = 'custom_objects.properties';
const RELATIONSHIPS = 'custom_objects.property_relationships';
const PAGE = 100;

export interface GhlObjectsConfig { token: string; locationId: string; fetchImpl?: typeof fetch; }

interface RawRecord {
  id: string;
  properties?: Record<string, unknown>;
  relations?: { relationId: string; associationId: string; recordId: string }[];
}

export function makeOwnerSyncClient(cfg: GhlObjectsConfig): OwnerSyncClient {
  const doFetch = cfg.fetchImpl ?? fetch;

  async function call<T>(method: string, path: string, opts: { query?: Record<string, string | number>; body?: unknown } = {}): Promise<T> {
    const url = new URL(BASE + path);
    for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, String(v));
    const r = await doFetch(url, {
      method,
      headers: { Authorization: `Bearer ${cfg.token}`, Version: VERSION, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const text = await r.text();
    if (!r.ok) throw new Error(`GHL ${method} ${path} ${r.status}: ${text.slice(0, 300)}`);
    return (text ? JSON.parse(text) : {}) as T;
  }

  // Record searches return each record's relations inline, so one pass over
  // an object gives both its fields and its links.
  async function searchAll(objectKey: string): Promise<RawRecord[]> {
    const all: RawRecord[] = [];
    for (let page = 1; ; page++) {
      const j = await call<{ records?: RawRecord[]; total?: number }>('POST', `/objects/${objectKey}/records/search`, {
        body: { locationId: cfg.locationId, page, pageLimit: PAGE, query: '' },
      });
      const records = j.records ?? [];
      all.push(...records);
      if (records.length < PAGE || (j.total != null && all.length >= j.total)) return all;
    }
  }

  const relationsOf = (r: RawRecord): RecordRelation[] =>
    (r.relations ?? []).map((x) => ({ relationId: x.relationId, associationId: x.associationId, recordId: x.recordId }));
  const text = (v: unknown) => (typeof v === 'string' ? v : '');

  return {
    async associations() {
      const j = await call<{ associations?: { id: string; key: string; firstObjectKey: string; secondObjectKey: string }[] }>(
        'GET', '/associations/', { query: { locationId: cfg.locationId, skip: 0, limit: 100 } });
      return (j.associations ?? []).map(({ id, key, firstObjectKey, secondObjectKey }) => ({ id, key, firstObjectKey, secondObjectKey }));
    },
    async listRelationships() {
      return (await searchAll(RELATIONSHIPS)).map((r) => ({
        id: r.id,
        type: text(r.properties?.relationship_type),
        status: text(r.properties?.relationship_status),
        endDate: text(r.properties?.relationship_end_date) || null,
        relations: relationsOf(r),
      }));
    },
    async listProperties() {
      return (await searchAll(PROPERTIES)).map((r) => ({ id: r.id, address: text(r.properties?.property_address), relations: relationsOf(r) }));
    },
    async createRelation(associationId, firstRecordId, secondRecordId) {
      const j = await call<{ id?: string; relation?: { id?: string } }>('POST', '/associations/relations', {
        body: { locationId: cfg.locationId, associationId, firstRecordId, secondRecordId },
      });
      return j.id ?? j.relation?.id ?? '';
    },
    async deleteRelation(relationId) {
      await call('DELETE', `/associations/relations/${relationId}`, { query: { locationId: cfg.locationId } });
    },
  };
}
