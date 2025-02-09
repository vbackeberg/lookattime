<script lang="ts">
	import TimeEvent from './time-event.svelte';
	import { page } from '$app/state';
	import { setContext } from 'svelte';

	const MAX_ZOOM_LEVEL = 1_728_000_000_000;
	const MIN_ZOOM_LEVEL = 1;
	const zoomLevel = $state({ v: 400 });
	setContext('zoomLevel', zoomLevel);

	

	function zoom(e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
		if (page.data.timeEvents.length === 0) return;
		e.preventDefault();
		const zoomFactor = e.deltaY < 0 ? 0.92 : 1.1
		const newZoomLevel = zoomLevel.v * zoomFactor;
		if (zoomLevelInBounds(newZoomLevel)) zoomLevel.v = newZoomLevel;

		const referencePosition = e.pageX

		timeEvents.forEach(t => {
			const distance = (t.position - referencePosition) * zoomFactor
			t.position = referencePosition + distance
		});
	}

	function zoomLevelInBounds(newZoomLevel: number) {
		return Math.abs(newZoomLevel) < MAX_ZOOM_LEVEL && Math.abs(newZoomLevel) >= MIN_ZOOM_LEVEL;
	}
</script>

<div class="size-full" onwheel={zoom}>
	<div>
		{#each timeEvents as timeEvent}
			<TimeEvent {timeEvent}></TimeEvent>
		{/each}
	</div>
</div>
