<script lang="ts">
	import { getContext } from 'svelte';

	let { timeEvent }: { timeEvent: TimeEvent } = $props();
	const zoomLevel = getContext<{ v: number }>('zoomLevel');

	

</script>

<div class="w-40 rounded border border-dashed" style={`transform: translateX(${position}px)`}>
	<div class="w-full -translate-x-1/2 rounded border">
		time event
		{position}
	</div>
</div>
