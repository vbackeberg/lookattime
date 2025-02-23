<script lang="ts">
	import { page } from "$app/state";

	let {
		timeEvent,
		zoomLevel,
		positionLowest,
	}: {
		timeEvent: TimeEvent;
		zoomLevel: number;
		positionLowest: number;
	} = $props();

	let position = $derived(positionLowest + (timeEvent.date - page.data.timeEvents[0].date) / zoomLevel);
</script>

<div
	class="w-40 h-20 rounded border border-dashed"
	style={`transform: translateX(${position}px)`}
>
	<div class="size-full -translate-x-1/2 rounded border">
		time event
		{position}
		{timeEvent.date}
	</div>
</div>
