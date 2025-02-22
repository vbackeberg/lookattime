<script lang="ts">
	import { getContext, untrack } from 'svelte';

	const zoomLevel = getContext<{ v: number }>('zoomLevel');

	let {
		timeEvent,
		referencePosition,
		zoomFactor
	}: { timeEvent: TimeEvent; referencePosition: number; zoomFactor: number } = $props();

	let position = $state(timeEvent.date / zoomLevel.v);

	$effect(() => {
		const distance = (untrack(() => position) - referencePosition) * zoomFactor;
		position = referencePosition + distance;
	});

	// when position negative push to positive and shift viewport within 1 frame

	//
</script>

<div class="w-40 rounded border border-dashed" style={`transform: translateX(${position}px)`}>
	<div class="w-full -translate-x-1/2 rounded border">
		time event
		{position}
		{timeEvent.date}
	</div>
</div>
