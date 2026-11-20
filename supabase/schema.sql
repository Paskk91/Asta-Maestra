-- Asta Maestra — schema Supabase per la sincronizzazione tra dispositivi.
-- Esegui questo file nella SQL Editor del tuo progetto Supabase.

create table if not exists public.asta_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  revision bigint not null default 0,
  device text,
  updated_at timestamptz not null default now(),
  constraint asta_sessions_user_id_key unique (user_id)
);

comment on table public.asta_sessions is 'Sessione d''asta di un utente: snapshot JSON con revisione per il controllo dei conflitti.';

alter table public.asta_sessions enable row level security;

-- RLS: ogni utente vede e modifica solo la propria riga.
-- auth.uid() e' avvolto in una subquery per essere valutato una sola volta.
drop policy if exists "asta_session_select" on public.asta_sessions;
create policy "asta_session_select" on public.asta_sessions
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "asta_session_insert" on public.asta_sessions;
create policy "asta_session_insert" on public.asta_sessions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "asta_session_update" on public.asta_sessions;
create policy "asta_session_update" on public.asta_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Push atomico con protezione della revisione: una versione piu vecchia non
-- puo' sovrascrivere una piu recente. La funzione restituisce sempre lo stato
-- corrente (quello salvato oppure quello remoto piu nuovo).
create or replace function public.asta_sync_push(
  p_data jsonb,
  p_revision bigint,
  p_device text default null
)
returns public.asta_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.asta_sessions;
begin
  if v_uid is null then
    raise exception 'Utente non autenticato';
  end if;

  insert into public.asta_sessions as s (user_id, data, revision, device, updated_at)
  values (v_uid, p_data, p_revision, p_device, now())
  on conflict (user_id) do update
    set data = excluded.data,
        revision = excluded.revision,
        device = excluded.device,
        updated_at = now()
    where excluded.revision > s.revision
  returning s.* into v_row;

  if v_row.id is null then
    select * into v_row from public.asta_sessions where user_id = v_uid;
  end if;

  return v_row;
end;
$$;

revoke all on function public.asta_sync_push(jsonb, bigint, text) from public, anon;
grant execute on function public.asta_sync_push(jsonb, bigint, text) to authenticated;

-- La tabella non espone DELETE: la rimozione avviene solo con cascata
-- eliminando l'account, come previsto dalla policy di ritenzione minima.
