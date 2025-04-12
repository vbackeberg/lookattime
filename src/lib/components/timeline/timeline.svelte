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
				scroll(e.evt.deltaX); // Touchpad horizontal scroll
			} else if (e.evt.shiftKey) {
				scroll(e.evt.deltaY); // Shift + mouse wheel horizontal scroll
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

		updateTimelineWidth();
		updateScrollbarWidthAndVisibility();

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
		const pointerX = layerEvents.getRelativePointerPosition()!.x;

		elements.forEach((e) => {
			const distance = (e.x() - pointerX) * zoomFactor;
			e.x(pointerX + distance);
		});

		updateTimelineWidth();
		updateScrollbarWidthAndVisibility();
		moveIntoVisibleSpace(); // TODO debounce
		cutSpaceLeft(); // TODO debounce
		// TODO cut space right
	}

	/** Moves layer and scrollbar in opposite direction */
	function scroll(dx: number) {
		if (!layerScrollbar.visible()) return;

		/** The point where right edge of layer would cross right edge of viewport. */
		const min = -(timelineWidth - stage.width());

		/** The point where left edge of layer would cross left edge of viewport. */
		const max = 0;

		const actual = Math.max(min, Math.min(layerEvents.x() - dx, max));
		layerEvents.x(actual);

		updateScrollbarPosX();
		cutSpaceLeft();
		// TODO cut space right
	}

	/** Sets position of scrollbar dependent on layerEvents position within scrollWidth. */
	function updateScrollbarPosX() {
		const availableWidth = stage.width() - padding * 2 - scrollbar.width();
		const hx = (layerEvents.x() / (-timelineWidth + stage.width())) * availableWidth + padding;
		scrollbar.x(hx);
	}

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

	/**
	 * Moves elements right by the amount that the leftmost element is outside of the visible space.
	 * We need to do this because elements with negative x-positions are not reachable on a canvas.
	 *
	 * Moving the elements right requires moving layerEvents left by the same amount.
	 * Because layerEvents now has a negative x-position it updates the scrollbar.
	 */
	function moveIntoVisibleSpace() {
		if (elements[0].x() >= margin) return;

		const distance = -(elements[0].x() - margin);

		layerEvents.x(layerEvents.x() - distance);
		elements.forEach((e) => e.x(e.x() + distance));

		updateScrollbarPosX();
	}

	/**
	 * Removes excess space to the left.
	 * There is excess space if layerEvents' position is farer left than the viewport (0)
	 * and than the leftmost element (incl. margin).
	 *
	 * It moves the layerEvents to the right by the amount of space that is left.
	 * The elements are moved left by the same amount.
	 */
	function cutSpaceLeft() {
		if (tId !== null) clearTimeout(tId);
		tId = setTimeout(() => {
			tId = null;

			const lowest = Math.min(elements[0].position().x - margin, 0);
			const distance = lowest - layerEvents.x();

			if (distance === 0) return;

			layerEvents.x(layerEvents.x() + distance);
			elements.forEach((e) => e.x(e.x() - distance));
		}, 200);
	}
	let tId: number | null;

	/** Additional space left and right of outermost time events */
	const margin = 100;

	/** Sets the total width of the timeline as the distance between
	 * the lowest and highest element or the stage edges.
	*/
	function updateTimelineWidth() {
		const positionLowest = Math.min(elements[0].position().x - margin, 0);

		const highest = elements[elements.length - 1];
		const positionHighest = Math.max(highest.position().x + highest.width() + margin, innerWidth!);

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
		updateScrollWidth();
		updateScrollbarWidthAndVisibility();
		updateScrollbarPosX();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="container"></div>
