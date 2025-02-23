<script lang="ts">
	import TimeEvent from './time-event.svelte';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	const MAX_ZOOM_LEVEL = 1_728_000_000_000;
	const MIN_ZOOM_LEVEL = 1;
	let referencePosition = $state(0);
	let zoomFactor = $state(1);
	let zoomLevel = $state(1_000);
	let positionLowest = $state(0)

	$effect(() => {
		zoomLevel;
		const distance = (untrack(() => positionLowest) - referencePosition) / zoomFactor;
		positionLowest = referencePosition + distance;
	});

	function zoom(e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) {
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

	let offset = $state(0);

	$effect(() => {
		// offset = -positionDateZero;
		// window.scrollBy(-positionDateZero, 0);
	});
</script>

<div class="size-full" onwheel={zoom}>
	{#each page.data.timeEvents as timeEvent, i}
		<TimeEvent {timeEvent} {zoomLevel} {positionLowest}></TimeEvent>
	{/each}

	<div class="mt-16 flex flex-col gap-2">
		<h2 class="text-xl">Debug</h2>
		<span>Zoom Level {zoomLevel}</span>
		<span>positionLowest {positionLowest}</span>
		<span>Offset {offset}</span>
	</div>
</div>
