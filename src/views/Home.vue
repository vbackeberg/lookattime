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
        { initialPosition: 200, width: 200, id: 1 },
        { initialPosition: 600, width: 200, id: 2 },
        { initialPosition: 2500, width: 200, id: 3 }
      ],
      zoomLevel: 1
    };
  },

  methods: {
    onScroll(e: WheelEvent) {
      this.changeZoom(e);
    },

    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        this.zoomIn(e);
        console.log("zoomIn");
      } else if (e.deltaY > 0) {
        this.zoomOut(e);
        console.log("zoomOut");
      }

      // for each box determine new position

      // update absolute positions and readjust so that most negative box has position 0
    },

    zoomOut(e: WheelEvent) {
      if (this.zoomLevel > 0) {
        this.zoomLevel -= 0.1;  
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomFactor", 0.9);
        this.determineNewPosition();
      } else {
        console.log("min zoom factor reached: " + this.zoomLevel);
      }
    },

    zoomIn(e: WheelEvent) {
      if (this.zoomLevel < Constants.MAX_ZOOM_LEVEL) {
        this.zoomLevel += 0.1;
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomFactor", 1.1);
        this.determineNewPosition();
      } else {
        console.log("max zoom factor reached: " + this.zoomLevel);
      }
    },

    determineNewPosition() {
      const zoomFactor = store.state.zoomFactor;
      const mousePosition = store.state.mousePosition;

      this.boxes.forEach((box) => {
        const distance = (box.initialPosition - mousePosition) * zoomFactor;

        const oldPosition = box.initialPosition;

        box.initialPosition = mousePosition + distance;

        this.logPositions(
          zoomFactor,
          mousePosition,
          oldPosition,
          box.initialPosition,
          distance
        );
      });
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
