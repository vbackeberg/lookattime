<script lang="ts">
	let {
		timeEvent,
		zoomLevel,
		positionDateZero
	}: {
		timeEvent: TimeEvent;
		zoomLevel: number;
		positionDateZero: number;
	} = $props();

	let position = $derived(positionDateZero + timeEvent.date / zoomLevel)
</script>

<div
	class="w-40 rounded border border-dashed transition-transform"
	style={`transform: translateX(${position}px)`}
>
	<div class="w-full -translate-x-1/2 rounded border">
		time event
		{position}
		{timeEvent.date}
	</div>
</div>
