<script lang="ts">
	import { page } from '$app/state';
	import TimeEvent from './time-event.svelte';

	let positions = $state([200, 400]);
	let canvas: HTMLCanvasElement;

	function drawBoxes() {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw boxes at each position
		positions.forEach(x => {
			ctx.fillStyle = '#333';
			ctx.fillRect(x, 50, 20, 20); // x, y, width, height
		});
	}

	$effect(() => {
		drawBoxes();
	});
</script>

<canvas
	bind:this={canvas}
	width="800"
	height="200"
/>
