<script lang="ts">
	import ScrollableElements from '$lib/components/timeline/test-1.svelte';
	import Test_2 from '$lib/components/timeline/test-2.svelte';
	import Test_3 from '$lib/components/timeline/test-3.svelte';
	import Timeline from '$lib/components/timeline/timeline.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Test_3 />
<!-- <Test_2 timeEvents={data.timeEvents}/> -->
<!-- <Timeline timeEvents={data.timeEvents} /> -->
