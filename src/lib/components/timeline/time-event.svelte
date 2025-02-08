<script lang="ts">
	import { toPosition } from "$lib/position-translator.svelte";


	let { timeEvent }: { timeEvent: TimeEvent } = $props();

	let positionCenter = $derived(toPosition(timeEvent.date));
</script>

<div class="w-40" style={`transform: translateX(${positionCenter}px)`}>
	<div class="w-full -translate-x-1/2">
		time event
		{positionCenter}
	</div>
</div>
