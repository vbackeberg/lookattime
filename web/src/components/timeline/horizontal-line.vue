<template>
  <svg id="horizontal-line" ref="horizontal-line"></svg>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watchEffect } from 'vue';

// const props = defineProps<{ timeMarkerArea: HTMLDivElement | null, parentMounted: boolean }>()
const horizontalLine = useTemplateRef("horizontal-line")

watchEffect(() => {
  repositionHorizontalLine()
  observeAndRepositionHorizontalLine()
})

onMounted(() => {
  // TODO: resize observer for time marker area: If it changes height, reposition line
  // const o = new ResizeObserver()
})

/**
 * Repositions and unhides horizontal line once
 * and then repositions whenever window resizes.
 *
 * Because the anchor element `time-marker-area` is
 * mounted in the parent component, the function
 * needs to wait for the next tick after which the
 * parent is mounted, too.
 */
async function observeAndRepositionHorizontalLine() {
  // window.onresize = (_) => { if (props.timeMarkerArea && horizontalLine.value) { repositionHorizontalLine() } };
};

// onUnmounted(() => { o1?.disconnect(); o2?.disconnect() });

/**
 * Anchor horizontal line to bottom of anchor element.
 *
 * The horizontal line is a special element in the application
 * because it is bound to two different constraints. On the one hand
 * it needs to cover the range from the viewports left to right edge,
 * regardless of the timelines actual width - this is why it has to be
 * a fixed element. On the other hand it needs to be positioned right
 * between the time events `connector` and `date` elements to make them
 * appear as emerging from the timeline. This is why its vertical
 * position must be set in a programmatical way.
 *
 * Both elements are guaranteed to exist since this method is called
 * after component has been mounted.
 */
function repositionHorizontalLine() {
  // console.log("call reposition")
  // if (props.timeMarkerArea && horizontalLine.value) {
  //   console.log("reposition");
  //   horizontalLine.value.style.visibility = "visible";
  //   console.log(props.timeMarkerArea.getBoundingClientRect().top)
  //   console.log(horizontalLine.value.getBoundingClientRect().height)

  //   horizontalLine.value.style.top =
  //     `${props.timeMarkerArea.getBoundingClientRect().top - horizontalLine.value.getBoundingClientRect().height}px`;
  // }

}
</script>

<style scoped>
/** Hidden until correctly positioned */
#horizontal-line {
  /* visibility: hidden; */

  width: 100%;
  height: 4px;
  position: absolute;
  

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
