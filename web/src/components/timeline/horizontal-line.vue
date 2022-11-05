<template>
  <svg id="horizontal-line"></svg>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HorizontalLine",

  mounted() {
    this.observeAndRepositionHorizontalLine();
  },

  methods: {
    /**
     * Repositions and unhides horizontal line once
     * and then repositions whenever window resizes.
     *
     * Because the anchor element `time-marker-area` is
     * mounted in the parent component, the function
     * needs to wait for the next tick after which the
     * parent is mounted, too.
     */
    async observeAndRepositionHorizontalLine() {
      await Vue.nextTick();

      const anchorElement = document.getElementById(
        "time-marker-area"
      ) as HTMLElement;

      const horizontalLineElement = document.getElementById(
        "horizontal-line"
      ) as HTMLElement;

      this.repositionHorizontalLine(anchorElement, horizontalLineElement);

      horizontalLineElement.style.visibility = "visible";

      window.onresize = _ =>
        this.repositionHorizontalLine(anchorElement, horizontalLineElement);
    },

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
    repositionHorizontalLine(
      anchorElement: HTMLElement,
      horizontalLineElement: HTMLElement
    ) {
      horizontalLineElement.style.top = `${anchorElement.getBoundingClientRect()
        .top - horizontalLineElement.getBoundingClientRect().height}px`;
    }
  }
});
</script>

<style scoped lang="scss">
/** Hidden until correctly positioned */
#horizontal-line {
  visibility: hidden;

  width: 100%;
  height: 4px;
  position: fixed;

  background-color: #000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
