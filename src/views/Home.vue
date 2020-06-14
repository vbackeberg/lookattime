<template>
  <div class="home">
    <Boxes myPosition="600"> </Boxes>
    <Boxes myPosition="200"> </Boxes>
  </div>
</template>

<script>
// @ is an alias to /src
import Boxes from "@/components/Boxes.vue";

export default {
  name: "Home",
  components: {
    Boxes
  }
};
</script>

<style scoped lang="scss">
.home {
  overflow: auto;
  white-space: nowrap;
}
</style>
