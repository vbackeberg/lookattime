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
    Box,
  },

  created() {},

  data() {
    return {
      boxes: [
        new BoxModel(200, 200, 1),
        new BoxModel(500, 200, 2),
        new BoxModel(1500, 200, 3),
      ],
      zoomLevel: 1,
    };
  },

  computed: {
    lowestBox(): BoxModel {
      return this.boxes.reduce((previous, current) => {
        return previous.positionLeft < current.positionLeft
          ? previous
          : current;
      });
    },
  },

  methods: {
    onScroll(e: WheelEvent) {
      this.changeZoom(e);
    },

    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        this.zoomIn(e);
      } else if (e.deltaY > 0) {
        this.zoomOut(e);
      } else {
        console.log("zoom level of " + this.zoomLevel + " exceeds limit.");
      }
    },

    zoomIn(e: WheelEvent) {
      this.zoomLevel += 0.1;
      this.determineNewPosition(1.1, e.pageX);
    },

    zoomOut(e: WheelEvent) {
      this.zoomLevel -= 0.1;
      this.determineNewPosition(0.9, e.pageX);
    },

    determineNewPosition(zoomFactor: number, mousePosition: number) {
      this.boxes.forEach((box) => {
        const oldPositionLeft = box.positionLeft;

        const positionCenter = box.positionLeft + box.width / 2;

        const distance = (positionCenter - mousePosition) * zoomFactor;

        box.positionLeft = mousePosition + distance - box.width / 2;

        this.logPositions(
          box.id,
          zoomFactor,
          mousePosition,
          oldPositionLeft,
          box.positionLeft,
          distance
        );
      });

      this.normalizePositions();
    },

    normalizePositions() {
      console.log("lowest box position center: " + this.lowestBox.positionLeft);

      if (this.lowestBox.positionLeft < 0) {
        this.extendSpace();
      } else if (
        this.lowestBox.positionLeft > window.screenX &&
        window.pageXOffset > 0
      ) {
        this.cutSpace();
      } else {
        console.log("not normalizing.");
      }
      console.log("----------------------------------------------------");
    },

    cutSpace() {
      console.log("normalizing...");
      console.log("shrinking...");
      console.log("pageXOffset " + window.pageXOffset);

      const distance = window.pageXOffset * -1;
      console.log("distance " + distance);

      window.scrollBy(distance, 0);

      this.boxes.forEach((box) => {
        console.log("box " + box.id + " old pos " + box.positionLeft);
        box.positionLeft += distance;
        console.log("box " + box.id + " new pos " + box.positionLeft);
      });
    },

    extendSpace() {
      console.log("normalizing...");
      console.log("extending...");

      const lowestBoxPositionLeft = this.lowestBox.positionLeft;
      console.log("lowestBoxPositionLeft " + lowestBoxPositionLeft);

      this.boxes.forEach((box) => {
        console.log("box " + box.id + " old pos " + box.positionLeft);
        box.positionLeft -= lowestBoxPositionLeft;
        console.log("box " + box.id + " new pos " + box.positionLeft);
      });

      console.log("screenX " + window.screenX);

      const screenXNew = window.screenX - lowestBoxPositionLeft;
      console.log("screenXNew " + screenXNew);

      window.scrollBy(screenXNew, 0);
    },

    logPositions(
      boxId: number,
      zoomFactor: number,
      mousePosition: number,
      oldPositionLeft: number,
      positionLeft: number,
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
          oldPositionLeft +
          " new Pos: " +
          positionLeft +
          " distance: " +
          distance
      );
    },
  },
});
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100000px;
}
</style>
