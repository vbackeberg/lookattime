<script lang="ts">
	import TimeEvent from './time-event.svelte';
	import { page } from '$app/state';
	import { setContext } from 'svelte';

	const MAX_ZOOM_LEVEL = 1_728_000_000_000;
	const MIN_ZOOM_LEVEL = 1;
	const zoomLevel = $state({ v: 1_000 });
	const offset = $state({ v: 0 });
	let referencePosition = $state(0);
	let zoomFactor = $state(1);

	setContext('zoomLevel', zoomLevel);
	setContext('offset', offset);


	function zoom(e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
		if (page.data.timeEvents.length === 0) return;
		e.preventDefault();
		zoomFactor = e.deltaY < 0 ? 1.1 : 0.92;
		const newZoomLevel = zoomLevel.v * zoomFactor;
		if (zoomLevelInBounds(newZoomLevel)) zoomLevel.v = newZoomLevel;

		referencePosition = e.pageX;
	}

	function zoomLevelInBounds(newZoomLevel: number) {
		return Math.abs(newZoomLevel) < MAX_ZOOM_LEVEL && Math.abs(newZoomLevel) >= MIN_ZOOM_LEVEL;
	}
</script>

<div class="size-full" onwheel={zoom}>
	{#each page.data.timeEvents as timeEvent}
		<TimeEvent {timeEvent} {referencePosition} {zoomFactor}></TimeEvent>
	{/each}

	<div class="mt-16 flex flex-col gap-2">
		<h2 class="text-xl">Debug</h2>
		<span>Zoom Level {zoomLevel.v}</span>
		<span>Offset {offset.v}</span>
	</div>
</div>
