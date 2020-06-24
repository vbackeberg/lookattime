<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <Box initialPosition="500" width="200"></Box>
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
      const zoomFactor = store.state.zoomFactor - 0.01;

      if (zoomFactor > 0) {
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomFactor", zoomFactor);
      } else {
        console.log("min zoom factor reached: " + zoomFactor);
      }
    },

    zoomIn(e: WheelEvent) {
      const zoomFactor = store.state.zoomFactor + 0.01;

      if (zoomFactor < 1.5) {
        store.commit("setMousePosition", e.clientX);
        store.commit("setZoomFactor", zoomFactor);
      } else {
        console.log("max zoom factor reached: " + zoomFactor);
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
