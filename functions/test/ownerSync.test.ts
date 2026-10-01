import { describe, it, expect } from 'vitest';
import { syncOwners, type OwnerSyncClient, type RecordRelation } from '../src/ownerSync';

// A stored relation between two records, as HighLevel keeps it.
interface Relation { id: string; associationId: string; firstRecordId: string; secondRecordId: string; }
interface RelationshipSeed { id: string; type: string; status: string; endDate: string | null; }

const ASSOC = {
  owner: { id: 'A_OWNER', key: 'owner', firstObjectKey: 'contact', secondObjectKey: 'custom_objects.properties' },
  contact: { id: 'A_REL_CONTACT', key: 'relationship_contact', firstObjectKey: 'contact', secondObjectKey: 'custom_objects.property_relationships' },
  property: { id: 'A_REL_PROPERTY', key: 'relationship_property', firstObjectKey: 'custom_objects.properties', secondObjectKey: 'custom_objects.property_relationships' },
};

// In-memory stand-in for the HighLevel API: same shapes, no network. Record
// searches return each record with its relations inline, as the real API does.
function fakeGhl(seed: {
  relationships: RelationshipSeed[];
  properties?: { id: string; address: string }[];
  relations?: Relation[];
}) {
  const relations: Relation[] = [...(seed.relations ?? [])];
  let n = 0;
  const relationsOf = (recordId: string): RecordRelation[] => relations
    .filter((r) => r.firstRecordId === recordId || r.secondRecordId === recordId)
    .map((r) => ({ relationId: r.id, associationId: r.associationId, recordId: r.firstRecordId === recordId ? r.secondRecordId : r.firstRecordId }));
  const client: OwnerSyncClient = {
    associations: async () => Object.values(ASSOC),
    listRelationships: async () => seed.relationships.map((r) => ({ ...r, relations: relationsOf(r.id) })),
    listProperties: async () => (seed.properties ?? [{ id: 'P1', address: '10 Ocean St' }]).map((p) => ({ ...p, relations: relationsOf(p.id) })),
    createRelation: async (associationId, firstRecordId, secondRecordId) => {
      const id = `NEW${++n}`;
      relations.push({ id, associationId, firstRecordId, secondRecordId });
      return id;
    },
    deleteRelation: async (relationId) => {
      relations.splice(relations.findIndex((r) => r.id === relationId), 1);
    },
  };
  const owners = () => relations.filter((r) => r.associationId === ASSOC.owner.id).map((r) => `${r.firstRecordId}>${r.secondRecordId}`).sort();
  return { client, owners };
}

// A relationship record R linked to contact C and property P.
const linked = (rel: string, contact: string, property: string): Relation[] => [
  { id: `${rel}-c`, associationId: ASSOC.contact.id, firstRecordId: contact, secondRecordId: rel },
  { id: `${rel}-p`, associationId: ASSOC.property.id, firstRecordId: property, secondRecordId: rel },
];
const rel = (id: string, over: Partial<RelationshipSeed> = {}): RelationshipSeed =>
  ({ id, type: 'owner', status: 'current', endDate: null, ...over });
const ownerRelation = (id: string, contact: string, property: string): Relation =>
  ({ id, associationId: ASSOC.owner.id, firstRecordId: contact, secondRecordId: property });

