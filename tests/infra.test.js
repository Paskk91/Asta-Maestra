import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './harness.js';

const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('schema Supabase: RLS, upsert con revisione e privilegi', () => {
  const sql = read('supabase/schema.sql');
  assert.match(sql, /create table if not exists public\.asta_sessions/);
  assert.match(sql, /generated always as identity primary key/);
  assert.match(sql, /references auth\.users \(id\) on delete cascade/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /\(select auth\.uid\(\)\) = user_id/);
  assert.match(sql, /on conflict \(user_id\) do update/);
  assert.match(sql, /where excluded\.revision > public\.asta_sessions\.revision/);
  assert.match(sql, /grant execute on function public\.asta_sync_push/);
  assert.match(sql, /revoke all on function public\.asta_sync_push.*anon/i);
});

test('modulo sync: esporta le operazioni attese', () => {
  const src = read('src/sync.js');
  for (const name of ['configured', 'localRevision', 'setLocalRevision', 'currentUser', 'signIn', 'signUp', 'signOut', 'onAuthChange', 'pull', 'push']) {
    assert.match(src, new RegExp(`export (const|function|async function) ${name}\\b`));
  }
  assert.match(src, /VITE_SUPABASE_URL/);
  assert.match(src, /asta_sync_push/);
});

test('PWA: manifest, service worker e icone', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.icons.length, 3);
  const sw = read('public/sw.js');
  assert.match(sw, /cache\.addAll/);
  assert.match(sw, /supabase/);
  assert.match(sw, /clients\.claim/);
  for (const icon of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
    assert.ok(fs.statSync(path.join(root, 'public/icons', icon)).size > 1000);
  }
  const html = read('index.html');
  assert.match(html, /rel="manifest"/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /rel="icon"/);
});

test('build: vite configurato con base relativa e CI presente', () => {
  const config = read('vite.config.js');
  assert.match(config, /base: '\.\/'/);
  const ci = read('.github/workflows/deploy.yml');
  assert.match(ci, /npm test/);
  assert.match(ci, /npm run build/);
  assert.match(ci, /deploy-pages/);
});
