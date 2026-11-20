import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL || '';
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const configured = Boolean(URL && KEY);

export const client = configured
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'astamaestra_supabase_auth'
      }
    })
  : null;

const REV_KEY = 'astamaestra_sync_revision';

export function localRevision() {
  const n = Number(localStorage.getItem(REV_KEY) || 0);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
export function setLocalRevision(n) {
  try { localStorage.setItem(REV_KEY, String(n)); } catch (e) { /* storage pieno */ }
}

export async function currentUser() {
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  return error ? null : (data?.user || null);
}

export async function signIn(email, password) {
  if (!client) throw new Error('Sync non configurata');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email, password) {
  if (!client) throw new Error('Sync non configurata');
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  if (!client) return;
  await client.auth.signOut();
}

export function onAuthChange(cb) {
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => cb(session?.user || null));
  return () => data?.subscription?.unsubscribe();
}

export async function pull() {
  if (!client) throw new Error('Sync non configurata');
  const { data, error } = await client
    .from('asta_sessions')
    .select('data,revision,updated_at,device')
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Invia lo stato locale. Il database accetta solo revisioni crescenti:
 * se la versione remota e' piu nuova restituisce quella, senza sovrascrivere.
 */
export async function push(state, device) {
  if (!client) throw new Error('Sync non configurata');
  const next = localRevision() + 1;
  const { data, error } = await client.rpc('asta_sync_push', {
    p_data: state,
    p_revision: next,
    p_device: device || navigator.userAgent?.slice(0, 80) || 'browser'
  });
  if (error) throw error;
  setLocalRevision(Number(data.revision) || next);
  return {
    accepted: Number(data.revision) === next,
    revision: Number(data.revision),
    updatedAt: data.updated_at,
    remote: data.data
  };
}
