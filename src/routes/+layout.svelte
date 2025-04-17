<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen w-screen bg-gray-700 text-gray-200">
	{@render children()}
</div>
