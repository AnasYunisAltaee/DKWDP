
<script> //Was ist eine For Schleife Level
  let step = 0;
  let message = '';
  let userCode = '';
  

  const steps = [
    {
      title: 'Was ist eine for-Schleife?',
      explanation: `Mit einer for-Schleife kannst du etwas mehrmals wiederholen. Beispiel:

for (let i = 0; i < 5; i++) {
  console.log(i);
}

Das gibt die Zahlen 0 bis 4 aus.`
    },
    {
      title: '🧠 Übung: Zähle von 1 bis 5',
      explanation: 'Schreibe eine for-Schleife, die die Zahlen von 1 bis 5 in die Konsole ausgibt.'
    },
    {
      title: 'Was ist eine while-Schleife?',
      explanation: `Eine while-Schleife wiederholt sich, solange eine Bedingung wahr ist. Beispiel:

let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}`
    },
    {
      title: '🧠 Übung: Zähle mit while von 0 bis 3',
      explanation: 'Schreibe eine while-Schleife, die die Zahlen 0 bis 3 ausgibt.'
    }
  ];

  function runCode() {
    message = '';
    try {
      // eval nur zu Lernzwecken in sicherer Umgebung!
      console.clear();
      eval(userCode);
      message = '✅ Code erfolgreich ausgeführt!';
    } catch (e) {
      message = '❌ Fehler im Code: ' + e.message;
    }
  }

  function nextStep() {
    if (step < steps.length - 1) step++;
  }

  function prevStep() {
    if (step > 0) step--;
  }
</script>

<main>
  <h1>{steps[step].title}</h1>
  <pre>{steps[step].explanation}</pre>

  {#if steps[step].title.startsWith('🧠')}
    <textarea
      bind:value={userCode}
      rows="6"
      placeholder="Schreibe deinen Code hier (z. B. for (let i = 1; i &lt;= 5; i++) &#123; console.log(i); &#125;)"
    ></textarea>
    <button on:click={runCode}>▶️ Ausführen</button>
    <p>{message}</p>
  {/if}

  <div style="margin-top: 20px">
    <button on:click={prevStep} disabled={step === 0}>⬅️ Zurück</button>
    <button on:click={nextStep} disabled={step === steps.length - 1}>➡️ Weiter</button>
  </div>
</main>

<style>
  main {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    font-family: sans-serif;
    background-color: #f0f8ff;
    border-radius: 12px;
  }

  h1 {
    color: #007acc;
    font-size: 1.8rem;
  }

  pre {
    background: #e6f2ff;
    padding: 12px;
    border-left: 4px solid #007acc;
    white-space: pre-wrap;
    border-radius: 6px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    font-family: monospace;
    font-size: 1rem;
    border: 2px solid #007acc;
    border-radius: 8px;
    margin-top: 10px;
  }

  button {
    padding: 8px 16px;
    margin: 5px;
    border: none;
    border-radius: 6px;
    background-color: #007acc;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  p {
    font-weight: bold;
    color: #d32f2f;
  }
</style>