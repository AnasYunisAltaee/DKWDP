<script> //Roboter Level 
  import { onMount } from 'svelte';

  // Größe des Gitters und jeder Zelle
  let gridSize = 10;
  let cellSize = 40;

  // Startposition des Roboters
  let robotX = 0;
  let robotY = 0;
  let direction = 'right'; // Anfangsrichtung des Roboters

  // Pfade für die Bewegung und Zielposition
  let path = [[0, 0]];
  let levelPath = [];
  let message = '';
  const goal = [4, 4]; // Zielkoordinaten
  const directions = ['up', 'right', 'down', 'left']; // Mögliche Richtungen

  // Funktion, um den Roboter nach links zu drehen
  function turn_left() {
    const index = directions.indexOf(direction);
    direction = directions[(index + 3) % 4];
  }

  // Funktion, um den Roboter nach rechts zu drehen
  function turn_right() {
    const index = directions.indexOf(direction);
    direction = directions[(index + 1) % 4];
  }

  // Funktion zur Bewegung des Roboters
  function move() {
    let [newX, newY] = [robotX, robotY];

    // Bewegt sich je nach aktueller Richtung
    if (direction === 'up') newY--;
    else if (direction === 'down') newY++;
    else if (direction === 'left') newX--;
    else if (direction === 'right') newX++;

    // Überprüft, ob die neue Position innerhalb des Gitters ist
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
      robotX = newX;
      robotY = newY;
      path.push([robotX, robotY]);

      // Überprüft, ob das Ziel erreicht wurde
      if (robotX === goal[0] && robotY === goal[1]) {
        message = '🎉 Du hast das Ziel erreicht!';
      }
    }
  }

  // Variable für den vom Nutzer geschriebenen Code
  let userCode = '';

  // Funktion zur Ausführung des Benutzer-Codes
  function runUserCode() {
    message = '';
    try {
      eval(userCode); // Führt den eingegebenen Code aus
    } catch (e) {
      message = 'Fehler im Code: ' + e.message;
    }
  }

  // Definition verschiedener Level mit Startpunkten und Zielen
  const levels = [
    {
      name: 'Level 1',
      goal: [4, 4],
      start: [0, 0],
      path: [[0,0],[1,0],[2,0],[3,0],[4,0], [4,1],[4,2],[4,3]]
    },
    {
      name: 'Level 2',
      goal: [6, 2],
      start: [1, 7],
      path: [[1,7],[1,6],[1,5],[1,4],[1,3], [1,2],[2,2],[3,2],[4,2],[5,2]]
    },
    {
      name: 'Level 3',
      goal: [4, 2],
      start: [9, 9],
      path: [[9,8],[9,7],[9,6],[8,6],[7,6], [6,6],[5,6],[4,6],[4,5],[4,4],[4,3]]
    },
  ];

  // Funktion zum Laden eines Levels
  function loadLevel(level) {
    robotX = level.start[0];
    robotY = level.start[1];
    direction = 'right';
    path = [[robotX, robotY]];
    message = '';
    goal[0] = level.goal[0];
    goal[1] = level.goal[1];
    levelPath = level.path || [];
  }

  // Lädt das erste Level beim Start der Komponente
  onMount(() => loadLevel(levels[0]));
</script>


