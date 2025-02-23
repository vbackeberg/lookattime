<script lang="ts">
	import TimeEvent from './time-event.svelte';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	const MAX_ZOOM_LEVEL = 1_728_000_000_000;
	const MIN_ZOOM_LEVEL = 1;
	let referencePosition = $state(0);
	let zoomFactor = $state(1);
	let zoomLevel = $state(0);
	let positionLowest = $state(0);

	$effect.pre(() => {
		const lowestDate = page.data.timeEvents[0].date;
		const highestDate = page.data.timeEvents[page.data.timeEvents.length - 1].date;
		zoomLevel = (highestDate - lowestDate) / window.innerWidth;
	});

	$effect(() => {
		if (zoomLevel) {
			const distance = (untrack(() => positionLowest) - referencePosition) / zoomFactor;
			positionLowest = referencePosition + distance;
		}
	});

	$effect(() => {
		if (positionLowest < 0) {
			window.scrollBy(-positionLowest, 0);
			positionLowest = 0;
		}
	});

	function zoom(e: WheelEvent) {
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
		if (page.data.timeEvents.length === 0) return;
		e.preventDefault();
		zoomFactor = e.deltaY < 0 ? 0.92 : 1.1;
		const newZoomLevel = zoomLevel * zoomFactor;
		if (zoomLevelInBounds(newZoomLevel)) zoomLevel = newZoomLevel;
		referencePosition = e.pageX;
	}

	function zoomLevelInBounds(newZoomLevel: number) {
		return Math.abs(newZoomLevel) < MAX_ZOOM_LEVEL && Math.abs(newZoomLevel) >= MIN_ZOOM_LEVEL;
	}
</script>

<svelte:window onwheel={zoom} />

{#if zoomLevel}
	<div class="size-full">
		{#each page.data.timeEvents as timeEvent, i}
			<TimeEvent {timeEvent} {zoomLevel} {positionLowest}></TimeEvent>
		{/each}
	</div>
{/if}

<div class="fixed bottom-0 flex flex-col gap-2 bg-orange-200/50 p-4">
	<h2 class="text-xl">Debug</h2>
	<span>Zoom Level {zoomLevel}</span>
	<span>positionLowest {positionLowest}</span>
</div>
