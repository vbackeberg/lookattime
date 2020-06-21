<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <Box initialPosition="-200"></Box>
      <Box initialPosition="50"></Box>
      <Box initialPosition="300"></Box>
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
    onScroll(e: MouseWheelEvent) {
      this.setMousePosition(e);
      this.changeZoom(e);
    },

    changeZoom(e: MouseWheelEvent) {
      if (e.deltaY > 0) {
        store.commit("increaseZoom");
      } else if (e.deltaY < 0) {
        store.commit("decreaseZoom");
      }
    },

    setMousePosition(e: MouseWheelEvent) {
      store.commit("setMousePosition", e.clientX);
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
