<script>
  import {
    showOutput,
    myVariable,
    isCurrentLevelDrawing,
    solvedLevel,
    levelID,
    outputID,
    unlockNextLevel,
  } from "$lib/stores/editorStore";
  import levels from "$data/levels.json";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let levelIndex;

  let currentLevel;
  let solvedTasks = [];
  let unlockedTasks = [];

  onMount(() => {
    currentLevel = levels[levelIndex];
    solvedTasks = new Array(currentLevel.description.length).fill(false);
    unlockedTasks = new Array(currentLevel.description.length).fill(false);
    unlockedTasks[0] = true;

    outputID.set(0);
    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(levelIndex);
    isCurrentLevelDrawing.set(currentLevel.type == "drawing");
  });

  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;
    if ($outputID + 1 < unlockedTasks.length) {
      unlockedTasks[$outputID + 1] = true;
    }
    checkLevelCompletion();
  }

  function nextTask() {
    let currentTask = $outputID + 1;

    if (currentTask >= currentLevel.description.length) {
      unlockNextLevel(levelIndex + 1);
      goto(`/levels/level${levelIndex + 2}`);
      showOutput.set(false);
      return;
    }

    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(solvedTasks[currentTask]);
    showOutput.set(false);
  }

  function previousTask() {
    let currentTask = Math.max(0, $outputID - 1);

    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(solvedTasks[currentTask]);
    showOutput.set(false);
  }

  function checkLevelCompletion() {
    const allTasksSolved = solvedTasks.every((task) => task === true);

    if (allTasksSolved) {
      unlockNextLevel(levelIndex + 1);
      console.log(`Level ${levelIndex + 2} wurde freigeschaltet!`);
    }
  }
</script>

<main>
  {#if currentLevel}
    <h1>{currentLevel.title[$outputID]}</h1>
    <p>{currentLevel.description[$outputID]}</p>

    {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
      <p>{currentLevel.hints[$outputID]}</p>
    {/if}

    <div>
      {#if $outputID > 0}
        <button on:click={previousTask}>Zurück</button>
      {/if}

      {#if $solvedLevel && $outputID + 1 < currentLevel.description.length && unlockedTasks[$outputID + 1]}
        <button on:click={nextTask} class="blink">Weiter</button>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    padding: 20px;
    text-align: center;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    transition: all 0.3s ease;
  }

  @keyframes blink {
    0%, 100% {
      filter: brightness(1);
      transform: scale(1);
    }
    50% {
      filter: brightness(1.3);
      transform: scale(1.05);
    }
  }

  .blink {
    animation: blink 1s infinite ease-in-out;
  }
</style>
