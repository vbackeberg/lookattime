<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Box from "@/components/Box.vue";
import store from "../store";
import Vue from "vue";
import { Constants } from "@/constants";
import { BoxModel } from "@/models/box-model";

export default Vue.extend({
  name: "Home",

  components: {
    Box
  },

  created() {
    window.scrollTo(500, 0);
  },

  data() {
    return {
      boxes: [
        { positionCenter: 200, width: 200, id: 1 },
        { positionCenter: 600, width: 200, id: 2 },
        { positionCenter: 2500, width: 200, id: 3 }
      ],
      zoomLevel: 1
    };
  },

  methods: {
    onScroll(e: WheelEvent) {
      this.changeZoom(e);
    },

    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0 && this.zoomLevel < Constants.MAX_ZOOM_LEVEL) {
        this.zoomIn(e);
      } else if (e.deltaY > 0 && this.zoomLevel > Constants.MIN_ZOOM_LEVEL) {
        this.zoomOut(e);
      } else {
        console.log("zoom level of " + this.zoomLevel + " exceeds limit.");
      }

      // update absolute positions and readjust so that most negative box has position 0
    },

    zoomIn(e: WheelEvent) {
      this.zoomLevel += 0.1;
      this.determineNewPosition(1.1, e.clientX);
    },

    zoomOut(e: WheelEvent) {
      this.zoomLevel -= 0.1;
      this.determineNewPosition(0.9, e.clientX);
    },

    determineNewPosition(zoomFactor: number, mousePosition: number) {
      this.boxes.forEach((box) => {
        const distance = (box.positionCenter - mousePosition) * zoomFactor;

        const oldPosition = box.positionCenter;

        box.positionCenter = mousePosition + distance;

        this.logPositions(
          zoomFactor,
          mousePosition,
          oldPosition,
          box.positionCenter,
          distance
        );
      });

      this.normalizePositions();
    },

    normalizePositions() {
        // find most negative pos
        // set that to 0
        // move all others
      // set viewport to equivalent position
    },

    logPositions(
      zoomFactor: number,
      mousePosition: number,
      oldPosition: number,
      positionCenter: number,
      distance: number
    ) {
      console.log(
        "zoom factor " +
          zoomFactor +
          " mouse pos " +
          mousePosition +
          " old pos: " +
          oldPosition +
          " new Pos: " +
          positionCenter +
          " distance: " +
          distance
      );
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  overflow: auto;
  white-space: nowrap;
  height: 100%;
}
</style>
