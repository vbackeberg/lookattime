<template>
  <div class="home">
    <div>
      <input @input="updateZoom" />
    </div>
    <div>
      <Boxes position="600"></Boxes>
      <Boxes position="200"></Boxes>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Boxes from "@/components/Boxes.vue";

export default {
  name: "Home",
  components: {
    Boxes
  },
  methods: {
    updateZoom(e) {
      this.$store.commit("updateZoom", e.target.value);
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  overflow: auto;
  white-space: nowrap;
}
</style>
