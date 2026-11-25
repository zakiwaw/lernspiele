# Lernspiele

Next.js-App für Kinder (Noah, 5 Jahre, und Hidaya, 3 Jahre) – optimiert für iPad Air 4, Safari, Touch.

## Was ist drin

- **Abenteuer-Karte** als Startbildschirm mit vier Lernwelten (SVG/CSS-Landschaften, eigene Begleiter)
- **Formen-Welt** (ab 3, Fuchs Fidi): Finden, Zeig mir (Stimme), Nachfahren mit dem Finger
- **Muster-Welt** (ab 5, Eule Ulli): Was kommt als Nächstes? Farben, Tiere, Blumen, Fahrzeuge, Flugzeuge, drei Stufen
- **Zahlen-Welt** (ab 4, Biber Benno) und **Wörter-Welt** (ab 5, Hase Hanni): Platzhalter, nach und nach füllbar
- **Profile**: Noah und Hidaya, eigener Fortschritt, Sterne, Stufen
- **Missionen**: 10 Aufgaben pro Mission, Sterne, Lob per Stimme und Text, Pause-Idee
- **Elternbereich**: Zahnrad gedrückt halten – Fortschritt, Sterne, letzte Mission, Spielzeit-Limit, Fortschritt zurücksetzen (mit Bestätigung)
- **Offline-freundlich**: Spielen funktioniert lokal, Fortschritt wird in `localStorage` gespeichert und bei konfigurierter Datenbank an `/api/progress` synchronisiert

## Technik

- Next.js 14 (App Router), React 18, TypeScript
- API Route: `POST/GET /api/progress`
- Speicherung: lokal (`localStorage`) immer; optional Vercel Postgres/Neon über `POSTGRES_URL`
- Keine Werbung, keine In-App-Käufe, kein Tracking, keine Kinderkonten
- Keine Emojis, nur SVG und Tabler-Icons

## Lokal starten

```bash
npm install
npm run build
npm run dev
```

## Vercel-Deploy (Schritt für Schritt)

1. Code auf den Branch pushen (oder PR nach `main` mergen).
2. In Vercel ist das Projekt `lernspiele` bereits mit dem GitHub-Repo `zakiwaw/lernspiele` verbunden.
3. Vercel erkennt Next.js automatisch. Framework Preset: **Next.js**.
4. Build Command: `next build` (Standard). Output: Standard von Next.js.
5. Umgebungsvariablen sind für den lokalen Modus nicht nötig.
6. Nach dem Deploy ist die App unter https://lernspiele-rho.vercel.app erreichbar.

## Was du in Vercel noch anklicken musst (optional, für Cloud-Speicher)

Ohne Datenbank funktioniert alles mit lokalem Speicher auf dem Gerät. Für gemeinsamen Cloud-Fortschritt:

1. In Vercel im Projekt `lernspiele` auf **Storage** gehen.
2. **Create Database** / Marketplace öffnen und eine **Neon Postgres**-Datenbank anlegen (Vercel Postgres-Integration). Der kostenlose Plan reicht für den Start.
3. Die Datenbank mit dem Projekt `lernspiele` verbinden. Vercel setzt automatisch `POSTGRES_URL` (und weitere Variablen).
4. Neu deployen. Die Tabelle `lernspiele_progress` wird beim ersten API-Aufruf automatisch erstellt.

Wenn keine `POSTGRES_URL` gesetzt ist, nutzt die API keinen dauerhaften Server-Speicher; der Spielfortschritt bleibt trotzdem lokal auf dem Gerät erhalten.

## Alte Dateien

Die früheren statischen Dateien (`index.html`, `formen.html`, `muster.html`, `common.js`, `style.css`, `.nojekyll`) liegen im Ordner `legacy/`. Sie wurden nicht gelöscht, sondern durch die Next.js-App ersetzt. Die Spiellogik daraus wurde in die neuen React-Komponenten übernommen.

## Offene Punkte

- **Cloud-Sync ist einfach gehalten**: Die API speichert aktuell einen gemeinsamen Fortschrittsstand (`main`). Für mehrere Familiengeräte gleichzeitig wäre eine echte Benutzer-/Haushaltskennung sinnvoll.
- **Zahlen-Welt und Wörter-Welt** sind Platzhalter und noch ohne Missionen.
- **Spielzeit-Limit** wird im Elternbereich eingestellt und im Client angezeigt/gezählt; eine harte serverseitige Sperre über Geräte hinweg gibt es ohne Cloud-Konto nicht.
- **PWA/Service Worker** ist nicht vollständig eingerichtet; Offline-Spiel funktioniert durch lokale App-Nutzung im Browser, aber nicht als garantiert installierte Offline-App.
