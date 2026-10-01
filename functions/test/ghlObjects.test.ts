import { describe, it, expect } from 'vitest';
import { makeOwnerSyncClient } from '../src/ghlObjects';

interface Call { method: string; path: string; query: Record<string, string>; body: any; auth: string | null; }

// Records every request and answers from `respond`, in place of the network.
function stubFetch(respond: (call: Call) => { status?: number; json?: unknown }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const call: Call = {
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      auth: new Headers(init?.headers).get('authorization'),
    };
    calls.push(call);
    const { status = 200, json = {} } = respond(call);
    return new Response(JSON.stringify(json), { status });
  }) as typeof fetch;
  return { calls, client: makeOwnerSyncClient({ token: 'pit-test', locationId: 'LOC1', fetchImpl }) };
}

const relationshipRecord = (id: string) => ({
  id,
  properties: { relationship_type: 'owner', relationship_status: 'current', relationship_start_date: '2026-01-05' },
  relations: [{ associationId: 'A1', relationId: `${id}-rel`, objectKey: 'contact', recordId: 'C1', createdAt: '2026-10-01T00:00:00Z' }],
});

describe('makeOwnerSyncClient', () => {
  it('reads every page of relationship records', async () => {
    const page = (n: number, size: number) => Array.from({ length: size }, (_, i) => relationshipRecord(`R${n}-${i}`));
    const { calls, client } = stubFetch((c) => ({ json: { total: 150, records: c.body.page === 1 ? page(1, 100) : page(2, 50) } }));
    const records = await client.listRelationships();
    expect(records).toHaveLength(150);
    expect(calls.map((c) => [c.method, c.path, c.body.page, c.body.locationId])).toEqual([
      ['POST', '/objects/custom_objects.property_relationships/records/search', 1, 'LOC1'],
      ['POST', '/objects/custom_objects.property_relationships/records/search', 2, 'LOC1'],
    ]);
  });

  it('maps a relationship record to its type, status, end date and relations', async () => {
    const ended = { ...relationshipRecord('R2'), properties: { relationship_type: 'owner', relationship_status: 'ended', relationship_end_date: '2026-09-01' } };
    const { client } = stubFetch(() => ({ json: { total: 2, records: [relationshipRecord('R1'), ended] } }));
    expect(await client.listRelationships()).toEqual([
      { id: 'R1', type: 'owner', status: 'current', endDate: null, relations: [{ relationId: 'R1-rel', associationId: 'A1', recordId: 'C1' }] },
      { id: 'R2', type: 'owner', status: 'ended', endDate: '2026-09-01', relations: [{ relationId: 'R2-rel', associationId: 'A1', recordId: 'C1' }] },
    ]);
  });

  it('maps a property record to its address and relations', async () => {
    const { calls, client } = stubFetch(() => ({ json: { total: 1, records: [{ id: 'P1', properties: { property_address: '10 Ocean St' } }] } }));
    expect(await client.listProperties()).toEqual([{ id: 'P1', address: '10 Ocean St', relations: [] }]);
    expect(calls[0].path).toBe('/objects/custom_objects.properties/records/search');
  });

  it('lists associations for the location', async () => {
    const assoc = { id: 'A1', key: 'owner', firstObjectKey: 'contact', secondObjectKey: 'custom_objects.properties' };
    const { calls, client } = stubFetch(() => ({ json: { associations: [assoc] } }));
    expect(await client.associations()).toEqual([assoc]);
    expect([calls[0].method, calls[0].path, calls[0].query.locationId, calls[0].auth]).toEqual(['GET', '/associations/', 'LOC1', 'Bearer pit-test']);
  });

  it('creates a relation and returns its id', async () => {
    const { calls, client } = stubFetch(() => ({ status: 201, json: { id: 'REL9' } }));
    expect(await client.createRelation('A1', 'C1', 'P1')).toBe('REL9');
    expect([calls[0].method, calls[0].path]).toEqual(['POST', '/associations/relations']);
    expect(calls[0].body).toEqual({ locationId: 'LOC1', associationId: 'A1', firstRecordId: 'C1', secondRecordId: 'P1' });
  });

  it('deletes a relation by id', async () => {
    const { calls, client } = stubFetch(() => ({ json: {} }));
    await client.deleteRelation('REL9');
    expect([calls[0].method, calls[0].path, calls[0].query.locationId]).toEqual(['DELETE', '/associations/relations/REL9', 'LOC1']);
  });

  it('fails with the status when HighLevel rejects a call', async () => {
    const { client } = stubFetch(() => ({ status: 401, json: { message: 'The token is not authorized for this scope.' } }));
    await expect(client.associations()).rejects.toThrow(/401.*not authorized/);
  });
});
