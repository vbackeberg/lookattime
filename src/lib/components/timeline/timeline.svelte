<script lang="ts">
	import Konva from 'konva';
	import type { Rect } from 'konva/lib/shapes/Rect';
	import { onMount } from 'svelte';
	let { timeEvents }: { timeEvents: TimeEvent[] } = $props();

	const zoomLevel = 1;

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let elements: Rect[];

	onMount(() => {
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

		scrollWidth = determineWidth();

		stage = new Konva.Stage({
			container: 'container',
			width: innerWidth,
			height: innerHeight
		});

		layer = new Konva.Layer();

		layer.add(...elements);
		stage.add(layer);
		stage.on('wheel', (e) => {
			zoom(e.evt);
		});

		const scrollbarLayer = new Konva.Layer();
		stage.add(scrollbarLayer);

		const padding = 4;

		const horizontalBar = new Konva.Rect({
			width: 100,
			height: 10,
			fill: 'grey',
			opacity: 0.8,
			x: padding,
			y: stage.height() - padding - 10,
			draggable: true,
			dragBoundFunc: function (pos) {
				pos.x = Math.max(Math.min(pos.x, stage.width() - this.width() - padding), padding);
				pos.y = stage.height() - padding - 10;

				return pos;
			}
		});
		scrollbarLayer.add(horizontalBar);

		/**
		 * Emulates scrollbar behavior. 
		 * Moves layer in the opposite direction than the scrollbar.
		 */
		horizontalBar.on('dragmove', function () {
			const availableWidth = stage.width() - padding * 2 - horizontalBar.width();
			const delta = (horizontalBar.x() - padding) / availableWidth;
			layer.x(-(scrollWidth! - stage.width()) * delta);
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

		scrollWidth = determineWidth();
	}

	const margin = 100;
	function determineWidth() {
		const lowest = elements[0];
		const positionLowest = Math.min(lowest.position().x - margin, 0);

		const highest = elements[elements.length - 1];
		const positionHighest = Math.max(highest.position().x + highest.width() + margin, innerWidth!);

		return positionHighest - positionLowest;
	}

	let scrollWidth = 0;
	let innerWidth = $state<number>();
	let innerHeight = $state<number>();
	$effect(() => {
		stage.width(innerWidth);
		stage.height(innerHeight);
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="container"></div>
