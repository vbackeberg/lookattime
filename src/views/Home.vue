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
import BoxModel from "@/models/box-model";

export default Vue.extend({
  name: "Home",

  components: {
    Box
  },

  created() {
    console.log("scrollto");
    window.scrollTo(500, 0);

    console.log("screenX created " + window.screenX);
  },

  data() {
    return {
      boxes: [
        new BoxModel(0, 200, 1),
        new BoxModel(400, 200, 2),
        new BoxModel(1500, 200, 3)
      ],
      zoomLevel: 1
    };
  },

  computed: {
    lowestBox(): BoxModel {
      return this.boxes.reduce((previous, current) => {
        return previous.positionCenter < current.positionCenter
          ? previous
          : current;
      });
    }
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
          box.id,
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
      console.log(
        "normalizing positions relative to " + this.lowestBox.positionCenter
      );

      const lowestBoxPositionCenter = this.lowestBox.positionCenter;
      console.log("lowestBoxPositionCenter " + lowestBoxPositionCenter);

      // move all boxes the distance from lowest box to 0
      // such that lowest box will have pos 0 and distances to other boxes remain the same.

      this.boxes.map((box) => {
        console.log("box " + box.id + " old pos " + box.positionCenter);
        box.positionCenter -= lowestBoxPositionCenter;
        console.log("box " + box.id + " new pos " + box.positionCenter);
      });

      console.log("screenX " + window.screenX);

      const screenXNew = window.screenX - lowestBoxPositionCenter;
      console.log("screenXNew " + screenXNew);

      // set viewport to equivalent position
      window.scrollTo(screenXNew, 0);
    },

    logPositions(
      boxId: number,
      zoomFactor: number,
      mousePosition: number,
      oldPosition: number,
      positionCenter: number,
      distance: number
    ) {
      console.log(
        "box " +
          boxId +
          " zoom factor " +
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
  width: 5000px;
  height: 100%;
}
</style>
