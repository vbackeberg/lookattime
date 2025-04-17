<script lang="ts">
	import Konva from 'konva';
	import { onMount } from 'svelte';

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let layerScrollbar: Konva.Layer;
	let scrollbar: Konva.Rect;
	let elements: Konva.Rect[];
	
	let innerWidth = $state<number>();
	let innerHeight = $state<number>();
	
	// Constants
	const padding = 4;
	const margin = 50;
	let contentWidth = 0;

	onMount(() => {
		// Create two rectangles with different colors
		elements = [
			new Konva.Rect({
				x: 50,
				y: 40,
				width: 100,
				height: 100,
				fill: 'blue',
				stroke: 'black',
				strokeWidth: 1
			}),
			new Konva.Rect({
				x: 300,
				y: 40,
				width: 100,
				height: 100,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 1
			})
		];

		// Initialize stage
		stage = new Konva.Stage({
			container: 'container',
			width: innerWidth,
			height: innerHeight
		});

		// Create and add main layer
		layer = new Konva.Layer();
		layer.add(...elements);
		stage.add(layer);

		// Create scrollbar layer and scrollbar
		layerScrollbar = new Konva.Layer();
		stage.add(layerScrollbar);

		scrollbar = new Konva.Rect({
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

		layerScrollbar.add(scrollbar);

		// Update initial dimensions
		updateContentWidth();
		updateScrollbarWidthAndVisibility();

		// Handle scrollbar drag
		scrollbar.on('dragmove', function () {
			const availableWidth = stage.width() - padding * 2 - scrollbar.width();
			const delta = (scrollbar.x() - padding) / availableWidth;
			layer.x(-(contentWidth - stage.width()) * delta);
		});

		// Handle wheel events for horizontal scrolling
		stage.on('wheel', (e) => {
			e.evt.preventDefault();
			if (contentWidth <= stage.width()) return;

			const dx = e.evt.deltaY;
			let distance = 0;

			if (dx > 0) {
				const limitRight = contentWidth - stage.width();
				if (limitRight > 0) {
					distance = Math.min(limitRight, 20);
				}
			} else {
				const limitLeft = -layer.x();
				if (limitLeft > 0) {
					distance = Math.max(-limitLeft, -20);
				}
			}
			
			layer.x(layer.x() - distance);
			updateScrollbarPosition();
		});
	});

	function updateContentWidth() {
		const rightmost = elements[1];
		contentWidth = rightmost.x() + rightmost.width() + margin;
	}

	function updateScrollbarWidthAndVisibility() {
		if (contentWidth <= stage.width()) {
			layerScrollbar.hide();
		} else {
			const availableWidth = stage.width() - padding * 2;
			const scrollbarWidth = Math.max(20, (stage.width() / contentWidth) * availableWidth);
			scrollbar.width(scrollbarWidth);
			layerScrollbar.show();
		}
	}

	function updateScrollbarPosition() {
		const availableWidth = stage.width() - padding * 2 - scrollbar.width();
		const scrollX = (-layer.x() / (contentWidth - stage.width())) * availableWidth + padding;
		scrollbar.x(scrollX);
	}

	$effect(() => {
		if (!stage) return;
		
		stage.width(innerWidth);
		stage.height(innerHeight);
		
		scrollbar.y(stage.height() - padding - 10);
		updateScrollbarWidthAndVisibility();
		updateScrollbarPosition();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="container"></div>