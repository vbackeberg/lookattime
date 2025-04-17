<script lang="ts">
	import Konva from 'konva';
	import { onMount } from 'svelte';

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let horizontalBar: Konva.Rect;
	let elements: Konva.Circle[] = [];
	onMount(() => {
		stage = new Konva.Stage({
			container: 'container',
			width: width,
			height: height
		});
		layer = new Konva.Layer();
		stage.add(layer);

		for (let i = 0; i < NUMBER; i++) {
			const e = generateNode();
			elements.push(e);
			layer.add(e);
		}

		// now draw our bars
		const scrollLayers = new Konva.Layer();
		stage.add(scrollLayers);

		horizontalBar = new Konva.Rect({
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

		scrollLayers.add(horizontalBar);

		horizontalBar.on('dragmove', function () {
			// delta in %
			const availableWidth = stage.width() - PADDING * 2 - horizontalBar.width();
			const delta = (horizontalBar.x() - PADDING) / availableWidth;

			layer.x(-(WIDTH - stage.width()) * delta);
		});

		stage.on('wheel', function (e) {
			// prevent parent scrolling
			e.evt.preventDefault();
			if (e.evt.metaKey || e.evt.ctrlKey || e.evt.altKey) return;

			if (e.evt.shiftKey) {
				scroll(e.evt);
			} else {
				zoom(e.evt);
			}
		});
	});

	function scroll(e: WheelEvent) {
		const dx = e.deltaY;

		const minX = -(WIDTH - stage.width());
		const maxX = 0;

		const x = Math.max(minX, Math.min(layer.x() - dx, maxX));

		layer.x(x);

		const availableWidth = stage.width() - PADDING * 2 - horizontalBar.width();

		const hx = (layer.x() / (-WIDTH + stage.width())) * availableWidth + PADDING;
		horizontalBar.x(hx);
	}

	function zoom(e: WheelEvent) {
		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		const zoomFactor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
		
		const pointerX = layer.getRelativePointerPosition()!.x;

		elements.forEach((e) => {
			const distance = (e.x() - pointerX) * zoomFactor;
			e.x(pointerX + distance);
		});

		afterZoom(e.deltaY)
	}

	function afterZoom(deltaY: number) {
		const positionLowest = elements[0].x();

		if (deltaY > 0) {
			// delete space
		} else {
			// add space
			

		}
		
	}



	const width = window.innerWidth;
	const height = window.innerHeight;

	const WIDTH = 3000;
	const HEIGHT = 3000;
	const NUMBER = 200;

	function generateNode() {
		return new Konva.Circle({
			x: WIDTH * Math.random(),
			y: HEIGHT * Math.random(),
			radius: 50,
			fill: 'red',
			stroke: 'black'
		});
	}

	const PADDING = 5;
</script>

<div id="container"></div>
