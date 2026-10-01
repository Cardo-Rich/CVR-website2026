// Derive each property's Owner association in HighLevel from its Property
// Relationship records: a relationship that is type Owner, status Current,
// with no end date makes its contact the property's Owner; anything else
// clears it. Run every 30 minutes by .github/workflows/ghl-owner-sync.yml;
// safe to run by hand any time.
//
//   npm run ghl:owner-sync              dry run: prints the plan, writes nothing
//   npm run ghl:owner-sync -- --apply   creates and removes Owner links
//
// Needs GHL_OWNER_SYNC_TOKEN: a sub-account Private Integration token with
// View Objects Record, View Associations and View/Edit Associations Relation.
// Output is record ids and counts only, because Actions logs are public.
import { makeOwnerSyncClient } from '../functions/src/ghlObjects';
import { syncOwners } from '../functions/src/ownerSync';

// Pre-existing property that is not part of the relationship model.
const UNMANAGED_ADDRESSES = ['1246 grand ave'];

const token = process.env.GHL_OWNER_SYNC_TOKEN;
const locationId = process.env.GHL_LOCATION_ID || 'OMuUca5rxmF3itOE9tHP';
const apply = process.argv.includes('--apply');

if (!token) {
  console.log('::warning::GHL_OWNER_SYNC_TOKEN is not set; Owner sync skipped.');
  process.exit(0);
}

const report = await syncOwners(makeOwnerSyncClient({ token, locationId }), { apply, unmanagedAddresses: UNMANAGED_ADDRESSES });

console.log(`${apply ? 'Applied' : 'Dry run'}: ${report.created.length} Owner link(s) to create, ${report.removed.length} to remove, ${report.skipped.length} relationship(s) skipped.`);
for (const p of report.created) console.log(`  + property ${p.propertyId} <- contact ${p.contactId}`);
for (const p of report.removed) console.log(`  - property ${p.propertyId} <- contact ${p.contactId} (relation ${p.relationId})`);
for (const s of report.skipped) console.log(`  ! relationship ${s.relationshipId}: ${s.reason}`);
