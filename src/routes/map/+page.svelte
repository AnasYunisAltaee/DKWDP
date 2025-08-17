<script>
	import { goto } from '$app/navigation';
	import { gameMode, unlockedLevels, bonusLevelsUnlocked, max_levels } from '$lib/stores/editorStore';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Mascot from '../mascot/Mascot.svelte';
	
	// Level-Daten
	const levelData = [
		{ id: 1, x: 60, y: 12, icon: 'polarbear', name: 'Polarbaer', size: 'medium' },
		{ id: 2, x: 22, y: 22, icon: 'tent', name: 'Zelt', size: 'medium' },
		{ id: 3, x: 30, y: 42, icon: 'hut', name: 'Huette', size: 'large' },
		{ id: 4, x: 63, y: 42, icon: 'angler', name: 'Angler', size: 'small' },
		{ id: 5, x: 49, y: 53, icon: 'bridge', name: 'Bruecke', size: 'large' },
		{ id: 6, x: 70, y: 57, icon: 'lumberjack', name: 'Holzfaeller', size: 'small' },
		{ id: 7, x: 48, y: 73, icon: 'raft', name: 'Floß', size: 'medium' },
		{ id: 8, x: 20, y: 85, icon: 'kid', name: 'Kind', size: 'small' },
		{ id: 9, x: 70, y: 90, icon: 'flower', name: 'Blume', size: 'small' },
		{ id: 10, x: 43, y: 95, icon: 'fish', name: 'Fisch', size: 'small' },
	];

	// Bonus Level Daten
	const bonusLevelData = [
		{ id: 1, x: 33, y: 79, icon: '✨', name: 'Bonus 1', route: '/levels/bonusLevel/bonus1'},
	];

	// Messages
	const welcomeMessages = [
		'Yo, wieder da! 🐧',
		'Bock zu coden?',
		'Chillig hier, oder? Los geht\'s!',
		'Coding-Zeit! Bereit?',
		'Eis to see you! 🧊',
		'Hi',
		'Willkommen beim Coder-Dojo!'
	];

	const idleMessages = [
		'Chillst du noch oder codest du schon? 🐧',
		'Die Level warten auf dich!',
		'Watschel watschel... langweilig hier! 😴',
		'Flossen bereit? Lass uns eintauchen!',
		'Rutsch ins Coden wie ein Pinguin! 🧊',
		'Kein Stress, lass dir Zeit!',
		'Watschel rüber und wähl ein Level!',
		'Fisch später, coden jetzt! 🐟'
	];

	const hoverMessages = [
		'braucht deine Skills!',
		'sieht chill aus! 🧊',
		'braucht deine Pinguin-Power!',
		'sieht genial aus!',
		'wartet auf Rutschpartie!',
		'ist bereit!',
		'braucht uns! ✨'
	];

	const bonusHoverMessages = [
		'ist ein geheimes Abenteuer! ✨',
		'ist voller Überraschungen!',
		'ist bereit für Action! 💫',
		'ist ein Bonus-Level'
	];

	// Mascot Status
	let emotion = 'neutral';
	let message = 'Willkommen!';
	let inactivityTimer;
	let currentNeutralState = 'neutral';
	let iconLoadStates = {};
	
	// automatische Path Lines zwischen den Leveln
	const pathLines = [];
	for (let i = 0; i < levelData.length - 1; i++) {
		pathLines.push({
			x1: levelData[i].x,
			y1: levelData[i].y,
			x2: levelData[i + 1].x,
			y2: levelData[i + 1].y
		});
	}

	// Helper-Funktionen
	function isLevelUnlocked(levelId) {
		return $gameMode === 'free' || $unlockedLevels.includes(levelId);
	}

	function isBonusLevelUnlocked(bonusId) {
		return $gameMode === 'free' || $bonusLevelsUnlocked.includes(bonusId);
	}

	function getRandomMessage(messageArray) {
		return messageArray[Math.floor(Math.random() * messageArray.length)];
	}

	function getRandomIdleMessage() {
		return getRandomMessage(idleMessages);
	}

	function getWelcomeMessage() {
		return getRandomMessage(welcomeMessages);
	}

	// Mascot Update
	function updateMascot(newEmotion, newMessage) {
		emotion = newEmotion;
		message = newMessage;
		resetInactivityTimer();
	}

	// Inaktivitäts Timer
	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			if (emotion === 'neutral' || emotion === 'neutral2' || emotion === 'think') {
				currentNeutralState = currentNeutralState === 'neutral' ? 'neutral2' : 'neutral';
				updateMascot(currentNeutralState, getRandomIdleMessage());
			}
		}, 10000);
	}

	// Icon Loading Handler
	function handleIconError(levelId) {
		iconLoadStates[levelId] = false;
		iconLoadStates = { ...iconLoadStates };
	}

	function handleIconLoad(levelId) {
		iconLoadStates[levelId] = true;
		iconLoadStates = { ...iconLoadStates }; 
	}
	
	// Level Navigation
	function LevelJoin(levelId) {
		if (browser && levelId && typeof levelId === 'number' && levelId >= 1 && levelId <= max_levels) {
			sessionStorage.setItem('lastVisitedLevel', levelId.toString());
		}
		setTimeout(() => {
			goto(`/levels/level${levelId}`);
		}, 200);
	}

	// Bonus Level Navigation
	function BonusLevelJoin(bonusLevel) {
		setTimeout(() => {
			goto(bonusLevel.route);
		}, 200);
	}

	// Hover Events
	function onLevelHover(level) {		
		const hoverMessage = getRandomMessage(hoverMessages);
		updateMascot('think', `Level ${level.id} ${hoverMessage}`);
	}

	function onBonusLevelHover(bonusLevel) {
		const hoverMessage = getRandomMessage(bonusHoverMessages);
		updateMascot('think', `${bonusLevel.name} ${hoverMessage}`);
	}

	// Mascot Initialisierung
	function initializeMascot() {
		const welcomeMsg = getWelcomeMessage();
		emotion = 'neutral';
		message = welcomeMsg;
		resetInactivityTimer();
	}

	// Auto Scroll zu letztem Level
	function handleAutoScroll() {
		let targetLevel;
		
		const lastVisitedLevel = browser ? sessionStorage.getItem('lastVisitedLevel') : null;
		const cameFromLevel = $page.url.searchParams.get('from') || lastVisitedLevel;
		
		const parsedLevel = cameFromLevel ? parseInt(cameFromLevel, 10) : null;
		
		if (parsedLevel && !isNaN(parsedLevel) && isLevelUnlocked(parsedLevel)) {
			targetLevel = parsedLevel;
			if (browser) sessionStorage.removeItem('lastVisitedLevel');
		} else {
			targetLevel = $unlockedLevels.length === 0 ? 1 : Math.max(...$unlockedLevels);
		}
		
		const levelButton = document.querySelector(`[data-level="${targetLevel}"]`);
		if (levelButton) {
			levelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	// Lifecycle Events
	onMount(() => {
		initializeMascot();
		setTimeout(handleAutoScroll, 50);
	});
	
	onDestroy(() => {
		clearTimeout(inactivityTimer);
	});
</script>

<!-- Mascot Component -->
<Mascot {emotion} {message} />

<div class="page-container">
	<div class="map-container">
		<!-- Hintergrund Map -->
		<img src="/map.png" alt="Adventure Map" class="map-image" />
		
		<!-- Header Overlay -->
		<div class="map-header-overlay">
			<h1>Willkommen im Coder-Dojo Abenteuerpfad!</h1>
		</div>

		<!-- Schnee-Animation -->
		<div class="snowflakes" aria-hidden="true">
			{#each Array(25) as _, i}
				<div class="snowflake">
					{['❅', '❆', '❄', '❅', '❆'][i % 5]}
				</div>
			{/each}
		</div>

		<!-- Progress Widget -->
		{#if $gameMode === 'progressive'}
			<div class="progress-widget">
				<span class="progress-text">{$unlockedLevels.length}/{max_levels} Level freigeschaltet</span>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {($unlockedLevels.length / max_levels) * 100}%"></div>
				</div>
				{#if $bonusLevelsUnlocked.length > 0}
					<span class="bonus-progress-text">✨ {$bonusLevelsUnlocked.length}/{bonusLevelData.length} Bonus entdeckt</span>
				{/if}
			</div>
		{/if}

		<!-- Path Lines -->
		<svg class="path-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
			{#each pathLines as line}
				<line 
					x1="{line.x1}%" 
					y1="{line.y1}%" 
					x2="{line.x2}%" 
					y2="{line.y2}" 
					stroke="rgba(160, 160, 160, 0.3)"
					stroke-width="0.3"
					stroke-dasharray="1,0.5"
				/>
			{/each}
		</svg>
		
		<!-- Home Button -->
		<button 
			class="home-button"
			on:click={() => goto('/')}
			title="Zurück zur Startseite"
		>
			🏠 Home
		</button>
		
		<!-- Level Buttons -->
		{#each levelData as level}
			<button 
				class="level-button {level.size} {isLevelUnlocked(level.id) ? 'unlocked' : 'locked'}"
				style="top: {level.y}%; left: {level.x}%;"
				data-level="{level.id}"
				on:click={() => LevelJoin(level.id)}
				on:mouseenter={() => onLevelHover(level)}
				title="{level.name}"
				disabled={!isLevelUnlocked(level.id)}
			>
				<!-- Icon oder Fallback -->
				{#if iconLoadStates[level.id] === false}
					<div class="level-number-only">
						{level.id}
					</div>
				{:else}
					<img 
						src="/icons/{level.icon}.png" 
						alt="{level.name}"
						class="level-icon"
						on:load={() => handleIconLoad(level.id)}
						on:error={() => handleIconError(level.id)}
					/>
					<div class="level-number-overlay">
						{level.id}
					</div>
				{/if}
				
				<!-- Lock Overlay -->
				{#if !isLevelUnlocked(level.id)}
					<div class="lock-overlay">
						🔒
					</div>
				{/if}
			</button>
		{/each}

		<!-- Bonus Level Buttons -->
		{#each bonusLevelData as bonusLevel}
			{#if isBonusLevelUnlocked(bonusLevel.id)}
				<button 
					class="bonus-level-button"
					style="top: {bonusLevel.y}%; left: {bonusLevel.x}%;"
					data-bonus-level="{bonusLevel.id}"
					on:click={() => BonusLevelJoin(bonusLevel)}
					on:mouseenter={() => onBonusLevelHover(bonusLevel)}
					title="{bonusLevel.name}"
				>
					<div class="bonus-icon">
						{bonusLevel.icon}
					</div>
					<div class="bonus-glow"></div>
				</button>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* CSS Variablen */
	:root {
		--transition-smooth: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	:global(html, body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		 overscroll-behavior: none;
	}

	.map-container { 
		position: relative; 
		user-select: none;
		overflow: hidden;
    	min-height: 100vh;
	}
	
	.map-image { 
		width: 100%; 
		display: block; 
	}
		
	/* Header Overlay */
	.map-header-overlay { 
		position: absolute;
		top: 30px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 2;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 1.5rem 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
	}

	.map-header-overlay h1 { 
		font-size: clamp(1.5rem, 3.5vw, 2.2rem);
		color: #2c3e50;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	
	.progress-widget { 
		position: fixed; 
		bottom: 105px; 
		left: 40px; 
		padding: 1rem; 
		backdrop-filter: blur(5px); 
		border: 1px solid rgba(255, 255, 255, 0.15); 
		border-radius: 15px; 
		display: flex; 
		flex-direction: column; 
		gap: 0.5rem; 
		z-index: 2; 
		pointer-events: none;
	}

	.progress-text { 
		font-size: 0.9rem; 
		color: #000000; 
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); 
		background: rgba(255, 255, 255, 0.3); 
		user-select: text;
	}
	
	.bonus-progress-text { 
		font-size: 0.8rem; 
		color: #d4af37; 
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); 
		background: rgba(212, 175, 55, 0.25); 
		user-select: text;
	}

	.progress-text, .bonus-progress-text { 
		font-weight: 600; 
		padding: 0.3rem; 
		border-radius: 12px; 
		border: 1px solid rgba(255, 255, 255, 0.3); 
		text-align: center; 
	}
	
	.progress-bar { 
		width: 190px; 
		height: 10px; 
		background: rgba(0, 0, 0, 0.1); 
		border-radius: 4px; 
		border: 1px solid rgba(255, 255, 255, 0.2); 
	}

	.progress-fill { 
		height: 100%; 
		background: linear-gradient(90deg, rgb(84, 187, 43) 0%, #4ebd7c 50%, #3ea76b 100%);
		border-radius: 4px;
		transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
	}

	/* Path Lines */
	.path-lines-svg { 
		position: absolute; 
		top: 0; 
		width: 100%; 
		height: 100%
	}

	/* Level Buttons */
	.level-button, .bonus-level-button { 
		position: absolute; 
		transform: translate(-50%, -50%); 
		background: transparent; 
		border: none; 
		cursor: pointer; 
		transition: var(--transition-smooth); 
	}

	.bonus-level-button { 
		filter: drop-shadow(0 15px 10px rgba(226, 184, 45, 0.8)); 
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
	}

	/* Level Button Sizes */
	.level-button.small { 
		width: clamp(80px, 8vw, 150px); 
		height: clamp(80px, 8vw, 150px); 
		filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.6)); 
	}

	.level-button.medium { 
		width: clamp(120px, 12vw, 250px); 
		height: clamp(120px, 12vw, 250px); 
		filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.8)); 
	}

	.level-button.large { 
		width: clamp(180px, 20vw, 400px); 
		height: clamp(180px, 20vw, 400px); 
		filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.8)); 
	}

	/* Button Status */
	.level-button.locked { 
		filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2)) grayscale(90%) brightness(0.7); 
		cursor: not-allowed; 
		pointer-events: none; 
	}

	.level-button.unlocked:hover, .bonus-level-button:hover { 
		transform: translate(-50%, -50%) scale(1.05); 
	}
	
	.bonus-level-button:hover { 
		transform: translate(-50%, -50%) scale(1.1); 
		filter: drop-shadow(0 8px 25px rgba(212, 175, 55, 0.8)); 
	}
	
	.level-button.unlocked:active, .bonus-level-button:active { 
		transition: all 0.1s ease; 
		transform: translate(-50%, -50%) scale(1.15); 
	}

	/* Level Icons */
	.level-icon { 
		width: 100%; 
		height: 100%; 
		object-fit: contain; 
		transition: var(--transition-smooth); 
	}
	
	/* Overlays */
	.level-number-overlay, .lock-overlay { 
		position: absolute; 
		top: 50%; 
		left: 50%; 
	}
	
	.level-number-overlay { 
		transform: translate(-50%, -50%); 
		font-size: clamp(10px, 1.5vw, 16px); 
		color: white; 
		font-family: 'Arial Black', sans-serif; 
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 3px rgba(0, 0, 0, 1); 
		transition: var(--transition-smooth); 
	}
	
	.lock-overlay { 
		transform: translate(-50%, -63%); 
		font-size: clamp(20px, 2vw, 40px); 
	}

	/* Fallback Number */
	.level-number-only { 
		width: 100%; 
		height: 100%; 
		display: flex; 
		justify-content: center; 
		align-items: center; 
		color: white; 
		font-family: 'Arial Black', sans-serif; 
		background: #4facfe; 
		border-radius: clamp(12px, 2vw, 22px); 
		border: clamp(3px, 0.5vw, 4px) solid rgba(255, 255, 255, 0.8); 
		text-shadow: 0 0 4px rgba(0, 0, 0, 1); 
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
		transition: var(--transition-smooth); 
	}

	/* Font Sizes für different Sizes */
	.level-button.large .level-number-only { 
		font-size: clamp(24px, 4vw, 45px); 
	}

	.level-button.medium .level-number-only { 
		font-size: clamp(20px, 3vw, 32px); 
	}

	.level-button.small .level-number-only { 
		font-size: clamp(16px, 2.5vw, 24px); 
	}

	/* Bonus Level Styles */
	.bonus-icon { 
		font-size: clamp(24px, 3vw, 48px); 
		animation: bonusPulse 2s ease-in-out infinite; 
	}

	.bonus-glow { 
		position: absolute; 
		top: 50%; 
		left: 50%; 
		transform: translate(-50%, -50%); 
		width: 120%; 
		height: 120%; 
		background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%); 
		border-radius: 50%; 
		animation: bonusGlow 2s ease-in-out infinite; 
	}

	/* Bonus Animations */
	@keyframes bonusPulse 
	{ 
		50% { transform: scale(1.1); } 
	}

	@keyframes bonusGlow 
	{ 
		50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); } 
	}
	
	/* Home Button */
	.home-button { 
		position: fixed; 
		bottom: 40px; 
		left: 40px; 
		width: 225px; 
		color: white; 
		border-radius: 25px; 
		font-size: 16px; 
		font-weight: 600; 
		background: rgba(255, 255, 255, 0.2); 
		border: 3px solid rgba(255, 255, 255, 0.2); 
		padding: 0.6rem; 
		z-index: 2; 
		transition: var(--transition-smooth);
		backdrop-filter: blur(5px);
	}
	
	.home-button:hover { 
		transform: scale(1.08); 
		background: rgba(255, 255, 255, 0.3); 
		border-color: rgba(255, 255, 255, 0.4); 
	}

	.home-button:active { 
		transform: scale(1.12);
		transition: all 0.1s ease;
	}

	/* Schneeflocken */
	.snowflake {
		position: absolute;
		color: #ffffff;
		z-index: 1;
		pointer-events: none;
	}

	/* Schnee Animationen */
	@keyframes snowfall-short {
		0% { top: -10%; opacity: 0; }
		5% { opacity: 1; }
		50% { top: 65%; opacity: 0; }
		100% { top: 100%; opacity: 0; }
	}

	@keyframes snowfall-long {
		0% { top: -10%; opacity: 0; }
		5% { opacity: 1; }
		92% { opacity: 1; }
		100% { top: 100%; opacity: 1; }
	}

	@keyframes snowshake {
		0%, 100% { transform: translateX(0px) rotate(0deg); }
		25% { transform: translateX(30px) rotate(30deg); }
		50% { transform: translateX(-20px) rotate(60deg); }
		75% { transform: translateX(40px) rotate(90deg); }
	}

	/* Individual Schneeflocken Animationen */
	.snowflake:nth-child(1) { 
		left: 12%; 
		font-size: 0.8em; 
		animation: snowfall-long 28s linear infinite, snowshake 9s ease-in-out infinite;
		animation-delay: -3s; 
	}

	.snowflake:nth-child(2) { 
		left: 67%; 
		font-size: 1.5em; 
		animation: snowfall-short 22s linear infinite, snowshake 12s ease-in-out infinite;
		animation-delay: -8s; 
	}

	.snowflake:nth-child(3) { 
		left: 89%; 
		font-size: 0.6em; 
		animation: snowfall-long 35s linear infinite, snowshake 7s ease-in-out infinite;
		animation-delay: -15s; 
	}

	.snowflake:nth-child(4) { 
		left: 34%; 
		font-size: 1.2em; 
		animation: snowfall-short 26s linear infinite, snowshake 11s ease-in-out infinite;
		animation-delay: -1s; 
	}

	.snowflake:nth-child(5) { 
		left: 78%; 
		font-size: 2.0em; 
		animation: snowfall-long 31s linear infinite, snowshake 8s ease-in-out infinite;
		animation-delay: -12s; 
	}

	.snowflake:nth-child(6) { 
		left: 13%; 
		font-size: 0.9em; 
		animation: snowfall-short 24s linear infinite, snowshake 10s ease-in-out infinite;
		animation-delay: -6s; 
	}

	.snowflake:nth-child(7) { 
		left: 52%; 
		font-size: 1.8em; 
		animation: snowfall-long 29s linear infinite, snowshake 13s ease-in-out infinite;
		animation-delay: -18s; 
	}

	.snowflake:nth-child(8) { 
		left: 90%; 
		font-size: 0.7em; 
		animation: snowfall-short 33s linear infinite, snowshake 6s ease-in-out infinite;
		animation-delay: -4s; 
	}

	.snowflake:nth-child(9) { 
		left: 19%; 
		font-size: 1.4em; 
		animation: snowfall-long 27s linear infinite, snowshake 14s ease-in-out infinite;
		animation-delay: -9s; 
	}

	.snowflake:nth-child(10) { 
		left: 50%; 
		font-size: 1.1em; 
		animation: snowfall-short 25s linear infinite, snowshake 8s ease-in-out infinite;
		animation-delay: -21s; 
	}

	.snowflake:nth-child(11) { 
		left: 43%; 
		font-size: 0.5em; 
		animation: snowfall-long 32s linear infinite, snowshake 11s ease-in-out infinite;
		animation-delay: -7s; 
	}

	.snowflake:nth-child(12) { 
		left: 86%; 
		font-size: 1.7em; 
		animation: snowfall-short 21s linear infinite, snowshake 9s ease-in-out infinite;
		animation-delay: -14s; 
	}

	.snowflake:nth-child(13) { 
		left: 28%; 
		font-size: 1.3em; 
		animation: snowfall-long 81s linear infinite, snowshake 7s ease-in-out infinite;
		animation-delay: -2s; 
	}

	.snowflake:nth-child(14) { 
		left: 61%; 
		font-size: 0.8em; 
		animation: snowfall-short 34s linear infinite, snowshake 12s ease-in-out infinite;
		animation-delay: -16s; 
	}

	.snowflake:nth-child(15) { 
		left: 8%; 
		font-size: 1.6em; 
		animation: snowfall-long 26s linear infinite, snowshake 10s ease-in-out infinite;
		animation-delay: -5s; 
	}

	.snowflake:nth-child(16) { 
		left: 76%; 
		font-size: 0.9em; 
		animation: snowfall-short 69s linear infinite, snowshake 8s ease-in-out infinite;
		animation-delay: -11s; 
	}

	.snowflake:nth-child(17) { 
		left: 15%; 
		font-size: 1.9em; 
		animation: snowfall-long 23s linear infinite, snowshake 13s ease-in-out infinite;
		animation-delay: -19s; 
	}

	.snowflake:nth-child(18) { 
		left: 58%; 
		font-size: 0.6em; 
		animation: snowfall-short 31s linear infinite, snowshake 6s ease-in-out infinite;
		animation-delay: -3s; 
	}

	.snowflake:nth-child(19) { 
		left: 92%; 
		font-size: 1.5em; 
		animation: snowfall-long 68s linear infinite, snowshake 11s ease-in-out infinite;
		animation-delay: -13s; 
	}

	.snowflake:nth-child(20) { 
		left: 37%; 
		font-size: 0.7em; 
		animation: snowfall-short 29s linear infinite, snowshake 9s ease-in-out infinite;
		animation-delay: -6s; 
	}

	.snowflake:nth-child(21) { 
		left: 83%; 
		font-size: 1.8em; 
		animation: snowfall-long 70s linear infinite, snowshake 14s ease-in-out infinite;
		animation-delay: -17s; 
	}

	.snowflake:nth-child(22) { 
		left: 22%; 
		font-size: 1.0em; 
		animation: snowfall-short 33s linear infinite, snowshake 7s ease-in-out infinite;
		animation-delay: -4s; 
	}

	.snowflake:nth-child(23) { 
		left: 65%; 
		font-size: 1.4em; 
		animation: snowfall-long 24s linear infinite, snowshake 10s ease-in-out infinite;
		animation-delay: -20s; 
	}

	.snowflake:nth-child(24) { 
		left: 49%; 
		font-size: 0.8em; 
		animation: snowfall-short 90s linear infinite, snowshake 19s ease-in-out infinite;
		animation-delay: -8s; 
	}

	.snowflake:nth-child(25) { 
		left: 11%; 
		font-size: 1.6em; 
		animation: snowfall-long 26s linear infinite, snowshake 8s ease-in-out infinite;
		animation-delay: -10s; 
	}
</style>