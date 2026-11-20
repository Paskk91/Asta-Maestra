#!/usr/bin/env node
/* Applica supabase/schema.sql e verifica il progetto.
   Uso: SUPABASE_ACCESS_TOKEN=<pat> node scripts/setup-supabase.mjs
   Il token si genera su https://supabase.com/dashboard/account/tokens */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const anon = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const ref = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!ref) throw new Error('URL Supabase non valido in .env');
if (!token) throw new Error('Imposta SUPABASE_ACCESS_TOKEN');
if (!anon || anon.startsWith('INSERISCI')) throw new Error('Inserisci VITE_SUPABASE_ANON_KEY in .env');

const sql = fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8');
console.log(`Progetto: ${ref}`);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql })
});
const text = await res.text();
if (!res.ok) {
  console.error('Errore applicazione schema:', res.status, text.slice(0, 1000));
  process.exit(1);
}
console.log('Schema applicato correttamente.');

const check = await fetch(`${url}/rest/v1/asta_sessions?select=id&limit=1`, {
  headers: { apikey: anon, Authorization: `Bearer ${anon}` }
});
console.log('Verifica tabella:', check.status, check.status === 200 ? 'OK' : (await check.text()).slice(0, 300));

const rpc = await fetch(`${url}/rest/v1/rpc/asta_sync_push`, {
  method: 'POST',
  headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_data: {}, p_revision: 1 })
});
console.log('Verifica funzione:', rpc.status, rpc.status === 401 || rpc.status === 400 ? 'OK (richiede auth)' : (await rpc.text()).slice(0, 300));