describe('syncOwners', () => {
  it('sets the property Owner to the contact of a current owner relationship', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1')], relations: linked('R1', 'C1', 'P1') });
    const report = await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual(['C1>P1']);
    expect(report.created).toEqual([{ contactId: 'C1', propertyId: 'P1' }]);
  });

  it('leaves Owner empty while the relationship is unverified', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1', { status: 'unverified' })], relations: linked('R1', 'C1', 'P1') });
    await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
  });

  it('leaves Owner empty when the relationship has an end date', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1', { endDate: '2026-09-01' })], relations: linked('R1', 'C1', 'P1') });
    await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
  });

  it('ignores current relationships that are not of type owner', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1', { type: 'property_manager' })], relations: linked('R1', 'C1', 'P1') });
    await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
  });

  it('clears the Owner when the relationship is ended', async () => {
    const ghl = fakeGhl({
      relationships: [rel('R1', { status: 'ended' })],
      relations: [...linked('R1', 'C1', 'P1'), ownerRelation('O1', 'C1', 'P1')],
    });
    const report = await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
    expect(report.removed).toEqual([{ relationId: 'O1', contactId: 'C1', propertyId: 'P1' }]);
  });

  it('clears an Owner that no relationship record backs (record deleted or Owner added by hand)', async () => {
    const ghl = fakeGhl({
      relationships: [rel('R2', { status: 'unverified' })],
      relations: [ownerRelation('O1', 'C1', 'P1')],
    });
    await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
  });

  it('writes nothing when the Owner already matches', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1')], relations: [...linked('R1', 'C1', 'P1'), ownerRelation('O1', 'C1', 'P1')] });
    const report = await syncOwners(ghl.client, { apply: true });
    expect(report.created).toEqual([]);
    expect(report.removed).toEqual([]);
    expect(ghl.owners()).toEqual(['C1>P1']);
  });

  it('keeps both contacts as Owner when a property has two current owner relationships', async () => {
    const ghl = fakeGhl({
      relationships: [rel('R1'), rel('R2')],
      relations: [...linked('R1', 'C1', 'P1'), ...linked('R2', 'C2', 'P1')],
    });
    await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual(['C1>P1', 'C2>P1']);
  });

  it('reports the plan without writing when apply is off', async () => {
    const ghl = fakeGhl({ relationships: [rel('R1')], relations: linked('R1', 'C1', 'P1') });
    const report = await syncOwners(ghl.client, { apply: false });
    expect(report.created).toEqual([{ contactId: 'C1', propertyId: 'P1' }]);
    expect(ghl.owners()).toEqual([]);
  });

  it('never touches the Owner of an unmanaged property', async () => {
    const ghl = fakeGhl({
      relationships: [rel('R1', { status: 'unverified' })],
      properties: [{ id: 'P1', address: '10 Ocean St' }, { id: 'PX', address: '1246 Grand Ave ' }],
      relations: [ownerRelation('O9', 'C9', 'PX')],
    });
    await syncOwners(ghl.client, { apply: true, unmanagedAddresses: ['1246 grand ave'] });
    expect(ghl.owners()).toEqual(['C9>PX']);
  });

  it('reports a current owner relationship that has no contact linked, and sets no Owner for it', async () => {
    const ghl = fakeGhl({
      relationships: [rel('R1')],
      relations: [{ id: 'R1-p', associationId: ASSOC.property.id, firstRecordId: 'P1', secondRecordId: 'R1' }],
    });
    const report = await syncOwners(ghl.client, { apply: true });
    expect(ghl.owners()).toEqual([]);
    expect(report.skipped).toEqual([{ relationshipId: 'R1', reason: 'no contact linked' }]);
  });

  it('refuses to run when no relationship records come back', async () => {
    const ghl = fakeGhl({ relationships: [], relations: [ownerRelation('O1', 'C1', 'P1')] });
    await expect(syncOwners(ghl.client, { apply: true })).rejects.toThrow(/no relationship records/i);
    expect(ghl.owners()).toEqual(['C1>P1']);
  });

  it('refuses to remove more Owners in one run than the limit, and writes nothing', async () => {
    const properties = ['P1', 'P2', 'P3'].map((id) => ({ id, address: `${id} St` }));
    const ghl = fakeGhl({
      relationships: [rel('R1', { status: 'unverified' })],
      properties,
      relations: [ownerRelation('O1', 'C1', 'P1'), ownerRelation('O2', 'C2', 'P2'), ownerRelation('O3', 'C3', 'P3')],
    });
    await expect(syncOwners(ghl.client, { apply: true, maxRemovals: 2 })).rejects.toThrow(/3 removals.*limit of 2/i);
    expect(ghl.owners()).toEqual(['C1>P1', 'C2>P2', 'C3>P3']);
  });
});
