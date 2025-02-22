<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen w-screen bg-gray-300">
{@render children()}
</div>
