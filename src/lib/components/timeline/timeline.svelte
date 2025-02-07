<script lang="ts">
	import TimeEvent from './time-event.svelte';

	let timeEvents = $state([]);
</script>

<div>
	<div>
		{#each timeEvents as timeEvent}
			<TimeEvent {timeEvent}></TimeEvent>
		{/each}
	</div>
</div>