<style>
  /* Globale Stile für die gesamte Seite */
  :global(body) {
    font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
    background: linear-gradient(to bottom, #f0f8ff, #e6f7ff); /* Sanfte Hintergrundfarbe */
    padding: 20px;
    color: #333; /* Dunkle Textfarbe für bessere Lesbarkeit */
  }

  /* Stil für die Hauptüberschrift */
  h1 {
    text-align: center;
    font-size: 2.5rem;
    color: #007acc; /* Blaue Farbe für einen frischen Look */
  }

  /* Stil für normale Absätze */
  p {
    text-align: center;
    font-size: 1.1rem;
  }

  /* Die Spielfläche wird als Grid erstellt */
  .grid {
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-template-rows: repeat(10, 40px);
    gap: 2px;
    background-color: #ccc; /* Gitter-Hintergrund */
    margin: 20px auto;
    border: 3px solid #007acc; /* Rahmen für das Gitter */
    width: fit-content;
    border-radius: 10px; /* Abgerundete Ecken */
  }

  /* Gestaltung der einzelnen Zellen im Gitter */
  .cell {
    width: 40px;
    height: 40px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 5px;
  }

  /* Der Pfad des Roboters wird hervorgehoben */
  .path {
    background-color: #b3e5fc;
  }

  /* Die Zielposition wird visuell hervorgehoben */
  .goal {
    background-color: #c8e6c9;
    border: 2px dashed #388e3c; /* Grün gestrichelte Umrandung */
  }

  /* Markierungen für Hinweise */
  .hint {
    background-color: #e0f7ff;
    border: 1px dashed #81d4fa;
  }

  /* Steuerungselemente zentrieren */
  .controls, .level-selector {
    text-align: center;
    margin-top: 20px;
  }

  /* Stil der Buttons */
  .level-selector button, button {
    margin: 5px;
    padding: 8px 12px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background-color: #007acc;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  /* Hover-Effekt für Buttons */
  .level-selector button:hover, button:hover {
    background-color: #005b99;
  }

  /* Stil für das Code-Eingabefeld */
  textarea {
    display: block;
    margin: 10px auto;
    padding: 10px;
    font-family: monospace;
    font-size: 1rem;
    width: 80%;
    max-width: 600px;
    border: 2px solid #007acc;
    border-radius: 10px;
    resize: vertical;
  }

  /* Roboter-Animationen für Richtungswechsel */
  .robot {
    transform: rotate(0deg);
    transition: transform 0.3s;
  }

  /* Rotationen abhängig von der Richtung des Roboters */
  .up .robot { transform: rotate(-90deg); }
  .down .robot { transform: rotate(90deg); }
  .left .robot { transform: rotate(180deg); }
  .right .robot { transform: rotate(0deg); }
</style>


<!-- Hauptüberschrift für das Spiel -->
<h1>🧠 Roboter-Abenteuer</h1>

<!-- Erklärung für die Steuerung des Roboters -->
<p>Programmiere deinen Roboter mit <code>turn_left()</code>, <code>turn_right()</code> und <code>move()</code>!</p>

<!-- Auswahl der Level -->
<div class="level-selector">
  {#each levels as level}
    <!-- Button für jedes Level, um es zu laden -->
    <button on:click={() => loadLevel(level)}>{level.name}</button>
  {/each}
</div>

<!-- Erstellung des Spielfelds als Grid -->
<div class="grid {direction}">
  {#each Array(gridSize) as _, y}
    {#each Array(gridSize) as _, x}
      <div
        class="cell 
          {path.find(p => p[0] === x && p[1] === y) ? 'path' : ''} 
          {goal[0] === x && goal[1] === y ? 'goal' : ''} 
          {levelPath.find(p => p[0] === x && p[1] === y) ? 'hint' : ''}"
      >
        <!-- Falls der Roboter sich auf dieser Zelle befindet, wird er angezeigt -->
        {#if robotX === x && robotY === y}
          <span class="robot">🤖</span>
        {/if}
      </div>
    {/each}
  {/each}
</div>

<!-- Eingabebereich für den Benutzer-Code -->
<textarea
  bind:value={userCode}
  rows="6"
  cols="50"
  placeholder="Schreibe deinen Code hier (z.B. move(); turn_left(); move();)"
></textarea>
<br />

<!-- Button zum Ausführen des Codes -->
<button on:click={runUserCode}>🚀 Code ausführen</button>

<!-- Anzeige von Nachrichten oder Fehlern -->
<p style="text-align: center; font-weight: bold; color: #d32f2f;">{message}</p>
