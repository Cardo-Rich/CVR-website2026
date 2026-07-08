// One-time migration: Supabase rental_agreements + portal_settings → Firestore/Storage.
// Run at cutover with BOTH credential sets in env:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (read the source)
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json (or ADC)  (write prod Firestore/Storage)
// Usage: cd functions && npx tsx scripts/migrate.ts [--dry]
import { createClient } from '@supabase/supabase-js';
import { getDb, getBucket } from '../src/db.js';
import { migrateAgreements, type SupabaseRow } from '../src/migrate.js';

const dry = process.argv.includes('--dry');
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const sb = createClient(url, key);
const { data: rows, error } = await sb.from('rental_agreements').select('*');
if (error) { console.error('Supabase read failed:', error.message); process.exit(1); }
const { data: settingsRow } = await sb.from('portal_settings').select('notify_email, from_email').eq('id', 1).single();
const settings = { notifyEmail: settingsRow?.notify_email ?? '', fromEmail: settingsRow?.from_email ?? '' };

console.log(`Read ${rows!.length} agreements (${rows!.filter((r: any) => r.status === 'signed').length} signed).`);
if (dry) { console.log('--dry: not writing. Sample tokens:', rows!.map((r: any) => r.token).join(', ')); process.exit(0); }

const res = await migrateAgreements(rows as SupabaseRow[], settings, getDb(), getBucket());
console.log(`Migrated ${res.migrated} agreements, regenerated ${res.pdfs} PDF(s), wrote config/portalSettings.`);
