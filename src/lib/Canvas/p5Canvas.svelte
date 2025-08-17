<script>
  import { onMount, onDestroy } from "svelte";
  import { myVariable } from "$lib/stores/editorStore";
  import { get } from "svelte/store";

  let canvasContainer;
  let p5Instance;
  let lastCode = "";

  function executeDrawingCode(code) {
    try {
      const func = new Function(
        "p",
        "console",
        `
        with(p) {
          ${code}
        }
      `
      );
      func(p5Instance, console);
    } catch (error) {
      console.error("Fehler beim Ausführen des Codes:", error);
    }
  }

  function initP5() {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.parent(canvasContainer);
        p.background(255);
      };

      p.draw = () => {
        p.background(255);
        if (lastCode.trim() !== "") {
          executeDrawingCode(lastCode);
        }
      };
    };

    p5Instance = new window.p5(sketch);
  }

  onMount(() => {
    if (typeof window !== "undefined" && window.p5) {
      initP5();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js";
      script.onload = () => initP5();
      document.head.appendChild(script);
    }
  });

  onDestroy(() => {
    if (p5Instance) p5Instance.remove();
  });

  export function runDrawingCode() {
    const code = get(myVariable);
    lastCode = code;
  }

  export function clearCanvas() {
    if (p5Instance) {
      p5Instance.background(255);
      lastCode = "";
    }
  }
</script>


<div class="canvas-container">
  <h3>Zeichenfläche</h3>
  <div class="canvas-wrapper" bind:this={canvasContainer}>
    <!-- p5.js Canvas -->
  </div>
  <div class="canvas-controls">
    <button on:click={runDrawingCode}>Zeichnung ausführen</button>
    <button on:click={clearCanvas}>Canvas leeren</button>
  </div>
</div>

<style>
  .canvas-wrapper canvas {
    border: 3px solid black;
    border-radius: 12px;
  }
</style>
