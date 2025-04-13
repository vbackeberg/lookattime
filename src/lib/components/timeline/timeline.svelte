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
				scroll(e.evt.deltaX); // Touchpad: horizontal scroll
			} else if (e.evt.shiftKey) {
				scroll(-e.evt.deltaY); // Shift + mouse wheel: horizontal scroll in inverted direction
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

	/** Sets position of scrollbar dependent on layerEvents position within scrollWidth. */
	function updateScrollbarPosX() {
		const availableWidth = stage.width() - padding * 2 - scrollbar.width();
		const hx =
			((elements[0].getAbsolutePosition(stage).x - margin) / (-timelineWidth + stage.width())) * availableWidth + padding;
		scrollbar.x(hx);
	}

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
		updateScrollbarPosX();
	}

	/** Moves layer and scrollbar in opposite direction */
	function scroll(dx: number) {
		if (timelineWidth <= stage.width()) return;
		if (dx === 0) return;

		let distance = 0;
		if (dx < 0) {
			const highest = elements[elements.length - 1];
			const limitRight =
				highest.getAbsolutePosition(stage).x + highest.width() + margin - stage.width();

			if (limitRight > 0) {
				distance = Math.min(limitRight, dx);
			}
		} else if (dx > 0) {
			const limitLeft = elements[0].getAbsolutePosition(stage).x - margin;

			if (limitLeft < 0) {
				distance = Math.max(limitLeft, dx);
			}
		}

		console.log('scroll by ' + distance);

		layerEvents.x(layerEvents.x() + distance)

		updateScrollbarPosX();
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

	/** Determines if there is too much or too little space on the left.
	 * Then cuts excessive space or moves elements into positive space.
	 */
	function manageSpaceLeft() {
		const positionLowest = elements[0].x() - margin;
		const distance = positionLowest - layerEvents.x();
		console.log(`${distance} = ${positionLowest} - ${layerEvents.x()}`);

		if (distance > 0) {
			console.log('cut space left');
			cutSpaceLeft(distance);
		} else if (distance < 0) {
			console.log('extend space left');
			extendSpaceLeft(distance);
		}
	}

	/**
	 * Moves layerEvents left and elements right by the same amount.
	 * We need to do this because the user cannot reach elements with negative positions.
	 */
	function extendSpaceLeft(distance: number) {
		layerEvents.x(layerEvents.x() - distance);
		elements.forEach((e) => e.x(e.x() + distance));
	}

	/**
	 * Moves layerEvents right and elements left by the same amount.
	 * We need to do this because there would otherwise be void space the user can scroll into.
	 */
	function cutSpaceLeft(distance: number) {
		layerEvents.x(layerEvents.x() + distance);
		elements.forEach((e) => e.x(e.x() - distance));
	}

	// function cutSpaceLeft() {
	// 	if (tId !== null) clearTimeout(tId);
	// 	tId = setTimeout(() => {
	// 		tId = null;
	// 		const positionLowest = Math.min(elements[0].position().x - margin, 0);
	// 		const distance = positionLowest - layerEvents.x();
	// 		if (distance === 0) return;
	// 		layerEvents.x(layerEvents.x() + distance);
	// 		elements.forEach((e) => e.x(e.x() - distance));
	// 	}, 200);
	// }
	let tId: number | null;

	function cutSpaceRight() {}

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
