// Keeps each property's Owner association in step with its Property
// Relationship records in HighLevel. The relationship records are the source
// of truth; Owner is a derived cache that only this sync writes.

// One end of a relation as a record search returns it: `recordId` is the
// record on the other side.
export interface RecordRelation { relationId: string; associationId: string; recordId: string; }
export interface RelationshipRecord { id: string; type: string; status: string; endDate: string | null; relations: RecordRelation[]; }
export interface PropertyRecord { id: string; address: string; relations: RecordRelation[]; }
export interface Association { id: string; key: string; firstObjectKey: string; secondObjectKey: string; }

export interface OwnerSyncClient {
  associations(): Promise<Association[]>;
  listRelationships(): Promise<RelationshipRecord[]>;
  listProperties(): Promise<PropertyRecord[]>;
  createRelation(associationId: string, firstRecordId: string, secondRecordId: string): Promise<string>;
  deleteRelation(relationId: string): Promise<void>;
}

export interface OwnerPair { contactId: string; propertyId: string; }
export interface OwnerSyncOptions { apply: boolean; unmanagedAddresses?: string[]; maxRemovals?: number; }
export interface OwnerSyncReport {
  created: OwnerPair[];
  removed: (OwnerPair & { relationId: string })[];
  skipped: { relationshipId: string; reason: string }[];
}

const DEFAULT_MAX_REMOVALS = 10;
const CONTACT = 'contact';

// An Owner is set only for a relationship that is type Owner, status Current,
// with no end date.
export function isCurrentOwner(r: Pick<RelationshipRecord, 'type' | 'status' | 'endDate'>): boolean {
  return r.type === 'owner' && r.status === 'current' && !r.endDate;
}

const normAddress = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
const pairKey = (p: OwnerPair) => `${p.contactId}|${p.propertyId}`;

export async function syncOwners(client: OwnerSyncClient, opts: OwnerSyncOptions): Promise<OwnerSyncReport> {
  const associations = await client.associations();
  const byKey = (key: string) => {
    const a = associations.find((x) => x.key === key);
    if (!a) throw new Error(`Association "${key}" not found`);
    return a;
  };
  const owner = byKey('owner');
  const relContact = byKey('relationship_contact');
  const relProperty = byKey('relationship_property');

  // An empty list means the API call went wrong, not that every owner left:
  // acting on it would clear every Owner.
  const relationships = await client.listRelationships();
  if (!relationships.length) throw new Error('No relationship records returned; refusing to sync.');

  const unmanaged = new Set((opts.unmanagedAddresses ?? []).map(normAddress));
  const managed = (await client.listProperties()).filter((p) => !unmanaged.has(normAddress(p.address)));
  const managedIds = new Set(managed.map((p) => p.id));

  const desired = new Map<string, OwnerPair>();
  const skipped: OwnerSyncReport['skipped'] = [];
  for (const r of relationships.filter(isCurrentOwner)) {
    const linkedVia = (associationId: string) => r.relations.filter((x) => x.associationId === associationId).map((x) => x.recordId);
    const contactIds = linkedVia(relContact.id);
    const propertyIds = linkedVia(relProperty.id).filter((id) => managedIds.has(id));
    if (!contactIds.length) { skipped.push({ relationshipId: r.id, reason: 'no contact linked' }); continue; }
    if (!propertyIds.length) { skipped.push({ relationshipId: r.id, reason: 'no managed property linked' }); continue; }
    for (const contactId of contactIds) for (const propertyId of propertyIds) {
      const pair = { contactId, propertyId };
      desired.set(pairKey(pair), pair);
    }
  }

  const existing: OwnerSyncReport['removed'] = managed.flatMap((p) => p.relations
    .filter((x) => x.associationId === owner.id)
    .map((x) => ({ relationId: x.relationId, contactId: x.recordId, propertyId: p.id })));

  const existingKeys = new Set(existing.map(pairKey));
  const created = [...desired.values()].filter((p) => !existingKeys.has(pairKey(p)));
  const removed = existing.filter((x) => !desired.has(pairKey(x)));
  const maxRemovals = opts.maxRemovals ?? DEFAULT_MAX_REMOVALS;
  if (removed.length > maxRemovals) {
    throw new Error(`Plan has ${removed.length} removals, over the limit of ${maxRemovals}; nothing was written.`);
  }

  if (opts.apply) {
    const contactFirst = owner.firstObjectKey === CONTACT;
    for (const p of created) {
      await client.createRelation(owner.id, contactFirst ? p.contactId : p.propertyId, contactFirst ? p.propertyId : p.contactId);
    }
    for (const x of removed) await client.deleteRelation(x.relationId);
  }
  return { created, removed, skipped };
}
