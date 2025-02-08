<script lang="ts">
	import { toPosition } from '$lib/position-translator';

	let { timeEvent }: { timeEvent: TimeEvent } = $props();

	let positionCenter = $derived(toPosition(timeEvent.date));
</script>

<div class="w-40 translate-x-[{500}px]">
	<div class="w-full -translate-x-1/2">
		time event
		{timeEvent.id}
	</div>
</div>
