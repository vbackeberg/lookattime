<script lang="ts">
	import { untrack } from 'svelte';

	let {
		timeEvent,
		referencePosition,
		zoomFactor,
		zoomLevel
	}: { timeEvent: TimeEvent; referencePosition: number; zoomFactor: number; zoomLevel: number } =
		$props();

	let position = $state(timeEvent.date / zoomLevel);

	$effect(() => {
		zoomLevel;
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
