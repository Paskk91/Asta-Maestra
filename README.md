# Asta Maestra — web app

Console d'asta per il fantacalcio, trasformata da file HTML singolo in una PWA distribuibile con sincronizzazione cloud opzionale.

## Struttura

```
index.html              markup + meta PWA
src/styles.css          stili
src/app.js              logica applicativa
src/sync.js             client Supabase
public/                 manifest, service worker, icone, SheetJS locale
supabase/schema.sql     tabella, RLS e funzione di upsert
tests/                  test jsdom (node:test)
.github/workflows/      build e deploy GitHub Pages
scripts/make-icons.py   generazione icone PNG
```

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 9 test automatici
npm run build      # genera dist/
npm run preview    # anteprima di dist/
```

## Pubblicazione (Fase 1)

Qualsiasi hosting statico con HTTPS va bene:

- **Cloudflare Pages / Netlify**: collega il repo, build command `npm run build`, directory `dist`.
- **GitHub Pages**: il workflow `.github/workflows/deploy.yml` fa build e deploy in automatico su `main`.
  Abilita *Settings → Pages → Source: GitHub Actions*.

L'app è installabile da browser (**Installa app** in *Sistema → Dati & backup*) e funziona offline dopo la prima visita. SheetJS è incluso localmente in `public/vendor/` per l'import XLSX offline.

## Sincronizzazione cloud (Fase 2)

1. Crea un progetto [Supabase](https://supabase.com).
2. Incolla `supabase/schema.sql` nella SQL Editor ed esegui.
3. Copia `.env.example` in `.env` e inserisci URL e chiave anonima del progetto.
4. Ricompila (`npm run build`). In *Sistema → Sincronizzazione cloud* apare il form di accesso.

Come funziona:

- Ogni utente ha **una sola riga** in `asta_sessions`, protetta da RLS (`auth.uid()`).
- Ogni salvataggio invia lo stato JSON con un **numero di revisione** crescente.
- Il database rifiuta revisioni vecchie tramite la funzione `asta_sync_push`: un dispositivo con dati obsoleti non può sovrascrivere uno più recente. L'app propone di scaricare la versione cloud.
- "Scarica dal cloud" chiede sempre conferma ed è annullabile con `Ctrl+Z`.
- Il backup JSON locale resta attivo come rete di sicurezza.

### Account e privacy

La registrazione usa email/password di Supabase Auth. Se abiliti la conferma email, il primo accesso richiede la verifica. La chiave anonima è pubblica per progetto: la sicurezza è garantita dalle policy RLS, non dal segreto della chiave.

Per distribuire l'app con sync, aggiungi due secret nel repo (`Settings → Secrets → Actions`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Note tecniche

- `base: './'` rende l'app deployabile anche in una sottocartella (GitHub Pages progetto).
- Il service worker fa network-first per le navigazioni e cache-first per gli asset; le richieste Supabase non vengono mai cacheate.
- Su `file://` la PWA non si registra: per sviluppare usa sempre `npm run dev`.
- Google Fonts è l'unica dipendenza esterna; in assenza di rete si usano i font di sistema.

## Fase 3 — CI

Il workflow esegue `npm test`, `npm run build` e pubblica `dist/` su GitHub Pages a ogni push su `main`.
