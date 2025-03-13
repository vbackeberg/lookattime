<script lang="ts">
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import TimeEvent from './time-event.svelte';

	const MAX_ZOOM_LEVEL = 1_728_000_000_000;
	const MIN_ZOOM_LEVEL = 1;
	const MIN_SPACE_LEFT = 300;
	let referencePosition = $state(0);
	let zoomFactor = $state(1);
	let zoomLevel = $state(0);
	let positionLowest = $state(MIN_SPACE_LEFT);

	/** Sets the (initial) zoom level when time events change such that all time events are visible on screen. */
	$effect.pre(() => {
		const lowestDate = page.data.timeEvents[0].date;
		const highestDate = page.data.timeEvents[page.data.timeEvents.length - 1].date;
		zoomLevel = (highestDate - lowestDate) / window.innerWidth;
	});

	/** Changes position of the lowest time event when the zoom level changes. */
	$effect(() => {
		if (zoomLevel) {
			const distance = (untrack(() => positionLowest) - referencePosition) / zoomFactor;
			positionLowest = referencePosition + distance;
		}
	});

	let scrollX = $state(0);
	let scrolling = $state(false);

	/** Creates space on the left by moving all elements right and scrolling the same amount.
	 * This ensures there's always some space left of the leftmost time event.
	 */
	$effect(() => {
		if (positionLowest < MIN_SPACE_LEFT) {
			const distance = MIN_SPACE_LEFT - positionLowest;
			positionLowest = MIN_SPACE_LEFT;
			window.scrollBy(distance, 0);
		}
	});

	/** Removes empty space on the left.
	 * This ensures there's never too much empty space left of the leftmost time event.
	 * Waits until scrolling is done.
	 */
	$effect(() => {
		if (!scrolling && scrollX > 0 && positionLowest > MIN_SPACE_LEFT) {
			if (positionLowest - scrollX > MIN_SPACE_LEFT) {
				const distance = scrollX;

				// Update through both ways, otherwise scrollX apparently won't update immediately
				scrollTo(0, 0);
				scrollX = 0;
				positionLowest -= distance;
			} else {
				const newScrollX = MIN_SPACE_LEFT - (positionLowest - scrollX);
				window.scrollTo(newScrollX, 0);
				scrollX = newScrollX;
				positionLowest = MIN_SPACE_LEFT;
			}
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

<svelte:window
	onwheel={zoom}
	bind:scrollX
	onscroll={() => (scrolling = true)}
	onscrollend={() => (scrolling = false)}
/>

{#if zoomLevel}
	<div class="size-full">
		{#each page.data.timeEvents as timeEvent, i}
			<TimeEvent {timeEvent} {zoomLevel} {positionLowest}></TimeEvent>
		{/each}
	</div>
{/if}

<div class="fixed bottom-20 flex flex-col gap-2 bg-orange-200/50 p-4">
	<h2 class="text-xl">Debug</h2>
	<span>Zoom Level {zoomLevel}</span>
	<span>positionLowest {positionLowest}</span>
</div>
