# Der kleine Weg der Programmierung

Eine interaktive Website für das CoderDojo Berlin Schöneweide, auf der Kinder spielerisch JavaScript programmieren lernen können.

## Überblick

Dieses Projekt bietet eine benutzerfreundliche Lernplattform mit verschiedenen Levels, die Kindern dabei helfen, JavaScript-Grundlagen durch praktische Übungen und interaktive Aufgaben zu erlernen.

## Installation

### Voraussetzungen

- Node.js (Version 16 oder höher)
- npm

### Setup

1. Repository klonen:
```bash
git clone https://github.com/dkwdp/Der-kleine-Weg-des-Programmierens.git
cd der-kleine-weg-der-programmierung
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

## Projektstruktur
<details>
<summary>Gesamte Projekstruktur anzeigen</summary>

```
Der-kleine-Weg-des-Programmierens/
├── 📁 src/
│   ├── 📁 data/
│   │   ├── layout.css
│   │   └── levels.json
│   │
│   ├── 📁 lib/
│   │   ├── 📁 Canvas/
│   │   │   ├── Canvas.svelte
│   │   │   └── p5Canvas.svelte
│   │   ├── editorStore.ts
│   │   ├── index.js
│   │   ├── JavaScriptEditor.svelte
│   │   └── levelpage.svelte
│   │
│   ├── 📁 routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                     (Front Page)
│   │   ├── 📁 levels/
│   │   │   ├── 📁 bonusLevel/
│   │   │   │   ├── 📁 bonus1/
│   │   │   │   │   └── +page.svelte         (Bonus Level Page)
│   │   │   │   ├── 📁 bonus2/              (unbenutzt)
│   │   │   │   ├── 📁 bonus3/              (unbenutzt)
│   │   │   │   └── 📁 bonus4/              (unbenutzt)
│   │   │   ├── 📁 level1/
│   │   │   │   └── +page.svelte            (Level Page)
│   │   │   ├── 📁 level2/
│   │   │   ├── 📁 level3/
│   │   │   ├── 📁 level4/
│   │   │   ├── 📁 level5/
│   │   │   ├── 📁 level6/
│   │   │   ├── 📁 level7/
│   │   │   ├── 📁 level8/
│   │   │   ├── 📁 level9/
│   │   │   └── 📁 level10/
│   │   ├── 📁 map/
│   │   │   └── +page.svelte                 (Map Page)
│   │   └── 📁 mascot/
│   │       └── Mascot.svelte
│   │
│   └── app.html
│
├── 📁 static/
│   ├── 📁 icons/
│   │   ├── *.png                           (Level-Icons)
│   ├── banner.png
│   ├── favicon.png
│   ├── homescreen_resized.png
│   ├── lockedBelt.png
│   └── map.png
│
├── 📄 Konfigurationsdateien
├── .gitignore
├── jsconfig.json
├── package.json
├── package-lock.json
├── README.md
├── svelte.config.js
└── vite.config.js
```
</details>

## Neue Level hinzufügen

### Schritt 1: Level-Ordner erstellen

Erstelle einen neuen Ordner unter `src/routes/levels/` mit dem Namen `levelX` (wobei X die Levelnummer ist):

```bash
mkdir src/routes/levels/level[nummer]
```

### Schritt 2: Svelte-Komponente erstellen

Erstelle eine neue Datei `+page.svelte` in dem neu erstellten Level-Ordner:

```bash
touch src/routes/levels/level[nummer]/+page.svelte
```

### Schritt 3: Code übernehmen und anpassen

1. Kopiere den Code aus einem bestehenden Level
2. Passe den Index im Code entsprechend an
3. Beispiel-Struktur für `+page.svelte`:

```svelte
<script>
  import LevelPage from '$lib/levelpage.svelte';
</script>

<LevelPage levelIndex={0}></LevelPage>
//hier den Level Index anpassen
```

### Schritt 4: Level-Inhalte in JSON definieren

Füge die Level-Inhalte in die `levels.json` Datei hinzu:

```json
{
  "id": "levelID",
  "title": ["Erstes Programm", "Zweite Aufgabe"],
  "description": ["Schreibe dein erstes...", "Jetzt erweitere..."],
  "expectedOutput": ["Hello World", "Hello Coder"],
  "initialCode": ["console.log('...')", "console.log('...')"],
  "type": "calculation" ODER "drawing",
  "hints": ["Tipp 1...", "Tipp 2..."]
},
```

**Wichtig:** Der Array-Index der jeweiligen Elemente entspricht dem Unterlevel, und der Hauptindex muss mit dem Index in der json Datei, der im Level-Code verwendet wird.

### Schritt 5: Level zur Karte hinzufügen

**5.1 Level-Daten in der Map definieren**

Füge das neue Level zum `levelData` Array in `src/routes/map/+page.svelte` hinzu:

```javascript
const levelData = [
    // ... bestehende Level
    { id: [LevelNummer], x: [X-Position%], y: [Y-Position%], icon: '[icon-name]', name: '[Level-Name]', size: 'small'|'medium'|'large' },
];
```

**Positionierung:**
- `x` und `y` sind Prozentangaben (0-100) für die Position auf der Karte
- `size` bestimmt die Größe des Level-Buttons: `small`, `medium`, oder `large`

**5.2 Level-Icon hinzufügen**

1. Füge eine PNG-Datei für das Level-Icon hinzu: `static/icons/[icon-name].png`
2. Empfohlene Icon-Größe: 256x256px oder größer
3. Das Icon sollte transparent sein für beste Darstellung

Falls kein Icon gegeben wird, erstellt die Website ein beziffertes blaues Fallback Icon.

### Schritt 6: Level-Index korrekt setzen

**Wichtig:** Der `levelIndex` in der `+page.svelte` muss mit dem Array-Index in `levels.json` übereinstimmen!

```svelte
<!-- Für das 1. Level (Index 0 in JSON) -->
<LevelPage levelIndex={0}></LevelPage>

<!-- Für das 2. Level (Index 1 in JSON) -->
<LevelPage levelIndex={1}></LevelPage>

<!-- Für das 5. Level (Index 4 in JSON) -->
<LevelPage levelIndex={4}></LevelPage>
```

### Schritt 7: Automatische Level-Erkennung

Das System erkennt automatisch die Anzahl der Level durch `max_levels = levels.length`. Man muss **nichts manuell anpassen** - einfach zur JSON-Datei hinzufügen und fertig!

## Bonus-Level hinzufügen

### Schritt 1: Bonus-Level zur Map hinzufügen

Füge das Bonus-Level zum `bonusLevelData` Array in `src/routes/map/+page.svelte` hinzu:

```javascript
const bonusLevelData = [
    { id: [BonusId], x: [X%], y: [Y%], icon: '[Emoji]', name: '[Name]', unlockAfter: [LevelNummer], route: '/levels/bonusLevel/bonus[id]'}
];
```

### Schritt 2: Freischaltungs-Bedingung definieren

Füge die Freischaltungs-Bedingung in `src/lib/stores/editorStore.ts` hinzu:

```javascript
const bonusUnlockRequirements = {
    1: 3,  // Bonus-Level 1 wird nach Level 2 freigeschaltet
    2: 7,  // Bonus-Level 2 wird nach Level 6 freigeschaltet
    // Neue Bonus-Level hier hinzufügen
};
```

### Schritt 3: Bonus-Level Route erstellen

Erstelle die entsprechende Route-Struktur:
```
src/routes/levels/bonusLevel/bonus[id]/+page.svelte
```
