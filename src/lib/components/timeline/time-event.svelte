<script lang="ts">
	import { toPosition } from '$lib/position-translator';

	let { timeEvent }: { timeEvent: TimeEvent } = $props();

	let positionCenter = $derived(toPosition(timeEvent.date));
</script>

<div class="w-40 translate-1/2"></div>
