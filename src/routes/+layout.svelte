<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="size-svh bg-black">
{@render children()}
</div>
