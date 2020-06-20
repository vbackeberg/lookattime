<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <Box position="-200"></Box>
      <Box position="50"></Box>
      <Box position="300"></Box>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Box from "@/components/Box.vue";
import store from "../store";

export default {
  name: "Home",
  components: {
    Box
  },
  methods: {
    onScroll(e: MouseWheelEvent) {
      if (e.deltaY > 0) {
        store.commit("increaseZoom");
      } else if (e.deltaY < 0) {
        store.commit("decreaseZoom");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  overflow: auto;
  white-space: nowrap;
  height: 100%;
}
</style>
