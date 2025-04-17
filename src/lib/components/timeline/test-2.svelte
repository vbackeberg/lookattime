<script lang="ts">
	import Konva from 'konva';
	import type { Rect } from 'konva/lib/shapes/Rect';
	import { onMount } from 'svelte';
	let { timeEvents }: { timeEvents: TimeEvent[] } = $props();

	const zoomLevel = 1;

	let stage: Konva.Stage;
	let layerEvents: Konva.Layer;
	let elements: Rect[];
	let layerScrollbar: Konva.Layer;
	let scrollbar: Konva.Rect;

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

		stage = new Konva.Stage({
			container: 'container',
			width: innerWidth,
			height: innerHeight
		});

		layerEvents = new Konva.Layer();

		layerEvents.add(...elements);
		stage.add(layerEvents);
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

		/**
		 * Scroll by drag
		 * Moves layer in the opposite direction than the scrollbar.
		 */
		scrollbar.on('dragmove', function () {
			const availableWidth = stage.width() - padding * 2 - scrollbar.width();
			const delta = (scrollbar.x() - padding) / availableWidth;
			layerEvents.x(-(timelineWidth - stage.width()) * delta);
		});
	});

	/** Sets position of scrollbar dependent on layerEvents position within scrollWidth. */
	function updateScrollbarPosX() {
		const availableWidth = stage.width() - padding * 2 - scrollbar.width();
		const hx =
			((elements[0].getAbsolutePosition(stage).x - margin) / (-timelineWidth + stage.width())) * availableWidth + padding;
		scrollbar.x(hx);
	}

	/** Scrollbar padding left and right */
	const padding = 4;

	/** Positions scrollbar at stage bottom. */
	function updateScrollbarPosY() {
		scrollbar.y(stage.height() - padding - 10);
	}

	/** Only show scrollbar if content is wider than stage width.*/
	function updateScrollbarWidthAndVisibility() {
		if (timelineWidth <= stage.width()) {
			layerScrollbar.hide();
		} else {
			const availableWidth = stage.width() - padding * 2;
			const scrollbarWidth = Math.max(20, (stage.width() / timelineWidth) * availableWidth);
			scrollbar.width(scrollbarWidth);
			layerScrollbar.show();
		}
	}

	/** Additional space left and right of outermost time events */
	const margin = 100;

	/** Sets the total width of the timeline as the distance between
	 * the lowest and highest element or the stage edges.
	 */
	function updateTimelineWidth() {
		const positionLowest = elements[0].x() - margin;

		const highest = elements[elements.length - 1];
		const positionHighest = highest.x() + highest.width() + margin;

		timelineWidth = positionHighest - positionLowest;
	}

	/** The total width of the timeline */
	let timelineWidth = 0;

	let innerWidth = $state<number>();
	let innerHeight = $state<number>();
	$effect(() => {
		stage.height(innerHeight);
		updateScrollbarPosY();

		stage.width(innerWidth);
		updateTimelineWidth();
		updateScrollbarWidthAndVisibility();
		updateScrollbarPosX();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="container"></div>
