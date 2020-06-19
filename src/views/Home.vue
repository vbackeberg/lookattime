<template>
  <div class="home" @mousewheel="onScroll">
    <div>
      <input @input="updateZoom" />
    </div>
    <div>
      <Box position="-100"></Box>
      <Box position="200"></Box>
      <Box position="600"></Box>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Box from "@/components/Box.vue";

export default {
  name: "Home",
  components: {
    Box
  },
  methods: {
    updateZoom(e) {
      this.$store.commit("updateZoom", e.target.value);
    },
    onScroll(e) {
      if (e.deltaY > 0) {
        this.$store.commit("increaseZoom");
      } else if (e.deltaY < 0) {
        this.$store.commit("decreaseZoom");
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
