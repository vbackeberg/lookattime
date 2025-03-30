<script lang="ts">
	import Konva from 'konva';
	import type { Rect } from 'konva/lib/shapes/Rect';
	import { onMount } from 'svelte';
	let { timeEvents }: { timeEvents: TimeEvent[] } = $props();

	const zoomLevel = 10_000_000;

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let elements: Rect[];

	onMount(() => {
		stage = new Konva.Stage({
			container: 'container',
			width: 500,
			height: 500
		});

		layer = new Konva.Layer();

		elements = timeEvents.map(
			(t) =>
				new Konva.Rect({
					x: t.date / zoomLevel,
					y: 40,
					width: 100,
					height: 20,
					stroke: 'black',
					strokeWidth: 1
				})
		);

		layer.add(...elements);
		stage.add(layer);
		stage.on('wheel', (e) => {
			zoom(e.evt);
		});
	});

	function zoom(e: WheelEvent) {
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
		if (timeEvents.length === 0) return;
		e.preventDefault();

		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		const zoomFactor = e.deltaY > 0 ? 1 / 1.1 : 1.1;

		elements.forEach((e) => {
			const distance = (e.x() - pointer.x) * zoomFactor;
			e.x(pointer.x + distance);
		});
	}

	let innerWidth = $state<number>()
	$effect(() => {stage.width(innerWidth)})
</script>

<svelte:window bind:innerWidth />

<div id="container"></div>
