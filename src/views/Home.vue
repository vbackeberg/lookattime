<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <Box initialPosition="200" width="200"></Box>
      <Box initialPosition="600" width="200"></Box>
      <Box initialPosition="2500" width="200"></Box>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Box from "@/components/Box.vue";
import store from "../store";
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {
    Box
  },
  created() {
    /* TODO: Determine horizontal center.
    The box to the most left should be positioned such
    that its position will never get a negative value when
    zooming in to allow for horizontal scroll.

    On created, scroll view to center.
    */

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

      if (zoomLevel < 3) {
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
