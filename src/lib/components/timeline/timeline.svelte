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

		const PADDING = 4;

		const horizontalBar = new Konva.Rect({
			width: 100,
			height: 10,
			fill: 'grey',
			opacity: 0.8,
			x: PADDING,
			y: stage.height() - PADDING - 10,
			draggable: true,
			dragBoundFunc: function (pos) {
				pos.x = Math.max(Math.min(pos.x, stage.width() - this.width() - PADDING), PADDING);
				pos.y = stage.height() - PADDING - 10;

				return pos;
			}
		});
		scrollbarLayer.add(horizontalBar);

		horizontalBar.on('dragmove', function () {
			console.log('pos layer x: ' + layer.x());
			const availableWidth = stage.width() - PADDING * 2 - horizontalBar.width();
			console.log('availableWidth ' + availableWidth);
			const delta = (horizontalBar.x() - PADDING) / availableWidth;
			console.log('delta ' + delta);

			layer.x(-(scrollWidth! - stage.width()) * delta);
			console.log('new pos: ' + -(scrollWidth! - stage.width()) * delta);
			console.log('pos layer x ' + layer.x());
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

	function determineWidth() {
		const positionLowest = Math.min(elements[0].position().x, 0);
		const positionHighest = Math.max(elements[elements.length - 1].position().x, innerWidth!);
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
