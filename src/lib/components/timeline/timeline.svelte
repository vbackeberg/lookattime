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
		stage.on('wheel', (e) => {
			e.evt.preventDefault();

			if (e.evt.metaKey || e.evt.ctrlKey || e.evt.altKey) return;

			if (e.evt.deltaX > 0) {
				scroll(e.evt.deltaX);
			} else if (e.evt.shiftKey) {
				scroll(e.evt.deltaY);
			} else {
				zoom(e.evt);
			}
		});

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

		scrollWidth = determineWidth();
		updateScrollbar();

		/**
		 * Emulates scrollbar behavior.
		 * Moves layer in the opposite direction than the scrollbar.
		 */
		scrollbar.on('dragmove', function () {
			const availableWidth = stage.width() - padding * 2 - scrollbar.width();
			const delta = (scrollbar.x() - padding) / availableWidth;
			layerEvents.x(-(scrollWidth - stage.width()) * delta);
		});
	});

	/** Scrollbar padding left and right */
	const padding = 4;

	/** Zooms elements relative to pointer.
	 * Then updates scrollbar and moves elements with negative position into positive space to make them visible.
	 * PointerX is the position of the pointer on the layer. */
	function zoom(e: WheelEvent) {
		if (timeEvents.length === 0) return;
		e.preventDefault();

		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		const zoomFactor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
		const pointerX = pointer.x - layerEvents.x();

		elements.forEach((e) => {
			const distance = (e.x() - pointerX) * zoomFactor; 
			e.x(pointerX + distance);
		});

		scrollWidth = determineWidth();
		updateScrollbar();

		if (elements[0].x() < margin) moveIntoVisibleSpace();
	}

	function scroll(dx: number) {
		if (scrollWidth <= stage.width()) return;

		const minX = -(scrollWidth - stage.width());
		const maxX = 0;
		const x = Math.max(minX, Math.min(layerEvents.x() - dx, maxX));
		layerEvents.x(x);

		const availableWidth = stage.width() - padding * 2 - scrollbar.width();
		const hx = (layerEvents.x() / (-scrollWidth + stage.width())) * availableWidth + padding;
		scrollbar.x(hx);
	}

	/** Only show scrollbar if content is wider than stage width.*/
	function updateScrollbar() {
		if (scrollWidth <= stage.width()) {
			layerScrollbar.hide();
		} else {
			const availableWidth = stage.width() - padding * 2;
			const scrollbarWidth = Math.max(20, (stage.width() / scrollWidth) * availableWidth);
			scrollbar.width(scrollbarWidth);
			layerScrollbar.show();
		}
	}

	function moveIntoVisibleSpace() {
		const lowest = elements[0];

		const distance = lowest.position().x - margin;

		elements.forEach((e) => {
			e.x(e.x() - distance);
		});

		scroll(-distance);
	}

	/** Additional space left and right of outermost time events */
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
