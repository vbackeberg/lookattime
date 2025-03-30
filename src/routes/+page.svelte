<script lang="ts">
	import Timeline from '$lib/components/timeline/timeline.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Timeline timeEvents={data.timeEvents} />
