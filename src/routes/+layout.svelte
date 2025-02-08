<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="size-svh bg-gray-300">
{@render children()}
</div>
