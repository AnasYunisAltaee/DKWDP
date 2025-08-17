<script>
    export let emotion = 'neutral';
    export let message = '';

    const emotionImages = {
      happy: '/PinuHappy.png',
      neutral: '/PinuNeutral.png',
      sad: '/PinuSad.png',
      think: '/PinuThink.png',
      switch: '/PinuSwitch.png',
      neutral2: '/PinuNeutral2.png',
    };
    
    // Dynamische Image Source
    $: imageSrc = emotionImages[emotion] || emotionImages.neutral;
</script>

<div class="mascot-container">
    <div class="mascot-wrapper">
      <!-- Pinguin Image -->
      <img 
        src={imageSrc} 
        alt="Pinguin-Maskottchen" 
        class="mascot-image"
      />
    </div>
    
    <!-- SprechBubble -->
    {#if message}
      {#key message}
        <div class="speech-bubble">
          {message}
        </div>
      {/key}
    {/if}
</div>

<style>
  /* Mascot Container */
  .mascot-container {
    position: fixed;
    bottom: 40px;
    right: 40px;
    height: 120px;
    z-index: 2; 
  }

  .mascot-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
    justify-content: center;
  }

  /* Mascot Image */
  .mascot-image {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    transition: filter 0.3s ease;
    animation: 
      idle 6s ease-in-out infinite,
      glow 8s ease-in-out infinite;
  }

  .mascot-image:hover {
    animation: 
      bounce 1s ease-in-out;
  }

  /* Pinguin Idle Animation */
  @keyframes idle {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg) scale(1); 
    }
    25% { 
      transform: translateY(-2px) rotate(-2deg) scale(1.02); 
    }
    50% { 
      transform: translateY(-4px) rotate(1deg) scale(1.04); 
    }
    75% { 
      transform: translateY(-2px) rotate(2deg) scale(1.02); 
    }
  }

  /* Subtile Glow Animation */
  @keyframes glow {
    0%, 100% { 
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); 
    }
    50% { 
      filter: drop-shadow(0 6px 12px rgba(228, 225, 51, 0.3)); 
    }
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1) rotate(3deg); }
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    right: -10px; 
    left: auto; 
    transform: none; 
    margin-bottom: 12px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
    border: 2px solid #000000;
    border-radius: 15px;
    max-width: 220px;
    min-width: 100px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    color: #000000;
    text-align: center;
    animation: 
      bubbleAppear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      bob 5s ease-in-out infinite;
    z-index: 1001;
  }

  /* Sprechbubble Appear Animation */
  @keyframes bubbleAppear {
    0% { 
      opacity: 0; 
      transform: scale(0.8) translateY(10px); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0px); 
    }
  }

  /* Leichte Bob Animation */
  @keyframes bob {
    0%, 100% { 
      transform: translateY(0px) scale(1); 
    }
    50% { 
      transform: translateY(-3px) scale(1.01); 
    }
  }

  /* Sprechblasenpfeil (Border) */
  .speech-bubble::before {
    content: '';
    position: absolute;
    top: 100%; 
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 9px solid transparent; 
    border-right: 9px solid transparent; 
    border-top: 9px solid #000000;
    z-index: 1;
  }

  /* Sprechblasenpfeil (Fill) */
  .speech-bubble::after {
    content: '';
    position: absolute;
    top: 100%; 
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #ffffff;
    z-index: 2;
    margin-top: -1px;
  }
</style>