<script>
  import { goto } from '$app/navigation';
  import { gameMode, unlockLevelsUpTo, level_range } from '$lib/stores/editorStore';
  
  let selectedLevel = 1;
  
  // Freien Modus
  function startFreeMode() {
    gameMode.set('free');
    goto('/map');
  }
  
  // Level-Auswahl
  function startProgressionMode() {
    gameMode.set('progressive');
    unlockLevelsUpTo(selectedLevel);
    goto('/map');
  }
</script>

<div class="page-container">
  <div class="image-container">
    <!-- Background Image -->
    <img src="/homescreen_resized.png" alt="Adventure Background" class="homescreen-image" />
    
    <div class="buttons">
      <div>
        <!-- Level Selection -->
        <select bind:value={selectedLevel} class="level-select">
          {#each level_range.reverse() as level}            
            <option value={level}>Level {level}</option>
          {/each}
        </select>
        <!-- Progression Mode Button -->
        <button on:click={startProgressionMode}>
          Reiseziel setzen
        </button>
      </div>
      
      <!-- Free Mode Button -->
      <button class="free-mode-button" on:click={startFreeMode}>
        - Freier Modus -
      </button>
    </div>
  </div>
</div>

<style>
  /* Global Body Reset */
  :global(body) {
    margin: 0;
    overscroll-behavior: none;
  }
  
  .page-container {
    height: 100vh;
  }
    
  .image-container {
    height: 100%;
  }

  .homescreen-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .buttons {
    position: absolute;
    bottom: 28%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .level-select {
    padding: 12px 16px;
    font-size: 1.1rem;
    border: 3px solid #3498db;
    border-radius: 10px;
    background: rgb(255, 255, 255);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .level-select:hover {
    border-color: #2980b9;
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.3);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .level-select:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }

  button {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: #ffffff;
    padding: 13px 22px;
    font-size: 1.2rem;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    letter-spacing: 0.5px;
  }

  /* Button Hover States */
  button:hover {
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(231, 76, 60, 0.5);
  }

  button:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }

  /* Free Mode Button Special Styles */
  .free-mode-button:focus {
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
  }

  .free-mode-button {
    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  }

  .free-mode-button:hover {
    background: linear-gradient(135deg, #229954 0%, #1e8449 100%);
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.5);
  }
</style>