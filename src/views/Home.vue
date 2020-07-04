<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <box
        v-for="box in boxes"
        v-bind:key="box.id"
        v-bind:initialPosition="box.initialPosition"
        v-bind:width="box.width"
      ></box>
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

  data() {
    return {
      boxes: [
        { initialPosition: "200", width: "200", id: 1 },
        { initialPosition: "600", width: "200", id: 2 },
        { initialPosition: "2500", width: "200", id: 3 }
      ]
    };
  },

  created() {
    window.scrollTo(500, 0);
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
        console.log("zoomOut");
        this.zoomOut(e);
      }

      // for each box determine new position

      // update absolute positions and readjust so that most negative box has position 0
    },

    zoomOut(e: WheelEvent) {
      const zoomLevel = store.state.zoomLevel - 0.1;

      if (zoomLevel > 0) {
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomLevel", zoomLevel);
        store.commit("setZoomFactor", 0.9);
      } else {
        console.log("min zoom factor reached: " + zoomLevel);
      }
    },

    zoomIn(e: WheelEvent) {
      const zoomLevel = store.state.zoomLevel + 0.1;

      if (zoomLevel < Constants.MAX_ZOOM_LEVEL) {
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomLevel", zoomLevel);
        store.commit("setZoomFactor", 1.1);
      } else {
        console.log("max zoom factor reached: " + zoomLevel);
      }
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
