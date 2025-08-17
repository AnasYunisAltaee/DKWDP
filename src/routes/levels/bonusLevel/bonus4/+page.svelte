<script> //Was ist if/else Level
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let userCode = writable('');
  let consoleOutput = writable('');
  let currentStep = 0;

  const steps = [
    {
      title: "Was ist if/else?",
      description: `In JavaScript benutzt man 'if', um zu fragen: "Stimmt das?" Wenn ja, passiert etwas.
Beispiel:

let alter = 10;

if (alter >= 18) {
  console.log("Du bist erwachsen!");
} else {
  console.log("Du bist noch ein Kind!");}`,
      code: `let alter = 10;

if (alter >= 18) {
  console.log("Du bist erwachsen!");
} else {
  console.log("Du bist noch ein Kind!");}`
    },
    {
      title: "Mini-Level: Alter prüfen",
      description: `Ist jemand alt genug fürs Kino? Ergänze die Bedingung so, dass die Ausgabe stimmt.`,
      code: `let alter = 12;

// Ergänze den Code unten:
if (alter >= 16) {
  console.log("Du darfst alleine ins Kino.");
} else {
  console.log("Du brauchst Begleitung.");}`
    },
    {
      title: "Mini-Level: Farben vergleichen",
      description: `Ändere den Wert der Variable so, dass \"Blau ist cool!\" erscheint.`,
      code: `let farbe = "rot";

if (farbe === "blau") {
  console.log("Blau ist cool!");
} else {
  console.log("Das ist nicht Blau.");}`
    },
    {
      title: "Bonus: Eigenes Beispiel",
      description: `Erstelle deinen eigenen if/else-Code, z. B. mit Punkten oder Wetter.`,
      code: `let punkte = 25;

if (punkte >= 30) {
  console.log("Du bekommst einen Preis!");
} else {
  console.log("Noch ein paar Punkte mehr!");}`
    }
  ];

  let current = steps[currentStep];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      current = steps[currentStep];
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      current = steps[currentStep];
    }
  }

  function runCode() {
    try {
      const log = [];
      const originalLog = console.log;
      console.log = (...args) => log.push(args.join(" "));

      eval(get(userCode));

      console.log = originalLog;
      consoleOutput.set(log.join("\n"));
    } catch (e) {
      consoleOutput.set("Fehler: " + e.message);
    }
  }

  import { get } from 'svelte/store';

  onMount(() => {
    userCode.set(current.code);
  });

  $: current = steps[currentStep];
  $: userCode.set(current.code);
</script>

<main>
  <h1>{current.title}</h1>
  <p>{current.description}</p>

  <textarea bind:value={$userCode} rows="10" cols="60"></textarea>
  <br />
  <button on:click={runCode}>Code ausführen</button>

  <h3>Konsole:</h3>
  <pre>{$consoleOutput}</pre>

  <div style="margin-top: 20px">
    <button on:click={prevStep} disabled={currentStep === 0}>Zurück</button>
    <button on:click={nextStep} disabled={currentStep === steps.length - 1}>Weiter</button>
  </div>
</main>

<style>
  main {
    padding: 20px;
    font-family: sans-serif;
    max-width: 800px;
    margin: auto;
  }
  textarea {
    width: 100%;
    font-family: monospace;
    font-size: 14px;
  }
  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
  }
  pre {
    background-color: #f4f4f4;
    padding: 10px;
    white-space: pre-wrap;
    border: 1px solid #ccc;
  }
</style>
