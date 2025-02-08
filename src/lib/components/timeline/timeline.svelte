<script lang="ts">
	import TimeEvent from './time-event.svelte';
	import {page} from "$app/state"


	
</script>

<div>
	<div>
		{#each page.data.timeEvents as timeEvent}
			<TimeEvent {timeEvent}></TimeEvent>
		{/each}
	</div>
</div>
