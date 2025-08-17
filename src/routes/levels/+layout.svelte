<script>
  import { goto } from '$app/navigation';
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { showOutput,myVariable, isCurrentLevelDrawing, outputID, solvedLevel, levelID, unlockNextLevel } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from "$data/levels.json";
  import P5Canvas from "$lib/Canvas/p5Canvas.svelte";
  import { fade } from 'svelte/transition';
  import "/src/data/layout.css";

  let output = "";
  let emotion = 'neutral';
  let message = '';
  let pulseHint = false;
  let isDragging = false;
  let startX, startLeftWidth;
  let canvasRef;
  let showSettings = false;
  let codeOutput;

  let currentLevelData = {};
  let solvedTasks = [];
  let allTasksSolved = false;

  const tips = [
    "Probier mal console.log()!",
    "Vergiss die Semikolons nicht!",
    "Du schaffst das!",
    "Fehler sind zum Lernen da!"
  ];

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  $: currentLevelData = levels[$levelID] || {};
  $: if (currentLevelData.description) {
    if (solvedTasks.length !== currentLevelData.description.length) {
      solvedTasks = new Array(currentLevelData.description.length).fill(false);
      allTasksSolved = false;
      pulseHint = false;
    }
  }

  $: if ($solvedLevel && $outputID >= 0 && $outputID < solvedTasks.length) {
    solvedTasks[$outputID] = true;
    checkLevelCompletion();
  }

  function checkLevelCompletion() {
    allTasksSolved = solvedTasks.every(task => task === true);
    pulseHint = allTasksSolved;
    if (allTasksSolved) {
      emotion = 'happy';
      message = '🎉 Level abgeschlossen! Klick auf 🗺️ um weiterzugehen!';
    } else {
      message = '';
      emotion = 'neutral';
    }
  }

  function goToMap() {
    outputID.set(0);
    goto('/map');
  }

  function goToHome() {
    outputID.set(0);
    goto('/');
  }

  function handleMascotClick() {
    if (!message) {
      message = tips[Math.floor(Math.random() * tips.length)];
      setTimeout(() => message = '', 3000);
    }
    emotion = emotion === 'neutral' ? 'neutral2' : 'neutral';
  }

  function handleMascotHover() {
    if (emotion === 'neutral') emotion = 'switch';
  }

  function handleMascotLeave() {
    if (emotion === 'switch') emotion = 'neutral';
  }

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;

  function startDrag(e) {
    isDragging = true;
    startX = e.clientX;
    startLeftWidth = document.querySelector('.sidebar').offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  function onDrag(e) {
    if (!isDragging) return;
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const dx = e.clientX - startX;
    const newLeftWidth = startLeftWidth + dx;
    const minWidth = 300;
    const maxWidth = container.offsetWidth - 300;

    if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
      sidebar.style.width = `${newLeftWidth}px`;
      sidebar.style.flex = '0 0 auto';
    }
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  onMount(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  });

  async function runJavaScript() {
    const code = get(myVariable);
    if(isCodeSafe(code)){
    try {
      let captured = "";
      const originalLog = console.log;
      console.log = (...args) => {
        captured += args.join(" ") + "\n";
      };

      const currentLevelData = levels[$levelID];
      if (currentLevelData && currentLevelData.type === "drawing") {
        if (canvasRef) canvasRef.runDrawingCode();
        output = "Zeichnung ausgeführt!";
      } else {
        const result = eval(code);
        const trimmedOutput = captured.trim() || String(result);
        let i = $outputID;
        const expectedOutput = currentLevelData.expectedOutput[i];
        console.log = originalLog;
        codeOutput = trimmedOutput;

        if(trimmedOutput === expectedOutput) {
          showOutput.set(true);
          output = "✓ Richtig: " + trimmedOutput;
          emotion = 'happy';
          message = 'Gut gemacht!';
          solvedLevel.set(true);
        } else {
          showOutput.set(true);
          output = "↳ Ergebnis: " + trimmedOutput + " | Erwartet: " + expectedOutput;
          emotion = 'think';
          message = 'Fast geschafft!';
        }
      }
    } catch (err) {
      showOutput.set(true);
      output = "✗ Fehler: " + err.message;
      emotion = 'sad';
      message = 'Versuch es nochmal!';
    }
  }
  }

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  //code nach verbotenen Befehlen überprüfen
  function isCodeSafe(code){
    let codeSafe = true;
    for(let i = 0; i < bannedCode.length; i++){
      if(code.toLowerCase().includes(bannedCode[i])){
        codeSafe = false;
        break;
      }
    }
    return codeSafe
  }

  let loading = false;
  let error = '';
  let code = '';
  let feedback = '';
  let bannedCode = ["getelementsby", "alert", "getelementby"];

  async function submitCode() {
    const code = get(myVariable);
    if(isCodeSafe(code)){
    if (codeOutput == levels[$levelID].expectedOutput[$outputID]) return;
    loading = true;
    error = '';
    feedback = '';

     const prompt = `role: system, content: Hier ist sehr simpler JavaScript-Code zwischen zwei Sternchen. Alles Notwendige für den Code sei gegeben:

*
${code}
*

Ignoriere die Sternchen. ANTWORTE KURZ!
Vergleich den Code mit dem erwarteten Output: '${levels[$levelID].expectedOutput[$outputID]}' Warum ist Code falsch?.
Beachte Groß- und Kleinschreibung sowie Zeichensetzung. ANTWORTE SO SIMPLE WIE MÖGLICH IN KINDERFREUNDLICHER SPRACHE! ANTWORTE AUF DEUTSCH!
**ANTWORTE KURZ** VERLGEICHE DEN ERWARTETET OUTPUT MIT DEM OUTPUT DES CODES! GIB KEINE CODE-ANTWORT!`;

    try {
      const res = await fetch('https://dkwdp.f4.htw-berlin.de/analyze', {
        //const res = await fetch('http://141.45.153.208:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      feedback = data.feedback;
      message = feedback;
    } catch (err) {
      error = 'Ups! Da konnte ich nicht helfen.: ' + err.message;
      message = error;
    } finally {
      loading = false;
    }
  }
  }

</script>

<main>
  <div class="top-bar">
    <button class="banner-button" on:click={goToMap()}>
      <img src="/banner.png" alt="Header Background" class="header-image" />
    </button>
   <!-- <button class="beltButton" on:click={toggleMenu}>Sammlung</button> -->
    {#if isOpen}
      <div class="popup-menu">
        <button class="close-btn" on:click={closeMenu}>✕</button>
        <div class="image-buttons">
          <img src="/lockedBelt.png" alt="Option 1" />
          <img src="/lockedBelt.png" alt="Option 2" />
          <img src="/lockedBelt.png" alt="Option 3" />
        </div>
      </div>
    {/if}
  </div>

  <div class="container">
    <div class="sidebar">
      <div class="header">
        <h1>Pinu's Abenteuer</h1>
        <div class="subtitle">Level {$levelID + 1}</div>
      </div>
      <slot />
    </div>
    <div class="resizer" on:mousedown={startDrag}></div>
    <div class="coding-area">
      <div class="editor-container">
        <div class="editor-header">
          <h2>Code Editor</h2>
       <!--   {#if !$isCurrentLevelDrawing}
            <button on:click={() => { runJavaScript(); submitCode(); }}>Ausführen</button>
          {/if} -->
        </div>

        {#if !$isCurrentLevelDrawing}
            <button class="run-button" on:click={() => { runJavaScript(); submitCode(); }}>Ausführen</button>
          {/if} 

        <JavaScriptEditor />
        <div class = "canvas">
          {#if $isCurrentLevelDrawing}
            <P5Canvas bind:this={canvasRef} />
          {/if}
        </div>
        {#if output && $showOutput}
          <div class="output-container {emotion}">
            <h3>Ergebnis</h3>
            <pre class="output">{output}</pre>
          </div>
        {/if}
      </div>
    </div>
    <div class="mascot-and-settings-container">
      <div class="mascot-container">
        <img 
          src={imageSrc} 
          alt="Natur-Maskottchen" 
          class="mascot"
          on:click={handleMascotClick}
          on:mouseover={handleMascotHover}
          on:mouseout={handleMascotLeave}
        />
        {#if message}
          <div class="speech-bubble">{message}</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Navigation -->
<!-- Navigation Buttons unten links -->
<div class="bottom-left-buttons">

  <button 
  class="nav-button" 
  on:click={goToHome} 
  aria-label="Hauptbildschirm"
>
  <span class="icon">🏠</span>
  <span class="tooltip">Hauptbildschirm</span>
</button>

  <button 
    class="nav-button {pulseHint ? 'pulse' : ''}" 
    on:click={goToMap} 
    aria-label="Zurück zur Karte"
  >
    <span class="icon">🗺️</span>
    <span class="tooltip">Zurück zur Karte</span>
  </button>

  <!---<button 
    class="nav-button" 
    on:click={goToHome} 
    aria-label="Hauptbildschirm"
  >
    <span class="icon">🏠</span>
    <span class="tooltip">Hauptbildschirm</span>
  </button> -->
</div>


</main>
